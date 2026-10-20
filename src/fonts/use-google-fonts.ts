import { useEffect } from "react";
import type { FontRef } from "@/core/project";
import { googleFontsHref } from "./google-fonts";

/**
 * Adds a stylesheet link for each Google font so the browser can render it. Links are kept once added:
 * switching back to a font is then instant, and an unused stylesheet costs nothing.
 */
export function useGoogleFonts(fonts: readonly FontRef[], text?: string): void {
  const hrefs = fonts.filter(font => font.source === "google").map(font => googleFontsHref(font, text));
  const key = hrefs.join("|");
  useEffect(() => {
    const present = new Set([...document.head.querySelectorAll("link")].map(link => link.getAttribute("href")));
    for (const href of key.split("|")) {
      if (!href || present.has(href)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.append(link);
    }
  }, [key]);
}
