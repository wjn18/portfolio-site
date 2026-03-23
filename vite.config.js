import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.PNG"],
  server: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
  },
});
