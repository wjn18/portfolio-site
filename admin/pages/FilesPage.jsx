import { useState } from "react";
import { api, formatSize, formatTime, toBase64 } from "../api.js";
import { Field } from "../components.jsx";

const KINDS = [
  { value: "resume", label: "简历 PDF（覆盖 /resume.pdf）" },
  { value: "doc", label: "文档（存到 /docs/）" },
  { value: "cover", label: "封面图（存到 /covers/）" },
];

export default function FilesPage({ snapshot, syncAfterFile }) {
  const [kind, setKind] = useState("resume");
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const upload = async () => {
    if (!file) {
      setMsg({ type: "error", text: "先选一个文件" });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const contentBase64 = await toBase64(file);
      const res = await api.uploadFile({
        kind,
        label: label || file.name,
        filename: file.name,
        mime: file.type,
        contentBase64,
      });
      syncAfterFile(res);
      setMsg({ type: "ok", text: `已上传到 ${res.file.publicPath}，保存后生效` });
      setFile(null);
      setLabel("");
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (f) => {
    if (!window.confirm(`确定删除「${f.label}」？仓库里的 ${f.publicPath} 会一并删除。`)) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await api.deleteFile(f.id);
      syncAfterFile(res);
      setMsg({ type: "ok", text: "已删除" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const files = snapshot.files || [];

  return (
    <>
      <div className="card">
        <h2>上传文件</h2>
        <p className="hint">
          单个文件上限 2MB。上传会立刻写回 GitHub 并触发构建，不用再点保存。
          简历只能有一份，重复上传会覆盖 /resume.pdf。
        </p>
        {msg && <div className={`banner ${msg.type === "error" ? "error" : "ok"}`}>{msg.text}</div>}

        <div className="row">
          <Field label="类型">
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="显示名" hint="列表里显示的名字，留空用文件名">
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
        </div>

        <div className="uploader">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ maxWidth: 420, margin: "0 auto" }}
          />
          <p className="muted" style={{ marginBottom: 0 }}>
            {file ? `已选择：${file.name}（${formatSize(file.size)}）` : "尚未选择文件"}
          </p>
        </div>

        <div className="row" style={{ marginTop: 12, marginBottom: 0 }}>
          <button type="button" className="primary" onClick={upload} disabled={busy || !file}>
            {busy ? "上传中…" : "上传"}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>已上传文件</h2>
        <p className="hint">文件改动不需要再点保存，上传/删除时已经提交过了。</p>
        {files.length === 0 ? (
          <p className="muted">（空）</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>显示名</th>
                <th>路径</th>
                <th>大小</th>
                <th>更新时间</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id}>
                  <td>{f.label}</td>
                  <td>
                    <a href={f.publicPath} target="_blank" rel="noreferrer">
                      {f.publicPath}
                    </a>
                  </td>
                  <td>{formatSize(f.size)}</td>
                  <td>{formatTime(f.updatedAt)}</td>
                  <td>
                    <button type="button" className="small danger" onClick={() => remove(f)} disabled={busy}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
