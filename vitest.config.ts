import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "lib/db/schema/**",
        "components/ui/**", // shadcn/ui generated primitives (third-party)
      ],
      thresholds: {
        lines: 81,
        branches: 81,
        functions: 81,
        statements: 81,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
