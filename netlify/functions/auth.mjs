/**
 * /api/auth
 *   GET    查询登录态
 *   POST   { password } 登录
 *   DELETE 退出
 *
 * 口令不存明文：环境变量 ADMIN_PASSWORD_SHA256 存 sha256 十六进制。
 * 生成方式：node -e "console.log(require('crypto').createHash('sha256').update('你的口令').digest('hex'))"
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { clientKey, fail, ok, rateLimited, readJson, netlifyHandler } from "../lib/guard.mjs";
import { clearCookie, createToken, isSecure, parseCookies, sessionCookie, verifyToken } from "../lib/jwt.mjs";

function hashPassword(plain) {
  return createHash("sha256").update(plain, "utf8").digest("hex");
}

function match(expectedHex, inputPlain) {
  if (!/^[0-9a-f]{64}$/i.test(expectedHex)) return false;
  const a = Buffer.from(expectedHex.toLowerCase(), "hex");
  const b = Buffer.from(hashPassword(inputPlain), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function handler(event) {
  const secure = isSecure(event);

  if (event.httpMethod === "GET") {
    const claims = verifyToken(parseCookies(event).admin_session, process.env.JWT_SECRET);
    return ok({ authenticated: Boolean(claims) });
  }

  if (event.httpMethod === "DELETE") {
    return ok({}, { "Set-Cookie": clearCookie(secure) });
  }

  if (event.httpMethod === "POST") {
    if (rateLimited(`login:${clientKey(event)}`)) {
      return fail(429, "RATE_LIMITED", "尝试过于频繁，请 1 分钟后再试");
    }

    const expected = process.env.ADMIN_PASSWORD_SHA256;
    if (!expected) return fail(500, "CONFIG", "ADMIN_PASSWORD_SHA256 未配置");
    if (!process.env.JWT_SECRET) return fail(500, "CONFIG", "JWT_SECRET 未配置");

    const body = await readJson(event);
    if (!body || typeof body.password !== "string") {
      return fail(400, "VALIDATION", "缺少 password");
    }
    if (!match(expected, body.password)) {
      return fail(401, "UNAUTHORIZED", "口令错误");
    }

    return ok({ authenticated: true }, { "Set-Cookie": sessionCookie(createToken(process.env.JWT_SECRET), secure) });
  }

  return fail(405, "METHOD_NOT_ALLOWED", `不支持 ${event.httpMethod}`);
}

export default netlifyHandler(handler);
