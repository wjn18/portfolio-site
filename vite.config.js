import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

/**
 * dev 下让 /admin 的行为对齐 Netlify 生产环境：
 * 生产上 Netlify 的 pretty URL 会把 /admin 301 重定向到 /admin/。
 * dev 若只做内部重写，浏览器地址仍是 /admin（无斜杠），
 * index.html 里的相对路径 ./main.jsx 会被浏览器解析成 /main.jsx（根目录）→ 404 白屏。
 */
function adminRewrite() {
  return {
    name: "dev-redirect-admin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/admin" || req.url.startsWith("/admin?")) {
          const q = req.url.indexOf("?");
          res.statusCode = 301;
          res.setHeader("Location", `/admin/${q >= 0 ? req.url.slice(q) : ""}`);
          res.end();
          return;
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
