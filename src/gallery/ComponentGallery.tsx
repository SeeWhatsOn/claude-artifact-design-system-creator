import { useState } from "react";
import type { ThemeId } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";
import { COMPONENTS } from "@/core/components/component-catalogue";
import { PreviewSurface } from "@/preview/PreviewSurface";
import { PreviewThemeSwitch } from "@/preview/PreviewThemeSwitch";
import { COMPONENT_DEMOS } from "./ComponentDemos";

/** All twelve components in the user's style, in light or dark, each with the summary Claude will read. */
export function ComponentGallery({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const [chosen, setChosen] = useState<ThemeId>("light");
  // Falls back to light when the project's dark theme is switched off.
  const theme = dark ? chosen : "light";
  const vars = theme === "dark" && dark ? dark : light;

  return (
    <section aria-labelledby="component-gallery" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="component-gallery" className="text-base font-semibold">
          Component gallery
        </h3>
        <PreviewThemeSwitch label="Gallery theme" value={theme} onChange={setChosen} darkAvailable={Boolean(dark)} />
      </div>
      <PreviewSurface vars={vars} dark={theme === "dark"} className="grid gap-[var(--space-4)] p-[var(--space-4)]">
        {COMPONENTS.map(component => {
          const Demo = COMPONENT_DEMOS[component.name];
          return (
            <article
              key={component.name}
              aria-labelledby={`gallery-${component.name}`}
              className="space-y-[var(--space-3)] border-b border-border pb-[var(--space-4)]"
              id={`gallery-${component.name.toLowerCase()}`}
            >
              <header className="space-y-1">
                <h4 id={`gallery-${component.name}`} className="font-semibold">
                  {component.title}
                </h4>
                <p className="text-sm text-muted-foreground">{component.summary.replaceAll("`", "")}</p>
              </header>
              <Demo />
            </article>
          );
        })}
      </PreviewSurface>
    </section>
  );
}
