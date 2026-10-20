import { CircleAlert, CircleCheck, OctagonX } from "lucide-react";
import type { Diagnostic } from "@/core/compile";

// One place for how each severity sorts and shows.
const SEVERITY: Record<
  Diagnostic["severity"],
  { order: number; label: string; Icon: typeof CircleAlert; tone: string }
> = {
  block: { order: 0, label: "Must fix: ", Icon: OctagonX, tone: "text-destructive" },
  warn: { order: 1, label: "Check: ", Icon: CircleAlert, tone: "text-muted-foreground" },
  info: { order: 2, label: "Note: ", Icon: CircleAlert, tone: "text-muted-foreground" },
};

/** Lists what blocks export or deserves a second look, most serious first, in plain words. */
export function DiagnosticsPanel({ diagnostics }: { diagnostics: Diagnostic[] }) {
  const sorted = diagnostics.toSorted((a, b) => SEVERITY[a.severity].order - SEVERITY[b.severity].order);

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
          {sorted.map(diagnostic => {
            const { label, Icon, tone } = SEVERITY[diagnostic.severity];
            return (
              <li key={`${diagnostic.path}:${diagnostic.message}`} className="flex gap-2 text-sm">
                <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${tone}`} />
                <span>
                  <span className="font-medium">{label}</span>
                  {diagnostic.message}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
