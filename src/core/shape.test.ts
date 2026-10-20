import { test, expect, describe } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import v1Fixture from "./fixtures/project-v1.json";
import { parseProject, type Project } from "./project";
import { setBorders, setDensity, setRadius, setShadow, setSpacingBase } from "./shape-editing";

type TokenList = { tokens: { name: string; value: string; usage: string }[] };

function tokensJson(project: Project): { spacing: TokenList; radius?: TokenList; shadow: TokenList } {
  const contents = compile(project).files["project/tokens.json"];
  if (typeof contents !== "string") throw new Error("tokens.json missing");
  return JSON.parse(contents);
}

function values(family: TokenList | undefined): Record<string, string> {
  return Object.fromEntries((family?.tokens ?? []).map(token => [token.name, token.value]));
}

describe("spacing", () => {
  const cases = [
    [4, "compact", [4, 8, 12, 16, 24, 32]],
    [4, "comfortable", [4, 8, 16, 24, 32, 48]],
    [4, "airy", [8, 16, 24, 32, 48, 64]],
    [8, "compact", [8, 16, 24, 32, 48, 64]],
    [8, "comfortable", [8, 16, 32, 48, 64, 96]],
    [8, "airy", [16, 32, 48, 64, 96, 128]],
  ] as const;

  test.each(cases)("a %ipx base at %s density gives six steps on the grid", (base, density, expected) => {
    const project = setDensity(setSpacingBase(createDefaultProject(), base), density);
    const spacing = tokensJson(project).spacing;
    expect(spacing.tokens.map(token => token.value)).toEqual(expected.map(px => `${px}px`));
    for (const px of expected) expect(px % base).toBe(0);
  });

  test("each step has a name, a usage note and a preview variable", () => {
    const project = createDefaultProject();
    const { spacing } = tokensJson(project);
    expect(spacing.tokens.map(token => token.name)).toEqual([
      "space-1",
      "space-2",
      "space-3",
      "space-4",
      "space-5",
      "space-6",
    ]);
    for (const token of spacing.tokens) expect(token.usage.length).toBeGreaterThan(0);
    expect(compile(project).preview.light["--space-4"]).toBe("24px");
  });
});

describe("radius", () => {
  test("four radii by hierarchy are exported and previewed", () => {
    const project = setRadius(createDefaultProject(), "card", 12);
    expect(values(tokensJson(project).radius)).toEqual({
      "radius-control": "6px",
      "radius-card": "12px",
      "radius-dialog": "14px",
      "radius-pill": "999px",
    });
    expect(compile(project).preview.light["--radius-card"]).toBe("12px");
  });

  test("missing radii block export, pointing at the shape step", () => {
    const project = createDefaultProject();
    const missing = { ...project, shape: { ...project.shape, radii: null } };
    const block = compile(missing).diagnostics.find(diagnostic => diagnostic.code === "radius-missing");
    expect(block).toMatchObject({ severity: "block", step: "shape", path: "shape.radii" });
    expect(tokensJson(missing).radius).toBeUndefined();
  });

  test("setting one radius on a project without radii starts from sensible corners", () => {
    const project = createDefaultProject();
    const set = setRadius({ ...project, shape: { ...project.shape, radii: null } }, "pill", 20);
    expect(set.shape.radii).toEqual({ control: 6, card: 10, dialog: 14, pill: 20 });
  });
});

describe("shadow", () => {
  test("the builder's shadow is exported for raised surfaces, with a stronger one for overlays", () => {
    const project = setShadow(createDefaultProject(), {
      enabled: true,
      colour: "#102030",
      opacity: 0.2,
      x: 0,
      y: 2,
      blur: 6,
      spread: -1,
    });
    expect(values(tokensJson(project).shadow)).toEqual({
      "shadow-raised": "0px 2px 6px -1px rgba(16, 32, 48, 0.2)",
      "shadow-overlay": "0px 4px 12px -1px rgba(16, 32, 48, 0.2)",
    });
    expect(compile(project).preview.light["--shadow-raised"]).toBe("0px 2px 6px -1px rgba(16, 32, 48, 0.2)");
  });

  test("flat exports a single no-shadow token and previews no shadow", () => {
    const project = setShadow(createDefaultProject(), { enabled: false });
    expect(tokensJson(project).shadow.tokens).toEqual([
      { name: "shadow-none", value: "none", usage: expect.stringContaining("never") },
    ]);
    expect(compile(project).preview.light["--shadow-raised"]).toBe("none");
  });

  test("turning shadows off and on again keeps the builder's settings", () => {
    const built = setShadow(createDefaultProject(), { enabled: true, blur: 9 });
    expect(setShadow(setShadow(built, { enabled: false }), { enabled: true }).shape.shadow.blur).toBe(9);
  });
});

describe("borders", () => {
  test("hairlines are 1px and no borders are 0px in the preview", () => {
    expect(compile(createDefaultProject()).preview.light["--border-width"]).toBe("1px");
    expect(compile(setBorders(createDefaultProject(), "none")).preview.light["--border-width"]).toBe("0px");
  });

  test("the README tells Claude how surfaces are separated", () => {
    const readme = compile(setBorders(createDefaultProject(), "none")).files["project/README.md"];
    expect(readme).toContain("No borders");
  });
});

test("a schemaVersion 1 project migrates its elevation and border choices", () => {
  const result = parseProject(v1Fixture);
  if (!result.ok) throw new Error(result.error);
  expect(result.project.shape.shadow.enabled).toBe(true);
  expect(result.project.shape.borders).toBe("hairline");
  expect(result.project.shape.radii).toEqual({ control: 4, card: 8, dialog: 12, pill: 999 });
  expect(result.project.meta.name).toBe("Version one");
});
