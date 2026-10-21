import { test, expect, beforeEach } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { assetStore } from "@/state/asset-store";
import { projectStore } from "@/state/project-store";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1]);
const SVG = `<svg xmlns="http://www.w3.org/2000/svg"/>`;

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
  assetStore.setState({ assets: {} });
});

function preview(): HTMLElement {
  return screen.getByRole("region", { name: "Preview" });
}

test("an uploaded logo is stored, listed with a thumbnail and shown in the preview", async () => {
  render(<App />);
  await userEvent.upload(screen.getByLabelText("Upload logo"), new File([PNG], "Acme Mark.png", { type: "image/png" }));

  const [logo] = projectStore.getState().project.logos;
  expect(logo).toMatchObject({ name: "Acme Mark", theme: "any" });
  expect([...(assetStore.getState().assets[logo?.assetId ?? ""] ?? [])]).toEqual([...PNG]);
  const list = screen.getByRole("list", { name: "Logos" });
  expect(within(list).getByRole("img", { name: "Acme Mark" })).toBeInTheDocument();
  expect(within(preview()).getByRole("img", { name: "Acme Mark" })).toBeInTheDocument();
});

test("light and dark variants each show on their own preview theme", async () => {
  render(<App />);
  await userEvent.upload(screen.getByLabelText("Upload logo"), new File([PNG], "On light.png"));
  await userEvent.upload(screen.getByLabelText("Upload logo"), new File([SVG], "On dark.svg"));
  await userEvent.selectOptions(screen.getByLabelText("Theme for On light"), "light");
  await userEvent.selectOptions(screen.getByLabelText("Theme for On dark"), "dark");

  expect(within(preview()).getByRole("img", { name: "On light" })).toBeInTheDocument();
  expect(within(preview()).queryByRole("img", { name: "On dark" })).toBeNull();
  await userEvent.click(within(preview()).getByRole("radio", { name: "Dark" }));
  expect(within(preview()).getByRole("img", { name: "On dark" })).toBeInTheDocument();
  expect(within(preview()).queryByRole("img", { name: "On light" })).toBeNull();
});

test("a logo can be removed, and the preview falls back to the brand name in plain type", async () => {
  render(<App />);
  await userEvent.upload(screen.getByLabelText("Upload logo"), new File([PNG], "Acme Mark.png"));
  await userEvent.click(screen.getByRole("button", { name: "Remove Acme Mark" }));

  expect(projectStore.getState().project.logos).toEqual([]);
  expect(within(preview()).queryByRole("img")).toBeNull();
  expect(within(preview()).getByText(projectStore.getState().project.meta.name)).toBeInTheDocument();
});

test("a file that isn't a PNG or SVG is refused with a reason", async () => {
  render(<App />);
  await userEvent.upload(screen.getByLabelText("Upload logo"), new File(["hello"], "logo.png"));
  expect(await screen.findByRole("alert")).toHaveTextContent("logo.png isn't a PNG or SVG file.");
  expect(projectStore.getState().project.logos).toEqual([]);
});
