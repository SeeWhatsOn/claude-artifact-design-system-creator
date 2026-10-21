import { expect, test } from "bun:test";
import { prepareLogoUpload } from "./logo-files";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const SVG = new TextEncoder().encode(`<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>`);
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);

test("a PNG becomes a logo for both themes, named after the file, with its bytes to store", () => {
  const result = prepareLogoUpload({ name: "Acme Mark.png", bytes: PNG }, () => "id-1");
  expect(result).toEqual({
    ok: true,
    logo: { id: "id-1", name: "Acme Mark", assetId: "id-1", theme: "any" },
    assets: { "id-1": PNG },
  });
});

test("an SVG is recognised from its contents, even after an XML declaration", () => {
  const result = prepareLogoUpload({ name: "logo.svg", bytes: SVG }, () => "id-2");
  expect(result.ok).toBe(true);
});

test("anything that isn't a PNG or SVG is turned away, whatever its name says", () => {
  expect(prepareLogoUpload({ name: "logo.png", bytes: JPEG }, () => "id-3")).toEqual({
    ok: false,
    error: "logo.png isn't a PNG or SVG file.",
  });
});
