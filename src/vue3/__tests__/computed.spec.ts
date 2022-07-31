import { reactive } from "../reactive";
import { computed } from "../computed";
import { effect } from "../effect";

describe("computed", () => {
  it("todo", () => {});
  // it("具备响应能力", () => {
  //   const counter = reactive({ num: 0 });
  //   const num = computed(() => counter.num);

  //   expect(num.value).toBe(0);
  //   counter.num++;
  //   expect(num.value).toBe(1);
  // });

  // it("延迟执行", () => {
  //   const counter = reactive({ num: 0 });
  //   const fn = jest.fn(() => counter.num);
  //   const num = computed(fn);

  //   expect(fn).not.toHaveBeenCalled();
  //   expect(num.value).toBe(1);
  //   expect(fn).toHaveBeenCalledTimes(1);
  //   counter.num++;
  //   expect(fn).toHaveBeenCalledTimes(2);
  // });

  // it("能够收集并触发副作用", () => {
  //   const value = reactive({ foo: 0 });
  //   const cValue = computed(() => value.foo);
  //   let dummy;
  //   effect(() => {
  //     dummy = cValue.value;
  //   });
  //   expect(dummy).toBe(0);
  //   value.foo = 1;
  //   expect(dummy).toBe(1);
  // });

  // it("getter支持读取计算属性值", () => {
  //   const value = reactive({ foo: 0 });
  //   const c1 = computed(() => value.foo);
  //   const c2 = computed(() => c1.value + 1);
  //   expect(c2.value).toBe(1);
  //   expect(c1.value).toBe(0);
  //   value.foo++;
  //   expect(c2.value).toBe(2);
  //   expect(c1.value).toBe(1);
  // });
  // it("嵌套computed能正确触发effect", () => {
  //   const value = reactive({ foo: 0 });
  //   const getter1 = jest.fn(() => value.foo);
  //   const getter2 = jest.fn(() => {
  //     return c1.value + 1;
  //   });
  //   const c1 = computed(getter1);
  //   const c2 = computed(getter2);

  //   let dummy;
  //   effect(() => {
  //     dummy = c2.value;
  //   });
  //   expect(dummy).toBe(1);
  //   expect(getter1).toHaveBeenCalledTimes(1);
  //   expect(getter2).toHaveBeenCalledTimes(1);
  //   value.foo++;
  //   expect(dummy).toBe(2);
  //   // should not result in duplicate calls
  //   expect(getter1).toHaveBeenCalledTimes(2);
  //   expect(getter2).toHaveBeenCalledTimes(2);
  // });
  // it("支持设置setter", () => {
  //   const n = ref(1);
  //   const plusOne = computed({
  //     get: () => n.value + 1,
  //     set: (val) => {
  //       n.value = val - 1;
  //     },
  //   });

  //   expect(plusOne.value).toBe(2);
  //   n.value++;
  //   expect(plusOne.value).toBe(3);

  //   plusOne.value = 0;
  //   expect(n.value).toBe(-1);
  // });

  // it("自定义setter能够触发effect", () => {
  //   const n = ref(1);
  //   const plusOne = computed({
  //     get: () => n.value + 1,
  //     set: (val) => {
  //       n.value = val - 1;
  //     },
  //   });

  //   let dummy;
  //   effect(() => {
  //     dummy = n.value;
  //   });
  //   expect(dummy).toBe(1);

  //   plusOne.value = 0;
  //   expect(dummy).toBe(-1);
  // });
});
