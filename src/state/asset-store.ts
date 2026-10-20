import { createStore, useStore } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";
import type { ProjectAssets } from "@/core/project-file";
import { idbStorage, type ProjectStorage } from "./project-store";

const STORAGE_KEY = "brandkit-assets";

/** Uploaded binaries (fonts, logos) by asset id, kept apart from the project so undo history stays small. */
export type AssetState = {
  assets: ProjectAssets;
  addAssets: (assets: ProjectAssets) => void;
};

type PersistedAssets = Pick<AssetState, "assets">;

// Keeps only entries that really are bytes, so a damaged save can't feed junk to the font loader or export.
function validatingStorage(storage: ProjectStorage): PersistStorage<PersistedAssets> {
  return {
    getItem: async name => {
      const saved = await storage.getItem(name);
      if (typeof saved !== "object" || saved === null || !("state" in saved)) return null;
      const { state } = saved;
      if (typeof state !== "object" || state === null || !("assets" in state)) return null;
      const raw = state.assets;
      if (typeof raw !== "object" || raw === null) return null;
      const assets = Object.fromEntries(Object.entries(raw).filter(([, bytes]) => bytes instanceof Uint8Array));
      return { state: { assets } };
    },
    setItem: (name, value) => storage.setItem(name, value),
    removeItem: name => storage.removeItem(name),
  };
}

/**
 * Creates an asset store saved to the given storage. Assets are only ever added: ids are unique, and an
 * undo can bring back a font whose file must still be there.
 */
export function createAssetStore(storage: ProjectStorage) {
  return createStore<AssetState>()(
    persist(
      set => ({
        assets: {},
        addAssets: added => set(state => ({ assets: { ...state.assets, ...added } })),
      }),
      { name: STORAGE_KEY, storage: validatingStorage(storage), partialize: state => ({ assets: state.assets }) },
    ),
  );
}

/** The app's single asset store, saved to IndexedDB. */
export const assetStore = createAssetStore(idbStorage);

/** Reads from the app's asset store in React components. */
export function useAssetStore<T>(selector: (state: AssetState) => T): T {
  return useStore(assetStore, selector);
}
