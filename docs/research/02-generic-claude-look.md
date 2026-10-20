# The generic Claude look — and how to steer it

## Causes
- "Distributional convergence" (Anthropic blog, https://www.claude.com/blog/improving-frontend-design-through-skills): no direction → Inter, purple gradients on white, minimal motion. When Inter is banned, Claude falls back to Space Grotesk.
- Tailwind UI's `bg-indigo-500` default trained the "purple button" look (https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website).
- Artifact React stack (community-verified): shadcn/ui + Tailwind + Lucide + Recharts → stock zinc/slate, rounded-lg, soft shadows.

## frontend-design SKILL.md (github.com/anthropics/skills, current, Sep 2026). Second-wave clusters to ban:
1. Cream bg (~#F4F1EA) + high-contrast serif + terracotta (~#D97757)
2. Near-black + single acid-green/vermilion accent
3. Broadsheet: hairline rules, zero radius, dense columns
4. SaaS card kit: identical rounded cards, one radius everywhere, rgba(0,0,0,.1) shadow, gradient washes
5. Template chrome: ALL-CAPS tracked eyebrows, "A · B · C" meta, "WORD — fragment", #0B0B0B/#111 as black, mono micro-labels, "→" on links/buttons
Plus: single-word headline accents, 01/02/03 markers on non-sequences, fade-slide-up on every section, hover-lift on every card, big-number stat hero.
**"the brief's own words always win, including when it asks for one of these looks"** → an exported brand skill overrides these bans. That is the lever.

## Lesson
Banning one default produces the next one. The picker must REQUIRE positive choices (named palette, type roles, radius-by-hierarchy, motion policy), not only offer bans.

## Agent Skills format (https://agentskills.io/specification)
`brand-name/SKILL.md` (frontmatter: name ≤64 lowercase-hyphen = folder name; description ≤1024 with triggers; optional license, compatibility, metadata) + `references/` + `assets/` + `scripts/`.
Body <500 lines/<5k tokens; references loaded on demand. (Unverified: reserved words "anthropic"/"claude" may be banned in name.)

## "Default tells" to expose as ban toggles in the picker
- Type: Inter/Roboto/system; Space Grotesk; single-word headline accent; ALL-CAPS eyebrows; mono micro-labels; 01/02/03 markers
- Colour: purple/indigo gradients; gradient text; slate/indigo defaults; cream+terracotta; black+acid accent; #111 near-black; gradient washes
- Shape/depth: one radius everywhere; uniform soft shadow; glassmorphism; glow; cards in cards
- Layout: centred hero + 3 cards; big-number stat hero; broadsheet; pill badge above hero
- Motion: fade-slide-up everywhere; hover lift; count-up; bounce easing
- Copy/chrome: emoji icons; → on buttons; middle-dot meta; em-dash labels; Title Case + "Get Started"/"Submit"; filler/invented stats
- Stack: stock Lucide; stock shadcn zinc; Recharts default palette

Sources: capitalandcompute.net/blog/fix-ai-slop-design, pages.thefountaininstitute.com/posts/7-tells-that-a-ui-is-ai-generated, superdesign.dev/blog/why-ai-design-looks-generic
