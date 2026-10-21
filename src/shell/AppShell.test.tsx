import { test, expect, beforeEach } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { STEPS } from "@/core/steps";
import { projectStore } from "@/state/project-store";
import { resetShell } from "./shell-store";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
  resetShell();
});

function rail() {
  return screen.getByRole("navigation", { name: "Steps" });
}

function currentStepTitle() {
  return within(screen.getByRole("region", { name: "Step" })).getAllByRole("heading", { level: 2 })[0]?.textContent;
}

async function next() {
  await userEvent.click(screen.getByRole("button", { name: /^Next/ }));
}

test("the guided path starts at Start and Next walks through every step in order", async () => {
  render(<App />);
  const seen = [currentStepTitle()];
  for (let i = 1; i < STEPS.length; i++) {
    await next();
    seen.push(currentStepTitle());
  }
  expect(seen).toEqual([
    "Start",
    "Colour",
    "Type",
    "Shape and space",
    "Logos",
    "Components and rules",
    "Voice",
    "Bans review",
    "Export",
  ]);
  expect(screen.queryByRole("button", { name: /^Next/ })).not.toBeInTheDocument();
});

test("before the first pass only reached steps open from the rail; afterwards every step is a tab", async () => {
  render(<App />);
  expect(within(rail()).getByRole("button", { name: /^Start/ })).toHaveAttribute("aria-current", "step");
  expect(within(rail()).getByRole("button", { name: /^Type/ })).toBeDisabled();

  await next();
  await userEvent.click(within(rail()).getByRole("button", { name: /^Start/ }));
  expect(currentStepTitle()).toBe("Start");
  expect(within(rail()).getByRole("button", { name: /^Colour/ })).toBeEnabled();
  expect(within(rail()).getByRole("button", { name: /^Type/ })).toBeDisabled();

  for (let i = 1; i < STEPS.length; i++) await next();
  for (const button of within(rail()).getAllByRole("button")) expect(button).toBeEnabled();
  await userEvent.click(within(rail()).getByRole("button", { name: /^Type/ }));
  expect(currentStepTitle()).toBe("Type");
});

function withFaintButtonText() {
  const project = createDefaultProject();
  const seeds = { ...project.palette.seeds, brandForeground: "#5B8FC9" };
  projectStore.setState({ project: { ...project, palette: { ...project.palette, seeds } } });
}

async function finishFirstPass() {
  for (let i = 1; i < STEPS.length; i++) await next();
}

test("the rail marks steps that block export", () => {
  withFaintButtonText();
  render(<App />);
  expect(within(rail()).getByRole("button", { name: /^Colour/ })).toHaveAccessibleName("Colour 1 to fix");
  expect(within(rail()).getByRole("button", { name: /^Type/ })).not.toHaveTextContent("to fix");
});

test("the export checklist lists each problem and links to the step that fixes it", async () => {
  withFaintButtonText();
  render(<App />);
  await finishFirstPass();
  const checklist = screen.getByRole("region", { name: "Export checklist" });
  expect(checklist).toHaveTextContent("Text on the main button colour is too faint to read in the light theme");
  const [goToColour] = within(checklist).getAllByRole("button", { name: "Go to Colour" });
  if (!goToColour) throw new Error("no link to Colour");
  await userEvent.click(goToColour);
  expect(currentStepTitle()).toBe("Colour");
});

test("with nothing blocking, the export checklist says the kit is ready", async () => {
  render(<App />);
  await finishFirstPass();
  expect(screen.getByRole("region", { name: "Export checklist" })).toHaveTextContent("Ready to download");
});

test("the Advanced toggle reveals token names and raw values without changing the plain labels", async () => {
  render(<App />);
  await next();
  expect(screen.queryByText("#1d6fb5")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("checkbox", { name: "Advanced: show token names" }));
  expect(screen.getByText("#1d6fb5")).toBeInTheDocument();
  expect(screen.getByLabelText("Main colour")).toBeInTheDocument();

  await next();
  await next();
  expect(screen.getByText("--radius-card")).toBeInTheDocument();
  expect(screen.getByLabelText("Cards (px)")).toBeInTheDocument();
  expect(screen.getByText("--space-1")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("checkbox", { name: "Advanced: show token names" }));
  expect(screen.queryByText("--radius-card")).not.toBeInTheDocument();
});

test("on phones the preview opens and closes as a sheet", async () => {
  render(<App />);
  const toggle = screen.getByRole("button", { name: "Show preview" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(toggle);
  expect(screen.getByRole("button", { name: "Hide preview" })).toHaveAttribute("aria-expanded", "true");
  await userEvent.click(screen.getByRole("button", { name: "Hide preview" }));
  expect(screen.getByRole("button", { name: "Show preview" })).toBeInTheDocument();
});

test("edits survive moving between steps", async () => {
  render(<App />);
  await next();
  await userEvent.click(screen.getByRole("radio", { name: /Ledger Ink/ }));
  await next();
  await userEvent.click(screen.getByRole("button", { name: /^Back/ }));
  expect(screen.getByRole("radio", { name: /Ledger Ink/ })).toBeChecked();
});
