import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";
import DashboardPage from "./pages/DashboardPage.jsx";
import FilesPage from "./pages/FilesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import TextPage from "./pages/TextPage.jsx";
import VideosPage from "./pages/VideosPage.jsx";

const TABS = [
  { key: "", label: "概览", Comp: DashboardPage },
  { key: "text", label: "文本内容", Comp: TextPage },
  { key: "projects", label: "项目", Comp: ProjectsPage },
  { key: "videos", label: "视频链接", Comp: VideosPage },
  { key: "files", label: "文件", Comp: FilesPage },
];

function hashKey() {
  return (window.location.hash || "#/").replace(/^#\/?/, "").split("?")[0];
}

export default function App() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState(hashKey);
  const [snapshot, setSnapshot] = useState(null);
  const [sha, setSha] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    const onHash = () => setTab(hashKey());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const boot = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const s = await api.session();
      setAuthed(s.authenticated);
      if (s.authenticated) {
        const c = await api.getContent();
        setSnapshot(c.snapshot);
        setSha(c.sha);
        setDirty(false);
      }
    } catch (err) {
      if (err.status === 401) {
        setAuthed(false);
        setLoadError(err.message);
      } else {
        // 已登录但内容加载失败（如 GITHUB_TOKEN 未配置）：
        // 保持登录态进后台，把原因亮出来，而不是踢回登录页
        setAuthed(true);
        setContentError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  // 有未保存改动时拦一下，别手滑关掉标签页
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const update = useCallback((updater) => {
    setSnapshot((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setDirty(true);
  }, []);

  const save = useCallback(
    async (publish) => {
      setSaving(true);
      setMsg(null);
      try {
        const res = await api.saveContent(snapshot, sha, publish);
        setSnapshot(res.snapshot);
        setSha(res.sha);
        setDirty(false);
        setMsg({
          type: "ok",
          text: publish
            ? "已保存并触发构建，通常 1–2 分钟后线上生效"
            : "已保存到仓库，未触发构建（站点内容暂未更新）",
        });
      } catch (err) {
        if (err.code === "CONFLICT") {
          setMsg({ type: "error", text: `${err.message}（建议刷新页面重新载入）` });
        } else if (err.status === 401) {
          setAuthed(false);
          setMsg({ type: "error", text: "登录已过期，请重新登录" });
        } else {
          setMsg({ type: "error", text: err.message });
        }
      } finally {
        setSaving(false);
      }
    },
    [snapshot, sha]
  );

  // 文件页上传/删除后服务端已经提交过了，这里同步最新的 files 与 sha，且不算「未保存」
  const syncAfterFile = useCallback((res) => {
    setSnapshot((prev) => ({ ...prev, files: res.files }));
    setSha(res.sha);
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setAuthed(false);
    setSnapshot(null);
    setDirty(false);
    setContentError(null);
  }, []);

  if (loading) {
    return <div className="wrap muted">载入中…</div>;
  }

  if (!authed) {
    return <LoginPage onSuccess={boot} error={loadError} />;
  }

  const active = TABS.find((t) => t.key === tab) || TABS[0];
  const Page = active.Comp;

  return (
    <>
      <header className="topbar">
        <span className="brand">作品集后台</span>
        <nav>
          {TABS.map((t) => (
            <a
              key={t.key || "home"}
              href={`#/${t.key}`}
              className={t.key === active.key ? "is-active" : ""}
            >
              {t.label}
            </a>
          ))}
        </nav>
        <div className="actions">
          {dirty && (
            <span className="muted">
              <span className="dirty-dot" />
              有未保存改动
            </span>
          )}
          <button type="button" onClick={() => save(false)} disabled={!dirty || saving}>
            仅保存
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => save(true)}
            disabled={saving}
          >
            {saving ? "保存中…" : "保存并发布"}
          </button>
          <button type="button" onClick={logout}>
            退出
          </button>
        </div>
      </header>

      <div className="wrap">
        {msg && <div className={`banner ${msg.type === "error" ? "error" : "ok"}`}>{msg.text}</div>}
        {contentError && (
          <div className="banner error">
            内容加载失败：{contentError}
            {contentError.includes("GITHUB_TOKEN") &&
              " —— 在 .env（本地）或 Netlify 环境变量（线上）填入 PAT 后重试"}
          </div>
        )}
        {snapshot ? (
          <Page snapshot={snapshot} update={update} refresh={boot} syncAfterFile={syncAfterFile} />
        ) : (
          !contentError && <div className="muted">载入中…</div>
        )}
      </div>
    </>
  );
}
