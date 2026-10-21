import { test, expect, type Page } from "@playwright/test";

test.use({ viewport: { width: 360, height: 740 } });

function pageOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test("no step scrolls sideways at 360px", async ({ page }) => {
  await page.goto("./");
  const next = page.getByRole("button", { name: /^Next/ });
  for (let step = 0; step < 8; step++) {
    expect(await pageOverflow(page), `step ${step + 1}`).toBeLessThanOrEqual(0);
    if (step < 7) await next.click();
  }
});

test("on a phone the preview is a sheet that opens over the controls and closes again", async ({ page }) => {
  await page.goto("./");
  const preview = page.getByRole("region", { name: "Preview" });
  await expect(preview).toBeHidden();

  await page.getByRole("button", { name: "Show preview" }).click();
  await expect(preview).toBeVisible();
  await expect(preview.getByRole("button", { name: "Save changes" })).toBeInViewport();
  expect(await pageOverflow(page)).toBeLessThanOrEqual(0);

  await page.getByRole("button", { name: "Hide preview" }).click();
  await expect(preview).toBeHidden();
});
