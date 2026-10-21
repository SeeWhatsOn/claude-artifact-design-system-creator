import { Eye, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShellStore } from "./shell-store";

/**
 * Holds the preview: a sticky column beside the controls on wide screens, and on phones a sheet that the
 * floating button opens over the stacked controls. Plain CSS breakpoints, so no extra dependency is needed.
 */
export function PreviewSheet({ children }: { children: ReactNode }) {
  const open = useShellStore(state => state.previewOpen);
  const setOpen = useShellStore(state => state.setPreviewOpen);

  // Escape closes the sheet, like any other overlay.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <div
        id="preview-sheet"
        className={cn(
          "min-w-0 space-y-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto",
          open
            ? "max-lg:fixed max-lg:inset-x-0 max-lg:top-12 max-lg:bottom-0 max-lg:z-40 max-lg:overflow-y-auto max-lg:rounded-t-xl max-lg:border-t max-lg:bg-background max-lg:p-4 max-lg:pb-20 max-lg:shadow-lg"
            : "max-lg:hidden",
        )}
      >
        {children}
      </div>
      <Button
        aria-controls="preview-sheet"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="fixed right-4 bottom-4 z-50 shadow-lg lg:hidden"
      >
        {open ? <X aria-hidden /> : <Eye aria-hidden />}
        {open ? "Hide preview" : "Show preview"}
      </Button>
    </>
  );
}
