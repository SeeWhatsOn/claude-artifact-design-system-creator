import { test, expect } from "bun:test";
import { googleFontsHref } from "./google-fonts";

test("a variable family loads its whole weight range", () => {
  const href = googleFontsHref({
    source: "google",
    family: "Brygada 1918",
    weights: [400, 500, 600, 700],
    variable: true,
  });
  expect(href).toBe("https://fonts.googleapis.com/css2?family=Brygada+1918:wght@400..700&display=swap");
});

test("a static family loads only the weights it ships", () => {
  const href = googleFontsHref({ source: "google", family: "Libre Caslon Text", weights: [700, 400], variable: false });
  expect(href).toBe("https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&display=swap");
});

test("a list preview asks for just the characters it shows", () => {
  const href = googleFontsHref({ source: "google", family: "Jost", weights: [400], variable: false }, "Bauhaus & Co");
  expect(href).toBe("https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap&text=Bauhaus%20%26%20Co");
});
