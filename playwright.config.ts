import { defineConfig, devices } from "@playwright/test";

/** End-to-end tests against the production build, served like GitHub Pages. */
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173/claude-artifact-design-system-creator/",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "bun run build && bun e2e/serve-dist.ts",
    url: "http://localhost:4173/claude-artifact-design-system-creator/",
    reuseExistingServer: !process.env.CI,
  },
});
