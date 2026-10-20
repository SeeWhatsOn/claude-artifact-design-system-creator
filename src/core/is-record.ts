/** Narrows untrusted data (a parsed file, stored state) to a plain object whose fields can be read. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
