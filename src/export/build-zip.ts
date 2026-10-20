import { strToU8, zipSync } from "fflate";
import type { FileMap } from "@/core/compile";

/** Packs export files into a zip, keeping each file at its path. */
export function buildZip(files: FileMap): Uint8Array<ArrayBuffer> {
  const entries = Object.fromEntries(
    Object.entries(files).map(([path, contents]) => [
      path,
      typeof contents === "string" ? strToU8(contents) : contents,
    ]),
  );
  // Copied into a plain ArrayBuffer-backed array, which is what Blob accepts.
  return new Uint8Array(zipSync(entries));
}
