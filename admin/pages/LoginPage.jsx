import { useState } from "react";
import { api } from "../api.js";

export default function LoginPage({ onSuccess, error }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(error || null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await api.login(password);
      await onSuccess();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap">
      <div className="card login-box">
        <h2>作品集后台</h2>
        <p className="hint">输入管理口令以继续</p>
        {err && <div className="banner error">{err}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="pw">管理口令</label>
            <input
              id="pw"
              type="password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="primary" disabled={busy || !password}>
            {busy ? "登录中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
