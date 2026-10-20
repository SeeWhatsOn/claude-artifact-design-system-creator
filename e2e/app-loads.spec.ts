import { AxeBuilder } from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test("the app loads with its title and no accessibility violations", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1, name: "Brandkit for Claude" })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
