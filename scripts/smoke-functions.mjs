/**
 * Netlify Functions 回归测试（不联网）。
 *
 *   npm run test:functions
 *
 * 必须在项目根目录运行（content.json 按 cwd 读取）。
 * 只覆盖纯逻辑：JWT 签发校验、内容结构校验、未登录拦截。不碰 GitHub。
 */
import { readFile } from "node:fs/promises";
import { createToken, verifyToken } from "../netlify/lib/jwt.mjs";
import { validateSnapshot } from "../netlify/lib/guard.mjs";

const secret = "test-secret-abc";
let pass = 0;
let fail = 0;
function check(name, cond, extra = "") {
  if (cond) {
    pass += 1;
    console.log(`PASS  ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL  ${name} ${extra}`);
  }
}

const t = createToken(secret);
check("jwt 往返", verifyToken(t, secret) !== null);
check("jwt 篡改被拒", verifyToken(`${t}x`, secret) === null);
check("jwt 错密钥被拒", verifyToken(t, "other-secret") === null);
check("jwt 空值被拒", verifyToken(null, secret) === null);

const snap = JSON.parse(await readFile("src/data/content.json", "utf8"));
const errs = validateSnapshot(snap);
check("真实 content.json 校验通过", errs.length === 0, errs.join(";"));
for (const count of [0, 1, 2, 5, 7]) {
  check(`about ${count} 段校验通过`, validateSnapshot({ ...snap, about: Array.from({ length: count }, (_, i) => `第 ${i + 1} 段`) }).length === 0);
}
for (const about of [null, "不是数组", ["正文", 42]]) {
  check("about 非字符串数组被拦", validateSnapshot({ ...snap, about }).length > 0);
}
check("projects 缺 visible 被拦", validateSnapshot({ ...snap, projects: [{ title: "x" }] }).length > 0);
check("videos platform 非法被拦", validateSnapshot({ ...snap, videos: [{ title: "a", url: "u", platform: "qq" }] }).length > 0);

process.env.JWT_SECRET = "";
delete process.env.ADMIN_PASSWORD_SHA256;
delete process.env.GITHUB_TOKEN;

const auth = (await import("../netlify/functions/auth.mjs")).handler;
const r1 = await auth({ httpMethod: "POST", headers: { host: "localhost:8888" }, body: JSON.stringify({ password: "x" }) });
check("auth 未配置 -> 500 CONFIG", r1.statusCode === 500 && JSON.parse(r1.body).error.code === "CONFIG");

const content = (await import("../netlify/functions/content.mjs")).handler;
process.env.JWT_SECRET = secret;
const r2 = await content({ httpMethod: "GET", headers: { host: "localhost:8888" }, body: null });
check("content 未登录 -> 401", r2.statusCode === 401, `got ${r2.statusCode}`);

const files = (await import("../netlify/functions/files.mjs")).handler;
const r3 = await files({ httpMethod: "DELETE", headers: { host: "localhost:8888" }, queryStringParameters: {}, body: null });
check("files 未登录 -> 401", r3.statusCode === 401, `got ${r3.statusCode}`);

const deploy = (await import("../netlify/functions/deploy.mjs")).handler;
const r4 = await deploy({ httpMethod: "GET", headers: { host: "localhost:8888" }, body: null });
check("deploy 未登录 -> 401", r4.statusCode === 401, `got ${r4.statusCode}`);

const r5 = await auth({ httpMethod: "GET", headers: { host: "localhost:8888" }, body: null });
check("auth GET 返回未登录态", r5.statusCode === 200 && JSON.parse(r5.body).data.authenticated === false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
