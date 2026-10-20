import { CircleAlert, CircleCheck, OctagonX } from "lucide-react";
import type { Diagnostic } from "@/core/compile";

const SEVERITY_ORDER: Record<Diagnostic["severity"], number> = { block: 0, warn: 1, info: 2 };

/** Lists what blocks export or deserves a second look, most serious first, in plain words. */
export function DiagnosticsPanel({ diagnostics }: { diagnostics: Diagnostic[] }) {
  const sorted = diagnostics.toSorted((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return (
    <section aria-label="Checks" className="space-y-2">
      <h2 className="text-sm font-medium">Checks</h2>
      {sorted.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CircleCheck aria-hidden className="size-4" />
          Nothing to fix.
        </p>
      ) : (
        <ul className="space-y-2">
          {sorted.map(diagnostic => (
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
      )}
    </section>
  );
}
