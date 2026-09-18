/**
 * 通用 HTTP 辅助 + 鉴权中间件 + 内容结构校验。
 */
import { parseCookies, verifyToken } from "./jwt.mjs";

export const CONTENT_PATH = "src/data/content.json";
export const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

/**
 * Netlify 的 ESM Functions 只接受 Response 对象，
 * 不接受旧的 { statusCode, headers, body } 结构（会报 "unsupported value"）。
 * 内部逻辑继续用结构化响应，导出时统一包一层。
 */
export function toResponse(r) {
  return new Response(r.body ?? "", { status: r.statusCode, headers: r.headers });
}

/**
 * Netlify 的 ESM Functions 走 v2 签名：传进来的是标准 Request，
 * 没有 v1 event 的 httpMethod / queryStringParameters / body 字段
 * （不适配的话 httpMethod 是 undefined，所有分支都走不到，登录直接 405）。
 * 这里统一转成 v1 event，同时兼容本来就是 v1 event 的调用（本地冒烟测试）。
 */
export function netlifyHandler(fn) {
  return async (req) => {
    let event;
    if (req && typeof req.httpMethod === "string") {
      event = req;
    } else {
      const url = new URL(req.url);
      const raw = req.method === "GET" || req.method === "HEAD" ? "" : await req.text();
      event = {
        httpMethod: req.method,
        headers: Object.fromEntries(req.headers.entries()),
        body: raw,
        isBase64Encoded: false,
        queryStringParameters: Object.fromEntries(url.searchParams.entries()),
      };
    }
    return toResponse(await fn(event));
  };
}

export function ok(data, extraHeaders = {}) {
  return {
    statusCode: 200,
    headers: { ...JSON_HEADERS, ...extraHeaders },
    body: JSON.stringify({ ok: true, data }),
  };
}

export function fail(status, code, message) {
  return {
    statusCode: status,
    headers: JSON_HEADERS,
    body: JSON.stringify({ ok: false, error: { code, message } }),
  };
}

const UNAUTHORIZED = () => fail(401, "UNAUTHORIZED", "未登录或登录已过期");

/** 校验通过返回 claims；否则返回 401 响应对象（注意返回的是响应，不是抛错） */
export function requireAuth(event) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return fail(500, "CONFIG", "JWT_SECRET 未配置");
  }
  const token = parseCookies(event).admin_session;
  const claims = verifyToken(token, secret);
  if (!claims) return UNAUTHORIZED();
  return claims;
}

export function isResponse(x) {
  return x && typeof x === "object" && typeof x.statusCode === "number";
}

export async function readJson(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body);
  } catch {
    return null;
  }
}

/** 简易内存限流。Function 实例间不共享，但对爆破后台已经够用。 */
const buckets = new Map();
export function rateLimited(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  return false;
}

export function clientKey(event) {
  const fwd = event.headers?.["x-forwarded-for"] || "";
  return (fwd.split(",")[0] || event.headers?.["client-ip"] || "unknown").trim();
}

const isArr = Array.isArray;
const isStr = (v) => typeof v === "string";

/**
 * 校验 content.json 结构。返回错误数组，空数组表示通过。
 * 只校验「缺了会让站点白屏」的部分，不做过度约束。
 */
export function validateSnapshot(s) {
  const errs = [];
  if (!s || typeof s !== "object") return ["内容不是对象"];

  const need = (field, pred, desc) => {
    if (!pred(s[field])) errs.push(`${field} ${desc}`);
  };

  need("profile", (v) => v && typeof v === "object", "缺失或不是对象");
  if (s.profile) {
    need2(s.profile, ["name", "role", "intro", "education"], errs, "profile");
    if (!isArr(s.profile.targets)) errs.push("profile.targets 必须是数组");
    if (!isArr(s.profile.highlights)) errs.push("profile.highlights 必须是数组");
  }
  need("actions", isArr, "必须是数组");
  need("nav", isArr, "必须是数组");
  need("spec", isArr, "必须是数组");
  need("about", (v) => isArr(v) && v.every(isStr), "必须是字符串数组");
  need("skills", isArr, "必须是数组");
  need("gameExperience", isArr, "必须是数组");
  need("contacts", isArr, "必须是数组");
  need("projects", isArr, "必须是数组");
  need("videos", isArr, "必须是数组");
  need("files", isArr, "必须是数组");

  let i = 0;
  for (const p of s.projects || []) {
    if (!isStr(p?.title) || !p.title) errs.push(`projects[${i}].title 缺失`);
    if (typeof p?.visible !== "boolean") errs.push(`projects[${i}].visible 必须是布尔值`);
    if (typeof p?.sort !== "number") errs.push(`projects[${i}].sort 必须是数字`);
    if (!isArr(p?.contributions)) errs.push(`projects[${i}].contributions 必须是数组`);
    if (!isArr(p?.links)) errs.push(`projects[${i}].links 必须是数组`);
    i += 1;
  }

  let j = 0;
  for (const v of s.videos || []) {
    if (!isStr(v?.title) || !v.title) errs.push(`videos[${j}].title 缺失`);
    if (!isStr(v?.url) || !v.url) errs.push(`videos[${j}].url 缺失`);
    if (!["bilibili", "youtube", "other"].includes(v?.platform)) {
      errs.push(`videos[${j}].platform 必须是 bilibili / youtube / other`);
    }
    j += 1;
  }

  return errs;
}

function need2(obj, fields, errs, prefix) {
  for (const f of fields) {
    if (!isStr(obj?.[f]) || !obj[f]) errs.push(`${prefix}.${f} 缺失`);
  }
}
