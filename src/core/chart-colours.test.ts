import { describe, expect, test } from "bun:test";
import { converter, wcagContrast } from "culori";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { setOverride } from "./palette-editing";
import { applyPalette, PALETTES } from "./palettes";

const toOklch = converter("oklch");
const CHARTS = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"];

function lightness(hex: string | undefined): number {
  const colour = toOklch(hex ?? "");
  if (!colour) throw new Error(`Not a colour: ${hex}`);
  return colour.l;
}

function hue(hex: string): number {
  return toOklch(hex)?.h ?? 0;
}

// Two hues are "the same" within a few degrees; gamut clamping nudges hue slightly.
function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

describe.each(PALETTES.map(palette => [palette.id]))("%s chart colours", paletteId => {
  const project = applyPalette(createDefaultProject(), paletteId);
  const { preview } = compile({ ...project, darkEnabled: true });

  for (const theme of ["light", "dark"] as const) {
    const vars = theme === "light" ? preview.light : preview.dark;

    test(`${theme}: every pair of series differs clearly in lightness`, () => {
      const ls = CHARTS.map(name => lightness(vars?.[name]));
      for (let i = 0; i < ls.length; i++) {
        for (let j = i + 1; j < ls.length; j++) {
          expect(Math.abs((ls[i] ?? 0) - (ls[j] ?? 0))).toBeGreaterThanOrEqual(0.08);
        }
      }
    });

    test(`${theme}: every series stands out from the page (3:1)`, () => {
      for (const name of CHARTS) {
        expect(wcagContrast(vars?.[name] ?? "", vars?.["--background"] ?? "")).toBeGreaterThanOrEqual(3);
      }
    });
  }

  test("series take their hues from the palette seeds", () => {
    const { brand, accent, success, warning, danger } = project.palette.seeds;
    const seeds = [brand, accent, success, warning, danger];
    CHARTS.forEach((name, index) => {
      const seed = seeds[index] ?? "";
      // Near-grey seeds have no meaningful hue to keep.
      if ((toOklch(seed)?.c ?? 0) < 0.03) return;
      expect(hueDistance(hue(preview.light[name] ?? ""), hue(seed))).toBeLessThan(8);
    });
  });
});

test("chart colours that are overridden too close in lightness get a warning", () => {
  const project = setOverride(
    setOverride(createDefaultProject(), "light", "chart-1", "#3366cc"),
    "light",
    "chart-2",
    "#3a6bd0",
  );
  const warning = compile(project).diagnostics.find(diagnostic => diagnostic.code === "chart-lightness");
  expect(warning).toMatchObject({ severity: "warn", step: "colour", path: "colours.light.chart-2" });
});

test("derived chart colours raise no lightness warning", () => {
  const codes = compile({ ...createDefaultProject(), darkEnabled: true }).diagnostics.map(d => d.code);
  expect(codes).not.toContain("chart-lightness");
});
