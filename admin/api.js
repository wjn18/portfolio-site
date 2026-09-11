/** 后台 API 封装。统一解包 { ok, data, error }，失败抛带 code 的 Error。 */

async function request(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "same-origin",
    headers: {},
  };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`/api/${path}`, options);
  } catch {
    throw new Error("网络请求失败，检查网络或 Netlify Functions 是否正常运行");
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    throw new Error(`服务端返回了非 JSON 响应（HTTP ${res.status}）`);
  }

  if (!payload.ok) {
    const err = new Error(payload.error?.message || "请求失败");
    err.code = payload.error?.code;
    err.status = res.status;
    throw err;
  }
  return payload.data;
}

export const api = {
  session: () => request("auth"),
  login: (password) => request("auth", { method: "POST", body: { password } }),
  logout: () => request("auth", { method: "DELETE" }),
  getContent: () => request("content"),
  saveContent: (snapshot, baseSha, publish) =>
    request("content", { method: "PUT", body: { snapshot, baseSha, publish } }),
  uploadFile: (payload) => request("files", { method: "POST", body: payload }),
  deleteFile: (id) => request(`files?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
  deployStatus: () => request("deploy"),
};

/** 文件转 base64（不含 data URL 前缀） */
export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

export function formatSize(bytes) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function formatTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("zh-CN", { hour12: false });
}
