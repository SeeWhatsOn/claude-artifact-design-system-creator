# Default font pairings

20 display + body + mono triads for the picker. Every family is on Google Fonts and was checked against the Fontsource API (weights and variable axes) and the Google Fonts metadata on 2026-10-20. Full data, including weights, axes and popularity ranks: [05-font-pairings.json](./05-font-pairings.json).

Selection rules: no Inter, Roboto, Open Sans, Lato, system fonts or Space Grotesk. No high-contrast serif paired with a generic sans. Fonts from the Anthropic blog's own example list (JetBrains Mono, Fira Code, Space Grotesk, Playfair, Crimson Pro, IBM Plex, Source Sans 3, Bricolage, Newsreader) are left out of the defaults, because prompted Claude now converges on them. Every body face reads well at 15-16px. Median Google Fonts popularity rank across the picks is 266 (for comparison: Inter 5, Roboto 2).

| # | Name | Mood | Display | Body | Mono | Ratio |
|---|---|---|---|---|---|---|
| 1 | Modern Broadsheet | editorial | Brygada 1918 (var: wght) | Schibsted Grotesk (var: wght) | Fragment Mono | 1.333 |
| 2 | Caslon Library | literary | Libre Caslon Display | Libre Caslon Text | Courier Prime | 1.333 |
| 3 | Calligraphic Humanist | humanist | Alegreya (var: wght) | Alegreya Sans | Fira Mono | 1.25 |
| 4 | Bauhaus Geometric | geometric | Jost (var: wght) | Albert Sans (var: wght) | Spline Sans Mono (var: wght) | 1.333 |
| 5 | Nordic Grotesk | grotesk | Familjen Grotesk (var: wght) | Instrument Sans (var: wdth/wght) | Azeret Mono (var: wght) | 1.25 |
| 6 | Swiss Variable | neo-grotesk / swiss | Archivo (var: wdth/wght) | Archivo (var: wdth/wght) | Source Code Pro (var: wght) | 1.25 |
| 7 | Field Notes Slab | slab | Zilla Slab | Karla (var: wght) | Fira Mono | 1.25 |
| 8 | Poster Condensed | condensed | Big Shoulders (var: opsz/wght) | Libre Franklin (var: wght) | Fragment Mono | 1.5 |
| 9 | Industrial | condensed / industrial | Barlow Condensed | Barlow | Martian Mono (var: wdth/wght) | 1.333 |
| 10 | Soft Rounded | rounded / friendly | Fredoka (var: wdth/wght) | Nunito Sans (var: opsz/wdth/wght/YTLC) | Sometype Mono (var: wght) | 1.25 |
| 11 | Terminal | technical | Chivo Mono (var: wght) | Chivo (var: wght) | Chivo Mono (var: wght) | 1.2 |
| 12 | Hyperlegible | accessible / public-service | Lexend (var: wght) | Atkinson Hyperlegible Next (var: wght) | Atkinson Hyperlegible Mono (var: wght) | 1.2 |
| 13 | Incised Luxe | luxurious | Marcellus | Spectral | Xanh Mono | 1.414 |
| 14 | Gluten Pop | playful | Gluten (var: slnt/wght) | Figtree (var: wght) | Sometype Mono (var: wght) | 1.333 |
| 15 | Civic Record | institutional / civic | Source Serif 4 (var: opsz/wght) | Public Sans (var: wght) | Overpass Mono (var: wght) | 1.25 |
| 16 | Open Enterprise | corporate / enterprise | Red Hat Display (var: wght) | Red Hat Text (var: wght) | Red Hat Mono (var: wght) | 1.25 |
| 17 | Scholar | academic / scientific | Piazzolla (var: opsz/wght) | Piazzolla (var: opsz/wght) | Source Code Pro (var: wght) | 1.2 |
| 18 | Warm Bookish | warm / bookish | Young Serif | Literata (var: opsz/wght) | Fira Mono | 1.25 |
| 19 | Seventies Retro | retro | Shrikhand | Cabin (var: wdth/wght) | Courier Prime | 1.333 |
| 20 | Block Brutal | brutalist / bold | Dela Gothic One | Hanken Grotesk (var: wght) | Fragment Mono | 1.5 |

## Flagged fonts

The app should warn when one of these is selected. **hard**: Anthropic names it as a default or bans it. **soft**: a common template or AI default. **info**: a good face, but it appears in Anthropic's example prompt, so it shows up a lot in prompted output.

| Family | Severity | Reason |
|---|---|---|
| Inter | hard | The #1 distributional-convergence default; the Anthropic blog's prompt says 'Never use'. |
| Roboto | hard | Listed under 'Never use' in Anthropic's frontend aesthetics prompt; Android/Material system default. |
| Open Sans | hard | Listed under 'Never use' in Anthropic's frontend aesthetics prompt. |
| Lato | hard | Listed under 'Never use' in Anthropic's frontend aesthetics prompt. |
| Arial / Helvetica / system-ui | hard | 'Default system fonts' are listed under 'Never use'; also the zero-decision fallback stack. |
| Space Grotesk | hard | The blog names it as the font Claude falls back to when Inter is banned. |
| Poppins | soft | Google Fonts popularity rank 8; the stock geometric font in templates and AI landing pages. |
| Montserrat | soft | Google Fonts rank 7; the stock geometric heading font in templates. |
| DM Sans | soft | Rank 21 and a frequent LLM fallback for 'clean modern sans'; reads as a template default. |
| Manrope | soft | Rank 30; common SaaS and AI-builder default; reads as a generic startup. |
| Plus Jakarta Sans | soft | Rank 35; common in AI-generated SaaS kits as the non-Inter Inter. |
| Outfit | soft | Rank 33; common geometric default in AI landing-page generators. |
| Geist | soft | Vercel's typeface, default in v0/Next.js scaffolds; a Vercel/shadcn tell. |
| Geist Mono | soft | Pairs with Geist in v0/Next.js defaults; a mono micro-label tell. |
| Playfair Display | soft | The stock high-contrast serif and one of the blog's own 'Editorial' examples; the cream + serif + terracotta cluster. |
| Fraunces | soft | Soft high-contrast variable serif that LLMs reach for to look editorial; part of the cream/serif/terracotta cluster the skill bans. |
| Instrument Serif | soft | Single-weight high-contrast display serif ubiquitous in 2024-26 AI and startup landing pages; same cluster. |
| DM Serif Display | soft | High-contrast display serif frequently paired with DM Sans in templates. |
| Cormorant Garamond | soft | The default 'luxury' serif in AI output; thin and hard to read at body sizes. |
| Bricolage Grotesque | soft | Named in the blog's 'Distinctive' examples, so prompted Claude now converges on it. |
| JetBrains Mono | soft | The blog's first 'Code aesthetic' example; the default mono in prompted output. |
| Space Mono | soft | Companion to Space Grotesk and the stock 'techy' mono for labels. |
| Newsreader | info | A good face, but one of the blog's 'Distinctive' examples, so it shows up often in prompted output. Fine if chosen on purpose. |
| Crimson Pro | info | A good face, but one of the blog's 'Editorial' examples. |
| IBM Plex Sans / Serif / Mono | info | A good system, but the blog's 'Technical' example. Fine if chosen on purpose. |
| Source Sans 3 | info | The blog's 'Technical' example; neutral to the point of anonymous. |
| Fira Code | info | The blog's 'Code aesthetic' example; ligature mono default. |

Sources: https://www.claude.com/blog/improving-frontend-design-through-skills ("Never use: Inter, Roboto, Open Sans, Lato, default system fonts"; the Space Grotesk fallback; the example list), https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md (the cream + high-contrast serif + terracotta cluster), and the Google Fonts popularity ranks. Soft flags based on rank are an editorial judgment from the ranks plus observed AI output, not an Anthropic statement.
