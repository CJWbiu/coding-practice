type ReactiveEffect = Function & { deps?: Set<Function>[] };

type KeyToDepMap = Map<any, Set<Function>>;

// 存储收集的依赖
const targetMap = new WeakMap<any, KeyToDepMap>();

// 当前激活的副作用
let activeEffect: ReactiveEffect | undefined;

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

export function trigger(target: any, key: string | symbol) {
  const despMap = targetMap.get(target);

  if (!despMap) {
    return;
  }

  const effects = despMap.get(key);
  const doEffects = new Set(effects);
  doEffects.forEach((effect) => effect());
}

function cleanup(effectFn: ReactiveEffect) {
  effectFn.deps!.forEach((deps) => deps.delete(effectFn));
  effectFn.deps = [];
}

export function effect(fn: Function) {
  const effectFn: ReactiveEffect = () => {
    // 每次在副作用执行前清理一次收集器中已存在的副作用
    // 等副作用执行后重新收集一次，避免分支切换后依然保存着不需要收集的依赖
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };

  // 反向收集包含该副作用的属性依赖收集器
  effectFn.deps = [];
  effectFn();
}
