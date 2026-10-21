import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isRecord } from "@/core/is-record";
import { STEPS, type StepId } from "@/core/steps";

// Navigation and view preferences are per viewer, not part of the design, so they live here rather than in the
// project: they stay out of undo history and out of saved project files.
type ShellData = {
  current: StepId;
  /** Index of the furthest step reached on the guided path. */
  furthest: number;
  /** Shows token names and raw values next to plain-language labels. */
  advanced: boolean;
  /** Phone only: the preview sheet is open over the controls. */
  previewOpen: boolean;
};

/** Where the user is in the guided flow, plus view preferences. */
export type ShellState = ShellData & {
  goTo: (step: StepId) => void;
  setAdvanced: (advanced: boolean) => void;
  setPreviewOpen: (open: boolean) => void;
};

const INITIAL: ShellData = { current: "start", furthest: 0, advanced: false, previewOpen: false };

const LAST = STEPS.length - 1;

/** Index of a step on the guided path. */
export function stepIndex(step: StepId): number {
  return STEPS.findIndex(candidate => candidate.id === step);
}

/** True once the user has reached Export, after which every step is a free tab. */
export function firstPassDone(furthest: number): boolean {
  return furthest >= LAST;
}

/** The shell store. localStorage is fine for these small per-viewer prefs; it fails soft when blocked. */
export const shellStore = createStore<ShellState>()(
  persist(
    set => ({
      ...INITIAL,
      goTo: step => set(state => ({ current: step, furthest: Math.max(state.furthest, stepIndex(step)) })),
      setAdvanced: advanced => set({ advanced }),
      setPreviewOpen: previewOpen => set({ previewOpen }),
    }),
    {
      name: "brandkit-shell",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ current, furthest, advanced }) => ({ current, furthest, advanced }),
      merge: (saved, state) => ({ ...state, ...readSaved(saved) }),
    },
  ),
);

// Saved prefs are untrusted (another version or a hand edit may have written them), so keep only valid fields.
function readSaved(saved: unknown): Partial<ShellData> {
  if (!isRecord(saved)) return {};
  const result: Partial<ShellData> = {};
  const step = STEPS.find(candidate => candidate.id === saved.current);
  if (step) result.current = step.id;
  if (typeof saved.furthest === "number" && saved.furthest >= 0 && saved.furthest <= LAST) {
    result.furthest = Math.floor(saved.furthest);
  }
  if (typeof saved.advanced === "boolean") result.advanced = saved.advanced;
  return result;
}

/** Reads from the shell store in React. */
export function useShellStore<T>(selector: (state: ShellState) => T): T {
  return useStore(shellStore, selector);
}

/** Back to the first visit: Start step, nothing reached, plain labels. Used by tests. */
export function resetShell() {
  shellStore.setState(INITIAL);
}
