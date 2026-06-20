import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "src/lib/api-client.ts",
        "src/lib/badges.ts",
        "src/lib/calculations.ts",
        "src/lib/emission-factors.ts",
        "src/lib/goals.ts",
        "src/lib/insights.ts",
        "src/lib/redirects.ts",
        "src/lib/validations.ts",
      ],
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 80 },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
