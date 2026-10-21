import type { ThemeId } from "../colour/derive-theme";
import type { Logo, Project } from "../project";

/** Adds an uploaded logo after the others. */
export function addLogo(project: Project, logo: Logo): Project {
  return { ...project, logos: [...project.logos, logo] };
}

/** Removes one logo. Its bytes stay in the asset store so undo can bring it back. */
export function removeLogo(project: Project, id: string): Project {
  return { ...project, logos: project.logos.filter(logo => logo.id !== id) };
}

/** Sets which theme a logo is for: "light", "dark" or "any" for both. */
export function setLogoTheme(project: Project, id: string, theme: Logo["theme"]): Project {
  return { ...project, logos: project.logos.map(logo => (logo.id === id ? { ...logo, theme } : logo)) };
}

/** The logo to show on a theme: the first made for it, else the first made for both, else none. */
export function logoForTheme(logos: readonly Logo[], theme: ThemeId): Logo | undefined {
  return logos.find(logo => logo.theme === theme) ?? logos.find(logo => logo.theme === "any");
}
