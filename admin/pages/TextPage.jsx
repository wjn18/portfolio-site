import { Field, ListEditor, RowEditor } from "../components.jsx";

const setProfile = (update, key) => (e) =>
  update((s) => ({ ...s, profile: { ...s.profile, [key]: e.target.value } }));

export default function TextPage({ snapshot, update }) {
  const p = snapshot.profile;
  const setTop = (key) => (val) => update((s) => ({ ...s, [key]: val }));

  return (
    <>
      <div className="card">
        <h2>基本信息</h2>
        <p className="hint">对应首屏与关于我区块。教育经历支持换行，两行分别是学校和时间。</p>

        <div className="row">
          <Field label="姓名">
            <input type="text" value={p.name} onChange={setProfile(update, "name")} />
          </Field>
          <Field label="英文副标题">
            <input type="text" value={p.englishTitle} onChange={setProfile(update, "englishTitle")} />
          </Field>
        </div>
        <div className="row">
          <Field label="岗位">
            <input type="text" value={p.role} onChange={setProfile(update, "role")} />
          </Field>
          <Field label="当前岗位">
            <input type="text" value={p.currentRole} onChange={setProfile(update, "currentRole")} />
          </Field>
        </div>

        <Field label="一句话简介">
          <textarea rows={4} value={p.intro} onChange={setProfile(update, "intro")} />
        </Field>
        <Field label="教育经历" hint="用换行分成两行：第一行学校，第二行时间">
          <textarea rows={2} value={p.education} onChange={setProfile(update, "education")} />
        </Field>

        <ListEditor
          label="求职方向标签"
          value={p.targets}
          onChange={(v) => update((s) => ({ ...s, profile: { ...s.profile, targets: v } }))}
          hint="一行一个"
          rows={5}
        />
        <ListEditor
          label="首屏要点"
          value={p.highlights}
          onChange={(v) => update((s) => ({ ...s, profile: { ...s.profile, highlights: v } }))}
          hint="一行一条"
          rows={5}
        />
      </div>

      <div className="card">
        <h2>首屏按钮</h2>
        <p className="hint">primary = 主按钮高亮；external = 新窗口打开；download = 触发下载。</p>
        <RowEditor
          title="按钮"
          items={snapshot.actions}
          onChange={setTop("actions")}
          newItem={{ label: "", href: "", primary: false, external: true, download: false }}
          fields={[
            { key: "label", label: "文案" },
            { key: "href", label: "链接", placeholder: "/resume.pdf" },
            { key: "primary", label: "主按钮", type: "check" },
            { key: "external", label: "新窗口", type: "check" },
            { key: "download", label: "下载", type: "check" },
          ]}
        />
      </div>

      <div className="card">
        <h2>顶栏导航</h2>
        <p className="hint">href 用锚点，例如 #works。</p>
        <RowEditor
          title="导航项"
          items={snapshot.nav}
          onChange={setTop("nav")}
          newItem={{ label: "", href: "#" }}
          fields={[
            { key: "label", label: "名称" },
            { key: "href", label: "锚点", placeholder: "#works" },
          ]}
        />
      </div>

      <div className="card">
        <h2>首屏数字</h2>
        <RowEditor
          title="数字格"
          items={snapshot.spec}
          onChange={setTop("spec")}
          newItem={{ value: "", label: "" }}
          fields={[
            { key: "value", label: "数值", placeholder: "01" },
            { key: "label", label: "说明" },
          ]}
        />
      </div>

      <div className="card">
        <h2>关于我</h2>
        <p className="hint">
          至少保留 5 段：第 1 段是自我介绍，最后 1 段是收尾语，中间是正文。顺序变了页面会串。
        </p>
        {snapshot.about.map((para, i) => (
          <div className="row" key={i} style={{ alignItems: "flex-start" }}>
            <div className="field" style={{ flexBasis: "100%" }}>
              <span className="lbl">第 {i + 1} 段</span>
              <textarea
                rows={3}
                value={para}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    about: s.about.map((x, idx) => (idx === i ? e.target.value : x)),
                  }))
                }
              />
            </div>
            <button
              type="button"
              className="small"
              disabled={i === 0}
              onClick={() =>
                update((s) => {
                  const next = [...s.about];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  return { ...s, about: next };
                })
              }
            >
              ↑
            </button>
            <button
              type="button"
              className="small"
              disabled={i === snapshot.about.length - 1}
              onClick={() =>
                update((s) => {
                  const next = [...s.about];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  return { ...s, about: next };
                })
              }
            >
              ↓
            </button>
            <button
              type="button"
              className="small danger"
              onClick={() =>
                update((s) => ({
                  ...s,
                  about: s.about.filter((_, idx) => idx !== i),
                }))
              }
            >
              删除
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update((s) => ({ ...s, about: [...s.about, ""] }))}
        >
          添加段落
        </button>
      </div>

      <div className="card">
        <h2>能力标签</h2>
        <p className="hint">分组标题 + 一行一条的能力描述。</p>
        {snapshot.skills.map((g, gi) => (
          <div className="item" key={gi}>
            <div className="item-head">
              <strong>第 {gi + 1} 组</strong>
              <button
                type="button"
                className="small danger"
                onClick={() =>
                  update((s) => ({ ...s, skills: s.skills.filter((_, i) => i !== gi) }))
                }
              >
                删除本组
              </button>
            </div>
            <Field label="分组标题">
              <input
                type="text"
                value={g.title}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    skills: s.skills.map((x, i) => (i === gi ? { ...x, title: e.target.value } : x)),
                  }))
                }
              />
            </Field>
            <ListEditor
              label="能力条目"
              value={g.items}
              rows={5}
              onChange={(v) =>
                update((s) => ({
                  ...s,
                  skills: s.skills.map((x, i) => (i === gi ? { ...x, items: v } : x)),
                }))
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update((s) => ({ ...s, skills: [...s.skills, { title: "新分组", items: [] }] }))
          }
        >
          添加分组
        </button>
      </div>

      <div className="card">
        <h2>游戏经历</h2>
        <ListEditor
          label="一行一条"
          value={snapshot.gameExperience}
          rows={10}
          onChange={setTop("gameExperience")}
        />
      </div>

      <div className="card">
        <h2>联系方式</h2>
        <p className="hint">href 留空就纯文本显示（比如微信号）。邮箱填 mailto:，电话填 tel:。</p>
        <RowEditor
          title="联系方式"
          items={snapshot.contacts}
          onChange={setTop("contacts")}
          newItem={{ label: "", value: "", href: "" }}
          fields={[
            { key: "label", label: "名称", placeholder: "邮箱" },
            { key: "value", label: "显示值" },
            { key: "href", label: "链接", placeholder: "mailto:xxx" },
          ]}
        />
      </div>
    </>
  );
}
