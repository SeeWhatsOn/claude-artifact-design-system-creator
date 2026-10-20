import { test, expect, describe } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { applyPairing, PAIRINGS } from "./font-pairings";
import type { FamilySlot, FontRef, Project } from "./project";
import { usedAssets } from "./project-file";
import { setFamily } from "./type-editing";
import { detectFontFormat, fontFileName, guessFontName, prepareFontUpload } from "./type/font-files";

function withFont(project: Project, slot: FamilySlot, font: FontRef): Project {
  return { ...project, type: { ...project.type, families: { ...project.type.families, [slot]: font } } };
}

function google(family: string): FontRef {
  return { source: "google", family, weights: [400, 700], variable: false, category: "sans-serif" };
}

function fontDiagnostics(project: Project) {
  return compile(project).diagnostics.filter(diagnostic => diagnostic.code.startsWith("font-"));
}

describe("flagged fonts", () => {
  test("a hard-flagged font warns, naming the font and the slot it's in", () => {
    const [warning] = fontDiagnostics(withFont(createDefaultProject(), "body", google("Inter")));
    expect(warning).toMatchObject({
      severity: "warn",
      code: "font-flagged-hard",
      step: "type",
      path: "type.families.body",
    });
    expect(warning?.message).toContain("Inter");
  });

  test("a soft-flagged font warns too", () => {
    expect(fontDiagnostics(withFont(createDefaultProject(), "display", google("Poppins")))).toEqual([
      expect.objectContaining({ severity: "warn", code: "font-flagged-soft" }),
    ]);
  });

  test("an info-flagged font is only a note", () => {
    expect(fontDiagnostics(withFont(createDefaultProject(), "mono", google("IBM Plex Mono")))).toEqual([
      expect.objectContaining({ severity: "info", code: "font-flagged-info" }),
    ]);
  });

  test("matching ignores case, and a font used in two slots is reported once", () => {
    const project = withFont(
      withFont(createDefaultProject(), "display", google("space grotesk")),
      "body",
      google("Space Grotesk"),
    );
    expect(fontDiagnostics(project)).toHaveLength(1);
  });

  test("none of the curated pairings is flagged", () => {
    for (const pairing of PAIRINGS)
      expect(fontDiagnostics(applyPairing(createDefaultProject(), pairing.id))).toEqual([]);
  });
});

describe("uploaded fonts", () => {
  const bytes = new Uint8Array([0x77, 0x4f, 0x46, 0x32, 1, 2, 3]);
  const bold = new Uint8Array([0x77, 0x4f, 0x46, 0x32, 9, 9]);
  const upload: FontRef = {
    source: "upload",
    family: "Acme Sans",
    weights: [400, 700],
    variable: false,
    category: "sans-serif",
    files: [
      { assetId: "font-a", file: "AcmeSans-400.woff2", weight: 400 },
      { assetId: "font-b", file: "AcmeSans-700.woff2", weight: 700 },
    ],
  };
  const project = withFont(createDefaultProject(), "body", upload);
  const assets = { "font-a": bytes, "font-b": bold };

  test("are bundled into project/fonts/ and listed in type.fonts", () => {
    const { files } = compile(project, { assets });
    expect(files["project/fonts/AcmeSans-400.woff2"]).toEqual(bytes);
    expect(files["project/fonts/AcmeSans-700.woff2"]).toEqual(bold);
    const tokens = JSON.parse(String(files["project/tokens.json"]));
    expect(tokens.type.fonts).toEqual([
      { family: "Acme Sans", file: "fonts/AcmeSans-400.woff2", weight: "400" },
      { family: "Acme Sans", file: "fonts/AcmeSans-700.woff2", weight: "700" },
    ]);
    expect(tokens.type.families.body).toBe('"Acme Sans", sans-serif');
  });

  test("keep the index as the last file", () => {
    expect(Object.keys(compile(project, { assets }).files).at(-1)).toBe("project/design-system.json");
  });

  test("are loaded by the preview", () => {
    expect(compile(project, { assets }).preview.fontsToLoad).toContainEqual(upload);
  });

  test("block export when a file is missing", () => {
    const [missing] = compile(project, { assets: { "font-a": bytes } }).diagnostics.filter(
      diagnostic => diagnostic.code === "font-file-missing",
    );
    expect(missing).toMatchObject({ severity: "block", step: "type", path: "type.families.body" });
    expect(missing?.message).toContain("Acme Sans");
  });
});

describe("font files", () => {
  test.each([
    ["woff2", [0x77, 0x4f, 0x46, 0x32]],
    ["woff", [0x77, 0x4f, 0x46, 0x46]],
    ["ttf", [0x00, 0x01, 0x00, 0x00]],
    ["otf", [0x4f, 0x54, 0x54, 0x4f]],
  ] as const)("recognises %s from its first bytes", (format, magic) => {
    expect(detectFontFormat(new Uint8Array([...magic, 0, 0]))).toBe(format);
  });

  test("rejects anything else, whatever it is called", () => {
    expect(detectFontFormat(new TextEncoder().encode("<svg></svg>"))).toBeNull();
  });

  test("guesses the family and weight from a file name", () => {
    expect(guessFontName("AcmeSans-Bold.woff2")).toEqual({ family: "Acme Sans", weight: 700 });
    expect(guessFontName("acme_grotesk_semibold.ttf")).toEqual({ family: "acme grotesk", weight: 600 });
    expect(guessFontName("Brand Display.otf")).toEqual({ family: "Brand Display", weight: 400 });
  });

  test("names exported files safely", () => {
    expect(fontFileName("Acme Sans", 700, "woff2")).toBe("AcmeSans-700.woff2");
    expect(fontFileName("../Ünïcode Font!", 400, "ttf")).toBe("UnicodeFont-400.ttf");
  });
});

describe("preparing an upload", () => {
  const woff2 = (extra: number) => new Uint8Array([0x77, 0x4f, 0x46, 0x32, extra]);
  let next = 0;
  const makeId = () => `asset-${++next}`;

  test("turns files of one family into a font with a file per weight", () => {
    const result = prepareFontUpload(
      [
        { name: "AcmeSans-Bold.woff2", bytes: woff2(2) },
        { name: "AcmeSans-Regular.woff2", bytes: woff2(1) },
      ],
      makeId,
    );
    if (!result.ok) throw new Error(result.error);
    expect(result.font).toEqual({
      source: "upload",
      family: "Acme Sans",
      weights: [400, 700],
      variable: false,
      files: [
        { assetId: "asset-2", file: "AcmeSans-400.woff2", weight: 400 },
        { assetId: "asset-1", file: "AcmeSans-700.woff2", weight: 700 },
      ],
    });
    expect(result.assets).toEqual({ "asset-1": woff2(2), "asset-2": woff2(1) });
  });

  test("refuses a file that isn't a font, naming it", () => {
    const result = prepareFontUpload([{ name: "logo.woff2", bytes: new TextEncoder().encode("<svg/>") }], makeId);
    expect(result).toEqual({ ok: false, error: "logo.woff2 isn't a font file. Use woff2, woff, ttf or otf." });
  });

  test("needs at least one file", () => {
    expect(prepareFontUpload([], makeId).ok).toBe(false);
  });
});

test("choosing a font for a slot replaces just that slot", () => {
  const project = setFamily(createDefaultProject(), "mono", google("Martian Mono"));
  expect(project.type.families.mono.family).toBe("Martian Mono");
  expect(project.type.families.body.family).toBe("Schibsted Grotesk");
});

test("a saved project file carries only the uploads the project uses", () => {
  const font: FontRef = {
    source: "upload",
    family: "Acme",
    weights: [400],
    variable: false,
    files: [{ assetId: "used", file: "Acme-400.woff2", weight: 400 }],
  };
  const project = withFont(createDefaultProject(), "body", font);
  const assets = { used: new Uint8Array([1]), stale: new Uint8Array([2]) };
  expect(Object.keys(usedAssets(project, assets))).toEqual(["used"]);
});
