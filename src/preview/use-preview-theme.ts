import { useState } from "react";
import type { ThemeId } from "@/core/colour/derive-theme";
import type { CssVarMap } from "@/core/compile";

/** The theme a preview shows and its variables; falls back to light while the project has no dark theme. */
export function usePreviewTheme(light: CssVarMap, dark?: CssVarMap) {
  const [chosen, setTheme] = useState<ThemeId>("light");
  const theme: ThemeId = dark ? chosen : "light";
  const vars = theme === "dark" && dark ? dark : light;
  return { theme, vars, setTheme };
}
