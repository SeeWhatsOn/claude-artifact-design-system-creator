import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ThemeId } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";
import { cn } from "@/lib/utils";
import { PreviewSurface } from "./PreviewSurface";
import { PreviewThemeSwitch } from "./PreviewThemeSwitch";
import { TypeSpecimen } from "./TypeSpecimen";

// Controls and surfaces read the compiled shape variables, so corners, borders and shadows follow the project.
const CONTROL = "rounded-[var(--radius-control)]";
const SURFACE = "border-[length:var(--border-width)]";

/** Renders sample components with the compiled colours applied as CSS variables scoped to the preview. */
export function PreviewPane({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const [chosen, setChosen] = useState<ThemeId>("light");
  // Falls back to light when the project's dark theme is switched off.
  const theme = dark ? chosen : "light";
  const vars = theme === "dark" && dark ? dark : light;

  return (
    <section aria-label="Preview" className="space-y-3">
      <PreviewThemeSwitch value={theme} onChange={setChosen} darkAvailable={Boolean(dark)} />
      <PreviewSurface
        vars={vars}
        dark={theme === "dark"}
        className="flex flex-col gap-[var(--space-5)] p-[var(--space-5)]"
      >
        <div className="flex flex-wrap items-center gap-[var(--space-2)]">
          <Button className={CONTROL}>Save changes</Button>
          <Button variant="secondary" className={CONTROL}>
            Preview
          </Button>
          <Button variant="ghost" className={CONTROL}>
            Cancel
          </Button>
          <span className="rounded-[var(--radius-pill)] bg-secondary px-[var(--space-2)] py-0.5 text-xs text-secondary-foreground">
            Draft
          </span>
        </div>
        <Card className={cn("max-w-sm", SURFACE, "rounded-[var(--radius-card)] shadow-[var(--shadow-raised)]")}>
          <CardHeader>
            <CardTitle>Monthly report</CardTitle>
            <CardDescription>Sent to your team on the first of each month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="preview-email">Work email</Label>
            <Input id="preview-email" type="email" placeholder="name@company.com" className={CONTROL} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className={CONTROL}>
              Subscribe
            </Button>
          </CardFooter>
        </Card>
        <div
          role="presentation"
          className={cn(
            "max-w-xs space-y-[var(--space-3)] bg-card p-[var(--space-4)] text-card-foreground",
            SURFACE,
            "rounded-[var(--radius-dialog)] shadow-[var(--shadow-overlay)]",
          )}
        >
          <p className="font-medium">Delete this report?</p>
          <p className="text-sm text-muted-foreground">It will be removed for everyone on your team.</p>
          <div className="flex justify-end gap-[var(--space-2)]">
            <Button variant="ghost" size="sm" className={CONTROL}>
              Keep it
            </Button>
            <Button variant="destructive" size="sm" className={CONTROL}>
              Delete report
            </Button>
          </div>
        </div>
        <TypeSpecimen />
      </PreviewSurface>
    </section>
  );
}
