import { z } from "zod";
import data from "../data/flagged-fonts.json";
import type { Diagnostic } from "../compile";
import { FAMILY_SLOTS, type Project } from "../project";

const flagSchema = z.object({
  families: z.array(z.string()).min(1),
  // hard: Anthropic names it as a default or bans it. soft: a template or AI default. info: fine, but common.
  severity: z.enum(["hard", "soft", "info"]),
  reason: z.string(),
});

/** A font Claude overuses, with how strongly to warn about it (from docs/research/05). */
export type FontFlag = z.infer<typeof flagSchema>;

const FLAGS: readonly FontFlag[] = z.array(flagSchema).parse(data);

/** The flag for a family, matched ignoring case, or undefined when it isn't overused. */
export function findFontFlag(family: string): FontFlag | undefined {
  const wanted = family.trim().toLowerCase();
  return FLAGS.find(flag => flag.families.some(name => name.toLowerCase() === wanted));
}

const LEAD = {
  hard: "is one of Claude's own defaults, so it reads as generic.",
  soft: "is a stock template and AI default.",
  info: "is a good face, but it shows up a lot in Claude's output. Fine if you chose it on purpose.",
} as const;

/** Warns about overused fonts (hard and soft) and notes the info-level ones. Each family is reported once. */
export function checkFlaggedFonts(type: Project["type"]): Diagnostic[] {
  const seen = new Set<string>();
  const diagnostics: Diagnostic[] = [];
  for (const slot of FAMILY_SLOTS) {
    const { family } = type.families[slot];
    const flag = findFontFlag(family);
    if (!flag || seen.has(family.toLowerCase())) continue;
    seen.add(family.toLowerCase());
    diagnostics.push({
      severity: flag.severity === "info" ? "info" : "warn",
      code: `font-flagged-${flag.severity}`,
      message: `${family} ${LEAD[flag.severity]} ${flag.reason}`,
      step: "type",
      path: `type.families.${slot}`,
    });
  }
  return diagnostics;
}
