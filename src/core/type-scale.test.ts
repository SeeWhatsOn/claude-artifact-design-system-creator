import { test, expect, describe } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { applyPairing, currentPairingId, PAIRINGS } from "./font-pairings";
import { TEXT_ROLES, type Project } from "./project";
import { clearRoleOverride, setRatio, setRoleOverride, setTypeBase } from "./type-editing";
import { TYPE_RATIOS } from "./type/type-scale";

type TypeStyle = {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
  textTransform?: string;
  usage: string;
};
type TypeFamily = {
  fonts: unknown[];
  families: Record<string, string>;
  groups: { name: string; family: string; styles: TypeStyle[] }[];
};

function exportedType(project: Project): TypeFamily {
  const contents = compile(project).files["project/tokens.json"];
  if (typeof contents !== "string") throw new Error("tokens.json missing");
  return (JSON.parse(contents) as { type: TypeFamily }).type;
}

function styles(project: Project): Map<string, TypeStyle & { family: string }> {
  return new Map(
    exportedType(project).groups.flatMap(group =>
      group.styles.map(style => [style.name, { ...style, family: group.family }]),
    ),
  );
}

function px(value: string | undefined): number {
  return Number(value?.replace("px", ""));
}

describe.each(TYPE_RATIOS.map(({ name, ratio }) => [name, ratio]))("the %s ratio", (_name, ratio) => {
  const project = setRatio(createDefaultProject(), ratio);
  const exported = styles(project);

  test("sizes each role as base × ratio^step, in whole px", () => {
    expect(px(exported.get("body")?.fontSize)).toBe(16);
    expect(px(exported.get("h3")?.fontSize)).toBe(Math.round(16 * ratio));
    expect(px(exported.get("h2")?.fontSize)).toBe(Math.round(16 * ratio ** 2));
    expect(px(exported.get("h1")?.fontSize)).toBe(Math.round(16 * ratio ** 3));
    expect(px(exported.get("display")?.fontSize)).toBe(Math.round(16 * ratio ** 4));
    expect(px(exported.get("caption")?.fontSize)).toBe(Math.round(16 / ratio));
  });

  test("the hierarchy never inverts", () => {
    const order = ["display", "h1", "h2", "h3", "lead", "body", "caption"];
    const sizes = order.map(role => px(exported.get(role)?.fontSize));
    expect(sizes).toEqual(sizes.toSorted((a, b) => b - a));
  });

  test("the preview gets the same sizes", () => {
    const { light } = compile(project).preview;
    expect(light["--type-h1-size"]).toBe(exported.get("h1")?.fontSize);
  });
});

test("changing the base scales every role", () => {
  const exported = styles(setTypeBase(createDefaultProject(), 18));
  expect(exported.get("body")?.fontSize).toBe("18px");
  expect(px(exported.get("h1")?.fontSize)).toBe(Math.round(18 * 1.333 ** 3));
});

test("every role is exported with fixed px sizes and a usage note, grouped by family", () => {
  const type = exportedType(createDefaultProject());
  const names = type.groups.flatMap(group => group.styles.map(style => style.name));
  expect(names.toSorted()).toEqual([...TEXT_ROLES].toSorted());
  for (const group of type.groups) {
    expect(Object.keys(type.families)).toContain(group.family);
    for (const style of group.styles) {
      expect(style.fontSize).toMatch(/^\d+px$/);
      expect(style.lineHeight).toMatch(/^\d+px$/);
      expect(typeof style.fontWeight).toBe("number");
      expect(style.usage.length).toBeGreaterThan(0);
    }
  }
});

test("Google fonts are named in families with a fallback, and need no font file", () => {
  const type = exportedType(createDefaultProject());
  expect(type.families).toEqual({
    display: '"Brygada 1918", serif',
    body: '"Schibsted Grotesk", sans-serif',
    mono: '"Fragment Mono", monospace',
  });
  expect(type.fonts).toEqual([]);
  expect(Object.keys(compile(createDefaultProject()).files).some(path => path.includes("fonts/"))).toBe(false);
});

test("the preview loads each family once", () => {
  const swiss = applyPairing(createDefaultProject(), "swiss-variable");
  expect(compile(swiss).preview.fontsToLoad.map(font => font.family)).toEqual(["Archivo", "Source Code Pro"]);
});

describe("role overrides", () => {
  const project = setRoleOverride(createDefaultProject(), "h2", {
    size: 30,
    weight: 500,
    lineHeight: 1.4,
    letterSpacing: 0.01,
    case: "upper",
    family: "body",
  });

  test("replace the generated values", () => {
    const h2 = styles(project).get("h2");
    expect(h2).toMatchObject({
      fontSize: "30px",
      lineHeight: "42px",
      fontWeight: 500,
      letterSpacing: "0.01em",
      textTransform: "uppercase",
      family: "body",
    });
  });

  test("persist across ratio and base changes", () => {
    const changed = setTypeBase(setRatio(project, 1.5), 17);
    expect(changed.type.roleOverrides.h2?.size).toBe(30);
    expect(styles(changed).get("h2")?.fontSize).toBe("30px");
  });

  test("survive picking another pairing", () => {
    expect(styles(applyPairing(project, "terminal-chivo")).get("h2")?.fontSize).toBe("30px");
  });

  test("can be cleared", () => {
    const cleared = clearRoleOverride(project, "h2");
    expect(cleared.type.roleOverrides.h2).toBeUndefined();
    expect(styles(cleared).get("h2")?.fontSize).toBe(`${Math.round(16 * 1.333 ** 2)}px`);
  });
});

describe.each(PAIRINGS.map(pairing => [pairing.id]))("the %s pairing", pairingId => {
  const project = applyPairing(createDefaultProject(), pairingId);

  test("is recognised as the current pairing", () => {
    expect(currentPairingId(project)).toBe(pairingId);
  });

  test("emits only weights its fonts ship, even when an override asks for another", () => {
    const heavy = setRoleOverride(setRoleOverride(project, "display", { weight: 300 }), "body", { weight: 950 });
    for (const style of styles(heavy).values()) {
      const slot = style.family as "display" | "body" | "mono";
      expect(heavy.type.families[slot].weights).toContain(style.fontWeight);
    }
  });
});

test("a single-weight display font locks every heading to that weight", () => {
  // Libre Caslon Display ships only 400.
  const exported = styles(applyPairing(createDefaultProject(), "caslon-library"));
  expect(exported.get("display")?.fontWeight).toBe(400);
  expect(exported.get("h1")?.fontWeight).toBe(400);
});

test("hand-picked families that match no pairing have no pairing id", () => {
  const project = createDefaultProject();
  const custom = {
    ...project,
    type: {
      ...project.type,
      families: { ...project.type.families, body: { ...project.type.families.body, family: "Karla" } },
    },
  };
  expect(currentPairingId(custom)).toBeNull();
});
