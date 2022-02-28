import miniCookies from "../mini-cookies";

describe("MiniCookies", () => {
  it("miniCookies is defined", () => expect(miniCookies).toBeDefined());

  it("gets cookies", () => {
    document.cookie = "foo=bar;";
    expect(miniCookies().get("foo")).toBe("bar");
  });

  it("sets cookies", () => {
    expect(miniCookies().set("biz", "baz").get("biz")).toBe("baz");
  });

  it("removes a cookie", () => {
    expect(miniCookies().set("fiz", "buz").get("fiz")).toBe("buz");
    expect(miniCookies().remove("fiz").get("fiz")).toBeUndefined();
  });
});
