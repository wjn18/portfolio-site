import { newId } from "../components.jsx";
import { ListEditor } from "../components.jsx";

/** links 在 textarea 里用 "标签 | 链接" 一行一条表示 */
function linksToText(links) {
  return (links || []).map((l) => (l.href ? `${l.label} | ${l.href}` : l.label)).join("\n");
}

function textToLinks(text) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|");
      return { label: (label || "").trim(), href: (href || "").trim() };
    });
}

export default function ProjectsPage({ snapshot, update }) {
  const list = snapshot.projects || [];

  const setField = (i, key, val) =>
    update((s) => ({
      ...s,
      projects: s.projects.map((p, idx) => (idx === i ? { ...p, [key]: val } : p)),
    }));

  const move = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    update((s) => {
      const next = [...s.projects];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...s, projects: next.map((p, idx) => ({ ...p, sort: idx })) };
    });
  };

  const remove = (i) =>
    update((s) => ({
      ...s,
      projects: s.projects
        .filter((_, idx) => idx !== i)
        .map((p, idx) => ({ ...p, sort: idx })),
    }));

  const add = () =>
    update((s) => ({
      ...s,
      projects: [
        ...s.projects,
        {
          id: newId(),
          title: "新项目",
          subtitle: "",
          period: "",
          type: "Unity Project",
          role: "独立完成",
          summary: "",
          contributions: [],
          links: [],
          sort: s.projects.length,
          visible: false,
        },
      ],
    }));

  return (
    <>
      <div className="card">
        <h2>项目</h2>
        <p className="hint">
          新项目默认「不显示」，填完内容后记得勾上显示。排序用 ↑ ↓，保存时自动重写 sort。
        </p>
        <button type="button" className="primary" onClick={add}>
          添加项目
        </button>
      </div>

      {list.map((p, i) => (
        <div className="card" key={p.id || i}>
          <div className="item-head">
            <strong>
              {i + 1}. {p.title || "（未命名）"}
            </strong>
            <span>
              <label className="check" style={{ marginRight: 12 }}>
                <input
                  type="checkbox"
                  checked={Boolean(p.visible)}
                  onChange={(e) => setField(i, "visible", e.target.checked)}
                />
                <span>显示</span>
              </label>
              <button type="button" className="small" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </button>
              <button
                type="button"
                className="small"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
              >
                ↓
              </button>
              <button type="button" className="small danger" onClick={() => remove(i)}>
                删除
              </button>
            </span>
          </div>

          <div className="grid-2">
            <div className="field">
              <span className="lbl">标题</span>
              <input type="text" value={p.title} onChange={(e) => setField(i, "title", e.target.value)} />
            </div>
            <div className="field">
              <span className="lbl">副标题</span>
              <input type="text" value={p.subtitle || ""} onChange={(e) => setField(i, "subtitle", e.target.value)} />
            </div>
            <div className="field">
              <span className="lbl">时间</span>
              <input type="text" value={p.period || ""} onChange={(e) => setField(i, "period", e.target.value)} />
            </div>
            <div className="field">
              <span className="lbl">类型</span>
              <input type="text" value={p.type || ""} onChange={(e) => setField(i, "type", e.target.value)} />
            </div>
            <div className="field">
              <span className="lbl">角色</span>
              <input type="text" value={p.role || ""} onChange={(e) => setField(i, "role", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <span className="lbl">简介</span>
            <textarea rows={4} value={p.summary || ""} onChange={(e) => setField(i, "summary", e.target.value)} />
          </div>

          <ListEditor
            label="主要贡献"
            value={p.contributions}
            rows={5}
            hint="一行一条"
            onChange={(v) => setField(i, "contributions", v)}
          />

          <div className="field">
            <span className="lbl">外链</span>
            <textarea
              rows={3}
              value={linksToText(p.links)}
              placeholder={"GitHub | https://github.com/..."}
              onChange={(e) => setField(i, "links", textToLinks(e.target.value))}
            />
            <span className="muted">一行一条，格式：标签 | 链接</span>
          </div>
        </div>
      ))}
    </>
  );
}
