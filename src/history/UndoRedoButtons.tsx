import { Redo2, Undo2 } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "zustand";
import { Button } from "@/components/ui/button";
import { projectStore } from "@/state/project-store";

/** Undo and redo buttons, plus the Cmd/Ctrl+Z and Shift+Cmd/Ctrl+Z shortcuts. */
export function UndoRedoButtons() {
  const canUndo = useStore(projectStore.temporal, state => state.pastStates.length > 0);
  const canRedo = useStore(projectStore.temporal, state => state.futureStates.length > 0);
  const { undo, redo } = projectStore.temporal.getState();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
      // Text fields keep their own native undo for what's being typed.
      if (isTextEntry(event.target)) return;
      event.preventDefault();
      if (event.shiftKey) projectStore.temporal.getState().redo();
      else projectStore.temporal.getState().undo();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Undo"
        title="Undo (Cmd/Ctrl+Z)"
        disabled={!canUndo}
        onClick={() => undo()}
      >
        <Undo2 aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Redo"
        title="Redo (Shift+Cmd/Ctrl+Z)"
        disabled={!canRedo}
        onClick={() => redo()}
      >
        <Redo2 aria-hidden />
      </Button>
    </div>
  );
}

function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target instanceof HTMLTextAreaElement) return true;
  // Radios, checkboxes and buttons have no text undo, so the shortcut still applies on them.
  return (
    target instanceof HTMLInputElement && !["radio", "checkbox", "button", "submit", "color"].includes(target.type)
  );
}
