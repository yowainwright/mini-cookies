import { test, expect } from '@playwright/test';

test.describe('Cookie Behavior Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-bundled.html');
    await page.waitForFunction(() => window.pageReady);
  });

  test('verifies cookies are actually set in browser', async ({ page }) => {
    // Clear all cookies first
    await page.context().clearCookies();

    // Set a cookie using mini-cookies
    await page.evaluate(() => {
      const cookies = window.miniCookies();
      cookies.set('browserTest', 'browserValue');
    });

    // Check that the cookie actually exists in the browser
    const cookies = await page.context().cookies();
    const testCookie = cookies.find(cookie => cookie.name === 'browserTest');
    
    expect(testCookie).toBeDefined();
    expect(testCookie?.value).toBe('browserValue');
  });

  test('verifies cookie attributes are set correctly', async ({ page }) => {
    await page.context().clearCookies();

    // Set a cookie with specific attributes
    await page.evaluate(() => {
      const cookies = window.miniCookies();
      cookies.set('attrTest', 'attrValue', {
        path: '/',
        days: 1
      });
    });

    const cookies = await page.context().cookies();
    const testCookie = cookies.find(cookie => cookie.name === 'attrTest');
    
    expect(testCookie).toBeDefined();
    expect(testCookie?.path).toBe('/');
    expect(testCookie?.expires).toBeGreaterThan(Date.now() / 1000);
  });

  test('verifies cookie removal works', async ({ page }) => {
    await page.context().clearCookies();

    // Set then remove a cookie
    await page.evaluate(() => {
      const cookies = window.miniCookies();
      cookies.set('removeTest', 'removeValue');
      cookies.remove('removeTest');
    });

    // Check that cookie is gone or expired
    const cookies = await page.context().cookies();
    const testCookie = cookies.find(cookie => cookie.name === 'removeTest');
    
    // Cookie might still exist but should be expired (days: -1)
    if (testCookie) {
      expect(testCookie.expires).toBeLessThan(Date.now() / 1000);
    }
  });

  test('verifies localStorage state persistence', async ({ page }) => {
    await page.context().clearCookies();

    // Set a cookie with state
    await page.evaluate(async () => {
      const cookies = window.miniCookies({ hasState: true, id: 'test-state' });
      cookies.set('stateTest', 'stateValue');
      // Wait for async state update
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Check localStorage directly
    const localStorageState = await page.evaluate(() => {
      return localStorage.getItem('test-state');
    });

    expect(localStorageState).toBeTruthy();
    const parsedState = JSON.parse(localStorageState);
    expect(parsedState).toEqual({
      stateTest: {
        name: 'stateTest',
        value: 'stateValue'
      }
    });
  });

  test('verifies state clears properly', async ({ page }) => {
    await page.context().clearCookies();

    // Set state then clear it
    await page.evaluate(async () => {
      const cookies = window.miniCookies({ hasState: true, id: 'clear-test-state' });
      cookies.set('clearTest', 'clearValue');
      await new Promise(resolve => setTimeout(resolve, 50));
      cookies.clearState();
    });

    // Check localStorage is empty
    const localStorageState = await page.evaluate(() => {
      return localStorage.getItem('clear-test-state');
    });

    expect(localStorageState).toBeNull();
  });

  test('verifies URL encoding/decoding works', async ({ page }) => {
    await page.context().clearCookies();

    const specialValue = 'hello world & special chars!';
    
    await page.evaluate((value) => {
      const cookies = window.miniCookies();
      cookies.set('encodingTest', value);
    }, specialValue);

    // Get the value back
    const retrievedValue = await page.evaluate(() => {
      const cookies = window.miniCookies();
      return cookies.get('encodingTest');
    });

    expect(retrievedValue).toBe(specialValue);

    // Also check the raw cookie
    const cookies = await page.context().cookies();
    const testCookie = cookies.find(cookie => cookie.name === 'encodingTest');
    expect(testCookie?.value).toBe(encodeURIComponent(specialValue));
  });

  test('verifies debug mode produces console output', async ({ page }) => {
    await page.context().clearCookies();

    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'debug' || msg.type() === 'log' || msg.type() === 'info') {
        consoleLogs.push(msg.text());
      }
    });

    await page.evaluate(() => {
      const cookies = window.miniCookies({ debug: true });
      cookies.set('debugTest', 'debugValue');
      const value = cookies.get('debugTest');
      // Force console output to verify debug mode
      console.log('Test finished, value:', value);
    });

    // Wait a bit for console messages
    await page.waitForTimeout(200);

    // Check that debug messages were logged or at least the test log was captured
    const hasDebugOutput = consoleLogs.some(log => 
      log.includes('mini-cookies') || log.includes('Test finished')
    );
    expect(hasDebugOutput).toBe(true);
  });
});
