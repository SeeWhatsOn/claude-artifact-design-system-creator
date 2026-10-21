import { beforeEach, expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { compile } from "@/core/compile";
import { createDefaultProject } from "@/core/default-project";
import { PATTERNS } from "@/core/patterns/pattern-catalogue";
import { patternState } from "@/core/patterns/pattern-editing";
import { projectStore } from "@/state/project-store";
import { App } from "@/App";
import { resetShell } from "@/shell/shell-store";
import { openStep } from "../../test/open-step";
import { PatternLibrary } from "./PatternLibrary";

const { preview } = compile({ ...createDefaultProject(), darkEnabled: true });

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
  resetShell();
});

function renderLibrary() {
  render(<PatternLibrary light={preview.light} dark={preview.dark} />);
  return screen.getByRole("region", { name: "Pattern library" });
}

test("renders every pattern with an example", () => {
  const library = renderLibrary();
  for (const pattern of PATTERNS) {
    const article = within(library).getByRole("article", { name: pattern.title });
    expect(article.querySelector("[data-preview-theme]")?.innerHTML).not.toBe("");
  }
});

test("each pattern shows its saved choice, and choosing another saves it to the project", async () => {
  const library = renderLibrary();
  const donut = within(library).getByRole("radiogroup", { name: "Donut chart use" });
  expect(within(donut).getByRole("radio", { name: "Never" })).toBeChecked();

  await userEvent.click(within(donut).getByRole("radio", { name: "Allowed" }));
  expect(patternState(projectStore.getState().project, "donut-chart")).toBe("allowed");
  expect(within(donut).getByRole("radio", { name: "Allowed" })).toBeChecked();
});

test("switches every example between the light and dark themes", async () => {
  const library = renderLibrary();
  const surfaces = () => [...library.querySelectorAll("[data-preview-theme]")];
  expect(surfaces().some(surface => surface.classList.contains("dark"))).toBe(false);
  await userEvent.click(within(library).getByRole("radio", { name: "Dark" }));
  expect(surfaces().every(surface => surface.classList.contains("dark"))).toBe(true);
});

test("the library sits on the Components and rules step, after the gallery", async () => {
  render(<App />);
  await openStep("Components and rules");
  const step = screen.getByRole("region", { name: "Step" });
  expect(within(step).getByRole("region", { name: "Pattern library" })).toBeInTheDocument();
});
