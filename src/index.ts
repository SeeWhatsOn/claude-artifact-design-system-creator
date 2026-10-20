import { serve } from "bun";
import index from "./index.html";

// Dev server only. Production is the static bundle from build.ts, served by GitHub Pages.
const server = serve({
  routes: {
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
