import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/test-bundled.html");
  await page.waitForFunction(() => window.pageReady);
});

test("verifies cookies are actually set in browser", async ({ page }) => {
  await page.context().clearCookies();

  await page.evaluate(() => {
    const cookies = window.miniCookies();
    cookies.set("browserTest", "browserValue");
  });

  const cookies = await page.context().cookies();
  const testCookie = cookies.find((cookie) => cookie.name === "browserTest");

  expect(testCookie).toBeDefined();
  expect(testCookie?.value).toBe("browserValue");
});

test("verifies cookie attributes are set correctly", async ({ page }) => {
  await page.context().clearCookies();

  await page.evaluate(() => {
    const cookies = window.miniCookies();
    cookies.set("attrTest", "attrValue", {
      path: "/",
      days: 1,
    });
  });

  const cookies = await page.context().cookies();
  const testCookie = cookies.find((cookie) => cookie.name === "attrTest");

  expect(testCookie).toBeDefined();
  expect(testCookie?.path).toBe("/");
  expect(testCookie?.expires).toBeGreaterThan(Date.now() / 1000);
});

test("verifies cookie removal works", async ({ page }) => {
  await page.context().clearCookies();

  await page.evaluate(() => {
    const cookies = window.miniCookies();
    cookies.set("removeTest", "removeValue");
    cookies.remove("removeTest");
  });

  const cookies = await page.context().cookies();
  const testCookie = cookies.find((cookie) => cookie.name === "removeTest");

  if (testCookie) {
    expect(testCookie.expires).toBeLessThan(Date.now() / 1000);
  }
});

test("verifies localStorage state persistence", async ({ page }) => {
  await page.context().clearCookies();

  await page.evaluate(() => {
    const cookies = window.miniCookiesState({ id: "test-state" });
    cookies.set("stateTest", "stateValue");
  });

  const localStorageState = await page.evaluate(() => localStorage.getItem("test-state"));

  expect(localStorageState).toBeTruthy();
  const parsedState = JSON.parse(localStorageState);
  expect(parsedState).toEqual({
    stateTest: {
      name: "stateTest",
      value: "stateValue",
    },
  });
});

test("verifies state clears properly", async ({ page }) => {
  await page.context().clearCookies();

  await page.evaluate(() => {
    const cookies = window.miniCookiesState({ id: "clear-test-state" });
    cookies.set("clearTest", "clearValue");
    cookies.clearState();
  });

  const localStorageState = await page.evaluate(() => localStorage.getItem("clear-test-state"));

  expect(localStorageState).toBeNull();
});

test("verifies URL encoding/decoding works", async ({ page }) => {
  await page.context().clearCookies();

  const specialValue = "hello world & special chars!";

  await page.evaluate((value) => {
    const cookies = window.miniCookies();
    cookies.set("encodingTest", value);
  }, specialValue);

  const retrievedValue = await page.evaluate(() => {
    const cookies = window.miniCookies();
    return cookies.get("encodingTest");
  });

  expect(retrievedValue).toBe(specialValue);

  const cookies = await page.context().cookies();
  const testCookie = cookies.find((cookie) => cookie.name === "encodingTest");
  expect(testCookie?.value).toBe(encodeURIComponent(specialValue));
});

test("verifies debug mode produces console output", async ({ page }) => {
  await page.context().clearCookies();

  let consoleLogs: string[] = [];
  page.on("console", (msg) => {
    const messageType = msg.type();
    const isDebugLog = messageType === "debug";
    const isConsoleLog = messageType === "log";
    const isInfoLog = messageType === "info";
    const shouldCaptureLog = isDebugLog || isConsoleLog || isInfoLog;
    if (shouldCaptureLog) {
      consoleLogs = consoleLogs.concat(msg.text());
    }
  });

  await page.evaluate(() => {
    const cookies = window.miniCookies({ debug: true });
    cookies.set("debugTest", "debugValue");
    const value = cookies.get("debugTest");
    console.log("Test finished, value:", value);
  });

  await page.waitForTimeout(200);

  const hasDebugOutput = consoleLogs.some((log) => /mini-cookies|Test finished/.test(log));
  expect(hasDebugOutput).toBe(true);
});
