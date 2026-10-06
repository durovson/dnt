import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
