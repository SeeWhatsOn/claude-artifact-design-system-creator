import { Button } from "@/components/ui/button";
import { COLOUR_TOKENS } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";
import { clearOverride, setOverride } from "@/core/palette-editing";
import { usePreviewTheme } from "@/preview/use-preview-theme";
import { useShellStore } from "@/shell/shell-store";
import { TokenName } from "@/shell/TokenName";
import { useProjectStore } from "@/state/project-store";

/**
 * Advanced mode only (the header's Advanced toggle): shows every derived colour by its token name and lets the
 * user pin any one of them per theme. The current values come from the compiled preview, so the UI never derives
 * colours itself.
 */
export function ColourOverrides({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const advanced = useShellStore(state => state.advanced);
  const overrides = useProjectStore(state => state.project.palette.overrides);
  const updateProject = useProjectStore(state => state.updateProject);
  const { theme, vars: values, setTheme } = usePreviewTheme(light, dark);
  if (!advanced) return null;

  return (
    <section aria-label="Advanced colours" className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Pin an exact value for any single colour. Pinned colours stay put when you change seeds or palettes.
      </p>
      <label className="flex items-center gap-2 text-sm">
        Theme
        <select
          value={theme}
          onChange={event => setTheme(event.target.value === "dark" ? "dark" : "light")}
          className="rounded-md border bg-background px-2 py-1"
        >
          <option value="light">Light</option>
          {dark && <option value="dark">Dark</option>}
        </select>
      </label>
      <ul className="grid gap-1 sm:grid-cols-2">
        {COLOUR_TOKENS.map(token => {
          const pinned = overrides[theme][token];
          return (
            <li key={token} className="flex items-center gap-2 text-sm">
              <input
                type="color"
                aria-label={`${token} (${theme})`}
                value={pinned ?? values[`--${token}`] ?? "#000000"}
                onChange={event => {
                  const hex = event.target.value;
                  updateProject(project => setOverride(project, theme, token, hex));
                }}
                className="h-7 w-9 cursor-pointer rounded border bg-transparent"
              />
              <TokenName>{token}</TokenName>
              {pinned && (
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Reset ${token}`}
                  onClick={() => updateProject(project => clearOverride(project, theme, token))}
                >
                  Reset
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
