import { z } from "zod";
import { PAIRINGS, pairingFont } from "@/core/font-pairings";
import type { FontRef } from "@/core/project";
import { idbStorage, type ProjectStorage } from "@/state/project-store";

/** Every Google font, from the keyless, CORS-enabled Fontsource API. */
export const FONTSOURCE_URL = "https://api.fontsource.org/v1/fonts?type=google";

const CACHE_KEY = "brandkit-font-catalogue";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** The fonts the search can offer, and where they came from. "curated" means the API couldn't be reached. */
export type Catalogue = { fonts: FontRef[]; source: "fontsource" | "curated" };

// Only the fields the app uses. An unknown category is dropped rather than failing the whole entry.
const entrySchema = z.object({
  family: z.string().min(1),
  weights: z.array(z.number().int().min(1).max(1000)).min(1),
  variable: z.boolean(),
  category: z.enum(["serif", "sans-serif", "monospace", "display", "handwriting"]).optional().catch(undefined),
});

const cacheSchema = z.object({ savedAt: z.number(), fonts: z.array(entrySchema) });

type Fetcher = (url: string) => Promise<Response>;

/**
 * Loads the font list: a fresh cached copy, else the API (then cached), else a stale cached copy,
 * else the fonts from the curated pairings. Never throws, so search always has something to show.
 */
export async function loadCatalogue({
  fetcher = url => fetch(url),
  cache = idbStorage,
  now = Date.now(),
}: { fetcher?: Fetcher; cache?: ProjectStorage; now?: number } = {}): Promise<Catalogue> {
  const cached = cacheSchema.safeParse(await cache.getItem(CACHE_KEY));
  if (cached.success && now - cached.data.savedAt < MAX_AGE_MS) return fromEntries(cached.data.fonts);
  try {
    const response = await fetcher(FONTSOURCE_URL);
    if (!response.ok) throw new Error(`Fontsource answered ${response.status}`);
    const body: unknown = await response.json();
    const entries = Array.isArray(body) ? body.flatMap(item => parseEntry(item)) : [];
    if (entries.length === 0) throw new Error("Fontsource sent no fonts");
    await cache.setItem(CACHE_KEY, { savedAt: now, fonts: entries });
    return fromEntries(entries);
  } catch {
    if (cached.success) return fromEntries(cached.data.fonts);
    return { fonts: curatedFonts(), source: "curated" };
  }
}

/** Every family used by the curated pairings, each once. The offline fallback. */
export function curatedFonts(): FontRef[] {
  const byFamily = new Map<string, FontRef>();
  for (const pairing of PAIRINGS) {
    for (const face of [pairing.display, pairing.body, pairing.mono]) byFamily.set(face.family, pairingFont(face));
  }
  return [...byFamily.values()].toSorted((a, b) => a.family.localeCompare(b.family));
}

function parseEntry(item: unknown): z.infer<typeof entrySchema>[] {
  const result = entrySchema.safeParse(item);
  return result.success ? [result.data] : [];
}

function fromEntries(entries: z.infer<typeof entrySchema>[]): Catalogue {
  return { fonts: entries.map(entry => ({ source: "google", ...entry })), source: "fontsource" };
}
