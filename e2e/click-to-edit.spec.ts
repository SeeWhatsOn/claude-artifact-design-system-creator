import { AxeBuilder } from "@axe-core/playwright";
import { test, expect, type Locator, type Page } from "@playwright/test";

// Presses Tab until the locator has focus, like a keyboard user would.
async function tabTo(page: Page, target: Locator) {
  for (let i = 0; i < 200; i++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error("Could not reach the target with Tab");
}

test("a card's corner radius can be edited with the keyboard alone", async ({ page }) => {
  await page.goto("./");
  const preview = page.getByRole("region", { name: "Preview" });

  await tabTo(page, preview.getByRole("switch", { name: "Edit mode" }));
  await page.keyboard.press("Space");
  const card = preview.getByRole("button", { name: "Edit card style" }).first();
  await tabTo(page, card);
  await page.keyboard.press("Enter");

  const inspector = page.getByRole("complementary", { name: "Card" });
  await expect(inspector.getByRole("heading", { name: "Card", exact: true })).toBeFocused();
  await expect(inspector.getByText("Corner radius · changes all cards, alerts and panels")).toBeVisible();
  const radius = inspector.getByLabel("Cards (px)");
  await tabTo(page, radius);
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.type("20");
  await expect(preview.locator("[data-preview-theme]")).toHaveCSS("--radius-card", "20px");

  await page.keyboard.press("Escape");
  await expect(inspector).toBeHidden();
  await expect(card).toBeFocused();
});

test("edit mode and the inspector have no accessibility violations", async ({ page }) => {
  await page.goto("./");
  const preview = page.getByRole("region", { name: "Preview" });
  await preview.getByRole("switch", { name: "Edit mode" }).click();
  await preview.getByRole("button", { name: "Edit card style" }).first().click();
  await expect(page.getByRole("complementary", { name: "Card" })).toBeVisible();
  await page.waitForFunction(() => document.getAnimations().length === 0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
