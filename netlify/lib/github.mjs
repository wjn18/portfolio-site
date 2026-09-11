/**
 * GitHub Contents API 封装。
 * 只做两件事：读仓库里的文本文件、写回文本文件（带 sha 防冲突）。
 *
 * 依赖的环境变量：
 *   GITHUB_TOKEN   fine-grained PAT，限定本仓库 Contents: read+write
 *   GITHUB_REPO    默认 wjn18/portfolio-site
 *   GITHUB_BRANCH  默认 main
 */
const API = "https://api.github.com";
const MAX_BYTES = 2 * 1024 * 1024; // 2MB，超出 Contents API 建议值

export class UpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "UpstreamError";
    this.status = status;
  }
}

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigError";
  }
}

function cfg() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new ConfigError("GITHUB_TOKEN 未配置");
  return {
    token,
    repo: process.env.GITHUB_REPO || "wjn18/portfolio-site",
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

/** 路径按段编码，保留 "/" 分隔符（整体 encodeURIComponent 会把 / 变成 %2F，GitHub 不认） */
function encodePath(p) {
  return p
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-admin",
  };
}

/** 读文件，不存在返回 null */
export async function readFile(path) {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${encodePath(path)}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token) });

  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new UpstreamError(`读取 ${path} 失败：GitHub ${res.status} ${detail.slice(0, 200)}`, res.status);
  }

  const json = await res.json();
  if (json.type !== "file") throw new UpstreamError(`${path} 不是文件`, 422);
  return {
    sha: json.sha,
    text: Buffer.from(json.content || "", "base64").toString("utf8"),
  };
}

/**
 * 写文件。
 * @param path    仓库内相对路径
 * @param text    文件内容（utf8）
 * @param message commit message
 * @param sha     已知的文件 sha；传 null 表示新建。sha 过旧 → 抛 409
 */
export async function writeFile(path, text, message, sha) {
  const { token, repo, branch } = cfg();
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > MAX_BYTES) {
    throw new UpstreamError(`文件超过 2MB 上限（实际 ${bytes} 字节）`, 422);
  }

  const body = {
    message,
    content: Buffer.from(text, "utf8").toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${API}/repos/${repo}/contents/${encodePath(path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new UpstreamError(`写入 ${path} 失败：GitHub ${res.status} ${detail.slice(0, 200)}`, res.status);
  }

  const json = await res.json();
  return { sha: json.content?.sha || null, commit: json.commit?.sha || null };
}

/** 写二进制文件，content 直接就是 base64 字符串（上传文件用） */
export async function writeBase64(path, contentBase64, message, sha) {
  const { token, repo, branch } = cfg();
  const bytes = Math.floor((contentBase64.length * 3) / 4);
  if (bytes > MAX_BYTES) {
    throw new UpstreamError(`文件超过 2MB 上限（实际约 ${bytes} 字节）`, 422);
  }

  const body = { message, content: contentBase64, branch };
  if (sha) body.sha = sha;

  const res = await fetch(`${API}/repos/${repo}/contents/${encodePath(path)}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new UpstreamError(`写入 ${path} 失败：GitHub ${res.status} ${detail.slice(0, 200)}`, res.status);
  }

  const json = await res.json();
  return { sha: json.content?.sha || null, commit: json.commit?.sha || null };
}

/** 删除文件 */
export async function deleteFile(path, message, sha) {
  const { token, repo, branch } = cfg();
  const res = await fetch(`${API}/repos/${repo}/contents/${encodePath(path)}`, {
    method: "DELETE",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new UpstreamError(`删除 ${path} 失败：GitHub ${res.status} ${detail.slice(0, 200)}`, res.status);
  }
  return true;
}
