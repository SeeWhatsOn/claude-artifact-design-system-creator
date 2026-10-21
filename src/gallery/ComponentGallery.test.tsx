import { expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { compile } from "@/core/compile";
import { createDefaultProject } from "@/core/default-project";
import { ComponentGallery } from "./ComponentGallery";

const { preview } = compile({ ...createDefaultProject(), darkEnabled: true });

function renderGallery() {
  render(<ComponentGallery light={preview.light} dark={preview.dark} />);
  const gallery = screen.getByRole("region", { name: "Component gallery" });
  const surface = gallery.querySelector("[data-preview-theme]");
  if (!(surface instanceof HTMLElement)) throw new Error("no preview surface");
  return { gallery, surface };
}

test("shows all twelve components", () => {
  const { gallery } = renderGallery();
  for (const title of [
    "Button",
    "Badge",
    "Card",
    "Input",
    "Select",
    "Checkbox and switch",
    "Tabs",
    "Table",
    "Alert",
    "Dialog",
    "Navigation and sidebar",
    "Chart",
  ]) {
    expect(within(gallery).getByRole("heading", { name: title })).toBeInTheDocument();
  }
});

test("switches between the light and dark themes", async () => {
  const { gallery, surface } = renderGallery();
  expect(surface).toHaveStyle({ "--background": preview.light["--background"] ?? "" });
  await userEvent.click(within(gallery).getByRole("radio", { name: "Dark" }));
  expect(surface).toHaveClass("dark");
  expect(surface).toHaveStyle({ "--background": preview.dark?.["--background"] ?? "" });
});

test("the dialog opens inside the gallery, so it wears the brand's colours", async () => {
  const { gallery, surface } = renderGallery();
  await userEvent.click(within(gallery).getByRole("button", { name: "Delete report" }));
  const dialog = await screen.findByRole("dialog", { name: "Delete this report?" });
  expect(surface).toContainElement(dialog);
});

test("the chart is labelled and draws its series in the chart colours", () => {
  const { gallery } = renderGallery();
  const chart = within(gallery).getByRole("figure", { name: /Visitors by source/ });
  expect(chart).toHaveStyle({ "--color-direct": "var(--chart-1)", "--color-referral": "var(--chart-5)" });
});
