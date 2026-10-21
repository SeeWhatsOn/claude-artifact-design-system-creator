import { AxeBuilder } from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

const SCENES = ["Dashboard", "Landing page", "Report", "Slide"];

async function axeViolations(page: Page) {
  // Buttons and badges fade their colours; checking mid-fade would read half-light, half-dark values.
  await page.waitForFunction(() => document.getAnimations().length === 0);
  return (await new AxeBuilder({ page }).include("[data-preview-theme]").analyze()).violations;
}

test("every scene, beside the Claude default, has no accessibility violations in light or dark", async ({ page }) => {
  await page.goto("./");
  const preview = page.getByRole("region", { name: "Preview" });
  await preview.getByRole("switch", { name: "Compare with Claude default" }).click();
  for (const theme of ["Light", "Dark"]) {
    await preview.getByRole("radio", { name: theme }).check({ force: true });
    for (const scene of SCENES) {
      await preview.getByRole("tab", { name: scene }).click();
      await expect(preview.getByRole("region", { name: "Claude default" })).toBeVisible();
      expect(await axeViolations(page), `${scene}, ${theme}`).toEqual([]);
    }
  }
});

test.describe("at phone width", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("no scene scrolls sideways, alone or compared", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "Show preview" }).click();
    const preview = page.getByRole("region", { name: "Preview" });
    for (const compare of [false, true]) {
      if (compare) await preview.getByRole("switch", { name: "Compare with Claude default" }).click();
      for (const scene of SCENES) {
        await preview.getByRole("tab", { name: scene }).click();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${scene}${compare ? ", compared" : ""}`).toBeLessThanOrEqual(0);
      }
    }
  });

  test("the slide keeps its 16:9 shape and fits the screen", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "Show preview" }).click();
    const preview = page.getByRole("region", { name: "Preview" });
    await preview.getByRole("tab", { name: "Slide" }).click();
    const slide = preview.getByRole("heading", { name: "Three things we learned" });
    await expect(slide).toBeInViewport();
    const box = await preview.locator(".aspect-video").boundingBox();
    expect(box?.width).toBeLessThanOrEqual(360);
    expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(16 / 9, 1);
  });
});
