import { useState } from "react";
import type { ThemeId } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";
import { COMPONENT_CSS } from "@/core/components/component-previews";
import { PATTERNS, type PatternGroup } from "@/core/patterns/pattern-catalogue";
import { patternState, setPatternState } from "@/core/patterns/pattern-editing";
import { PATTERN_CSS, patternPreviewBody } from "@/core/patterns/pattern-previews";
import { PreviewSurface } from "@/preview/PreviewSurface";
import { PreviewThemeSwitch } from "@/preview/PreviewThemeSwitch";
import { useProjectStore } from "@/state/project-store";
import { PatternStateSwitch } from "./PatternStateSwitch";

const GROUPS: PatternGroup[] = ["Data", "Diagrams", "Text and layout", "Navigation"];

/**
 * Every artifact pattern rendered in the brand, light or dark, each with a preferred / allowed / never choice.
 * Examples are the same static markup the export writes, so what you see is what Claude is shown.
 */
export function PatternLibrary({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const project = useProjectStore(state => state.project);
  const updateProject = useProjectStore(state => state.updateProject);
  const [chosen, setChosen] = useState<ThemeId>("light");
  // Falls back to light when the project's dark theme is switched off.
  const theme = dark ? chosen : "light";
  const vars = theme === "dark" && dark ? dark : light;

  return (
    <section id="pattern-library-panel" aria-labelledby="pattern-library" className="space-y-4">
      {/* The examples' classes only read tokens, so these rules do nothing outside a preview surface. */}
      <style>{`${COMPONENT_CSS}\n${PATTERN_CSS}`}</style>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id="pattern-library" className="text-base font-semibold">
            Pattern library
          </h3>
          <p className="text-sm text-muted-foreground">
            Charts, tables, diagrams and other building blocks Claude puts in artifacts. Never means Claude is told not
            to use it.
          </p>
        </div>
        <PreviewThemeSwitch label="Pattern theme" value={theme} onChange={setChosen} darkAvailable={Boolean(dark)} />
      </div>
      {GROUPS.map(group => (
        <div key={group} className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">{group}</h4>
          {PATTERNS.filter(pattern => pattern.group === group).map(pattern => {
            const state = patternState(project, pattern.id);
            return (
              <article key={pattern.id} aria-labelledby={`pattern-${pattern.id}`} className="space-y-2">
                <header className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h5 id={`pattern-${pattern.id}`} className="font-semibold">
                      {pattern.title}
                    </h5>
                    <p className="text-sm text-muted-foreground">{pattern.summary}</p>
                  </div>
                  <PatternStateSwitch
                    label={`${pattern.title} use`}
                    value={state}
                    onChange={next => updateProject(current => setPatternState(current, pattern.id, next))}
                  />
                </header>
                <PreviewSurface vars={vars} dark={theme === "dark"} className="p-[var(--space-4)]">
                  {/* Our own static markup from the catalogue, never user input. */}
                  <div dangerouslySetInnerHTML={{ __html: patternPreviewBody(pattern.id) }} />
                </PreviewSurface>
              </article>
            );
          })}
        </div>
      ))}
    </section>
  );
}
