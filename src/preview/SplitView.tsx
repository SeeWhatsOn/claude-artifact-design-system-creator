import type { ReactNode } from "react";
import type { CssVarMap } from "@/core/compile";
import { PreviewSurface } from "./PreviewSurface";

/** One side of a comparison: its name, the variables it wears and what it shows. */
export type SplitSide = { label: string; vars: CssVarMap; content: ReactNode };

/**
 * Two previews side by side, each scoped to its own variables: Claude default vs mine now, snapshot A vs B later.
 * The sides stack when the preview column is narrow (a container query, so it follows the column, not the screen).
 */
export function SplitView({ sides, dark }: { sides: readonly [SplitSide, SplitSide]; dark: boolean }) {
  return (
    <div className="@container">
      <div className="grid gap-3 @xl:grid-cols-2">
        {sides.map(side => (
          <section key={side.label} aria-label={side.label} className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{side.label}</p>
            <PreviewSurface vars={side.vars} dark={dark} className="overflow-hidden">
              {side.content}
            </PreviewSurface>
          </section>
        ))}
      </div>
    </div>
  );
}
