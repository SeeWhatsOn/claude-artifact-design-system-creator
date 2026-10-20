import { isRecord } from "./is-record";
import { toJsonFile } from "./json-file";
import { parseProject, type Project } from "./project";

/** Uploaded binaries (fonts, logos) by asset id. */
export type ProjectAssets = Record<string, Uint8Array>;

/** The outcome of reading a project file the user picked. */
export type ReadProjectFileResult =
  | { ok: true; project: Project; assets: ProjectAssets }
  | { ok: false; error: string };

const FORMAT = "brandkit-project";
const NOT_A_PROJECT = "This file isn't a Brandkit project.";
const damagedAsset = (id: string) => `The uploaded file "${id}" in this project is damaged.`;

/** Serialises the whole system to one JSON file, with uploads embedded as base64 so the file is self-contained. */
export function writeProjectFile(project: Project, assets: ProjectAssets): string {
  const encoded = Object.fromEntries(Object.entries(assets).map(([id, bytes]) => [id, toBase64(bytes)]));
  return toJsonFile({ format: FORMAT, project, assets: encoded });
}

/** The uploads the project actually refers to, so a saved file doesn't carry ones it no longer uses. */
export function usedAssets(project: Project, assets: ProjectAssets): ProjectAssets {
  const ids = [
    ...Object.values(project.type.families).flatMap(font => (font.files ?? []).map(file => file.assetId)),
    ...project.logos.map(logo => logo.assetId),
  ];
  return Object.fromEntries(ids.flatMap(id => (assets[id] ? [[id, assets[id]]] : [])));
}

/** Reads a project file, migrating and validating the project inside it. */
export function readProjectFile(text: string): ReadProjectFileResult {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    return { ok: false, error: NOT_A_PROJECT };
  }
  if (!isRecord(file) || file.format !== FORMAT) return { ok: false, error: NOT_A_PROJECT };
  const parsed = parseProject(file.project);
  if (!parsed.ok) return parsed;

  const assets: ProjectAssets = {};
  const raw = isRecord(file.assets) ? file.assets : {};
  for (const [id, value] of Object.entries(raw)) {
    if (typeof value !== "string") return { ok: false, error: damagedAsset(id) };
    try {
      assets[id] = fromBase64(value);
    } catch {
      return { ok: false, error: damagedAsset(id) };
    }
  }
  return { ok: true, project: parsed.project, assets };
}

// btoa/atob work on "binary strings", one char per byte; chunked to stay under argument-count limits.
function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let start = 0; start < bytes.length; start += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(start, start + 0x8000));
  }
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
}
