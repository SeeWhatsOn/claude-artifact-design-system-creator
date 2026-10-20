# Tokens, shadcn theming, fonts, type scale

## Local scaffold
Bun React template; shadcn new-york/neutral, cssVariables; styles/globals.css = stock shadcn TW4 (@theme inline, OKLCH :root/.dark, radius sm..xl from --radius .625rem). No font/shadow/spacing vars. Installed UI: button, card, input, label, select, textarea only. No app logic yet.

## shadcn (Tailwind v4) — https://ui.shadcn.com/docs/theming
Vars: background/foreground, card(-fg), popover(-fg), primary(-fg), secondary(-fg), muted(-fg), accent(-fg), destructive, border, input, ring, chart-1..5, sidebar(-foreground/-primary(-fg)/-accent(-fg)/-border/-ring), radius. OKLCH. Dark under `.dark`. Custom color = :root/.dark value + `--color-x` in @theme inline.
Registry: types registry:theme / style / base / font / item. `cssVars:{theme,light,dark}`, `css` for raw rules. registry:font `{family, provider:"google", import, variable, weight, subsets}`. Install via `npx shadcn add https://host/r/name.json`.
shadcn/create (CLI v4, Mar 2026) preset codes + `shadcn apply` (partial apply since Apr 2026).

## Prior art
- tweakcn (registry:style; superset: fonts, radius, tracking-*, shadow-color/opacity/blur/spread/offset → shadow-2xs..2xl, spacing, letter-spacing). Borrow var superset, shadow builder, presets, copy-command UX.
- Radix Themes: few knobs (accent, gray, radius, scaling, panel bg) → 12-step scales. Borrow knobs-over-values.
- Realtime Colors: 5 seed colors previewed on realistic page, randomise+lock.
- uicolors.app (hex → 50–950), Huemint (ML palettes in context).

## DTCG 2025.10 (stable CG report, 2025-10-28)
`$value`, `$type`, `$description`, `$extensions`; groups nest; aliases `{a.b}`; color `{colorSpace:"oklch",components:[L,C,H],alpha,hex}`; dimension `{value,unit}`; composites shadow/typography/etc. File `.tokens.json`. NOTE: Claude Design System type CANNOT read DTCG — must convert to list shape.

## Fonts
- Official API needs key: googleapis.com/webfonts/v1/webfonts?key=…
- Keyless: fonts.google.com/metadata/fonts (1,950 families, 2.7MB, no CORS → proxy via Bun /api/fonts, cache) OR Fontsource api.fontsource.org/v1/fonts (CORS *, license + variable info).
- Load: css2?family=X:wght@100..900&display=swap ; `&text=X` for cheap list previews.
- Upload: `new FontFace(name, buf)` → load → document.fonts.add. Export must bundle file.

## Type scale
Ratios 1.067/1.125/1.2/1.25/1.333/1.414/1.5/1.618; size = base × ratio^n. Fluid (Utopia): clamp(min, intercept + slope·vw, max) with rem term. Map to TW4 --text-* + --text-*--line-height.

## Recommendations
Single internal model (seeds → derived semantic tokens, light+dark), apply live as CSS vars on a preview wrapper. culori for OKLCH/scales/gamut; WCAG/APCA contrast checks. Exports: Claude DS package, shadcn registry JSON (served /r/:id.json), DTCG, rules MD. Install more shadcn components for preview.
