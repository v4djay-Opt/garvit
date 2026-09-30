import { defineConfig } from "@playwright/test";
export default defineConfig({
  projects: [{ name: "chromium", use: { browserName: "chromium" } }, { name: "firefox", use: { browserName: "firefox" } }, { name: "webkit", use: { browserName: "webkit" } }],
  testDir: "./tests/browser", fullyParallel: false, workers: 1, timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:3100", headless: true, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: { command: "/opt/homebrew/opt/node@24/bin/node scripts/start-preview.mjs", url: "http://127.0.0.1:3100", reuseExistingServer: true, timeout: 60_000 },
});
