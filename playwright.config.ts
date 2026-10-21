import { defineConfig, devices } from "@playwright/test";

// PORT lets parallel checkouts each run their own server instead of reusing another's build.
const url = `http://localhost:${process.env.PORT ?? 4173}/claude-artifact-design-system-creator/`;

/** End-to-end tests against the production build, served like GitHub Pages. */
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: url,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "bun run build && bun e2e/serve-dist.ts",
    url,
    reuseExistingServer: !process.env.CI,
  },
});
