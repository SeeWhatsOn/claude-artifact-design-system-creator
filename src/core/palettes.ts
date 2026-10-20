import { z } from "zod";
import data from "./data/palettes.json";
import { paletteSeedsSchema, type Project } from "./project";

const paletteSchema = z.object({
  id: z.string(),
  name: z.string(),
  mood: z.string(),
  inspiration: z.string(),
  seeds: paletteSeedsSchema,
  // Set when a palette knowingly resembles a generic Claude look; the app flags it.
  echoesTell: z.string().nullable(),
  note: z.string().optional(),
});

/** A curated starting palette (from docs/research/04). */
export type Palette = z.infer<typeof paletteSchema>;

/** The 20 curated palettes, parsed once so a bad edit to the data fails loudly at startup and in tests. */
export const PALETTES: readonly Palette[] = z.array(paletteSchema).parse(data);

/** Looks up a curated palette by id. */
export function findPalette(id: string): Palette | undefined {
  return PALETTES.find(palette => palette.id === id);
}

/** Swaps a curated palette's seeds into a project, keeping every other choice. Unknown ids leave it unchanged. */
export function applyPalette(project: Project, paletteId: string): Project {
  const palette = findPalette(paletteId);
  if (!palette) return project;
  return { ...project, palette: { ...project.palette, paletteId, seeds: palette.seeds } };
}
