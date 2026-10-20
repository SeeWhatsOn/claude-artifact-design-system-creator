import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CssVarMap } from "@/core/compile";

/** Renders sample components with the compiled colours applied as CSS variables scoped to the preview. */
export function PreviewPane({ vars }: { vars: CssVarMap }) {
  return (
    <section aria-label="Preview" className="rounded-lg border">
      {/* Scoped vars: the app's own chrome keeps its theme while the preview shows the user's. */}
      <div
        data-preview-theme
        style={vars as CSSProperties}
        className="space-y-4 rounded-lg bg-background p-6 text-foreground"
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
