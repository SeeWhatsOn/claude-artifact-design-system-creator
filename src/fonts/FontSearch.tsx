import { useEffect, useState } from "react";
import type { FamilySlot, FontRef } from "@/core/project";
import { setFamily } from "@/core/type-editing";
import { findFontFlag } from "@/core/type/flagged-fonts";
import { fontStack } from "@/core/type/type-scale";
import { useProjectStore } from "@/state/project-store";
import { loadCatalogue, type Catalogue } from "./font-catalogue";
import { searchFonts, type CategoryFilter } from "./search-fonts";
import { useGoogleFonts } from "./use-google-fonts";

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All styles" },
  { value: "serif", label: "Serif" },
  { value: "sans-serif", label: "Sans serif" },
  { value: "display", label: "Display" },
  { value: "handwriting", label: "Handwriting" },
  { value: "monospace", label: "Monospace" },
];

/** Searches every Google font by name and style, each result shown in its own face. Loads the list on first use. */
export function FontSearch({ slot }: { slot: FamilySlot }) {
  const updateProject = useProjectStore(state => state.updateProject);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const [wanted, setWanted] = useState(false);

  // The list is about 500 KB, so it's only fetched once someone starts to search.
  useEffect(() => {
    if (!wanted) return;
    let current = true;
    void loadCatalogue().then(loaded => current && setCatalogue(loaded));
    return () => {
      current = false;
    };
  }, [wanted]);

  const results = catalogue ? searchFonts(catalogue.fonts, query, category) : [];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Search Google Fonts
          <input
            type="search"
            value={query}
            onFocus={() => setWanted(true)}
            onChange={event => {
              setWanted(true);
              setQuery(event.target.value);
            }}
            className="rounded-md border bg-background px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Style
          <select
            value={category}
            onChange={event =>
              setCategory(CATEGORIES.find(option => option.value === event.target.value)?.value ?? "all")
            }
            className="rounded-md border bg-background px-2 py-1"
          >
            {CATEGORIES.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {wanted && !catalogue && <p className="text-sm text-muted-foreground">Loading fonts…</p>}
      {catalogue?.source === "curated" && (
        <output className="block text-sm text-muted-foreground">
          Font search is offline, so only the curated fonts are shown.
        </output>
      )}
      {catalogue && (
        <ul aria-label="Font results" className="max-h-72 space-y-1 overflow-y-auto">
          {results.map(font => (
            <FontResult
              key={font.family}
              font={font}
              onPick={() => updateProject(project => setFamily(project, slot, font))}
            />
          ))}
          {results.length === 0 && <li className="text-sm text-muted-foreground">No fonts match.</li>}
        </ul>
      )}
    </div>
  );
}

function FontResult({ font, onPick }: { font: FontRef; onPick: () => void }) {
  // Only this row's name is downloaded, so long result lists stay light.
  useGoogleFonts([font], font.family);
  const flag = findFontFlag(font.family);

  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        className="flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-left hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="text-base" style={{ fontFamily: fontStack(font, "body") }}>
          {font.family}
        </span>
        {flag && (
          <span className="shrink-0 text-xs text-muted-foreground" title={flag.reason}>
            {flag.severity === "info" ? "Common in AI output" : "Overused by AI"}
          </span>
        )}
      </button>
    </li>
  );
}
