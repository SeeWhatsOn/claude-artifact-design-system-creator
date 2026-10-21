import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pickVariant } from "@/core/components/placement";
import { roleStyle } from "@/preview/role-style";
import { cn } from "@/lib/utils";
import { CARD, CONTROL } from "@/preview/brand-classes";
import type { SceneProps } from "./scene-props";

const FEATURES = [
  { title: "Shared plans", body: "Everyone sees the same week, so nobody books over a deadline." },
  { title: "Gentle reminders", body: "One summary each morning instead of a stream of alerts." },
];

// No landmarks (nav, named form): the scene appears twice when compared, and landmarks must be unique.
/** A marketing page: nav, hero with two calls to action, two feature cards and a sign-up form. */
export function LandingScene({ components, logo }: SceneProps) {
  const email = useId();
  const nav = pickVariant(components, "Button", "nav", ["ghost", "outline", "secondary"]);
  const heroSecondary = pickVariant(components, "Button", "hero", ["outline", "secondary"]);

  return (
    <div data-edit="surface" className="@container flex flex-col gap-[var(--space-6)] p-[var(--space-4)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        {logo}
        {nav && (
          <Button data-edit="button" variant={nav} size="sm" className={CONTROL}>
            Sign in
          </Button>
        )}
      </div>
      <section className="max-w-xl flex flex-col gap-[var(--space-4)]">
        <h2 data-edit="heading" data-edit-role="display" style={roleStyle("display")} className="m-0">
          Plan your week in one place
        </h2>
        <p style={roleStyle("lead")} className="m-0 text-muted-foreground">
          See what your team is working on, move things around, and stop chasing updates.
        </p>
        <div className="flex flex-wrap gap-[var(--space-2)]">
          <Button data-edit="button" className={CONTROL}>
            Start a free trial
          </Button>
          {heroSecondary && (
            <Button data-edit="button" variant={heroSecondary} className={CONTROL}>
              See how it works
            </Button>
          )}
        </div>
      </section>
      <div className="grid gap-[var(--space-4)] @md:grid-cols-2">
        {FEATURES.map(feature => (
          <article
            key={feature.title}
            data-edit="card"
            className={cn(CARD, "flex flex-col gap-[var(--space-2)] bg-card p-[var(--space-4)] text-card-foreground")}
          >
            <h3 data-edit="heading" data-edit-role="h3" style={roleStyle("h3")} className="m-0">
              {feature.title}
            </h3>
            <p style={roleStyle("body")} className="m-0">
              {feature.body}
            </p>
          </article>
        ))}
      </div>
      <form
        data-edit="card"
        onSubmit={event => event.preventDefault()}
        className={cn(
          CARD,
          "max-w-md flex flex-col gap-[var(--space-3)] bg-card p-[var(--space-4)] text-card-foreground",
        )}
      >
        <h3 data-edit="heading" data-edit-role="h3" style={roleStyle("h3")} className="m-0">
          Get the monthly letter
        </h3>
        <div className="flex flex-col gap-[var(--space-1)]">
          <Label htmlFor={email}>Work email</Label>
          <Input id={email} type="email" placeholder="name@company.com" className={CONTROL} />
        </div>
        <Button data-edit="button" type="submit" className={cn(CONTROL, "self-start")}>
          Subscribe
        </Button>
      </form>
    </div>
  );
}
