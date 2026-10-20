/** Formats a value as a readable JSON file: two-space indents and a trailing newline. */
export function toJsonFile(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
