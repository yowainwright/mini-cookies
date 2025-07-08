import { test, expect } from '@playwright/test';

test.describe('Mini-Cookies E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-bundled.html');
    await page.waitForFunction(() => window.pageReady);
  });

  test('sets and gets cookies', async ({ page }) => {
    await page.click('#set-cookie');
    const result = await page.evaluate(() => window.testResults.setCookie);
    expect(result).toBe(true);

    await page.click('#get-cookie');
    const value = await page.evaluate(() => window.testResults.getCookie);
    expect(value).toBe('testValue');
  });

  test('removes cookies', async ({ page }) => {
    await page.click('#set-cookie');
    await page.click('#remove-cookie');
    const result = await page.evaluate(() => window.testResults.removeCookie);
    expect(result).toBe(true);
  });

  test('state management operations', async ({ page }) => {
    await page.click('#set-state-cookie');
    const setStateResult = await page.evaluate(() => window.testResults.setStateCookie);
    expect(setStateResult).toBe(true);

    await page.click('#review-state');
    const state = await page.evaluate(() => window.testResults.reviewState);
    expect(state).toEqual({ stateCookie: { name: 'stateCookie', value: 'stateValue' } });

    await page.click('#clear-state');
    const clearedState = await page.evaluate(() => window.testResults.clearState);
    expect(clearedState).toEqual({});
  });

  test('advanced cookie features', async ({ page }) => {
    await page.click('#set-with-attrs');
    const setWithAttrs = await page.evaluate(() => window.testResults.setWithAttrs);
    expect(setWithAttrs).toBe(true);

    await page.click('#test-debug');
    const debugResults = await page.evaluate(() => window.testResults.testDebug);
    expect(debugResults.value).toBe('debugValue');
    expect(debugResults.debugOutput).toContain('debugCookie');
  });
});

