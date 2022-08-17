import { track, trigger } from "./effect";
import { ITERATE_KEY, TriggerOpTypes } from "./shared";

export function reactive(data: Record<string | symbol, any>) {
  return new Proxy(data, {
    get: (target, key, receiver) => {
      // 代理对象可以通过‘raw’属性访问到原始对象
      if (key === "raw") {
        return target;
      }

      track(target, key);

      // receiver用于指定this，例如data的某个key是getter，内部访问了this
      // 通过创建出的代理对象proxyData访问key
      // 此时getter中this指向的是原始值target，而通过receiver可以将this指向代理后的对象
      return Reflect.get(target, key, receiver);
    },

    set: (target, key, newValue, receiver) => {
      const oldVal = target[key];

      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerOpTypes.SET
        : TriggerOpTypes.ADD;

      const res = Reflect.set(target, key, newValue, receiver);

      // 如果是通过访问代理对象原型属性，此处为false，此时应该阻止触发trigger
      const isSelfReceiver = target === receiver.raw;

      // 只有值变化了才需要触发副作用，通过判断值本身是否相等来辨别NaN的场景
      if (
        isSelfReceiver &&
        oldVal !== newValue &&
        (newValue === newValue || oldVal === oldVal)
      ) {
        trigger(target, key, type);
      }

      return res;
    },

    // 用于拦截in操作
    has: (target, key) => {
      track(target, key);
      return Reflect.has(target, key);
    },

    // 拦截for in操作，由于是遍历值，没有指定具体值，所以track一个自定义的值方便trigger
    ownKeys: (target) => {
      track(target, ITERATE_KEY);
      return Reflect.ownKeys(target);
    },

    deleteProperty: (target, key) => {
      // 只有删除对象存在的key才有意义
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);

      // 只有成功删除后才需要触发副作用
      if (res && hadKey) {
        trigger(target, key, TriggerOpTypes.DELETE);
      }

      return res;
    },
  });
}
