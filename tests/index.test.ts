import { describe, it } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";
import { setCookieAttributes } from "../src/utils.ts";
import miniCookies from "../src/index.ts";
import miniCookiesWithState from "../src/state.ts";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  storageQuota: 10000000,
});
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

function withDocumentUrl(url: string, callback: () => void) {
  dom.reconfigure({ url });
  try {
    callback();
  } finally {
    dom.reconfigure({ url: "http://localhost" });
  }
}

describe("MiniCookies", () => {
  it("miniCookies is defined", () => {
    assert.ok(typeof miniCookies === "function");
  });

  it("gets cookies", () => {
    document.cookie = "foo=bar;";
    assert.strictEqual(miniCookies().get("foo"), "bar");
  });

  it("sets cookies", () => {
    assert.strictEqual(miniCookies().set("biz", "baz").get("biz"), "baz");
  });

  it("removes a cookie", () => {
    assert.strictEqual(miniCookies().set("fiz", "buz").get("fiz"), "buz");
    assert.strictEqual(miniCookies().remove("fiz").get("fiz"), undefined);
  });
});

describe("attributes", () => {
  it("expires attr prefers days", () => {
    const today = new Date();
    const expires = new Date(today.setDate(today.getDate() + 7));
    const result = setCookieAttributes({ days: 1, expires });
    assert.ok(result.includes("expires="));
  });

  it("expands isSecure without emitting the control flag", () => {
    withDocumentUrl("https://localhost", () => {
      const result = setCookieAttributes({ isSecure: true });
      assert.match(result, /; secure/);
      assert.match(result, /; __Secure-/);
      assert.match(result, /; samesite=strict/);
      assert.doesNotMatch(result, /isSecure/);
    });
  });

  it("expands isStrictSecure without emitting unsafe domain", () => {
    withDocumentUrl("https://localhost", () => {
      const result = setCookieAttributes({
        domain: "example.com",
        isStrictSecure: true,
      });
      assert.match(result, /; secure/);
      assert.match(result, /; __Secure-/);
      assert.match(result, /; __Host-/);
      assert.match(result, /; path=\//);
      assert.doesNotMatch(result, /domain=/);
      assert.doesNotMatch(result, /isStrictSecure/);
    });
  });
});

describe("MiniCookies state", () => {
  it("keeps root hasState compatibility", () => {
    const cookies = miniCookies({ hasState: true, id: "root-state-compat" });
    cookies.set("root", "state");
    assert.deepStrictEqual(cookies.review(), {
      root: { name: "root", value: "state" },
    });
    cookies.clearState();
  });

  it("updates state", () => {
    const cookies = miniCookiesWithState();
    cookies.set("biz", "buzz");
    assert.deepStrictEqual(cookies.review(), {
      biz: { name: "biz", value: "buzz" },
    });
    cookies.clearState();
  });

  it("clears state", () => {
    const cookies = miniCookiesWithState();
    cookies.set("flower", "power");
    assert.deepStrictEqual(cookies.review(), {
      flower: { name: "flower", value: "power" },
    });
    cookies.clearState();
    assert.deepStrictEqual(cookies.review(), {});
  });
});
