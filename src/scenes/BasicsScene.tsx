import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypeSpecimen } from "@/preview/TypeSpecimen";
import { cn } from "@/lib/utils";
import { CONTROL, type SceneProps } from "./scene-styles";

const SURFACE = "border-[length:var(--border-width)]";

/** Sample components and a type specimen: the quickest read of colour, type and shape together. */
export function BasicsScene({ logo }: SceneProps) {
  const email = useId();
  return (
    <div data-edit="surface" className="flex flex-col gap-[var(--space-5)] p-[var(--space-5)]">
      {logo}
      <div className="flex flex-wrap items-center gap-[var(--space-2)]">
        <Button data-edit="button" className={CONTROL}>
          Save changes
        </Button>
        <Button data-edit="button" variant="secondary" className={CONTROL}>
          Preview
        </Button>
        <Button data-edit="button" variant="ghost" className={CONTROL}>
          Cancel
        </Button>
        <span className="rounded-[var(--radius-pill)] bg-secondary px-[var(--space-2)] py-0.5 text-xs text-secondary-foreground">
          Draft
        </span>
      </div>
      <Card
        data-edit="card"
        className={cn("max-w-sm", SURFACE, "rounded-[var(--radius-card)] shadow-[var(--shadow-raised)]")}
      >
        <CardHeader>
          <CardTitle>Monthly report</CardTitle>
          <CardDescription>Sent to your team on the first of each month.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor={email}>Work email</Label>
          <Input id={email} type="email" placeholder="name@company.com" className={CONTROL} />
        </CardContent>
        <CardFooter>
          <Button data-edit="button" variant="outline" className={CONTROL}>
            Subscribe
          </Button>
        </CardFooter>
      </Card>
      <div
        data-edit="dialog"
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
    </div>
  );
}
