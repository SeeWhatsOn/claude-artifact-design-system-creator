import { expect, test } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { EDIT_TARGET_IDS, editTarget, sectionHeader } from "./edit-targets";

test("a card is edited by its corners, depth and spacing, and says what else changes", () => {
  const card = editTarget("card");
  expect(card?.actionLabel).toBe("Edit card style");
  expect(card?.sections.map(section => section.control)).toEqual(["radius-card", "depth", "spacing"]);
  expect(sectionHeader(card!.sections[0]!)).toBe("Corner radius · changes all cards, alerts and panels");
});

test("a button's corners are shared with inputs", () => {
  const button = editTarget("button");
  expect(button?.actionLabel).toBe("Edit button style");
  expect(sectionHeader(button!.sections[0]!)).toBe("Corner radius · changes all buttons and inputs");
});

test("a heading edits its own text role and names it", () => {
  const heading = editTarget("heading", "h2");
  expect(heading?.title).toBe("Heading 2");
  expect(heading?.role).toBe("h2");
  expect(sectionHeader(heading!.sections[0]!)).toBe("Heading 2 text · changes every Heading 2");
});

test("a heading with no role given falls back to Heading 1", () => {
  expect(editTarget("heading")?.role).toBe("h1");
});

test("unknown targets have no inspector", () => {
  expect(editTarget("sidebar")).toBeUndefined();
});

test("every token a section claims to change is one the compiler writes", () => {
  const { preview } = compile(createDefaultProject());
  for (const id of EDIT_TARGET_IDS) {
    for (const section of editTarget(id)!.sections) {
      for (const token of section.tokens) expect(preview.light, `${id} ${token}`).toHaveProperty(token);
    }
  }
});
