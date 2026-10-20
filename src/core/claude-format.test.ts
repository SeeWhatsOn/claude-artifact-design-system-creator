import { test, expect, describe } from "bun:test";
import { z } from "zod";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { PALETTES, applyPalette } from "./palettes";

// The Claude Design System contract (type contract 0.2.47), encoded as tests: see docs/research/01.
const TOKEN_NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
// Hex or oklch() with plain numbers only: no named colours, var() or color-mix().
const COLOUR_VALUE = /^(#[0-9a-f]{6}|oklch\([0-9.]+%? [0-9.]+ [0-9.]+\))$/;

const tokenSchema = z.object({ name: z.string(), value: z.unknown(), usage: z.string().min(1) });
const tokensFileSchema = z.object({
  name: z.string().min(1),
  version: z.number(),
  color: z.object({
    themes: z.array(z.object({ id: z.string(), name: z.string() })).min(1),
    tokens: z.array(tokenSchema).min(1),
  }),
});
const indexSchema = z.object({
  v: z.literal(3),
  layout: z.literal("files"),
  createdOnFiles: z.object({ v: z.literal(1), at: z.iso.datetime() }),
  title: z.string().min(1),
  namespace: z.string().regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/),
  libraries: z.array(z.unknown()),
  sections: z.object({}).strict(),
  groups: z.array(z.string()),
  assetGroups: z.record(z.string(), z.unknown()),
  blobs: z.object({}).strict(),
  docs: z.object({ readme: z.literal("project/README.md"), sections: z.array(z.unknown()) }),
  lastChange: z.object({ by: z.string(), at: z.iso.datetime(), via: z.string(), note: z.string() }),
});

function readJson(files: Record<string, string | Uint8Array>, path: string): unknown {
  const contents = files[path];
  if (typeof contents !== "string") throw new Error(`${path} missing`);
  return JSON.parse(contents);
}

describe.each(PALETTES.map(palette => [palette.id]))("%s export", paletteId => {
  const { files } = compile(applyPalette(createDefaultProject(), paletteId));

  test("has the index, tokens and README under project/", () => {
    expect(Object.keys(files)).toEqual(
      expect.arrayContaining(["project/design-system.json", "project/tokens.json", "project/README.md"]),
    );
  });

  test("never writes the files the Design System page generates", () => {
    for (const path of Object.keys(files)) {
      expect(path.startsWith("project/")).toBe(true);
      expect(path).not.toMatch(/^project\/(api\/|tokens\.css$|manifest\.json$)/);
    }
  });

  test("the index has the files-layout shape with createdOnFiles", () => {
    expect(indexSchema.safeParse(readJson(files, "project/design-system.json")).error).toBeUndefined();
  });

  test("tokens.json uses the list shape, not DTCG", () => {
    expect(tokensFileSchema.safeParse(readJson(files, "project/tokens.json")).error).toBeUndefined();
  });

  test("token names are valid and unique, values are hex or oklch, and every token has a usage note", () => {
    const tokens = tokensFileSchema.parse(readJson(files, "project/tokens.json"));
    const names = tokens.color.tokens.map(token => token.name);
    for (const name of names) expect(name).toMatch(TOKEN_NAME);
    expect(new Set(names).size).toBe(names.length);
    for (const token of tokens.color.tokens) {
      expect(typeof token.value).toBe("object");
      for (const value of Object.values(token.value as object)) expect(value).toMatch(COLOUR_VALUE);
    }
  });

  test("the light theme comes first", () => {
    const tokens = tokensFileSchema.parse(readJson(files, "project/tokens.json"));
    expect(tokens.color.themes[0]).toEqual({ id: "light", name: "Light" });
  });
});

test("the index records when it was made and which contract it targets", () => {
  const at = new Date("2026-10-20T12:00:00.000Z");
  const index = indexSchema.parse(
    readJson(compile(createDefaultProject(), { now: at }).files, "project/design-system.json"),
  );
  expect(index.createdOnFiles.at).toBe("2026-10-20T12:00:00.000Z");
  expect(index.lastChange.note).toContain("0.2.47");
});

test("the title and README use the brand name", () => {
  const project = createDefaultProject();
  const { files } = compile({ ...project, meta: { name: "Acme Studio", namespace: "acme-studio" } });
  const index = indexSchema.parse(readJson(files, "project/design-system.json"));
  expect(index.title).toBe("Acme Studio");
  expect(index.namespace).toBe("AcmeStudio");
  expect(files["project/README.md"]).toStartWith("# Acme Studio");
});

test("the index is the last file, as the Design System type asks", () => {
  expect(Object.keys(compile(createDefaultProject()).files).at(-1)).toBe("project/design-system.json");
});

test("the README only promises 4.5:1 text when every pair reaches it", () => {
  const project = createDefaultProject();
  const readable = compile(project).files["project/README.md"];
  expect(readable).toContain("reads at 4.5:1 or better");

  // White on #3D8BD0 is about 3.6:1: allowed, but only with a warning.
  const lowContrast = {
    ...project,
    palette: { ...project.palette, seeds: { ...project.palette.seeds, brand: "#3D8BD0" } },
  };
  const readme = compile(lowContrast).files["project/README.md"];
  expect(readme).not.toContain("reads at 4.5:1 or better");
  expect(readme).toContain("below 4.5:1");
});
