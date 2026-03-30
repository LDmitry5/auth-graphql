import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "./runtime-compiler": "./runtime-compiler.browser",
    },
  },
  optimizeDeps: {
    exclude: ["@apollo/client"],
  },
  server: {
    proxy: {
      "/graphql": {
        target: "http://185.207.66.100:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});
