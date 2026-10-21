import { beforeEach, expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PalettePicker } from "@/colour/PalettePicker";
import { createDefaultProject } from "@/core/default-project";
import { applyPalette, PALETTES } from "@/core/palettes";
import { projectStore } from "@/state/project-store";

const current = PALETTES[5]!;

beforeEach(() => {
  projectStore.setState({ project: applyPalette(createDefaultProject(), current.id) });
  projectStore.temporal.getState().clear();
});

function options() {
  return within(screen.getByRole("radiogroup", { name: "Palette" })).getAllByRole("radio");
}

test("the current choice is pinned first, with the rest in their usual order", () => {
  render(<PalettePicker />);
  const names = options().map(radio => radio.closest("label")?.textContent);
  expect(names[0]).toBe(current.name);
  expect(names.slice(1)).toEqual(PALETTES.filter(palette => palette !== current).map(palette => palette.name));
  expect(options()[0]).toBeChecked();
});

test("choosing another option doesn't reorder the strip, so arrow keys keep a steady order", async () => {
  render(<PalettePicker />);
  const before = options().map(radio => radio.getAttribute("value"));
  await userEvent.click(options()[2]!);
  expect(options().map(radio => radio.getAttribute("value"))).toEqual(before);
  expect(options()[2]).toBeChecked();
});
