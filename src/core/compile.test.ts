import { test, expect } from "bun:test";
import { wcagContrast } from "culori";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import type { Project } from "./project";

const SHADCN_VARS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
];

function withOverride(project: Project, name: string, value: string): Project {
  return {
    ...project,
    palette: { ...project.palette, overrides: { ...project.palette.overrides, light: { [name]: value } } },
  };
}

test("the light preview sets every shadcn colour variable as a hex colour", () => {
  const { light } = compile(createDefaultProject()).preview;
  for (const name of SHADCN_VARS) expect(light[`--${name}`]).toMatch(/^#[0-9a-f]{6}$/);
});

test("the brand seed and its foreground become the primary colours", () => {
  const { light } = compile(createDefaultProject()).preview;
  expect(light["--primary"]).toBe("#1d6fb5");
  expect(light["--primary-foreground"]).toBe("#ffffff");
  expect(light["--background"]).toBe("#f3f2f1");
});

test("an override replaces a derived colour", () => {
  const project = withOverride(createDefaultProject(), "card", "#ABCDEF");
  expect(compile(project).preview.light["--card"]).toBe("#abcdef");
});

test("changing the brand seed changes the preview", () => {
  const project = createDefaultProject();
  const changed = {
    ...project,
    palette: { ...project.palette, seeds: { ...project.palette.seeds, brand: "#BE1E2D" } },
  };
  expect(compile(changed).preview.light["--primary"]).toBe("#be1e2d");
});

function tokensJson(project: Project) {
  const contents = compile(project).files["project/tokens.json"];
  if (typeof contents !== "string") throw new Error("tokens.json missing");
  return JSON.parse(contents) as {
    color: { themes: { id: string }[]; tokens: { name: string; value: Record<string, string> }[] };
  };
}

test("a dark-enabled project previews a dark theme built from the dark background seed", () => {
  const { dark } = compile(createDefaultProject()).preview;
  for (const name of SHADCN_VARS) expect(dark?.[`--${name}`]).toMatch(/^#[0-9a-f]{6}$/);
  expect(dark?.["--background"]).toBe("#1d1c1a");
});

test("the dark brand colour is lightened until it reads at 4.5:1 on the dark background", () => {
  // Civic Ledger's brand is only 3.24:1 on its dark background as given.
  const dark = compile(createDefaultProject()).preview.dark ?? {};
  expect(wcagContrast(dark["--primary"]!, dark["--background"]!)).toBeGreaterThanOrEqual(4.5);
  expect(wcagContrast(dark["--primary"]!, dark["--primary-foreground"]!)).toBeGreaterThanOrEqual(4.5);
  expect(dark["--primary"]).not.toBe("#1d6fb5");
});

test("a light-only project has no dark preview and exports one theme", () => {
  const project = { ...createDefaultProject(), darkEnabled: false };
  expect(compile(project).preview.dark).toBeUndefined();
  expect(tokensJson(project).color.themes.map(theme => theme.id)).toEqual(["light"]);
});

test("a dark-enabled project exports both themes, light first, with a value for each", () => {
  const tokens = tokensJson(createDefaultProject());
  expect(tokens.color.themes.map(theme => theme.id)).toEqual(["light", "dark"]);
  for (const token of tokens.color.tokens) expect(Object.keys(token.value)).toEqual(["light", "dark"]);
});

test("a dark override replaces the derived dark colour only", () => {
  const project = createDefaultProject();
  const overridden = {
    ...project,
    palette: { ...project.palette, overrides: { light: {}, dark: { card: "#123456" } } },
  };
  const { light, dark } = compile(overridden).preview;
  expect(dark?.["--card"]).toBe("#123456");
  expect(light["--card"]).not.toBe("#123456");
});
