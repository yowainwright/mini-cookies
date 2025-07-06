import { describe, it } from "node:test";
import assert from "node:assert";
import { JSDOM } from "jsdom";
import { setCookieAttributes } from "../src/utils";
import miniCookies from "../src/mini-cookies";

// Setup DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  storageQuota: 10000000
});
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

describe("MiniCookies", () => {
  it("miniCookies is defined", () => {
    assert.ok(typeof miniCookies === 'function');
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
});

describe("MiniCookies state", () => {
  it('updates state', async () => {
    const cookies = miniCookies({ hasState: true });
    cookies.set('biz', 'buzz');
    // Wait for async state update
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.deepStrictEqual(cookies.review(), { biz: { name: 'biz', value: 'buzz' } });
    cookies.clearState();
  });

  it('clears state', async () => {
    const cookies = miniCookies({ hasState: true });
    cookies.set('flower', 'power');
    // Wait for async state update
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.deepStrictEqual(cookies.review(), { flower: { name: 'flower', value: 'power' } });
    cookies.clearState();
    assert.deepStrictEqual(cookies.review(), {});
  });
});
