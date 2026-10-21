import type { CssVarMap } from "../compile";
import { escapeHtml } from "../escape-html";

/** The brand's variables for each theme, as compiled for the live preview. */
export type CardVars = { light: CssVarMap; dark?: CssVarMap };

/** One static preview card: where it sits on the Design System page, and its markup. */
export type DsCard = {
  /** The page group the card is listed under, e.g. "Actions". */
  group: string;
  /** Card height in px on the Design System page. */
  height: number;
  title: string;
  /** Extra CSS for this card. Must read colours and sizes through `var(--token)` only. */
  css?: string;
  /** The card's body markup. */
  body: string;
};

// Every card starts from the brand's page and body text, so cards look alike without repeating it.
const BASE_CSS = `*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  padding: var(--space-4);
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
  font-size: var(--type-body-size);
  line-height: var(--type-body-line-height);
}`;

/**
 * Writes a static `preview.html` card for Claude's Design System page. Line 1 is the `@dsCard` marker the page
 * reads; the brand's tokens are inlined as CSS variables (dark ones under `prefers-color-scheme`), so the card
 * needs no bundle and every colour in it is a token.
 */
export function dsCard(card: DsCard, vars: CardVars): string {
  const dark = vars.dark
    ? `\n@media (prefers-color-scheme: dark) {\n  :root {\n${declarations(vars.dark, 4)}\n  }\n}`
    : "";
  return `<!-- @dsCard group="${card.group}" height=${Math.round(card.height)} -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(card.title)}</title>
<style>
:root {
${declarations(vars.light, 2)}
}${dark}
${BASE_CSS}
${card.css ?? ""}
</style>
</head>
<body>
${card.body}
</body>
</html>
`;
}

function declarations(vars: CssVarMap, indent: number): string {
  const pad = " ".repeat(indent);
  // Values come from compiled tokens; a stray `;` or `}` from a hand-edited file can't break out of the block.
  return Object.entries(vars)
    .map(([name, value]) => `${pad}${name}: ${value.replace(/[;{}<>]/g, "")};`)
    .join("\n");
}
