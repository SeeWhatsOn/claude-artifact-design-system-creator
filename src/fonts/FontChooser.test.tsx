import { test, expect, beforeEach, afterEach } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { createDefaultProject } from "@/core/default-project";
import { assetStore } from "@/state/asset-store";
import { resetShell } from "@/shell/shell-store";
import { projectStore } from "@/state/project-store";
import { openStep } from "../../test/open-step";

const realFetch = globalThis.fetch;

function respondWith(fonts: unknown) {
  globalThis.fetch = Object.assign(() => Promise.resolve(new Response(JSON.stringify(fonts))), {
    preconnect: realFetch.preconnect,
  });
}

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
  resetShell();
  assetStore.setState({ assets: {} });
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const API_FONTS = [
  { family: "Inter", weights: [100, 900], variable: true, category: "sans-serif" },
  { family: "Karla", weights: [200, 800], variable: true, category: "sans-serif" },
  { family: "Lora", weights: [400, 700], variable: true, category: "serif" },
];

test("searching shows matching Google fonts, each in its own face, and picking one fills the chosen slot", async () => {
  respondWith(API_FONTS);
  render(<App />);
  await openStep("Type");
  await userEvent.click(screen.getByRole("radio", { name: /Body text/ }));
  await userEvent.type(screen.getByRole("searchbox", { name: "Search Google Fonts" }), "kar");
  const results = await screen.findByRole("list", { name: "Font results" });
  const karla = await within(results).findByRole("button", { name: /Karla/ });
  expect(within(karla).getByText("Karla")).toHaveStyle({ fontFamily: '"Karla", sans-serif' });
  const hrefs = [...document.head.querySelectorAll("link")].map(link => link.getAttribute("href"));
  expect(hrefs).toContain("https://fonts.googleapis.com/css2?family=Karla:wght@200..800&display=swap&text=Karla");

  await userEvent.click(karla);
  expect(projectStore.getState().project.type.families.body.family).toBe("Karla");
});

test("a flagged font is marked in the results and warns once picked", async () => {
  respondWith(API_FONTS);
  render(<App />);
  await openStep("Type");
  await userEvent.type(screen.getByRole("searchbox", { name: "Search Google Fonts" }), "inter");
  const inter = await screen.findByRole("button", { name: /Inter/ });
  expect(inter).toHaveTextContent("Overused by AI");
  await userEvent.click(inter);
  expect(screen.getByRole("region", { name: "Checks" })).toHaveTextContent("Inter is one of Claude's own defaults");
});

test("when font search is offline, the curated fonts are offered instead", async () => {
  globalThis.fetch = Object.assign(() => Promise.reject(new TypeError("offline")), {
    preconnect: realFetch.preconnect,
  });
  render(<App />);
  await openStep("Type");
  await userEvent.type(screen.getByRole("searchbox", { name: "Search Google Fonts" }), "jost");
  expect(await screen.findByText("Font search is offline, so only the curated fonts are shown.")).toBeInTheDocument();
  expect(await screen.findByRole("button", { name: /Jost/ })).toBeInTheDocument();
});

test("an uploaded font is stored, used for the slot and bundled into the export", async () => {
  render(<App />);
  await openStep("Type");
  await userEvent.click(screen.getByRole("radio", { name: /Body text/ }));
  const file = new File([new Uint8Array([0x77, 0x4f, 0x46, 0x32, 1])], "AcmeSans-Bold.woff2", { type: "font/woff2" });
  await userEvent.upload(screen.getByLabelText("Upload font files"), file);

  const body = projectStore.getState().project.type.families.body;
  expect(body).toMatchObject({ source: "upload", family: "Acme Sans", weights: [700] });
  const assetId = body.files?.[0]?.assetId ?? "";
  expect([...(assetStore.getState().assets[assetId] ?? [])]).toEqual([0x77, 0x4f, 0x46, 0x32, 1]);
  expect(screen.getByRole("button", { name: "Download Design System" })).toBeEnabled();
});

test("a file that isn't a font is refused with a reason", async () => {
  render(<App />);
  await openStep("Type");
  const file = new File(["<svg/>"], "logo.woff2");
  await userEvent.upload(screen.getByLabelText("Upload font files"), file);
  expect(await screen.findByRole("alert")).toHaveTextContent("logo.woff2 isn't a font file");
  expect(projectStore.getState().project.type.families.body.source).toBe("google");
});
