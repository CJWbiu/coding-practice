import { reactive } from "./reactive";

export function ref(val: number | string | null | boolean) {
  const wrapper = {
    value: val,
  };

  return reactive(wrapper);
}
