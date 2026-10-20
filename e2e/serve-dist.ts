// Serves the static build under a sub-path, the way GitHub Pages serves a project site.
import path from "node:path";

const base = "/claude-artifact-design-system-creator/";
const distDir = path.join(import.meta.dir, "..", "dist");
const port = Number(process.env.PORT ?? 4173);

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (!pathname.startsWith(base)) return new Response("Not found", { status: 404 });
    const relative = pathname.slice(base.length) || "index.html";
    const file = Bun.file(path.join(distDir, path.normalize(relative)));
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },
});

console.log(`Serving dist at http://localhost:${port}${base}`);
