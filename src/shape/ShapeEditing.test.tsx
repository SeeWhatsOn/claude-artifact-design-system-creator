import { test, expect, beforeEach } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { resetShell } from "@/shell/shell-store";
import { projectStore } from "@/state/project-store";
import { openStep } from "../../test/open-step";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
  resetShell();
});

function previewVars() {
  return screen.getByRole("region", { name: "Preview" }).querySelector("[data-preview-theme]");
}

test("spacing grid and density update the preview", async () => {
  render(<App />);
  await openStep("Shape and space");
  await userEvent.click(screen.getByRole("radio", { name: "8px grid" }));
  await userEvent.click(screen.getByRole("radio", { name: "Airy" }));
  expect(previewVars()).toHaveStyle({ "--space-1": "16px", "--space-6": "128px" });
});

test("each corner radius updates the preview", async () => {
  render(<App />);
  await openStep("Shape and space");
  fireEvent.change(screen.getByLabelText("Cards (px)"), { target: { value: "20" } });
  fireEvent.change(screen.getByLabelText("Buttons and inputs (px)"), { target: { value: "2" } });
  expect(previewVars()).toHaveStyle({ "--radius-card": "20px", "--radius-control": "2px" });
});

test("missing radii are flagged and block download until a corner is set", async () => {
  const project = createDefaultProject();
  projectStore.setState({ project: { ...project, shape: { ...project.shape, radii: null } } });
  render(<App />);
  await openStep("Shape and space");
  expect(screen.getByRole("region", { name: "Checks" })).toHaveTextContent("Choose corner radii");
  expect(screen.getByRole("button", { name: "Download Design System" })).toBeDisabled();

  fireEvent.change(screen.getByLabelText("Cards (px)"), { target: { value: "8" } });
  expect(screen.getByRole("button", { name: "Download Design System" })).toBeEnabled();
});

test("the shadow builder previews a shadow, and flat removes it", async () => {
  render(<App />);
  await openStep("Shape and space");
  expect(previewVars()).toHaveStyle({ "--shadow-raised": "none" });
  await userEvent.click(screen.getByRole("radio", { name: "Shadows" }));
  fireEvent.change(screen.getByLabelText("Blur (px)"), { target: { value: "8" } });
  expect(previewVars()).toHaveStyle({ "--shadow-raised": "0px 1px 8px 0px rgba(29, 28, 26, 0.14)" });
  await userEvent.click(screen.getByRole("radio", { name: "Flat, no shadows" }));
  expect(previewVars()).toHaveStyle({ "--shadow-raised": "none" });
});

test("borders can be switched off", async () => {
  render(<App />);
  await openStep("Shape and space");
  await userEvent.click(screen.getByRole("radio", { name: "No borders" }));
  expect(previewVars()).toHaveStyle({ "--border-width": "0px" });
});
