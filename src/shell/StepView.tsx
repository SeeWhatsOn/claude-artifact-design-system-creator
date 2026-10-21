import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/core/steps";
import { useShellStore, stepIndex } from "./shell-store";
import { panelsFor, type StepPanelProps } from "./step-panels";

/** The current step: its title, its registered panels, and Back / Next along the guided path. */
export function StepView(props: StepPanelProps) {
  const current = useShellStore(state => state.current);
  const goTo = useShellStore(state => state.goTo);
  const index = stepIndex(current);
  const step = STEPS[index] ?? STEPS[0];
  const previous = STEPS[index - 1];
  const next = STEPS[index + 1];
  const heading = useRef<HTMLHeadingElement>(null);
  const shown = useRef(current);

  // After moving between steps, put focus (and the viewport) on the new step's title, not on the old button.
  // Compared by hand rather than with a dependency list so the first render doesn't steal focus.
  useEffect(() => {
    if (shown.current === current) return;
    shown.current = current;
    heading.current?.focus();
  });

  return (
    <section aria-label="Step" className="min-w-0 space-y-6">
      <h2 ref={heading} id={`step-${step.id}`} tabIndex={-1} className="text-base font-semibold outline-none">
        {step.label}
      </h2>
      {panelsFor(step.id).map(({ id, Panel }) => (
        <Panel key={id} {...props} />
      ))}
      <div className="flex flex-wrap justify-between gap-2 border-t pt-4">
        {previous ? (
          <Button variant="ghost" onClick={() => goTo(previous.id)}>
            <ArrowLeft aria-hidden />
            Back<span className="sr-only">: {previous.label}</span>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button onClick={() => goTo(next.id)}>
            Next: {next.label}
            <ArrowRight aria-hidden />
          </Button>
        )}
      </div>
    </section>
  );
}
