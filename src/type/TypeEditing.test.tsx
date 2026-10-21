import { test, expect, beforeEach } from "bun:test";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { applyPairing } from "@/core/font-pairings";
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

test("the pairing picker lists all 20 pairings, each named in its own display face", async () => {
  render(<App />);
  await openStep("Type");
  const picker = screen.getByRole("radiogroup", { name: "Font pairing" });
  expect(within(picker).getAllByRole("radio")).toHaveLength(20);
  expect(within(picker).getByRole("radio", { name: /Modern Broadsheet/ })).toBeChecked();
  expect(within(picker).getByText("Caslon Library")).toHaveStyle({ fontFamily: '"Libre Caslon Display", serif' });
});

test("picking a pairing changes the preview fonts and loads them from Google Fonts", async () => {
  render(<App />);
  await openStep("Type");
  await userEvent.click(screen.getByRole("radio", { name: /Swiss Variable/ }));
  expect(previewVars()).toHaveStyle({ "--font-display": '"Archivo", sans-serif' });
  const hrefs = [...document.head.querySelectorAll("link")].map(link => link.getAttribute("href"));
  expect(hrefs).toContain("https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&display=swap");
});

test("changing the ratio and base updates preview sizes live", async () => {
  render(<App />);
  await openStep("Type");
  await userEvent.click(screen.getByRole("radio", { name: "Dramatic 1.5" }));
  expect(previewVars()).toHaveStyle({ "--type-h1-size": "54px" });
  fireEvent.change(screen.getByLabelText("Body text size (px)"), { target: { value: "18" } });
  expect(previewVars()).toHaveStyle({ "--type-body-size": "18px" });
});

test("a role override shows in the preview and survives a ratio change", async () => {
  render(<App />);
  await openStep("Type");
  const editor = screen.getByRole("group", { name: "Adjust a text role" });
  fireEvent.change(within(editor).getByLabelText("Size (px)"), { target: { value: "44" } });
  expect(previewVars()).toHaveStyle({ "--type-h1-size": "44px" });
  await userEvent.click(screen.getByRole("radio", { name: "Calm 1.2" }));
  expect(previewVars()).toHaveStyle({ "--type-h1-size": "44px" });
  await userEvent.click(within(editor).getByRole("button", { name: "Reset Heading 1" }));
  expect(previewVars()).toHaveStyle({ "--type-h1-size": "28px" });
});

test("the weight control is locked for a font with one weight", async () => {
  projectStore.setState({ project: applyPairing(createDefaultProject(), "caslon-library") });
  render(<App />);
  await openStep("Type");
  const editor = screen.getByRole("group", { name: "Adjust a text role" });
  expect(within(editor).getByLabelText(/Weight/)).toBeDisabled();
  await userEvent.selectOptions(within(editor).getByLabelText("Text role"), "Body");
  expect(within(editor).getByLabelText(/Weight/)).toBeEnabled();
});
