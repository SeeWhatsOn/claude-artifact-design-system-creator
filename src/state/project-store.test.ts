import { test, expect } from "bun:test";
import { createDefaultProject } from "@/core/default-project";
import { createProjectStore, idbStorage, type ProjectStorage } from "./project-store";

function memoryStorage(): ProjectStorage {
  const items = new Map<string, unknown>();
  return {
    getItem: async name => items.get(name) ?? null,
    setItem: async (name, value) => void items.set(name, value),
    removeItem: async name => void items.delete(name),
  };
}

function renamed(name: string) {
  return (project: ReturnType<typeof createDefaultProject>) => ({ ...project, meta: { ...project.meta, name } });
}

test("starts with the default project", () => {
  const store = createProjectStore(memoryStorage());
  expect(store.getState().project).toEqual(createDefaultProject());
});

test("undo and redo step through project changes", () => {
  const store = createProjectStore(memoryStorage());
  store.getState().updateProject(renamed("Acme"));
  store.getState().updateProject(renamed("Acme Two"));

  store.temporal.getState().undo();
  expect(store.getState().project.meta.name).toBe("Acme");

  store.temporal.getState().redo();
  expect(store.getState().project.meta.name).toBe("Acme Two");
});

test("a new store restores the project saved by an earlier one", async () => {
  const storage = memoryStorage();
  const first = createProjectStore(storage);
  await first.persist.rehydrate();
  first.getState().updateProject(renamed("Acme"));

  const second = createProjectStore(storage);
  await second.persist.rehydrate();
  expect(second.getState().project.meta.name).toBe("Acme");
});

test("restoring does not create an undo step", async () => {
  const storage = memoryStorage();
  const first = createProjectStore(storage);
  first.getState().updateProject(renamed("Acme"));

  const second = createProjectStore(storage);
  await second.persist.rehydrate();
  expect(second.temporal.getState().pastStates).toHaveLength(0);
});

test("invalid saved data is ignored and the default project is kept", async () => {
  const storage = memoryStorage();
  await storage.setItem("brandkit-project", { state: { project: { schemaVersion: 1, meta: "broken" } }, version: 0 });

  const store = createProjectStore(storage);
  await store.persist.rehydrate();
  expect(store.getState().project).toEqual(createDefaultProject());
});

test("the IndexedDB storage fails soft when IndexedDB is unavailable", async () => {
  // happy-dom has no IndexedDB, like some private-browsing modes.
  expect(await idbStorage.getItem("anything")).toBeNull();
  expect(idbStorage.setItem("anything", { state: {}, version: 0 })).resolves.toBeUndefined();

  const store = createProjectStore(idbStorage);
  await store.persist.rehydrate();
  store.getState().updateProject(renamed("Acme"));
  expect(store.getState().project.meta.name).toBe("Acme");
});
