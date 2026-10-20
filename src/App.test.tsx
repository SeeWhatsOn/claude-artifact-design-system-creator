import { test, expect, beforeEach } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultProject } from "@/core/default-project";
import { projectStore } from "@/state/project-store";
import { App } from "./App";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
});

test("app shell shows the product title", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: "Brandkit for Claude" })).toBeInTheDocument();
});

test("the palette picker lists all 20 palettes, with the current one selected", () => {
  render(<App />);
  const picker = screen.getByRole("radiogroup", { name: "Palette" });
  expect(within(picker).getAllByRole("radio")).toHaveLength(20);
  expect(within(picker).getByRole("radio", { name: /Civic Ledger/ })).toBeChecked();
});

test("choosing a palette updates the live preview", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("radio", { name: /Ledger Ink/ }));
  const preview = screen.getByRole("region", { name: "Preview" });
  expect(preview.querySelector("[data-preview-theme]")).toHaveStyle({ "--primary": "#0e4d64" });
  expect(within(preview).getByRole("button", { name: "Save changes" })).toBeInTheDocument();
});

test("the download button is available once a palette is chosen", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: "Download Design System" })).toBeEnabled();
});
