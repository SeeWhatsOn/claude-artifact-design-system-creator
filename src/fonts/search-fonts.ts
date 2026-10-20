import type { FontRef } from "@/core/project";

/** A font style filter: one Google Fonts category, or all of them. */
export type CategoryFilter = NonNullable<FontRef["category"]> | "all";

/**
 * Finds fonts by name within a category. Exact matches come first, then names that start with the
 * query, then names with a word that does, then any other match. Ties keep the catalogue's order.
 */
export function searchFonts(fonts: readonly FontRef[], query: string, category: CategoryFilter, limit = 20): FontRef[] {
  const wanted = query.trim().toLowerCase();
  const inCategory = category === "all" ? fonts : fonts.filter(font => font.category === category);
  if (!wanted) return inCategory.slice(0, limit);
  const rank = (family: string) => {
    const name = family.toLowerCase();
    if (name === wanted) return 0;
    if (name.startsWith(wanted)) return 1;
    if (name.split(/\s+/).some(word => word.startsWith(wanted))) return 2;
    return name.includes(wanted) ? 3 : -1;
  };
  return inCategory
    .map(font => ({ font, rank: rank(font.family) }))
    .filter(match => match.rank >= 0)
    .toSorted((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(match => match.font);
}
