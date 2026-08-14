import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Keeps env validation deterministic regardless of the developer's .env.
    env: {
      VITE_SUPABASE_URL: "https://test.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      VITE_SITE_URL: "https://jecmwa.test",
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
