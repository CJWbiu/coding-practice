import { track, trigger } from "./effact";

export function reactive(data: Record<string | symbol, any>) {
  return new Proxy(data, {
    get: (target, key) => {
      track(target, key);
      return target[key];
    },
    set: (target, key, value) => {
      target[key] = value;
      trigger(target, key);
      return true;
    },
  });
}
