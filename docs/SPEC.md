# Brandkit for Claude — Specification (v1)

Repo: SeeWhatsOn/claude-artifact-design-system-creator · Research: `docs/research/01–05` · Status: draft for sign-off (2026-10-20)

> Q26–Q29 (picker flow, undo/snapshots, name, done criteria) were taken at the recommended answers without explicit confirmation — marked **(assumed)** below.

## Problem Statement

People who make lots of artifacts with Claude get output that is polished but generic: Inter or Space Grotesk, purple-indigo gradients or the newer cream-and-terracotta look, identical rounded cards with soft shadows, ALL-CAPS eyebrow labels, "→" on every button. Claude now supports **Design Systems** (a brand's README, tokens, components and rules that Claude reads before making decks, designs and prototypes), but building one means hand-writing a specific file package and `tokens.json` shape. Non-technical people can't do that, and they can't judge what a token change will look like until they see it applied. There is also no place in the Design System format for some rules people care about, such as "this button only in toolbars", "no count-up animations" or "never write 'Get Started'". As a result Claude's own defaults win.

## Solution

**Brandkit for Claude** is a browser app with a visual picker. A user starts from a curated style preset, swaps in one of 20 curated colour palettes and 20 font pairings (or searches any Google Font or uploads their own), and tunes the type scale, spacing, radius, shadow, motion, component variants and placement rules, copy voice, and a set of "generic tells" bans. Every change previews live on real shadcn components and on four realistic scenes: a dashboard, a landing page, a report and a slide. These are shown in light and dark, side by side with the "Claude default" look.

Export produces:
1. A **Claude Design System package**: a `project/` folder that drops straight into Claude's Design System artifact type with no hand edits.
2. A **brand skill**. It enforces what the Design System can't express (bans, placement rules, motion and copy policy) and can publish the package to Claude.
3. A **shadcn theme** (CSS variables and a registry JSON).

These are delivered as a zip, with a copy-paste prompt for people without Claude Code.

## User Stories

### Getting started
1. As a non-technical user, I want to open the app from a URL with nothing to install, so that I can start immediately.
2. As a new user, I want to pick from about 8 starter style presets (e.g. editorial, brutalist, soft product, civic, playful, luxury, technical, warm), so that I begin from something coherent rather than a blank page.
3. As a new user, I want each preset shown as a thumbnail of a real scene, so that I can choose by eye.
4. As a user, I want to see a "Claude default" version of every scene next to mine, so that I can see exactly how I'm departing from the generic look.
5. As a user, I want the "Claude default" look to be a comparison only and never a starting preset, so that I'm not nudged back to it.
6. As a returning user, I want my in-progress system restored automatically when I reopen the app, so that I don't lose work.
7. As a user, I want to save my whole system as one project file and load it again later or on another machine, so that I own my work.

### Guided flow and navigation (assumed)
8. As a non-technical user, I want a guided path (Start → Colour → Type → Shape & space → Components & rules → Voice → Bans review → Export), so that I know what to do next.
9. As a user, I want a progress rail showing which required choices are still missing, so that I know what blocks export.
10. As a user who has finished the guided path, I want every step available as a tab, so that I can jump around freely.
11. As a user, I want the live preview always visible beside the controls, so that every change is immediately visible.
12. As a phone user, I want the preview as a toggleable sheet over a stacked layout, so that the app works at narrow widths.
13. As a non-technical user, I want plain-language labels ("Main button colour", "Headline size") with token names hidden, so that I'm not confronted with jargon.
14. As a technical user, I want an Advanced toggle that reveals token names and raw values, so that I can fine-tune precisely.
15. As a user, I want undo and redo for every change, so that I can experiment safely.
16. As a user, I want to take named snapshots ("bolder version") and A/B compare two of them in the split preview, so that I can decide between directions.

### Colour
17. As a user, I want to choose from 20 curated palettes spanning moods and industries, so that I get a tasteful, non-generic starting palette.
18. As a user, I want to swap a palette into any preset without losing my type and shape choices, so that colour and style are independent.
19. As a user, I want to set colour through a few seeds (brand, neutral tint, accent, success, warning, danger), so that I don't have to pick 30 colours.
20. As a user, I want the full set of interface colours (backgrounds, text, borders, cards, inputs, focus ring, sidebar, five chart colours) derived from my seeds for both light and dark, so that everything stays consistent.
21. As a user, I want dark-mode brand colours lightened automatically until they're readable, so that dark mode works without manual fixing.
22. As a user, I want a randomise action with per-seed locks, so that I can explore variations around colours I like.
23. As a user, I want to see live contrast ratings for each text/background pair in plain words ("Easy to read", "Too faint"), so that I keep things accessible.
24. As an advanced user, I want to override any single derived colour in either theme, so that I can match an exact brand value.
25. As a user, I want a warning when my palette resembles a known generic look (purple-indigo gradient, cream + terracotta, black + acid accent), so that I avoid it unknowingly.
26. As a user, I want light required and dark optional (auto-derived, then editable), so that I'm not forced to design two themes.

### Typography
27. As a user, I want to pick from 20 curated font pairings (display, body, mono), so that I get a distinctive, readable combination quickly.
28. As a user, I want to search all Google Fonts with each name rendered in its own face, so that I can pick any font I like.
29. As a user, I want to upload my own font files (woff2, woff, ttf, otf) and see them immediately, so that I can use my brand's licensed typeface.
30. As a user, I want uploaded fonts bundled into the export, so that Claude can actually use them.
31. As a user, I want a warning (hard, soft or info) when I pick a font Claude overuses (Inter, Roboto, Space Grotesk, Playfair…), so that I make an informed choice.
32. As a user, I want a fixed set of text roles (Display, H1, H2, H3, Lead, Body, Small, Caption, Label, Code), so that I know what each style is for.
33. As a user, I want sizes generated from a base size and a named ratio ("Calm 1.2", "Dramatic 1.5"), so that the hierarchy is harmonious without arithmetic.
34. As a user, I want to override any role's family, size, weight, line height, letter spacing and case, so that I can fine-tune.
35. As a user, I want the weight control disabled for fonts that only ship one weight, so that I can't choose something that won't render.

### Shape, space, depth, motion, icons
36. As a user, I want to choose a spacing base (4 or 8) and a density (compact, comfortable, airy), so that the layout rhythm suits my brand.
37. As a user, I want separate corner radii for controls, cards, dialogs and pills, so that I avoid "one radius on everything".
38. As a user, I want a shadow builder (colour, opacity, blur, spread, offset) or a "flat, no shadows" option, so that depth fits my brand.
39. As a user, I want to choose hairline borders or no borders, so that surfaces are separated the way I like.
40. As a user, I want a motion policy (none, subtle, expressive) plus banned effects, so that Claude doesn't animate everything by default.
41. As a user, I want an icon rule (stroke weight and size), so that icons feel deliberate rather than stock.

### Components and rules
42. As a user, I want to see all 12 components (Button, Badge, Card, Input, Select, Checkbox/Switch, Tabs, Table, Alert, Dialog, Navigation/Sidebar, Chart) in a gallery, so that I can check them all in my style.
43. As a user, I want to switch individual component variants on or off (e.g. keep primary, secondary and ghost buttons, drop destructive-outline), so that Claude only uses the variants I approve.
44. As a user, I want to say where each variant may be used, chosen from fixed contexts (page header, toolbar, form footer, card, table row, hero, nav, dialog, slide), so that I can express rules like "ghost buttons only in toolbars".
45. As a user, I want limits such as "at most 1 primary button per view", so that hierarchy is enforced.
46. As a user, I want free-text do/don't notes per component, so that I can capture anything the structured rules miss.
47. As a user, I want chart colours derived from my palette and checked for distinguishability by lightness, so that charts aren't the stock palette and stay readable.

### Voice and copy
48. As a user, I want to choose sentence case or Title Case for headings and buttons, so that copy style is consistent.
49. As a user, I want preferred button wording examples ("Save changes", not "Submit"), so that Claude writes specific actions.
50. As a user, I want a banned phrases list prefilled with generic marketing filler ("Elevate", "Seamless", invented stats), so that Claude's copy sounds like me.
51. As a user, I want tone sliders (formal↔casual, terse↔warm), so that I can set voice without writing a style guide.
52. As a user, I want an emoji policy (never, sparingly, freely), so that emoji-as-icons stops appearing.
53. As a user, I want the preview scenes' copy to reflect my case and emoji choices, so that I see the effect.

### Generic-tells bans
54. As a user, I want about 30 generic tells listed in groups (type, colour, shape, layout, motion, copy, stack), all banned by default, so that the system starts anti-generic.
55. As a user, I want to switch off individual bans with a one-line explanation of each, so that I can deliberately keep a look I actually want.
56. As a user, I want a warning (not a block) when I switch off a ban, so that I know the consequence.

### Logos
57. As a user, I want to upload SVG or PNG logos with light and dark variants, so that the preview and Claude's output use my real mark.
58. As a user without a logo, I want plain type used with a note in the export, so that Claude never invents a logo.

### Validation and export
59. As a user, I want export blocked until the required positive choices are made (palette, type roles, radius, motion policy), so that the system isn't just a list of bans.
60. As a user, I want export blocked if any text pair is below 3:1 contrast, and a warning between 3:1 and 4.5:1 on body text, so that the system stays accessible.
61. As a user, I want a checklist of exactly what's blocking or warning, linked to the step that fixes it, so that I can resolve it quickly.
62. As a user, I want to download a zip containing the Design System package, the brand skill and the shadcn theme, so that I get everything in one go.
63. As a claude.ai user, I want a "copy prompt" button that tells Claude how to create a Design System from the zip, so that I can import without Claude Code.
64. As a Claude Code user, I want to install the brand skill and have it publish the package to a Design System artifact for me, so that import is one step.
65. As a user, I want the exported package accepted by Claude's Design System type with no hand edits, so that it just works.
66. As a user, I want every exported token to carry a plain-English usage note, so that Claude knows when to use it.
67. As a user, I want the export's README to be a short brand book (overview, global rules, index), so that Claude reads the essentials first.
68. As a user, I want a static preview page per component and a cover page in the export, so that the Design System page looks complete in Claude.
69. As a developer, I want a shadcn registry JSON I can install with the shadcn CLI, plus raw CSS variables, so that I can apply the same theme to my own projects.
70. As a user, I want Claude to follow my system when making a deck or dashboard without me describing the brand, so that my artifacts stop looking generic.
71. As a user, I want the skill to state that my brand rules override Claude's default frontend-design guidance, so that my choices win over its defaults, including when I deliberately chose a "tell".

## Implementation Decisions

**Platform & hosting**
- Fully client-side single-page app built from the existing Bun + React 19 + Tailwind v4 + shadcn (new-york) scaffold. Bun is used for dev and to build a static bundle, deployed to GitHub Pages from this repo. No server is needed at runtime. The demo API routes in the template are removed.
- No accounts. The Project lives in a zustand store (undo/redo via zundo) persisted to IndexedDB (idb-keyval), since fonts and logos are binary; it is validated and migrated with zod on load/import. Import/export uses a single project JSON file with uploads embedded. localStorage only for small conveniences, always in try/catch.
- Stack: Bun only for dev/build/test (no Vite/Vite+), culori, fflate, recharts, native colour input + OKLCH sliders (no picker library), oxlint + oxfmt.

**One domain core, one seam.** All design logic lives in a pure, framework-free core module whose single public entry point is:

```ts
compile(project: Project): {
  preview: { light: CssVarMap; dark?: CssVarMap; fontsToLoad: FontRef[] } // what the UI applies live
  diagnostics: Diagnostic[]   // { severity: "block" | "warn" | "info", code, message, step, path }
  files: FileMap              // export path -> string | Uint8Array
}
```

The UI never derives tokens itself. It renders `preview` vars onto a preview wrapper and lists `diagnostics`. Export zips `files`.

Inside the core, as internal modules behind that seam:
- **Colour engine**: works in OKLCH (culori). Expands seeds into the full shadcn variable set plus chart-1..5 for light and dark. Raises lightness for dark-mode brand colours until they reach 4.5:1, then picks a dark foreground. Applies overrides last.
- **Contrast checker**: WCAG 2 ratios across the defined foreground/background pairs, in every theme.
- **Type scale**: `base × ratio^n` mapped to the 10 roles, then per-role overrides. Exports fixed px values.
- **Rules compiler**: turns component variants, contexts, limits, bans, motion, copy voice and icon rules into Markdown.
- **Exporters**: `claudeDesignSystem`, `brandSkill`, `shadcnTheme` (CSS vars and `registry:style` JSON with `registry:font` entries).

**Project model (schema, versioned)**: `{ schemaVersion, meta{name, namespace}, presetId, palette{seeds, overrides{light,dark}}, darkEnabled, type{families{display,body,mono}: FontRef, base, ratio, roleOverrides}, shape{spacingBase, density, radii{control,card,dialog,pill}, shadow|flat, borders}, motion{policy, bannedEffects}, icons{stroke,size}, components{[name]{variants{[v]{enabled, contexts[], limit?}}, notes}}, voice{case, buttonExamples, bannedPhrases, tone{formality, warmth}, emoji}, bans{[tellId]: boolean}, logos[], snapshots[] }`. A `FontRef` is `{source: "google"|"upload", family, weights, variable, assetId?}`. Migrations are keyed on `schemaVersion`.

**Claude Design System export contract** (from the Design System type, contract 0.2.47; details in `docs/research/01`):
- Files go under `project/`: the index `design-system.json` (with `createdOnFiles`), `tokens.json`, `README.md`, `components/<Comp>/README.md` (the first sentence is the summary), `components/<Comp>/preview.html` (first line `<!-- @dsCard group=… height=… -->`, static HTML/CSS with no bundle), `components/Cover/preview.html`, `assets/Logos/*`, and `fonts/*` for uploaded fonts only.
- **Never** write the generated files `api/*`, `tokens.css` or `manifest.json`.
- `tokens.json` uses the **list shape** (`{"tokens":[{name,value,usage}]}` per family; `color.themes` with the light theme first). It is never DTCG.
- Token names match `[A-Za-z0-9][A-Za-z0-9_.-]{0,63}` and are unique across families.
- Colour values are hex or `oklch()` only: no named colours, `var()` or `color-mix()`.
- Every token has a `usage` note.
- Google fonts are named only in `type.families`, with no file.
- Size: a small, legible system rather than every intermediate value, close to the type's guidance (roughly 6–10 core colours per theme plus semantic and chart colours, 10 text styles, 4–6 spacing steps, 4 radii).

**Brand skill export**:
- Layout: `<brand>-design/SKILL.md` + `references/tokens.css` (Tailwind v4 `@theme` plus shadcn vars) + `references/components.md` + `assets/fonts/` + `assets/logos/`.
- Frontmatter: the name is lowercase-hyphenated, matches the folder and avoids the reserved words "claude"/"anthropic". The description includes trigger phrases.
- The body stays under 500 lines and covers: when to use the skill, an explicit "these brand rules override default frontend-design guidance" line, bans, placement rules, layout/motion/copy/icon policy, chart palette, and a **publish procedure**. That procedure is to create a Design System artifact from the bundled `project/` files, following the type's own instructions.

**Shared design data** shipped with the app: 20 palettes (`docs/research/04`), 20 font pairings and 27 flagged fonts with severity (`docs/research/05`), about 30 generic-tell definitions (`docs/research/02`), and 8 style presets. Each preset bundles palette, pairing, ratio, shape, motion and voice. A "Claude default" pseudo-preset is used only for comparison.

**Fonts**:
- Search uses the Fontsource API (CORS-enabled, keyless) directly from the browser, cached in browser storage.
- Fonts load via Google Fonts css2 URLs, with `&text=` subsets for list previews. Static families load explicit weights; single-weight families disable the weight control.
- Uploads use the FontFace API.

**Preview**:
- Scoped CSS variables on a wrapper element, with a `.dark` class per pane.
- Components: the 12 shadcn components (install the missing ones).
- Four scenes (dashboard, landing, report/doc, 16:9 slide), written to *use* tokens and rules, e.g. placing a ghost button only where the rules allow it.
- A split view handles both comparisons: Claude default vs. mine, and snapshot A vs. snapshot B.
- **Picker flow (assumed)**: a guided path first, then tabs; a progress rail driven by `block` diagnostics.
- **Validation gates**: `block` covers missing palette, type roles, radius or motion policy, and any text pair below 3:1. `warn` covers body text between 3:1 and 4.5:1, a disabled ban, a flagged font, and a palette that resembles a tell.
- **Delivery**: a zip containing `design-system/project/…`, `skill/<brand>-design/…`, `shadcn/…` and `PROMPT.md`, plus a copy-prompt button.
- **Name (assumed)**: the UI title is "Brandkit for Claude"; the repo keeps its name.

## Testing Decisions

- **One seam: `compile(project)`.** Tests construct a `Project` (from presets, palettes and hand-built edge cases) and assert only on its three outputs: preview vars, diagnostics and files. Internal modules are not tested directly unless a bug needs pinning.
- **What a good test looks like:** it asserts externally observable behaviour, such as "the exported `tokens.json` has no duplicate names", "every text pair in the dark preview is ≥4.5:1", "missing motion policy yields a `block` diagnostic pointing at the Shape step" or "disabling the ghost-button variant removes it from the Button README". It does not assert on intermediate data structures.
- **Covered:**
  - **Claude format conformance.** For every preset × palette combination: list shape, name regex, uniqueness, allowed colour syntaxes, light theme first, usage present, required files present, forbidden generated files absent, preview first-line marker, and index shape with `createdOnFiles`.
  - **Contrast.** Every derived pair meets the gates in every theme, for all 20 palettes, in light and dark.
  - **Type scale.** Correct sizes for each ratio, overrides respected, and single-weight fonts produce no unsupported weights.
  - **Skill.** Frontmatter validity (name rules, description length), the override line is present, enabled bans appear and disabled bans don't, and the body is ≤500 lines.
  - **shadcn export.** The registry JSON has the required keys and the CSS vars cover the full shadcn set.
  - **Golden files.** One or two presets have committed expected exports; diffs are reviewed deliberately.
  - **Project schema.** Round-trip save/load and migration from older `schemaVersion`.
- **Tooling:** `bun test`. There is no existing test prior art in the repo (fresh template), so these golden and property-style tests set the pattern.
- **UI:** React Testing Library (happy-dom on `bun test`) for component behaviour; Playwright + axe for e2e and accessibility, including the release smoke test: preset → change palette → change font → export → zip contains the expected top-level folders.
- **Acceptance (v1 done, assumed):** a non-technical tester goes from preset to export in under 15 minutes. The zip becomes a working Design System artifact with no hand edits. With the skill installed, Claude generates a deck and a dashboard that visibly follow the brand and break none of the enabled bans.

## Out of Scope

- Accounts, cloud storage and multi-user sharing or collaboration.
- Publishing to claude.ai directly from the browser (the skill or the user does it).
- DTCG / W3C token export (planned next).
- Importing shadcn `globals.css`, tweakcn JSON, Figma or existing Design Systems; only the app's own project file is imported.
- "Extract palette from image/URL/screenshot".
- More than light + dark themes.
- Fluid (clamp) type in the export.
- A React `components/bundle.js` with live components in the Design System.
- Icon sets, imagery and illustration assets (logos only).
- Adobe Fonts and other font services.
- Previewing user-supplied HTML.

## Further Notes

- **Research basis**:
  - `docs/research/01`: the Claude Design System format, including the decisive finding that it cannot read DTCG.
  - `docs/research/02`: generic tells, from Anthropic's frontend-design skill. It contains the clause "the brief's own words always win", which is why the skill can override the defaults.
  - `docs/research/03`: shadcn, fonts and type-scale prior art.
  - `docs/research/04–05`: curated palettes and font pairings.
- **Banning one default produces the next one.** That's why export requires positive choices, and why the curated libraries avoid Anthropic's own suggested alternatives (Space Grotesk, Playfair, JetBrains Mono…).
- **Two palettes knowingly echo a tell.** Hi-Vis is near-black with an acid accent; Solarized Dusk has a cream-ish light background and defaults to dark. Both are flagged in-app.
- **Claude's Design System format may change.** Its contract version (0.2.47) is recorded in the export index, and the conformance tests encode the rules, so a format change shows up as a test failure.
- **Work breakdown.** The work will be tracked as GitHub issues on this repo, not as task files in the repo.
