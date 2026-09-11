import { useCallback, useEffect, useState } from "react";
import { api, formatTime } from "../api.js";

const STATE_TEXT = {
  building: "构建中",
  processing: "处理中",
  uploading: "上传中",
  ready: "已上线",
  error: "失败",
  canceled: "已取消",
  enqueued: "排队中",
  new: "新提交",
};

export default function DashboardPage({ snapshot }) {
  const [deploy, setDeploy] = useState(null);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    try {
      const d = await api.deployStatus();
      setDeploy(d);
      setErr(null);
    } catch (e) {
      setErr(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="card">
        <h2>内容状态</h2>
        <p className="hint">内容是全量覆盖保存的，改完记得点右上角的「保存并发布」。</p>
        <table>
          <tbody>
            <tr>
              <th style={{ width: 160 }}>最后更新时间</th>
              <td>{formatTime(snapshot?.updatedAt)}</td>
            </tr>
            <tr>
              <th>更新者</th>
              <td>{snapshot?.updatedBy || "-"}</td>
            </tr>
            <tr>
              <th>项目数</th>
              <td>
                {snapshot?.projects?.length || 0}（显示 {snapshot?.projects?.filter((p) => p.visible).length || 0}）
              </td>
            </tr>
            <tr>
              <th>视频数</th>
              <td>
                {snapshot?.videos?.length || 0}（显示 {snapshot?.videos?.filter((v) => v.visible).length || 0}）
              </td>
            </tr>
            <tr>
              <th>文件数</th>
              <td>{snapshot?.files?.length || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>部署状态</h2>
        <p className="hint">
          {deploy && !deploy.configured
            ? "未配置 NETLIFY_TOKEN / NETLIFY_SITE_ID，查不到部署状态。内容保存仍然生效。"
            : "显示 Netlify 最近一次部署。"}
        </p>
        {err && <div className="banner error">{err}</div>}
        {deploy?.configured && deploy.deploy && (
          <table>
            <tbody>
              <tr>
                <th style={{ width: 160 }}>状态</th>
                <td>{STATE_TEXT[deploy.deploy.state] || deploy.deploy.state}</td>
              </tr>
              <tr>
                <th>分支</th>
                <td>{deploy.deploy.branch || "-"}</td>
              </tr>
              <tr>
                <th>开始时间</th>
                <td>{formatTime(deploy.deploy.createdAt)}</td>
              </tr>
              <tr>
                <th>站点地址</th>
                <td>
                  <a href={deploy.deploy.url} target="_blank" rel="noreferrer">
                    {deploy.deploy.url}
                  </a>
                </td>
              </tr>
              {deploy.deploy.errorMessage && (
                <tr>
                  <th>错误信息</th>
                  <td>{deploy.deploy.errorMessage}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="row" style={{ marginTop: 12, marginBottom: 0 }}>
          <button type="button" onClick={load}>
            刷新
          </button>
        </div>
      </div>

      <div className="card">
        <h2>两个保存按钮的区别</h2>
        <ul className="muted" style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>仅保存</strong>：写回 GitHub 仓库，但 commit 带 <code>[skip netlify]</code>，
            不触发构建，线上内容不变。适合一次改好几处、最后统一发布。
          </li>
          <li>
            <strong>保存并发布</strong>：写回仓库并触发 Netlify 构建，通常 1–2 分钟后线上生效。
          </li>
          <li>每次保存都是一次 Git commit，改错了可以到 GitHub 上 revert。</li>
        </ul>
      </div>
    </>
  );
}
