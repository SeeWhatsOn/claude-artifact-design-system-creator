import { CircleCheck, OctagonX } from "lucide-react";
import type { Diagnostic } from "@/core/compile";
import { STEPS } from "@/core/steps";
import { cn } from "@/lib/utils";
import { firstPassDone, useShellStore } from "./shell-store";

/**
 * The steps rail. Each step shows whether something on it blocks export. Before the first pass only steps
 * already reached can be opened; once Export has been reached every step works as a tab.
 */
export function ProgressRail({ diagnostics }: { diagnostics: Diagnostic[] }) {
  const current = useShellStore(state => state.current);
  const furthest = useShellStore(state => state.furthest);
  const goTo = useShellStore(state => state.goTo);
  const free = firstPassDone(furthest);

  return (
    <nav aria-label="Steps" className="overflow-x-auto">
      <ol className="flex gap-1 lg:flex-col">
        {STEPS.map((step, index) => {
          const blocks = diagnostics.filter(d => d.step === step.id && d.severity === "block").length;
          const reached = free || index <= furthest;
          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                aria-current={step.id === current ? "step" : undefined}
                disabled={!reached}
                onClick={() => goTo(step.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm whitespace-nowrap",
                  "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                  "aria-[current=step]:bg-secondary aria-[current=step]:font-medium",
                )}
              >
                <span aria-hidden className="text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                {step.label}
                {blocks > 0 ? (
                  <span className="ml-auto flex items-center gap-1 text-xs text-destructive">
                    <OctagonX aria-hidden className="size-3.5" />
                    {blocks} to fix
                  </span>
                ) : (
                  reached &&
                  index < furthest && (
                    <CircleCheck aria-label="done" className="ml-auto size-3.5 text-muted-foreground" />
                  )
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
