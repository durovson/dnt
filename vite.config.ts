import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Relative asset paths make the same build work on GitHub Pages (/dnt/) and on the custom domain (is.a-dev).
  base: "./",
  plugins: [react()],
  css: { modules: { localsConvention: "camelCase" } },
  resolve: {
    alias: {
      "@ui-styles": path.resolve(rootDir, "vendor/telegram-ui-kit/src/styles"),
    },
  },
  build: { target: "es2020", sourcemap: true },
});
