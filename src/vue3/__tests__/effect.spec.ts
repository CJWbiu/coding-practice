import { effect } from "../effect";
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

  it("支持嵌套", () => {
    let num = 0;
    const counter = reactive({ num1: 1, num2: 1 });
    effect(() => {
      effect(() => (num += counter.num1));
      num += counter.num2;
    });

    counter.num2++;

    expect(num).toBe(5);
  });

  it("避免同时触发track和trigger导致无限循环", () => {
    const counter = reactive({ num1: 1 });
    effect(() => {
      counter.num1++;
    });

    expect(counter.num1).toBe(2);
  });

  it("支持调度执行", () => {
    jest.useFakeTimers();
    const counter = reactive({ num: 2 });
    const callback = jest.fn(() => {
      num += counter.num;
    });
    let num = 0;
    effect(callback, {
      scheduler(fn) {
        setTimeout(() => {
          fn();
        }, 50);
      },
    });

    expect(callback).toBeCalled();
    expect(num).toBe(2);

    counter.num++;
    expect(num).toBe(2);
    jest.runAllTimers();
    expect(num).toBe(5);

    jest.useRealTimers();
  });

  it("lazy", () => {
    const obj = reactive({ foo: 1 });
    let dummy;
    const runner = effect(() => (dummy = obj.foo), { lazy: true })!;
    expect(dummy).toBe(undefined);

    expect(runner()).toBe(1);
    expect(dummy).toBe(1);
    obj.foo = 2;
    expect(dummy).toBe(2);
  });
});
