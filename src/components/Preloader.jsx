import { useEffect, useState } from "react";

/** 逐个浮现的文本 */
const TEXT = "Loading..";
/** 首个字符出现后，露首字母到第二个字的间隔 */
const BASE_MS = 350;
/** 每多一个字，间隔按此系数递减 → 出现速度逐步加快 */
const RATIO = 0.85;
/** 全部浮现后的停顿 */
const HOLD_MS = 340;
const LEAVE_MS = 560;

/**
 * 加载页：Loading.. 的字符逐个出现，且出现速度逐步加快。
 * 全部出现后短暂停留再淡出，回调 onDone 由父级卸载并触发首屏入场动画。
 * prefers-reduced-motion 时直接跳过。
 */
export default function Preloader({ onDone }) {
  const [shown, setShown] = useState(1);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return undefined;
    }

    document.body.style.overflow = "hidden";

    const timers = [];
    let elapsed = BASE_MS;

    // 第 2 个字符起逐个浮现，间隔按 RATIO 递减
    for (let i = 1; i < TEXT.length; i += 1) {
      timers.push(
        setTimeout(() => {
          setShown(i + 1);
        }, elapsed),
      );
      elapsed += BASE_MS * RATIO ** i;
    }

    timers.push(setTimeout(() => setLeaving(true), elapsed + HOLD_MS));
    timers.push(setTimeout(onDone, elapsed + HOLD_MS + LEAVE_MS));

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const progress = shown / TEXT.length;

  return (
    <div
      className={`preloader${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-label="页面加载中"
    >
      <div className="preloader__box">
        <span className="preloader__word" aria-hidden="true">
          {TEXT.split("")
            .slice(0, shown)
            .map((char, index) => (
              <span key={index} className="preloader__char">
                {char}
              </span>
            ))}
        </span>
        <span
          className="preloader__bar"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
