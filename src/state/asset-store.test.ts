import { test, expect } from "bun:test";
import { createAssetStore } from "./asset-store";
import type { ProjectStorage } from "./project-store";

function memoryStorage(): ProjectStorage {
  const items = new Map<string, unknown>();
  return {
    getItem: async name => items.get(name) ?? null,
    setItem: async (name, value) => void items.set(name, value),
    removeItem: async name => void items.delete(name),
  };
}

test("added assets are restored by a new store", async () => {
  const storage = memoryStorage();
  const first = createAssetStore(storage);
  await first.persist.rehydrate();
  first.getState().addAssets({ "font-1": new Uint8Array([1, 2]) });

  const second = createAssetStore(storage);
  await second.persist.rehydrate();
  expect([...(second.getState().assets["font-1"] ?? [])]).toEqual([1, 2]);
});

test("entries that aren't bytes are dropped on restore", async () => {
  const storage = memoryStorage();
  await storage.setItem("brandkit-assets", {
    state: { assets: { good: new Uint8Array([1]), bad: "nope" } },
    version: 0,
  });
  const store = createAssetStore(storage);
  await store.persist.rehydrate();
  expect(Object.keys(store.getState().assets)).toEqual(["good"]);
});
