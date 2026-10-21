import { beforeEach, expect, test } from "bun:test";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { resetShell } from "@/shell/shell-store";
import { projectStore } from "@/state/project-store";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
  resetShell();
});

function preview() {
  return screen.getByRole("region", { name: "Preview" });
}

function previewVars() {
  return preview().querySelector("[data-preview-theme]");
}

async function startEditing() {
  await userEvent.click(within(preview()).getByRole("switch", { name: "Edit mode" }));
}

test("edit targets only appear in edit mode", async () => {
  render(<App />);
  expect(within(preview()).queryByRole("button", { name: "Edit card style" })).toBeNull();
  await startEditing();
  expect(within(preview()).getAllByRole("button", { name: "Edit card style" }).length).toBeGreaterThan(0);
});

test("clicking a card opens its inspector, says what else changes, and edits go live and undo", async () => {
  render(<App />);
  const before = previewVars()?.getAttribute("style");
  await startEditing();
  await userEvent.click(within(preview()).getAllByRole("button", { name: "Edit card style" })[0]!);

  const inspector = screen.getByRole("complementary", { name: "Card" });
  expect(within(inspector).getByText("Corner radius · changes all cards, alerts and panels")).toBeInTheDocument();
  fireEvent.change(within(inspector).getByLabelText("Cards (px)"), { target: { value: "20" } });
  expect(previewVars()).toHaveStyle({ "--radius-card": "20px" });

  await userEvent.click(screen.getByRole("button", { name: "Undo" }));
  expect(previewVars()?.getAttribute("style")).toBe(before ?? "");
});

test("Enter opens the inspector with focus inside; Escape closes it and returns focus to the target", async () => {
  render(<App />);
  await startEditing();
  const target = within(preview()).getAllByRole("button", { name: "Edit button style" })[0]!;
  target.focus();
  await userEvent.keyboard("{Enter}");

  const inspector = screen.getByRole("complementary", { name: "Button" });
  expect(inspector).toContainElement(document.activeElement as HTMLElement);
  expect(within(inspector).getByText("Corner radius · changes all buttons and inputs")).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("complementary", { name: "Button" })).toBeNull();
  expect(document.activeElement).toBe(target);
});

test("a heading opens the editor for its own text role", async () => {
  render(<App />);
  await startEditing();
  const headings = within(preview()).getAllByRole("button", { name: "Edit heading style" });
  await userEvent.click(headings[1]!);
  const inspector = screen.getByRole("complementary", { name: "Heading 1" });
  expect(within(inspector).getByText("Heading 1 text · changes every Heading 1")).toBeInTheDocument();
  expect(within(inspector).queryByLabelText("Text role")).toBeNull();
});

test("the page background inspector offers the palettes as a strip", async () => {
  render(<App />);
  await startEditing();
  await userEvent.click(within(preview()).getByRole("button", { name: "Edit page background" }));
  const inspector = screen.getByRole("complementary", { name: "Page" });
  await userEvent.click(within(inspector).getByRole("radio", { name: /Ledger Ink/ }));
  expect(projectStore.getState().project.palette.paletteId).toBe("ledger-ink");
});

test("in the comparison only my side can be edited", async () => {
  render(<App />);
  await userEvent.click(within(preview()).getByRole("switch", { name: "Compare with Claude default" }));
  await startEditing();
  const claude = within(preview()).getByRole("region", { name: "Claude default" });
  const mine = within(preview()).getByRole("region", { name: "Your brand" });
  expect(within(claude).queryByRole("button", { name: "Edit card style" })).toBeNull();
  expect(within(mine).getAllByRole("button", { name: "Edit card style" }).length).toBeGreaterThan(0);
});
