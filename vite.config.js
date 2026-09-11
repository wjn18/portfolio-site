import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

/**
 * dev 下 /admin 会被 SPA fallback 劫持成访客站首页（Netlify 生产没这个问题，
 * 它按目录索引把 /admin 解析到 /admin/index.html）。
 * 这里手动重写，保证本地与线上行为一致。
 */
function adminRewrite() {
  return {
    name: "dev-rewrite-admin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === "/admin" || req.url.startsWith("/admin?")) {
          req.url = "/admin/index.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  assetsInclude: ["**/*.PNG"],
  plugins: [adminRewrite()],
  // 项目未使用 @vitejs/plugin-react，这里显式启用 automatic JSX runtime，
  // 组件文件无需再手写 import React（经典转换在构建期不报错、运行期才崩）
  esbuild: {
    jsx: "automatic",
  },
  build: {
    rollupOptions: {
      // 两个入口：访客站 index.html、后台 admin/index.html。
      // 后台代码不会进访客站 bundle，不影响首屏体积。
      input: {
        main: resolve(root, "index.html"),
        admin: resolve(root, "admin/index.html"),
      },
    },
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
