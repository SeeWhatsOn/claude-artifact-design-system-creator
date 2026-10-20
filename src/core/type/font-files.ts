import type { FontRef } from "../project";

/** The font file formats the app accepts for upload. */
export type FontFormat = "woff2" | "woff" | "ttf" | "otf";

// Each format's first four bytes. Checked instead of trusting the file's name or type.
const SIGNATURES: [FontFormat, number[]][] = [
  ["woff2", [0x77, 0x4f, 0x46, 0x32]], // "wOF2"
  ["woff", [0x77, 0x4f, 0x46, 0x46]], // "wOFF"
  ["ttf", [0x00, 0x01, 0x00, 0x00]],
  ["ttf", [0x74, 0x72, 0x75, 0x65]], // "true", old Apple TrueType
  ["otf", [0x4f, 0x54, 0x54, 0x4f]], // "OTTO"
];

const WEIGHT_WORDS: Record<string, number> = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  book: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
};

/** Recognises a font file from its first bytes, or returns null for anything that isn't one. */
export function detectFontFormat(bytes: Uint8Array): FontFormat | null {
  const match = SIGNATURES.find(([, signature]) => signature.every((byte, index) => bytes[index] === byte));
  return match?.[0] ?? null;
}

/** Guesses a family name and weight from a file name like "AcmeSans-Bold.woff2". Unknown weights are 400. */
export function guessFontName(fileName: string): { family: string; weight: number } {
  const words = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean);
  let weight = 400;
  // "Semi Bold" arrives as two words after the camel-case split, so try the last two together first.
  for (const take of [2, 1]) {
    const tail = words.slice(-take).join("").toLowerCase();
    if (words.length > take && tail in WEIGHT_WORDS) {
      weight = WEIGHT_WORDS[tail] ?? 400;
      words.splice(-take);
      break;
    }
  }
  return { family: words.join(" "), weight };
}

/** A safe export file name: ASCII letters and digits from the family, then the weight and format. */
export function fontFileName(family: string, weight: number, format: FontFormat): string {
  const base = family.normalize("NFD").replace(/[^A-Za-z0-9]/g, "") || "Font";
  return `${base}-${weight}.${format}`;
}

/** The outcome of turning picked files into one uploaded font. */
export type FontUploadResult =
  | { ok: true; font: FontRef; assets: Record<string, Uint8Array> }
  | { ok: false; error: string };

/**
 * Turns the files a user picked (one family, any weights) into an uploaded font reference plus the
 * binaries to store. The family comes from the first file's name; each file's weight from its own.
 */
export function prepareFontUpload(
  files: readonly { name: string; bytes: Uint8Array }[],
  makeId: () => string,
): FontUploadResult {
  const [first] = files;
  if (!first) return { ok: false, error: "Pick at least one font file." };
  const family = guessFontName(first.name).family || "Uploaded font";
  const assets: Record<string, Uint8Array> = {};
  const fontFiles: NonNullable<FontRef["files"]> = [];
  for (const { name, bytes } of files) {
    const format = detectFontFormat(bytes);
    if (!format) return { ok: false, error: `${name} isn't a font file. Use woff2, woff, ttf or otf.` };
    const { weight } = guessFontName(name);
    const assetId = makeId();
    assets[assetId] = bytes;
    fontFiles.push({ assetId, file: fontFileName(family, weight, format), weight });
  }
  fontFiles.sort((a, b) => a.weight - b.weight);
  const weights = [...new Set(fontFiles.map(file => file.weight))];
  return { ok: true, font: { source: "upload", family, weights, variable: false, files: fontFiles }, assets };
}
