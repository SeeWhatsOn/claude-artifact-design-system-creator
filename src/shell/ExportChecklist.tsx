import { CircleAlert, CircleCheck, OctagonX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/core/steps";
import { useShellStore } from "./shell-store";
import type { StepPanelProps } from "./step-panels";

/** Export step: every problem still open, grouped by step, each linking back to the step that fixes it. */
export function ExportChecklist({ diagnostics }: StepPanelProps) {
  const goTo = useShellStore(state => state.goTo);
  const open = diagnostics.filter(diagnostic => diagnostic.severity !== "info");
  const blocked = open.some(diagnostic => diagnostic.severity === "block");

  return (
    <section aria-label="Export checklist" className="space-y-4">
      <p className="flex items-center gap-2 text-sm">
        {blocked ? (
          <>
            <OctagonX aria-hidden className="size-4 text-destructive" />
            Fix the items marked “Must fix” before downloading.
          </>
        ) : (
          <>
            <CircleCheck aria-hidden className="size-4" />
            Ready to download. Use Download Design System at the top.
          </>
        )}
      </p>
      <ul className="space-y-4">
        {STEPS.map(step => {
          const items = open
            .filter(diagnostic => diagnostic.step === step.id)
            .toSorted((a, b) => (a.severity === "block" ? 0 : 1) - (b.severity === "block" ? 0 : 1));
          if (items.length === 0) return null;
          return (
            <li key={step.id} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium">{step.label}</h3>
                <Button variant="outline" size="sm" onClick={() => goTo(step.id)}>
                  Go to {step.label}
                </Button>
              </div>
              <ul className="space-y-1">
                {items.map(diagnostic => (
                  <li key={`${diagnostic.path}:${diagnostic.message}`} className="flex gap-2 text-sm">
                    {diagnostic.severity === "block" ? (
                      <OctagonX aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
                    ) : (
                      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span>
                      <span className="font-medium">{diagnostic.severity === "block" ? "Must fix: " : "Check: "}</span>
                      {diagnostic.message}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
