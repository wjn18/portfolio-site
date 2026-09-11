/**
 * 极简 JWT（HS256）。不引第三方依赖，用 node:crypto 自带 HMAC。
 * payload 里放 { sub: "admin", iat, exp }。
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "admin_session";
const DEFAULT_TTL = 7 * 24 * 60 * 60; // 7 天

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}

function b64urlJson(obj) {
  return b64url(JSON.stringify(obj));
}

function sign(data, secret) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createToken(secret, ttlSeconds = DEFAULT_TTL) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64urlJson({ alg: "HS256", typ: "JWT" });
  const payload = b64urlJson({ sub: "admin", iat: now, exp: now + ttlSeconds });
  const body = `${header}.${payload}`;
  return `${body}.${sign(body, secret)}`;
}

/** 校验通过返回 payload，任何异常（签名错/过期/格式错）都返回 null */
export function verifyToken(token, secret) {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expected = sign(`${header}.${payload}`, secret);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof claims.exp !== "number" || claims.exp * 1000 < Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

export function parseCookies(event) {
  const raw = event.headers?.cookie || event.headers?.Cookie || "";
  const out = {};
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function sessionCookie(token, secure) {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    secure ? "Secure" : "",
    `Max-Age=${DEFAULT_TTL}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearCookie(secure) {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    secure ? "Secure" : "",
    "Max-Age=0",
  ]
    .filter(Boolean)
    .join("; ");
}

export function isSecure(event) {
  const host = event.headers?.host || event.headers?.Host || "";
  const localhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  return !localhost;
}
