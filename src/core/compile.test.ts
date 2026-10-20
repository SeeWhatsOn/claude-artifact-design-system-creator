import { test, expect } from "bun:test";
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
