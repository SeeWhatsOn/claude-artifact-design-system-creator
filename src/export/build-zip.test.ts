import { test, expect } from "bun:test";
import { strFromU8, unzipSync } from "fflate";
import { buildZip } from "./build-zip";

test("zips text and binary files at their paths", () => {
  const zip = buildZip({ "project/README.md": "# Acme\n", "project/fonts/a.woff2": new Uint8Array([1, 2, 3]) });
  const entries = unzipSync(zip);
  expect(Object.keys(entries).sort()).toEqual(["project/README.md", "project/fonts/a.woff2"]);
  expect(strFromU8(entries["project/README.md"]!)).toBe("# Acme\n");
  expect([...entries["project/fonts/a.woff2"]!]).toEqual([1, 2, 3]);
});
