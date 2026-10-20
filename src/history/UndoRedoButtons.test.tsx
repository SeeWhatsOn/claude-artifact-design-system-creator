import { test, expect, beforeEach } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultProject } from "@/core/default-project";
import { applyPalette } from "@/core/palettes";
import { projectStore } from "@/state/project-store";
import { UndoRedoButtons } from "./UndoRedoButtons";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
});

function choose(paletteId: string) {
  projectStore.getState().updateProject(project => applyPalette(project, paletteId));
}

const paletteId = () => projectStore.getState().project.palette.paletteId;

test("undo and redo are disabled with no history", () => {
  render(<UndoRedoButtons />);
  expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled();
});

test("the buttons step back and forward through changes", async () => {
  render(<UndoRedoButtons />);
  choose("ledger-ink");
  await userEvent.click(screen.getByRole("button", { name: "Undo" }));
  expect(paletteId()).toBe("civic-ledger");
  await userEvent.click(screen.getByRole("button", { name: "Redo" }));
  expect(paletteId()).toBe("ledger-ink");
});

test("Cmd/Ctrl+Z undoes and Shift+Cmd/Ctrl+Z redoes", async () => {
  render(<UndoRedoButtons />);
  choose("ledger-ink");
  await userEvent.keyboard("{Meta>}z{/Meta}");
  expect(paletteId()).toBe("civic-ledger");
  await userEvent.keyboard("{Control>}{Shift>}z{/Shift}{/Control}");
  expect(paletteId()).toBe("ledger-ink");
});

test("the shortcut leaves text fields to their own undo", async () => {
  render(
    <>
      <UndoRedoButtons />
      <input aria-label="Brand name" />
    </>,
  );
  choose("ledger-ink");
  await userEvent.click(screen.getByRole("textbox", { name: "Brand name" }));
  await userEvent.keyboard("{Meta>}z{/Meta}");
  expect(paletteId()).toBe("ledger-ink");
});
