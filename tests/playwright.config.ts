import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const retryCount = isCi ? 2 : 0;
const workerCount = isCi ? 1 : undefined;
const serverTimeout = 120 * 1000;
const serverPort = 4173;
const serverUrl = `http://127.0.0.1:${serverPort}`;
const fixtureUrl = `${serverUrl}/test-bundled`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: retryCount,
  workers: workerCount,
  reporter: "html",
  use: {
    baseURL: serverUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "node e2e/server.ts",
    url: fixtureUrl,
    reuseExistingServer: false,
    timeout: serverTimeout,
  },
});
