import { useId, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { claudeDefaultPreview } from "@/core/claude-default";
import type { CssVarMap } from "@/core/compile";
import type { EditTarget } from "@/core/edit-targets";
import { useGoogleFonts } from "@/fonts/use-google-fonts";
import { EditableScene } from "@/inspector/EditableScene";
import { Inspector } from "@/inspector/Inspector";
import { PreviewLogo } from "@/logos/PreviewLogo";
import { SCENES, type SceneEntry } from "@/scenes/scene-registry";
import { useProjectStore } from "@/state/project-store";
import { PreviewSurface } from "./PreviewSurface";
import { PreviewThemeSwitch } from "./PreviewThemeSwitch";
import { SplitView } from "./SplitView";
import { usePreviewTheme } from "./use-preview-theme";

/** The live preview: scene tabs drawn with the compiled variables, optionally beside the Claude default look. */
export function PreviewPane({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const [scene, setScene] = useState(SCENES[0]?.id ?? "");
  const [compare, setCompare] = useState(false);
  const compareId = useId();
  const editId = useId();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<EditTarget | null>(null);
  // The overlay that opened the inspector, so Escape can hand focus back to it.
  const opener = useRef<HTMLElement | null>(null);
  const components = useProjectStore(state => state.project.components);
  const name = useProjectStore(state => state.project.meta.name);
  const { theme, vars, setTheme } = usePreviewTheme(light, dark);
  const claude = compare ? claudeDefaultPreview() : undefined;
  useGoogleFonts(claude?.fontsToLoad ?? []);

  // Only my brand is editable; the Claude default side of a comparison stays as it is.
  function mine({ Scene }: SceneEntry) {
    return (
      <EditableScene
        editing={editing}
        onEdit={(target, element) => {
          opener.current = element;
          setSelected(target);
        }}
      >
        <Scene components={components} logo={<PreviewLogo theme={theme} />} />
      </EditableScene>
    );
  }

  function closeInspector() {
    setSelected(null);
    if (opener.current?.isConnected) opener.current.focus();
  }

  function toggleEditing(on: boolean) {
    setEditing(on);
    if (!on) setSelected(null);
  }

  return (
    <section aria-label="Preview" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <PreviewThemeSwitch value={theme} onChange={setTheme} darkAvailable={Boolean(dark)} />
        <div className="flex items-center gap-2">
          <Switch id={compareId} checked={compare} onCheckedChange={setCompare} />
          <Label htmlFor={compareId}>Compare with Claude default</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id={editId} checked={editing} onCheckedChange={toggleEditing} />
          <Label htmlFor={editId}>Edit mode</Label>
        </div>
      </div>
      {editing && (
        <p className="text-sm text-muted-foreground">Click or tab to any outlined part of the preview to edit it.</p>
      )}
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
      {selected && <Inspector key={selected.title} target={selected} vars={vars} onClose={closeInspector} />}
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
