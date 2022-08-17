import { ref } from "../ref";
import { effect } from "../effect";

describe("ref", () => {
  it("代理数字", () => {
    const num = ref(0);
    let dummy = 0;

    effect(() => {
      dummy = num.value;
    });

    expect(dummy).toBe(0);
    num.value++;
    expect(dummy).toBe(1);
  });

  it("代理字符", () => {
    const num = ref("");
    let dummy = "";

    effect(() => {
      dummy = num.value;
    });

    expect(dummy).toBe("");
    num.value += "1";
    expect(dummy).toBe("1");
  });

  it("代理波尔值", () => {
    const flag = ref(false);
    let dummy = false;

    effect(() => {
      dummy = flag.value;
    });

    expect(dummy).toBe(false);
    flag.value = true;
    expect(dummy).toBe(true);
  });

  it("代理null", () => {
    const flag = ref(null);
    let dummy = null;

    effect(() => {
      dummy = flag.value;
    });

    expect(dummy).toBe(null);
    flag.value = true;
    expect(dummy).toBe(true);
  });
});
