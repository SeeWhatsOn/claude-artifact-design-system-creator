import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { claudeDefaultPreview } from "@/core/claude-default";
import type { ThemeId } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";
import { useGoogleFonts } from "@/fonts/use-google-fonts";
import { PreviewLogo } from "@/logos/PreviewLogo";
import { SCENES, type SceneEntry } from "@/scenes/scene-registry";
import { useProjectStore } from "@/state/project-store";
import { PreviewSurface } from "./PreviewSurface";
import { PreviewThemeSwitch } from "./PreviewThemeSwitch";
import { SplitView } from "./SplitView";

/** The live preview: scene tabs drawn with the compiled variables, optionally beside the Claude default look. */
export function PreviewPane({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const [chosen, setChosen] = useState<ThemeId>("light");
  const [scene, setScene] = useState(SCENES[0]?.id ?? "");
  const [compare, setCompare] = useState(false);
  const compareId = useId();
  const components = useProjectStore(state => state.project.components);
  const name = useProjectStore(state => state.project.meta.name);
  // Falls back to light when the project's dark theme is switched off.
  const theme = dark ? chosen : "light";
  const vars = theme === "dark" && dark ? dark : light;
  const claude = compare ? claudeDefaultPreview() : undefined;
  useGoogleFonts(claude?.fontsToLoad ?? []);

  function mine({ Scene }: SceneEntry) {
    return <Scene components={components} logo={<PreviewLogo theme={theme} />} />;
  }

  return (
    <section aria-label="Preview" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <PreviewThemeSwitch value={theme} onChange={setChosen} darkAvailable={Boolean(dark)} />
        <div className="flex items-center gap-2">
          <Switch id={compareId} checked={compare} onCheckedChange={setCompare} />
          <Label htmlFor={compareId}>Compare with Claude default</Label>
        </div>
      </div>
      <Tabs value={scene} onValueChange={setScene}>
        <TabsList
          aria-label="Scene"
          className="flex-wrap justify-start group-data-[orientation=horizontal]/tabs:h-auto"
        >
          {SCENES.map(entry => (
            <TabsTrigger key={entry.id} value={entry.id} className="h-8 flex-none">
              {entry.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {SCENES.map(entry => (
          <TabsContent key={entry.id} value={entry.id}>
            {claude ? (
              <SplitView
                dark={theme === "dark"}
                sides={[
                  {
                    label: "Claude default",
                    vars: (theme === "dark" && claude.dark) || claude.light,
                    // No placement rules and no logo: the generic look as Claude would draw it unprompted.
                    content: <entry.Scene components={{}} logo={<Wordmark name={name} />} />,
                  },
                  { label: "Your brand", vars, content: mine(entry) },
                ]}
              />
            ) : (
              <PreviewSurface vars={vars} dark={theme === "dark"} className="overflow-hidden">
                {mine(entry)}
              </PreviewSurface>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function Wordmark({ name }: { name: string }) {
  return (
    <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
      {name}
    </span>
  );
}
