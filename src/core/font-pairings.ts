import { z } from "zod";
import data from "./data/font-pairings.json";
import { FAMILY_SLOTS, type FontRef, type Project } from "./project";

const faceSchema = z.object({
  family: z.string(),
  category: z.enum(["serif", "sans-serif", "monospace", "display", "handwriting"]),
  weights: z.array(z.number().int()).min(1),
  variable: z.boolean(),
});

const pairingSchema = z.object({
  id: z.string(),
  name: z.string(),
  mood: z.string(),
  display: faceSchema,
  body: faceSchema,
  mono: faceSchema,
  suggestedRatio: z.number(),
  notes: z.string(),
});

/** A curated display + body + mono triad (from docs/research/05). */
export type Pairing = z.infer<typeof pairingSchema>;

/** The curated pairings, parsed once so a bad edit to the data fails loudly at startup and in tests. */
export const PAIRINGS: readonly Pairing[] = z.array(pairingSchema).parse(data);

/** Looks up a curated pairing by id. */
export function findPairing(id: string): Pairing | undefined {
  return PAIRINGS.find(pairing => pairing.id === id);
}

/** Turns one face of a pairing into the Google font reference a project stores. */
export function pairingFont(face: Pairing["display"]): FontRef {
  return { source: "google", ...face };
}

/** Swaps a pairing's three fonts into a project. The scale and role overrides stay. Unknown ids change nothing. */
export function applyPairing(project: Project, pairingId: string): Project {
  const pairing = findPairing(pairingId);
  if (!pairing) return project;
  const families = {
    display: pairingFont(pairing.display),
    body: pairingFont(pairing.body),
    mono: pairingFont(pairing.mono),
  };
  return { ...project, type: { ...project.type, families } };
}

/** The pairing whose three Google fonts the project uses, or null when any slot was picked by hand. */
export function currentPairingId(project: Project): string | null {
  const { families } = project.type;
  const match = PAIRINGS.find(pairing =>
    FAMILY_SLOTS.every(slot => families[slot].source === "google" && families[slot].family === pairing[slot].family),
  );
  return match?.id ?? null;
}
