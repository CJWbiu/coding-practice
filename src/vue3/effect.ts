import { ITERATE_KEY, TriggerOpTypes } from "./shared";

type ReactiveEffect = Function & {
  deps?: Set<Function>[];
  options?: EffectOptions;
};

type KeyToDepMap = Map<any, Set<ReactiveEffect>>;

interface EffectOptions {
  scheduler?: (fn: Function) => void;
  lazy?: boolean;
}

// 存储收集的依赖
const targetMap = new WeakMap<any, KeyToDepMap>();

// 当前激活的副作用
let activeEffect: ReactiveEffect | undefined;

// 通过栈的形式处理嵌套effect的场景
const activeEffectStack: ReactiveEffect[] = [];

export function track(target: any, key: string | symbol) {
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let deps = depsMap.get(key);

  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(activeEffect);
  activeEffect.deps!.push(deps);
}

export function trigger(
  target: any,
  key: string | symbol,
  type: TriggerOpTypes
) {
  const despMap = targetMap.get(target);

  if (!despMap) {
    return;
  }

  const effects = despMap.get(key) ?? [];

  // 获取与ITERATE_KEY相关的副作用
  const iterateEffects = despMap.get(ITERATE_KEY) ?? [];

  const doEffects = new Set<ReactiveEffect>();

  effects?.forEach((effect) => {
    // 避免在effect中执行xx++操作
    // 在effect还未执行完就触发track和trigger导致无限循环
    if (effect !== activeEffect) {
      doEffects.add(effect);
    }
  });

  // 新增、删除属性需要触发for in操作的副作用
  if (type === TriggerOpTypes.ADD || type === TriggerOpTypes.DELETE) {
    iterateEffects?.forEach((effect) => {
      if (effect !== activeEffect) {
        doEffects.add(effect);
      }
    });
  }

  doEffects.forEach((effect) => {
    if (effect?.options?.scheduler) {
      effect.options.scheduler(effect);
    } else {
      effect();
    }
  });
}

function cleanup(effectFn: ReactiveEffect) {
  effectFn.deps!.forEach((deps) => deps.delete(effectFn));
  effectFn.deps = [];
}

export function effect(fn: Function, options?: EffectOptions) {
  const effectFn: ReactiveEffect = () => {
    // 每次在副作用执行前清理一次收集器中已存在的副作用
    // 等副作用执行后重新收集一次，避免分支切换后依然保存着不需要收集的依赖
    cleanup(effectFn);
    activeEffect = effectFn;
    activeEffectStack.push(effectFn);
    let res = fn();

    activeEffectStack.pop();
    activeEffect = activeEffectStack[activeEffectStack.length - 1];

    return res;
  };

  // 反向收集包含该副作用的属性依赖收集器
  effectFn.deps = [];
  options && (effectFn.options = options);

  if (options?.lazy) {
    return effectFn;
  }
  effectFn();
}
