import { test, expect, type Page } from "@playwright/test";

// Reads the autosaved project straight from IndexedDB (idb-keyval's default database and store).
function savedProject(page: Page) {
  return page.evaluate(
    () =>
      new Promise<unknown>(resolve => {
        const open = indexedDB.open("keyval-store");
        open.onsuccess = () => {
          const db = open.result;
          if (!db.objectStoreNames.contains("keyval")) return resolve(null);
          const get = db.transaction("keyval").objectStore("keyval").get("brandkit-project");
          get.onsuccess = () => resolve(get.result ?? null);
        };
        open.onerror = () => resolve(null);
      }),
  );
}

test("reloading restores the last palette and dark-theme choice", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("radio", { name: /Ledger Ink/ }).check({ force: true });
  await page.getByRole("checkbox", { name: "Include a dark theme" }).uncheck();
  // Autosave is asynchronous, so wait for it to land before reloading.
  await expect.poll(() => savedProject(page)).toMatchObject({ state: { project: { darkEnabled: false } } });

  await page.reload();
  await expect(page.getByRole("radio", { name: /Ledger Ink/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Include a dark theme" })).not.toBeChecked();
});

test("the app still works when storage is blocked, as in some private windows", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", { get: () => undefined });
  });
  await page.goto("./");
  await page.getByRole("radio", { name: /Ledger Ink/ }).check({ force: true });
  await expect(page.getByRole("radio", { name: /Ledger Ink/ })).toBeChecked();
  await expect(page.getByRole("button", { name: "Download Design System" })).toBeEnabled();
});
