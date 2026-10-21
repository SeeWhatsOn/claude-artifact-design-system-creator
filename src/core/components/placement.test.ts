import { expect, test } from "bun:test";
import type { Project } from "../project";
import { pickVariant } from "./placement";

const GHOST_IN_TOOLBARS_ONLY: Project["components"] = {
  Button: {
    notes: "",
    variants: {
      ghost: { enabled: true, contexts: ["toolbar"] },
      outline: { enabled: false, contexts: [] },
    },
  },
};

test("with no rules, the first preferred variant is used", () => {
  expect(pickVariant({}, "Button", "hero", ["ghost", "outline"])).toBe("ghost");
});

test("a variant limited to other contexts is skipped", () => {
  expect(pickVariant(GHOST_IN_TOOLBARS_ONLY, "Button", "hero", ["ghost", "secondary"])).toBe("secondary");
});

test("a variant is used in a context its rule allows", () => {
  expect(pickVariant(GHOST_IN_TOOLBARS_ONLY, "Button", "toolbar", ["ghost", "secondary"])).toBe("ghost");
});

test("a switched-off variant is never used", () => {
  expect(pickVariant(GHOST_IN_TOOLBARS_ONLY, "Button", "toolbar", ["outline", "secondary"])).toBe("secondary");
});

test("nothing is picked when every preferred variant is ruled out", () => {
  expect(pickVariant(GHOST_IN_TOOLBARS_ONLY, "Button", "hero", ["ghost", "outline"])).toBeUndefined();
});
