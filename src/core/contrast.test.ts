import { test, expect, describe } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { PALETTES, applyPalette } from "./palettes";
import type { Project } from "./project";

function withSeeds(seeds: Partial<Project["palette"]["seeds"]>): Project {
  const project = createDefaultProject();
  return { ...project, palette: { ...project.palette, seeds: { ...project.palette.seeds, ...seeds } } };
}

function contrastDiagnostics(project: Project) {
  return compile(project).diagnostics.filter(diagnostic => diagnostic.code.startsWith("contrast"));
}

describe.each(PALETTES.map(palette => [palette.id]))("%s", paletteId => {
  test("passes the block gate in light and dark", () => {
    const project = { ...applyPalette(createDefaultProject(), paletteId), darkEnabled: true };
    expect(contrastDiagnostics(project).filter(diagnostic => diagnostic.severity === "block")).toEqual([]);
  });
});

test("text below 3:1 blocks export and points at the Colour step", () => {
  // Pale grey on the default blue brand is about 1.8:1.
  const [diagnostic, ...rest] = contrastDiagnostics(withSeeds({ brandForeground: "#5B8FC9" }));
  expect(rest).toEqual([]);
  expect(diagnostic).toMatchObject({ severity: "block", code: "contrast-too-low", step: "colour" });
  expect(diagnostic?.path).toBe("colours.light.primary-foreground");
  expect(diagnostic?.message).toContain("light theme");
  expect(diagnostic?.message).toContain("3:1");
});

test("body text between 3:1 and 4.5:1 is a warning, not a block", () => {
  // White on #3D8BD0 is about 3.5:1.
  const [diagnostic] = contrastDiagnostics(withSeeds({ brand: "#3D8BD0" }));
  expect(diagnostic).toMatchObject({ severity: "warn", code: "contrast-low", step: "colour" });
  expect(diagnostic?.message).toContain("4.5:1");
});

test("a dark override that makes text unreadable blocks in the dark theme only", () => {
  const project = createDefaultProject();
  const overridden = {
    ...project,
    palette: { ...project.palette, overrides: { light: {}, dark: { card: "#EEEEEE" } } },
  };
  const blocks = contrastDiagnostics(overridden).filter(diagnostic => diagnostic.severity === "block");
  expect(blocks.length).toBeGreaterThan(0);
  for (const block of blocks) {
    expect(block.path).toStartWith("colours.dark.");
    expect(block.message).toContain("dark theme");
  }
});

test("a light-only project isn't checked in dark", () => {
  const project = { ...createDefaultProject(), darkEnabled: false };
  const overridden = {
    ...project,
    palette: { ...project.palette, overrides: { light: {}, dark: { card: "#EEEEEE" } } },
  };
  expect(contrastDiagnostics(overridden)).toEqual([]);
});
