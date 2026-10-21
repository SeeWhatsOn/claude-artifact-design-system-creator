import { beforeEach, expect, test } from "bun:test";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { compile } from "@/core/compile";
import { createDefaultProject } from "@/core/default-project";
import { projectStore } from "@/state/project-store";
import { PreviewPane } from "./PreviewPane";

const { preview } = compile(createDefaultProject());

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
});

function renderPane() {
  render(<PreviewPane light={preview.light} dark={preview.dark} />);
  return screen.getByRole("region", { name: "Preview" });
}

async function openScene(pane: HTMLElement, name: string) {
  await userEvent.click(within(pane).getByRole("tab", { name }));
  return within(pane).getByRole("tabpanel", { name });
}

test("each scene has a tab and shows its own page", async () => {
  const pane = renderPane();
  const expected = {
    Dashboard: "Weekly overview",
    "Landing page": "Plan your week in one place",
    Report: "Quarterly customer report",
    Slide: "Three things we learned",
  };
  for (const [tab, heading] of Object.entries(expected)) {
    const panel = await openScene(pane, tab);
    expect(within(panel).getByRole("heading", { name: heading })).toBeInTheDocument();
  }
});

test("scenes use only the brand's tokens, never their own colours or fonts", async () => {
  const pane = renderPane();
  for (const tab of ["Dashboard", "Landing page", "Report", "Slide"]) {
    const panel = await openScene(pane, tab);
    // The surface itself carries the compiled variables; everything inside it must only read them.
    for (const element of panel.querySelectorAll("[data-preview-theme] [style], [data-preview-theme] [class]")) {
      const style = element.getAttribute("style") ?? "";
      const classes = element.getAttribute("class") ?? "";
      expect(style).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i);
      // Arbitrary Tailwind values like bg-[#123456]; shadcn's chart selectors such as [stroke='#ccc'] only restyle.
      expect(classes).not.toMatch(/-\[(#|rgba?\(|hsla?\(|oklch\()/i);
      expect(style).not.toMatch(/font-family:(?!\s*var\()/);
    }
  }
});

test("compare shows the Claude default look beside the brand, in the same scene", async () => {
  const pane = renderPane();
  await openScene(pane, "Landing page");
  await userEvent.click(within(pane).getByRole("switch", { name: "Compare with Claude default" }));

  const claude = within(pane).getByRole("region", { name: "Claude default" });
  const mine = within(pane).getByRole("region", { name: "Your brand" });
  expect(within(claude).getByRole("heading", { name: "Plan your week in one place" })).toBeInTheDocument();
  expect(within(mine).getByRole("heading", { name: "Plan your week in one place" })).toBeInTheDocument();
  expect(claude.querySelector("[data-preview-theme]")).toHaveStyle({ "--primary": "#4f46e5" });
  expect(mine.querySelector("[data-preview-theme]")).toHaveStyle({ "--primary": preview.light["--primary"] ?? "" });
});

test("the comparison follows the light/dark switch on both sides", async () => {
  const pane = renderPane();
  await userEvent.click(within(pane).getByRole("switch", { name: "Compare with Claude default" }));
  await userEvent.click(within(pane).getByRole("radio", { name: "Dark" }));
  for (const side of ["Claude default", "Your brand"]) {
    const surface = within(pane).getByRole("region", { name: side }).querySelector("[data-preview-theme]");
    expect(surface).toHaveClass("dark");
  }
});

test("scenes leave out a variant the component rules don't allow there", async () => {
  const pane = renderPane();
  let panel = await openScene(pane, "Landing page");
  expect(within(panel).getByRole("button", { name: "See how it works" })).toBeInTheDocument();

  const project = createDefaultProject();
  project.components = {
    Button: {
      notes: "",
      variants: {
        outline: { enabled: false, contexts: [] },
        secondary: { enabled: true, contexts: ["toolbar"] },
      },
    },
  };
  act(() => projectStore.setState({ project }));
  panel = within(pane).getByRole("tabpanel", { name: "Landing page" });
  expect(within(panel).queryByRole("button", { name: "See how it works" })).toBeNull();
});

test("key parts of every scene are tagged for click-to-edit", async () => {
  const pane = renderPane();
  for (const tab of ["Dashboard", "Landing page", "Report", "Slide"]) {
    const panel = await openScene(pane, tab);
    for (const target of ["surface", "heading"]) {
      expect(panel.querySelector(`[data-edit="${target}"]`), `${tab} ${target}`).not.toBeNull();
    }
  }
  const dashboard = await openScene(pane, "Dashboard");
  for (const target of ["button", "card", "dialog"]) {
    expect(dashboard.querySelector(`[data-edit="${target}"]`), target).not.toBeNull();
  }
});
