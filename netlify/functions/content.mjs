/**
 * /api/content
 *   GET 读取整份 content.json（顺带返回 sha 作为乐观锁凭据）
 *   PUT { snapshot, baseSha, publish } 全量覆盖保存
 *
 * publish=false 时 commit message 带 [skip netlify]，只入库不触发构建。
 */
import { ConfigError, UpstreamError, readFile, writeFile } from "../lib/github.mjs";
import { CONTENT_PATH, fail, isResponse, ok, readJson, requireAuth, validateSnapshot, netlifyHandler } from "../lib/guard.mjs";

export async function handler(event) {
  const auth = requireAuth(event);
  if (isResponse(auth)) return auth;

  if (event.httpMethod === "GET") {
    const cur = await readFile(CONTENT_PATH);
    if (!cur) return fail(404, "NOT_FOUND", `仓库里找不到 ${CONTENT_PATH}`);

    let snapshot;
    try {
      snapshot = JSON.parse(cur.text);
    } catch {
      return fail(502, "UPSTREAM", "content.json 不是合法 JSON，请到 GitHub 上手工修复");
    }
    return ok({ snapshot, sha: cur.sha });
  }

  if (event.httpMethod === "PUT") {
    const body = await readJson(event);
    if (!body) return fail(400, "VALIDATION", "请求体不是合法 JSON");

    const problems = validateSnapshot(body.snapshot);
    if (problems.length) return fail(422, "VALIDATION", problems.join("；"));

    const next = {
      ...body.snapshot,
      version: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: "admin",
    };
    const message = body.publish ? "content: 更新站点内容" : "content: 更新站点内容 [skip netlify]";

    try {
      const res = await writeFile(
        CONTENT_PATH,
        `${JSON.stringify(next, null, 2)}\n`,
        message,
        body.baseSha || null
      );
      return ok({ snapshot: next, sha: res.sha, commit: res.commit, published: Boolean(body.publish) });
    } catch (err) {
      if (err instanceof UpstreamError && err.status === 409) {
        return fail(409, "CONFLICT", "内容已被其他地方修改，请刷新页面后重新编辑");
      }
      if (err instanceof ConfigError) return fail(500, "CONFIG", err.message);
      return fail(502, "UPSTREAM", err.message);
    }
  }

  return fail(405, "METHOD_NOT_ALLOWED", `不支持 ${event.httpMethod}`);
}

export default netlifyHandler(handler);
