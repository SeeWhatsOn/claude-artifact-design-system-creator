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

test("the gallery has no accessibility violations in light or dark", async ({ page }) => {
  await openComponentsStep(page);
  const gallery = page.getByRole("region", { name: "Component gallery" });
  await expect(gallery.getByRole("heading", { name: "Chart" })).toBeVisible();
  expect((await new AxeBuilder({ page }).include("[data-preview-theme]").analyze()).violations).toEqual([]);

  await gallery.getByRole("radio", { name: "Dark" }).check({ force: true });
  await expect(gallery.locator("[data-preview-theme]")).toHaveClass(/dark/);
  // Buttons and badges fade their colours; checking mid-fade would read half-light, half-dark values.
  await page.waitForFunction(() => document.getAnimations().length === 0);
  expect((await new AxeBuilder({ page }).include("[data-preview-theme]").analyze()).violations).toEqual([]);
});

test("the gallery dialog opens in the brand's colours", async ({ page }) => {
  await openComponentsStep(page);
  const gallery = page.getByRole("region", { name: "Component gallery" });
  await gallery.getByRole("button", { name: "Delete report" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete this report?" });
  await expect(dialog).toBeVisible();
  // Portalled into the preview surface, so it reads the brand's card colour rather than the app's.
  const cardVar = await gallery
    .locator("[data-preview-theme]")
    .evaluate(el => getComputedStyle(el).getPropertyValue("--card"));
  const background = await dialog.evaluate(el => getComputedStyle(el).backgroundColor);
  const expected = await page.evaluate(hex => {
    const probe = document.createElement("div");
    probe.style.color = hex;
    document.body.append(probe);
    const rgb = getComputedStyle(probe).color;
    probe.remove();
    return rgb;
  }, cardVar.trim());
  expect(background).toBe(expected);
});
