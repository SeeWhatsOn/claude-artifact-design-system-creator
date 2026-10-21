import type { Logo } from "../project";

/** The logo file formats the app accepts for upload. */
export type LogoFormat = "png" | "svg";

/** Each logo format's media type, for the export's asset records and the preview. */
export const LOGO_MEDIA_TYPES: Record<LogoFormat, string> = { png: "image/png", svg: "image/svg+xml" };

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
// SVG is text: an optional BOM, XML declaration, doctype and comments may come before the <svg> tag.
const SVG_START = /^﻿?\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*|<!DOCTYPE[^>]*>\s*)*<svg[\s>]/i;

/** Recognises a logo file from its contents, or returns null for anything that isn't a PNG or SVG. */
export function detectLogoFormat(bytes: Uint8Array): LogoFormat | null {
  if (PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)) return "png";
  const head = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, 4096));
  return SVG_START.test(head) ? "svg" : null;
}

/** The outcome of turning a picked file into one logo. */
export type LogoUploadResult =
  | { ok: true; logo: Logo; assets: Record<string, Uint8Array> }
  | { ok: false; error: string };

/** Turns a picked file into a logo for both themes, named after the file, plus the bytes to store. */
export function prepareLogoUpload(file: { name: string; bytes: Uint8Array }, makeId: () => string): LogoUploadResult {
  if (!detectLogoFormat(file.bytes)) return { ok: false, error: `${file.name} isn't a PNG or SVG file.` };
  const id = makeId();
  const name = file.name.replace(/\.[^.]+$/, "").trim() || "Logo";
  return { ok: true, logo: { id, name, assetId: id, theme: "any" }, assets: { [id]: file.bytes } };
}
