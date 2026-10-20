import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ThemeId } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";
import { cn } from "@/lib/utils";

/** Renders sample components with the compiled colours applied as CSS variables scoped to the preview. */
export function PreviewPane({ light, dark }: { light: CssVarMap; dark?: CssVarMap }) {
  const [chosen, setChosen] = useState<ThemeId>("light");
  // Falls back to light when the project's dark theme is switched off.
  const theme = dark ? chosen : "light";
  const vars = theme === "dark" && dark ? dark : light;

  return (
    <section aria-label="Preview" className="space-y-3">
      <div role="radiogroup" aria-label="Preview theme" className="inline-flex rounded-md border p-0.5 text-sm">
        {(["light", "dark"] as const).map(option => (
          <label
            key={option}
            className="cursor-pointer rounded px-3 py-1 has-checked:bg-secondary has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              name="preview-theme"
              value={option}
              checked={theme === option}
              disabled={option === "dark" && !dark}
              onChange={() => setChosen(option)}
              className="sr-only"
            />
            {option === "light" ? "Light" : "Dark"}
          </label>
        ))}
      </div>
      {/* Scoped vars: the app's own chrome keeps its theme while the preview shows the user's. */}
      <div
        data-preview-theme
        style={vars as CSSProperties}
        className={cn("space-y-4 rounded-lg border bg-background p-6 text-foreground", theme === "dark" && "dark")}
      >
        <div className="flex flex-wrap gap-2">
          <Button>Save changes</Button>
          <Button variant="secondary">Preview</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Monthly report</CardTitle>
            <CardDescription>Sent to your team on the first of each month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="preview-email">Work email</Label>
            <Input id="preview-email" type="email" placeholder="name@company.com" />
          </CardContent>
          <CardFooter>
            <Button variant="outline">Subscribe</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
