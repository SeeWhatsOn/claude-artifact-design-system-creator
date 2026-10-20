import * as idb from "idb-keyval";
import { temporal } from "zundo";
import { createStore, useStore } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";
import { createDefaultProject } from "@/core/default-project";
import { parseProject, type Project } from "@/core/project";

const STORAGE_KEY = "brandkit-project";

/** The project being edited, plus the one way to change it. */
export type ProjectState = {
  project: Project;
  updateProject: (update: (project: Project) => Project) => void;
};

type PersistedState = Pick<ProjectState, "project">;

/** Async key-value storage that holds structured-clone values, like IndexedDB. Values read back are untrusted. */
export type ProjectStorage = {
  getItem: (name: string) => Promise<unknown>;
  setItem: (name: string, value: unknown) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
};

/**
 * IndexedDB via idb-keyval. IndexedDB rather than localStorage because uploaded fonts and logos are binary.
 * Every call fails soft so the app keeps working, unsaved, where IndexedDB is missing or blocked.
 */
export const idbStorage: ProjectStorage = {
  getItem: async name => {
    try {
      return (await idb.get(name)) ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await idb.set(name, value);
    } catch {
      // Not saved; the in-memory project is still usable.
    }
  },
  removeItem: async name => {
    try {
      await idb.del(name);
    } catch {
      // Nothing to remove if storage is unavailable.
    }
  },
};

// Validates what comes back from storage, so a corrupt or outdated save falls back to the default project.
function validatingStorage(storage: ProjectStorage): PersistStorage<PersistedState> {
  return {
    getItem: async name => {
      const saved = await storage.getItem(name);
      if (typeof saved !== "object" || saved === null || !("state" in saved)) return null;
      const { state } = saved;
      if (typeof state !== "object" || state === null || !("project" in state)) return null;
      const result = parseProject(state.project);
      return result.ok ? { state: { project: result.project } } : null;
    },
    setItem: (name, value) => storage.setItem(name, value),
    removeItem: name => storage.removeItem(name),
  };
}

/** Creates a project store with undo/redo (zundo) that saves to and restores from the given storage. */
export function createProjectStore(storage: ProjectStorage) {
  const store = createStore<ProjectState>()(
    persist(
      temporal(
        set => ({
          project: createDefaultProject(),
          updateProject: update => set(state => ({ project: update(state.project) })),
        }),
        { partialize: state => ({ project: state.project }) },
      ),
      {
        name: STORAGE_KEY,
        storage: validatingStorage(storage),
        partialize: state => ({ project: state.project }),
      },
    ),
  );
  // Restoring a saved project is not something the user can undo.
  store.persist.onFinishHydration(() => store.temporal.getState().clear());
  return store;
}

/** The app's single project store, saved to IndexedDB. */
export const projectStore = createProjectStore(idbStorage);

/** Reads from the app's project store in React components. */
export function useProjectStore<T>(selector: (state: ProjectState) => T): T {
  return useStore(projectStore, selector);
}
