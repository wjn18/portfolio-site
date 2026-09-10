import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.PNG"],
  // 项目未使用 @vitejs/plugin-react，这里显式启用 automatic JSX runtime，
  // 组件文件无需再手写 import React（经典转换在构建期不报错、运行期才崩）
  esbuild: {
    jsx: "automatic",
  },
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
