import { ListEditor, newId } from "../components.jsx";

const PLATFORMS = [
  { value: "bilibili", label: "哔哩哔哩" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "其他" },
];

export default function VideosPage({ snapshot, update }) {
  const list = snapshot.videos || [];

  const setField = (i, key, val) =>
    update((s) => ({
      ...s,
      videos: s.videos.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)),
    }));

  const move = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    update((s) => {
      const next = [...s.videos];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...s, videos: next.map((v, idx) => ({ ...v, sort: idx })) };
    });
  };

  const remove = (i) =>
    update((s) => ({
      ...s,
      videos: s.videos.filter((_, idx) => idx !== i).map((v, idx) => ({ ...v, sort: idx })),
    }));

  const add = () =>
    update((s) => ({
      ...s,
      videos: [
        ...s.videos,
        {
          id: newId(),
          title: "新视频",
          description: "",
          url: "",
          cover: "",
          platform: "bilibili",
          tags: [],
          sort: s.videos.length,
          visible: true,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

  return (
    <>
      <div className="card">
        <h2>视频链接</h2>
        <p className="hint">
          只存链接，不上传视频文件。封面图可以先在「文件」页上传，再把地址填到封面栏。
        </p>
        <button type="button" className="primary" onClick={add}>
          添加视频
        </button>
      </div>

      {list.length === 0 && <div className="card muted">还没有视频。点上面的按钮添加。</div>}

      {list.map((v, i) => (
        <div className="card" key={v.id || i}>
          <div className="item-head">
            <strong>
              {i + 1}. {v.title || "（未命名）"}
            </strong>
            <span>
              <label className="check" style={{ marginRight: 12 }}>
                <input
                  type="checkbox"
                  checked={Boolean(v.visible)}
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
              <input type="text" value={v.title} onChange={(e) => setField(i, "title", e.target.value)} />
            </div>
            <div className="field">
              <span className="lbl">平台</span>
              <select value={v.platform} onChange={(e) => setField(i, "platform", e.target.value)}>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <span className="lbl">视频链接</span>
            <input
              type="text"
              placeholder="https://www.bilibili.com/video/BV..."
              value={v.url}
              onChange={(e) => setField(i, "url", e.target.value)}
            />
          </div>

          <div className="field">
            <span className="lbl">一句话描述</span>
            <input type="text" value={v.description || ""} onChange={(e) => setField(i, "description", e.target.value)} />
          </div>

          <div className="field">
            <span className="lbl">封面图地址</span>
            <input
              type="text"
              placeholder="/covers/xxx.webp"
              value={v.cover || ""}
              onChange={(e) => setField(i, "cover", e.target.value)}
            />
          </div>

          <ListEditor
            label="标签"
            value={v.tags}
            rows={3}
            hint="一行一个，用于筛选"
            onChange={(val) => setField(i, "tags", val)}
          />
        </div>
      ))}
    </>
  );
}
