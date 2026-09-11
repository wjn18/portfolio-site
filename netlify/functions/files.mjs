/**
 * /api/files
 *   POST   { kind, label, filename, contentBase64 } 上传并登记
 *   DELETE ?id=xxx                                  删除文件并移出 files[]
 *
 * publicPath 由后端按 kind 生成，不接受前端指定，避免任意路径写入。
 * 文件改动必然要重建才生效，所以这里一律不带 [skip netlify]。
 */
import { randomUUID } from "node:crypto";
import { ConfigError, UpstreamError, deleteFile, readFile, writeBase64, writeFile } from "../lib/github.mjs";
import { CONTENT_PATH, fail, isResponse, ok, readJson, requireAuth, netlifyHandler } from "../lib/guard.mjs";

const MAX_BASE64 = 3 * 1024 * 1024;

const PATHS = {
  resume: () => "/resume.pdf",
  doc: (name) => `/docs/${name}`,
  cover: (name) => `/covers/${name}`,
};

function safeName(name) {
  return String(name || "")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 120);
}

async function loadContent() {
  const cur = await readFile(CONTENT_PATH);
  if (!cur) throw new UpstreamError(`仓库里找不到 ${CONTENT_PATH}`, 404);
  return { snapshot: JSON.parse(cur.text), sha: cur.sha };
}

function toRepoPath(publicPath) {
  return `public${publicPath}`;
}

export async function handler(event) {
  const auth = requireAuth(event);
  if (isResponse(auth)) return auth;

  if (event.httpMethod === "POST") {
    const body = await readJson(event);
    if (!body) return fail(400, "VALIDATION", "请求体不是合法 JSON");

    const kind = body.kind;
    if (!PATHS[kind]) return fail(422, "VALIDATION", "kind 必须是 resume / doc / cover");

    if (typeof body.contentBase64 !== "string" || !body.contentBase64) {
      return fail(422, "VALIDATION", "缺少文件内容");
    }
    if (body.contentBase64.length > MAX_BASE64) {
      return fail(422, "VALIDATION", "文件超过 2MB 上限");
    }

    const name = safeName(body.filename) || "file";
    const publicPath = PATHS[kind](name);
    const repoPath = toRepoPath(publicPath);

    try {
      const existing = await readFile(repoPath);
      await writeBase64(
        repoPath,
        body.contentBase64,
        `files: 更新 ${publicPath}`,
        existing?.sha || null
      );

      const { snapshot, sha } = await loadContent();
      const size = Math.floor((body.contentBase64.length * 3) / 4);
      const now = new Date().toISOString();
      const record = {
        id: randomUUID(),
        kind,
        label: body.label || name,
        filename: name,
        publicPath,
        size,
        mime: body.mime || "application/octet-stream",
        updatedAt: now,
      };

      const files = (snapshot.files || []).filter((f) => f.publicPath !== publicPath);
      files.push(record);
      const next = {
        ...snapshot,
        files,
        updatedAt: now,
        updatedBy: "admin",
      };

      const res = await writeFile(
        CONTENT_PATH,
        `${JSON.stringify(next, null, 2)}\n`,
        `files: 登记 ${publicPath}`,
        sha
      );

      return ok({ file: record, files, sha: res.sha });
    } catch (err) {
      if (err instanceof UpstreamError && err.status === 409) {
        return fail(409, "CONFLICT", "内容已被其他地方修改，请刷新页面后重试");
      }
      if (err instanceof ConfigError) return fail(500, "CONFIG", err.message);
      return fail(502, "UPSTREAM", err.message);
    }
  }

  if (event.httpMethod === "DELETE") {
    const id = event.queryStringParameters?.id;
    if (!id) return fail(422, "VALIDATION", "缺少 id");

    try {
      const { snapshot, sha } = await loadContent();
      const target = (snapshot.files || []).find((f) => f.id === id);
      if (!target) return fail(404, "NOT_FOUND", "找不到该文件");

      const repoPath = toRepoPath(target.publicPath);
      const existing = await readFile(repoPath);
      if (existing) {
        await deleteFile(repoPath, `files: 删除 ${target.publicPath}`, existing.sha);
      }

      const files = snapshot.files.filter((f) => f.id !== id);
      const next = { ...snapshot, files, updatedAt: new Date().toISOString(), updatedBy: "admin" };
      const res = await writeFile(
        CONTENT_PATH,
        `${JSON.stringify(next, null, 2)}\n`,
        `files: 移除 ${target.publicPath}`,
        sha
      );

      return ok({ files, sha: res.sha });
    } catch (err) {
      if (err instanceof ConfigError) return fail(500, "CONFIG", err.message);
      return fail(502, "UPSTREAM", err.message);
    }
  }

  return fail(405, "METHOD_NOT_ALLOWED", `不支持 ${event.httpMethod}`);
}

export default netlifyHandler(handler);
