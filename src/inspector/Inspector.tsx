import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import type { CssVarMap } from "@/core/compile";
import { sectionHeader, type EditTarget } from "@/core/edit-targets";
import { stepLabel } from "@/core/steps";
import { useShellStore } from "@/shell/shell-store";
import { InspectorControl } from "./InspectorControl";

/**
 * The main controls for one clicked preview element, each headed with what else it changes. A panel docked at the
 * bottom right on wide screens and a bottom sheet on phones. Portalled to the body so it sits above the phone
 * preview sheet and stays a top-level landmark. Focus starts on its title; Escape closes it.
 */
export function Inspector({ target, vars, onClose }: { target: EditTarget; vars: CssVarMap; onClose: () => void }) {
  const titleId = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const goTo = useShellStore(state => state.goTo);
  const setPreviewOpen = useShellStore(state => state.setPreviewOpen);

  const panel = useRef<HTMLElement>(null);

  useEffect(() => title.current?.focus(), []);

  useEffect(() => {
    const element = panel.current;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // Stop here so the phone preview sheet, which closes on Escape at the window, stays open.
      event.stopPropagation();
      onClose();
    }
    element?.addEventListener("keydown", onKey);
    return () => element?.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <aside
      ref={panel}
      aria-labelledby={titleId}
      className="fixed inset-x-0 bottom-0 z-[60] max-h-[60vh] space-y-4 overflow-y-auto rounded-t-xl border-t bg-background p-4 text-foreground shadow-lg lg:inset-x-auto lg:right-4 lg:bottom-4 lg:max-h-[75vh] lg:w-96 lg:rounded-xl lg:border"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 ref={title} id={titleId} tabIndex={-1} className="text-base font-semibold outline-none">
          {target.title}
        </h2>
        <Button variant="ghost" size="icon" aria-label="Close inspector" onClick={onClose}>
          <X aria-hidden />
        </Button>
      </div>
      {target.sections.map(section => (
        <section key={section.control} aria-label={section.title} className="space-y-2 border-t pt-3">
          <h3 className="text-sm font-medium">{sectionHeader(section)}</h3>
          <InspectorControl control={section.control} role={target.role} vars={vars} />
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0"
            onClick={() => {
              onClose();
              setPreviewOpen(false);
              goTo(section.step);
            }}
          >
            All {stepLabel(section.step).toLowerCase()} settings
          </Button>
        </section>
      ))}
    </aside>,
    document.body,
  );
}
