import type { FontRef } from "@/core/project";

/**
 * A Google Fonts css2 URL for one family. Variable fonts load their weight range, static ones only the
 * weights they ship. `text` limits the download to those characters, for cheap previews in long lists.
 */
export function googleFontsHref(font: FontRef, text?: string): string {
  const weights = font.weights.toSorted((a, b) => a - b);
  const axis = font.variable && weights.length > 1 ? `${weights[0]}..${weights.at(-1)}` : weights.join(";");
  const family = `${encodeURIComponent(font.family).replaceAll("%20", "+")}:wght@${axis}`;
  const subset = text ? `&text=${encodeURIComponent(text)}` : "";
  return `https://fonts.googleapis.com/css2?family=${family}&display=swap${subset}`;
}
