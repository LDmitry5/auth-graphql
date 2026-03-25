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
    port: 3000,
    open: true,
  },
});
