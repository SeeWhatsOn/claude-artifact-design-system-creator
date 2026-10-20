import { z } from "zod";
import { migrate } from "./migrations";

/** The schemaVersion this build writes. Bump it and add a migration when the shape changes. */
export const CURRENT_SCHEMA_VERSION = 1;

const hexColour = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex colour like #1D6FB5");

/** The ten fixed text roles, from largest to smallest. */
export const TEXT_ROLES = ["display", "h1", "h2", "h3", "lead", "body", "small", "caption", "label", "code"] as const;

const fontRefSchema = z.object({
  source: z.enum(["google", "upload"]),
  family: z.string().min(1),
  weights: z.array(z.number().int().min(1).max(1000)).min(1),
  variable: z.boolean(),
  // Points at the binary in IndexedDB for uploaded fonts.
  assetId: z.string().optional(),
});

/** The few colours a user sets; the colour engine derives every interface colour from them. */
export const paletteSeedsSchema = z.object({
  brand: hexColour,
  brandForeground: hexColour,
  neutralLightBg: hexColour,
  neutralDarkBg: hexColour,
  neutralHue: z.object({ hue: z.number().min(0).max(360), chroma: z.number().min(0) }),
  accent: hexColour,
  success: hexColour,
  warning: hexColour,
  danger: hexColour,
});

const themeOverridesSchema = z.record(z.string(), hexColour);

const roleOverrideSchema = z
  .object({
    family: z.enum(["display", "body", "mono"]),
    size: z.number().positive(),
    weight: z.number().int().min(1).max(1000),
    lineHeight: z.number().positive(),
    letterSpacing: z.number(),
    case: z.enum(["none", "upper", "lower", "title"]),
  })
  .partial();

const variantSchema = z.object({
  enabled: z.boolean(),
  contexts: z.array(z.string()),
  limit: z.number().int().positive().optional(),
});

const projectSchema = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  meta: z.object({
    name: z.string().min(1, "Give your brand a name"),
    namespace: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  }),
  presetId: z.string().nullable(),
  palette: z.object({
    // Null until the user picks a curated palette, or when seeds don't match one (e.g. migrated custom colours).
    paletteId: z.string().nullable(),
    seeds: paletteSeedsSchema,
    overrides: z.object({ light: themeOverridesSchema, dark: themeOverridesSchema }),
  }),
  darkEnabled: z.boolean(),
  type: z.object({
    families: z.object({ display: fontRefSchema, body: fontRefSchema, mono: fontRefSchema }),
    base: z.number().positive(),
    ratio: z.number().gt(1),
    roleOverrides: z.partialRecord(z.enum(TEXT_ROLES), roleOverrideSchema),
  }),
  shape: z.object({
    spacingBase: z.union([z.literal(4), z.literal(8)]),
    density: z.enum(["compact", "comfortable", "airy"]),
    radii: z.object({
      control: z.number().min(0),
      card: z.number().min(0),
      dialog: z.number().min(0),
      pill: z.number().min(0),
    }),
    elevation: z.enum(["shadow", "flat"]),
    borders: z.enum(["none", "subtle", "strong"]),
  }),
  motion: z.object({
    // Null until chosen; a missing policy blocks export.
    policy: z.enum(["none", "subtle", "expressive"]).nullable(),
    bannedEffects: z.array(z.string()),
  }),
  icons: z.object({ stroke: z.number().positive(), size: z.number().positive() }),
  components: z.record(z.string(), z.object({ variants: z.record(z.string(), variantSchema), notes: z.string() })),
  voice: z.object({
    case: z.enum(["sentence", "title"]),
    buttonExamples: z.array(z.string()),
    bannedPhrases: z.array(z.string()),
    tone: z.object({ formality: z.number().min(0).max(1), warmth: z.number().min(0).max(1) }),
    emoji: z.enum(["never", "sparingly", "freely"]),
  }),
  bans: z.record(z.string(), z.boolean()),
  logos: z.array(
    z.object({ id: z.string(), name: z.string(), assetId: z.string(), theme: z.enum(["light", "dark", "any"]) }),
  ),
  snapshots: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.iso.datetime(),
      // A snapshot holds a whole earlier project; it is parsed with parseProject when restored.
      project: z.unknown(),
    }),
  ),
});

/** A user's whole design system: everything the app edits, saves and exports. */
export type Project = z.infer<typeof projectSchema>;

/** The seed colours of a palette. */
export type PaletteSeeds = z.infer<typeof paletteSeedsSchema>;

/** A typeface choice, either from Google Fonts or uploaded by the user. */
export type FontRef = z.infer<typeof fontRefSchema>;

/** The outcome of loading untrusted project data. */
export type ParseProjectResult = { ok: true; project: Project } | { ok: false; error: string };

/** Validates untrusted input (an imported file or stored state) and explains what is wrong in plain words. */
export function parseProject(input: unknown): ParseProjectResult {
  if (typeof input !== "object" || input === null || !("schemaVersion" in input)) {
    return { ok: false, error: "This file isn't a Brandkit project." };
  }
  const version = input.schemaVersion;
  if (typeof version === "number" && version > CURRENT_SCHEMA_VERSION) {
    return { ok: false, error: "This project was made with a newer version of Brandkit. Reload the app to update." };
  }
  const data = typeof version === "number" ? migrate({ ...input }, version, CURRENT_SCHEMA_VERSION) : input;
  const result = projectSchema.safeParse(data);
  if (!result.success) return { ok: false, error: z.prettifyError(result.error) };
  return { ok: true, project: result.data };
}
