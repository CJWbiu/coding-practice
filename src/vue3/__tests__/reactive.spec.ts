import { reactive } from "../reactive";
import { effect } from "../effect";

describe("reactive", () => {
  it("代理in操作", () => {
    const obj = reactive({ foo: 1 });
    const fnSpy = jest.fn(() => "foo" in obj);

    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
    obj.foo = 2;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });

  it("代理for in操作", () => {
    const obj = reactive({ foo: 1 });
    const fnSpy = jest.fn(() => {
      for (let key in obj) {
      }
    });

    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);

    // 属性值变化不触发
    obj.foo = 2;
    expect(fnSpy).toHaveBeenCalledTimes(1);

    // 添加新属性触发
    obj.bar = 1;
    expect(fnSpy).toHaveBeenCalledTimes(2);

    // 删除触发
    delete obj.bar;
    expect(fnSpy).toHaveBeenCalledTimes(3);
  });

  it("代理属性访问", () => {
    const obj = reactive({ foo: 1 });
    const fnSpy = jest.fn(() => obj.foo);

    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
    obj.foo = 2;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });

  it("代理属性新增", () => {
    const obj = reactive({});

    obj.foo = 1;
    const fnSpy = jest.fn(() => obj.foo);
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
    obj.foo++;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });

  it("代理属性删除", () => {
    const obj = reactive({ foo: 1 });
    const fnSpy = jest.fn(() => obj.foo);

    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
    delete obj.foo;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });

  it("代理属性更新", () => {
    const obj = reactive({ foo: 1 });
    const fnSpy = jest.fn(() => obj.foo);

    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);

    // 值未变不触发
    obj.foo = 1;
    expect(fnSpy).toHaveBeenCalledTimes(1);

    // 多次赋值NaN也只触发一次
    obj.foo = NaN;
    expect(fnSpy).toHaveBeenCalledTimes(2);
    obj.foo = NaN;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });

  it("对象getter中访问this的场景", () => {
    const obj = reactive({
      bar: 1,
      get foo() {
        return this.bar;
      },
    });
    const fnSpy = jest.fn(() => obj.foo);

    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
    obj.bar = 2;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });

  it("访问原型链上的属性", () => {
    const child = reactive({});
    const parent = reactive({ bar: 1 });

    Object.setPrototypeOf(child, parent);

    // 访问原型上的属性
    const fnSpy = jest.fn(() => child.bar);

    effect(fnSpy);

    expect(fnSpy).toHaveBeenCalledTimes(1);
    child.bar = 2;
    expect(fnSpy).toHaveBeenCalledTimes(2);
  });
});
