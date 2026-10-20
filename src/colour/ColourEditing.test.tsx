import { test, expect, beforeEach } from "bun:test";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { setSeed } from "@/core/palette-editing";
import { projectStore } from "@/state/project-store";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
});

function previewVars() {
  return screen.getByRole("region", { name: "Preview" }).querySelector("[data-preview-theme]");
}

test("seed pickers have plain-language labels and update the preview", () => {
  render(<App />);
  fireEvent.input(screen.getByLabelText("Main colour"), { target: { value: "#be1e2d" } });
  expect(previewVars()).toHaveStyle({ "--primary": "#be1e2d" });
  for (const label of [
    "Text on main colour",
    "Light page background",
    "Highlight colour",
    "Danger colour",
    "Grey tint",
  ]) {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  }
});

test("randomise keeps locked colours", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Lock main colour" }));
  await userEvent.click(screen.getByRole("button", { name: "Randomise unlocked colours" }));
  const { seeds } = projectStore.getState().project.palette;
  expect(seeds.brand).toBe("#1d6fb5");
  expect(seeds.accent).not.toBe("#ffdd00");
});

test("randomise explains when the locked colours can't pass", async () => {
  projectStore.setState({ project: setSeed(createDefaultProject(), "brandForeground", "#2a7cc4") });
  render(<App />);
  await userEvent.click(screen.getByRole("checkbox", { name: "Lock main colour" }));
  await userEvent.click(screen.getByRole("button", { name: "Randomise unlocked colours" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Text on the main button colour");
});

test("advanced mode pins and resets a single derived colour", async () => {
  render(<App />);
  const advanced = screen.getByRole("region", { name: "Advanced colours" });
  await userEvent.click(within(advanced).getByRole("checkbox", { name: "Show advanced colour controls" }));
  fireEvent.input(within(advanced).getByLabelText("card (light)"), { target: { value: "#abcdef" } });
  expect(previewVars()).toHaveStyle({ "--card": "#abcdef" });

  await userEvent.click(within(advanced).getByRole("button", { name: "Reset card" }));
  expect(projectStore.getState().project.palette.overrides.light).toEqual({});
});

test("a palette that resembles a generic look shows a warning", () => {
  projectStore.setState({ project: setSeed(createDefaultProject(), "brand", "#6366f1") });
  render(<App />);
  expect(screen.getByRole("region", { name: "Checks" })).toHaveTextContent("purple-indigo");
});
