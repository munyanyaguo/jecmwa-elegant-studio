import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Substitutes __SITE_URL__ in index.html. Vite's own %VAR% syntax can't be used
 * inside href/content attributes — it runs decodeURI over them and `%` throws.
 */
function siteUrlHtml(siteUrl: string): Plugin {
  return {
    name: "jecmwa-site-url-html",
    transformIndexHtml: {
      order: "post",
      handler: (html) => html.replaceAll("__SITE_URL__", siteUrl),
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "http://localhost:8080").replace(/\/$/, "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), siteUrlHtml(siteUrl)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
    build: {
      target: "es2020",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            supabase: ["@supabase/supabase-js"],
          },
        },
      },
    },
  };
});
