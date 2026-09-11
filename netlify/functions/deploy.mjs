/**
 * /api/deploy
 *   GET 查询最近一次 Netlify 部署状态
 *
 * 依赖可选环境变量：NETLIFY_TOKEN、NETLIFY_SITE_ID。
 * 没配就返回 { configured: false }，后台显示「未配置」而不是报错。
 */
import { fail, isResponse, ok, requireAuth, netlifyHandler } from "../lib/guard.mjs";

export async function handler(event) {
  const auth = requireAuth(event);
  if (isResponse(auth)) return auth;

  if (event.httpMethod !== "GET") {
    return fail(405, "METHOD_NOT_ALLOWED", `不支持 ${event.httpMethod}`);
  }

  const token = process.env.NETLIFY_TOKEN;
  const site = process.env.NETLIFY_SITE_ID;
  if (!token || !site) {
    return ok({ configured: false });
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${site}/deploys?per_page=1`, {
      headers: { Authorization: `Bearer ${token}`, "User-Agent": "portfolio-admin" },
    });
    if (!res.ok) {
      return fail(502, "UPSTREAM", `Netlify API ${res.status}`);
    }
    const list = await res.json();
    const d = list[0];
    if (!d) return ok({ configured: true, deploy: null });

    return ok({
      configured: true,
      deploy: {
        state: d.state,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        branch: d.branch,
        url: d.ssl_url || d.url,
        errorMessage: d.error_message || null,
      },
    });
  } catch (err) {
    return fail(502, "UPSTREAM", err.message);
  }
}

export default netlifyHandler(handler);
