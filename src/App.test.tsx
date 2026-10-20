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

function setSeeds(seeds: Partial<ReturnType<typeof createDefaultProject>["palette"]["seeds"]>) {
  const project = createDefaultProject();
  projectStore.setState({
    project: { ...project, palette: { ...project.palette, seeds: { ...project.palette.seeds, ...seeds } } },
  });
}

test("the preview switches between light and dark", async () => {
  render(<App />);
  const preview = screen.getByRole("region", { name: "Preview" });
  const themed = preview.querySelector("[data-preview-theme]");
  expect(themed).toHaveStyle({ "--background": "#f3f2f1" });

  await userEvent.click(within(preview).getByRole("radio", { name: "Dark" }));
  expect(themed).toHaveStyle({ "--background": "#1d1c1a" });
  expect(themed).toHaveClass("dark");
});

test("turning the dark theme off removes the dark preview", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Include a dark theme" }));
  expect(screen.getByRole("radio", { name: "Dark" })).toBeDisabled();
  expect(projectStore.getState().project.darkEnabled).toBe(false);
});

test("with nothing to fix, the checklist says so", () => {
  render(<App />);
  expect(screen.getByRole("region", { name: "Checks" })).toHaveTextContent("Nothing to fix");
});

test("a blocking problem is listed in plain words and disables download", () => {
  setSeeds({ brandForeground: "#5B8FC9" });
  render(<App />);
  expect(screen.getByRole("region", { name: "Checks" })).toHaveTextContent(
    "Text on the main button colour is too faint to read in the light theme",
  );
  expect(screen.getByRole("button", { name: "Download Design System" })).toBeDisabled();
});

test("a warning is listed but download stays available", () => {
  setSeeds({ brand: "#3D8BD0" });
  render(<App />);
  expect(screen.getByRole("region", { name: "Checks" })).toHaveTextContent("hard to read");
  expect(screen.getByRole("button", { name: "Download Design System" })).toBeEnabled();
});
