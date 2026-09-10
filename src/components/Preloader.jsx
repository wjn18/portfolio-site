import { useEffect, useState } from "react";

const COUNT_FROM = 3;
const TICK_MS = 640;
const LEAVE_MS = 560;

/**
 * 3-2-1 倒计时加载页。
 * 结束后回调 onDone，由父级卸载并触发热场入场动画。
 * prefers-reduced-motion 时直接跳过。
 */
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(COUNT_FROM);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return undefined;
    }

    document.body.style.overflow = "hidden";
    let n = COUNT_FROM;

    const tick = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(tick);
        setLeaving(true);
        setTimeout(onDone, LEAVE_MS);
      } else {
        setCount(n);
      }
    }, TICK_MS);

    return () => {
      clearInterval(tick);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const progress = leaving ? 1 : (COUNT_FROM - count) / COUNT_FROM;

  return (
    <div
      className={`preloader${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-label="页面加载中"
    >
      <div className="preloader__box">
        <span key={count} className="preloader__count" aria-hidden="true">
          {count}
        </span>
        <span className="preloader__meta">Loading · Portfolio</span>
        <span
          className="preloader__bar"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
