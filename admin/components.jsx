/* 后台用的几个通用小组件，够用就行 */

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <span className="lbl">{label}</span>
      {children}
      {hint ? <span className="muted">{hint}</span> : null}
    </div>
  );
}

/** 一行一条的字符串列表编辑器 */
export function ListEditor({ label, value, onChange, hint, rows = 6 }) {
  const text = (value || []).join("\n");
  return (
    <div className="field" style={{ flexBasis: "100%" }}>
      <span className="lbl">{label}</span>
      <textarea
        rows={rows}
        value={text}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      />
      {hint ? <span className="muted">{hint}</span> : null}
    </div>
  );
}

/**
 * 对象数组编辑器（导航项、联系方式、外链…）
 * fields: [{ key, label, type: "text" | "check", placeholder }]
 */
export function RowEditor({ title, items, fields, onChange, newItem, addLabel = "新增一项" }) {
  const list = items || [];
  const setAt = (i, key, val) => {
    const next = list.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const move = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="item">
      <div className="item-head">
        <strong>{title}</strong>
        <button type="button" className="small" onClick={() => onChange([...list, { ...newItem }])}>
          {addLabel}
        </button>
      </div>

      {list.length === 0 && <p className="muted">（空）</p>}

      {list.map((it, i) => (
        <div className="row" key={i} style={{ alignItems: "flex-end" }}>
          {fields.map((f) =>
            f.type === "check" ? (
              <div className="field" key={f.key} style={{ flex: "0 0 auto", minWidth: 0 }}>
                <span className="lbl">{f.label}</span>
                <label className="check">
                  <input type="checkbox" checked={Boolean(it[f.key])} onChange={(e) => setAt(i, f.key, e.target.checked)} />
                  <span>是</span>
                </label>
              </div>
            ) : (
              <div className="field" key={f.key}>
                <span className="lbl">{f.label}</span>
                <input
                  type="text"
                  value={it[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setAt(i, f.key, e.target.value)}
                />
              </div>
            )
          )}
          <button type="button" className="small" onClick={() => move(i, -1)} disabled={i === 0}>
            ↑
          </button>
          <button type="button" className="small" onClick={() => move(i, 1)} disabled={i === list.length - 1}>
            ↓
          </button>
          <button type="button" className="small danger" onClick={() => remove(i)}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
