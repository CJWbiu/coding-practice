import { effect } from "../effact";
import { reactive } from "../reactive";

describe("effect", () => {
  it("副作用函数会被立即执行一次", () => {
    const fnSpy = jest.fn(() => {});
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  it("具备基础的响应式能力", () => {
    let dummy;
    const counter = reactive({ num1: 0, num2: 0 });
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2));

    expect(dummy).toBe(0);
    counter.num1 = counter.num2 = 7;
    expect(dummy).toBe(21);
  });

  it("支持分支切换并更新依赖", () => {
    const fnSpy = jest.fn(() => {});
    const obj = reactive({ x: 1, y: 1 });
    effect(() => {
      fnSpy();
      return obj.x ? obj.y : 0;
    });

    obj.x = 0;
    obj.y = 3;

    expect(fnSpy).toHaveBeenCalledTimes(2);
  });
});
