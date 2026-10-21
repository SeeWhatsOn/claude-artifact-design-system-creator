import type { Project } from "../project";
import type { ComponentName } from "./component-catalogue";

/** The fixed places a component variant can be allowed in (SPEC story 44). */
export const PLACEMENT_CONTEXTS = [
  "page header",
  "toolbar",
  "form footer",
  "card",
  "table row",
  "hero",
  "nav",
  "dialog",
  "slide",
] as const;

/** One place a variant can appear, e.g. "toolbar". */
export type PlacementContext = (typeof PLACEMENT_CONTEXTS)[number];

/**
 * Whether the project's component rules let this variant appear in this context. With no rule the answer is yes,
 * so scenes look complete before any rules are set. An empty context list means "anywhere".
 * Limits (e.g. one primary per view) are left to the rules editor (#12) and aren't checked here.
 */
export function variantAllowed(
  components: Project["components"],
  component: ComponentName,
  variant: string,
  context: PlacementContext,
): boolean {
  const rule = components[component]?.variants[variant];
  if (!rule) return true;
  if (!rule.enabled) return false;
  return rule.contexts.length === 0 || rule.contexts.includes(context);
}

/** The first of the preferred variants the rules allow in this context, or undefined if none is allowed. */
export function pickVariant<Variant extends string>(
  components: Project["components"],
  component: ComponentName,
  context: PlacementContext,
  preferred: readonly Variant[],
): Variant | undefined {
  return preferred.find(variant => variantAllowed(components, component, variant, context));
}
