import { test, expect } from "bun:test";
import type { FontRef } from "@/core/project";
import type { ProjectStorage } from "@/state/project-store";
import { curatedFonts, loadCatalogue } from "./font-catalogue";
import { searchFonts } from "./search-fonts";

function memoryStorage(): ProjectStorage & { items: Map<string, unknown> } {
  const items = new Map<string, unknown>();
  return {
    items,
    getItem: async name => items.get(name) ?? null,
    setItem: async (name, value) => void items.set(name, value),
    removeItem: async name => void items.delete(name),
  };
}

const API_FONTS = [
  { id: "karla", family: "Karla", weights: [200, 800], variable: true, category: "sans-serif", subsets: ["latin"] },
  { id: "lora", family: "Lora", weights: [400, 700], variable: true, category: "serif" },
  { family: "Broken" },
];

const ok = () => Promise.resolve(new Response(JSON.stringify(API_FONTS)));
const offline = () => Promise.reject(new TypeError("Failed to fetch"));

test("loads Google fonts from Fontsource, keeping only valid entries", async () => {
  const catalogue = await loadCatalogue({ fetcher: ok, cache: memoryStorage() });
  expect(catalogue.source).toBe("fontsource");
  expect(catalogue.fonts).toEqual([
    { source: "google", family: "Karla", weights: [200, 800], variable: true, category: "sans-serif" },
    { source: "google", family: "Lora", weights: [400, 700], variable: true, category: "serif" },
  ]);
});

test("a fresh cached list is used without asking the API again", async () => {
  const cache = memoryStorage();
  await loadCatalogue({ fetcher: ok, cache, now: 1000 });
  const catalogue = await loadCatalogue({ fetcher: offline, cache, now: 2000 });
  expect(catalogue.fonts.map(font => font.family)).toEqual(["Karla", "Lora"]);
});

test("when the API can't be reached, search falls back to the curated fonts", async () => {
  const catalogue = await loadCatalogue({ fetcher: offline, cache: memoryStorage() });
  expect(catalogue.source).toBe("curated");
  expect(catalogue.fonts).toEqual(curatedFonts());
  expect(catalogue.fonts.map(font => font.family)).toContain("Brygada 1918");
});

test("an error response also falls back", async () => {
  const failing = () => Promise.resolve(new Response("busy", { status: 503 }));
  expect((await loadCatalogue({ fetcher: failing, cache: memoryStorage() })).source).toBe("curated");
});

const fonts: FontRef[] = ["Lora", "Karla", "Libre Franklin", "Big Shoulders", "Fira Mono"].map(family => ({
  source: "google",
  family,
  weights: [400],
  variable: false,
  category: family === "Lora" ? "serif" : family === "Fira Mono" ? "monospace" : "sans-serif",
}));

test("search ranks names that start with the query above other matches", () => {
  expect(searchFonts(fonts, "l", "all").map(font => font.family)).toEqual([
    "Lora",
    "Libre Franklin",
    "Karla",
    "Big Shoulders",
  ]);
});

test("search matches the start of any word and ignores case", () => {
  expect(searchFonts(fonts, "SHOULD", "all").map(font => font.family)).toEqual(["Big Shoulders"]);
});

test("search filters by category", () => {
  expect(searchFonts(fonts, "", "monospace").map(font => font.family)).toEqual(["Fira Mono"]);
});
