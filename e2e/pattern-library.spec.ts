import { AxeBuilder } from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

async function openComponentsStep(page: Page) {
  await page.goto("./");
  const step = page.getByRole("region", { name: "Step" });
  for (let i = 0; i < 10; i++) {
    if (await step.getByRole("heading", { level: 2, name: "Components and rules" }).isVisible()) return;
    await page.getByRole("button", { name: /^Next/ }).click();
  }
  throw new Error("Never reached the Components and rules step");
}

test("the pattern library has no accessibility violations in light or dark", async ({ page }) => {
  await openComponentsStep(page);
  const library = page.getByRole("region", { name: "Pattern library" });
  await expect(library.getByRole("article", { name: "Breadcrumb" })).toBeVisible();
  const scan = () => new AxeBuilder({ page }).include("#pattern-library-panel").analyze();
  expect((await scan()).violations).toEqual([]);

  await library.getByRole("radio", { name: "Dark" }).check({ force: true });
  await expect(library.locator("[data-preview-theme]").first()).toHaveClass(/dark/);
  await page.waitForFunction(() => document.getAnimations().length === 0);
  expect((await scan()).violations).toEqual([]);
});
