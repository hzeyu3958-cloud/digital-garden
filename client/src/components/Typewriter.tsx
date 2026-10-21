/*
 * Typewriter: 逐字打字机效果
 * 参考 danica-garden 的 TextType —— 每个字随机 85%–135% 速度，可带光标
 */
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  initialDelay?: number;
  className?: string;
  style?: CSSProperties;
  showCursor?: boolean;
  /** 为 false 时停在空白，等外部放行（如开场门关闭后） */
  active?: boolean;
  onDone?: () => void;
}

export default function Typewriter({
  text,
  speed = 95,
  initialDelay = 400,
  className = "",
  style,
  showCursor = true,
  active = true,
  onDone,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setCount(0);
    doneRef.current = false;

    if (!active) return;

    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const tick = () => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
        return;
      }
      timer = setTimeout(tick, speed * (0.85 + Math.random() * 0.5));
    };

    timer = setTimeout(tick, initialDelay);
    return () => clearTimeout(timer);
  }, [text, speed, initialDelay, active]);

  return (
    <span className={className} style={style}>
      {text.slice(0, count)}
      {showCursor && count < text.length && (
        <span className="tw-cursor" aria-hidden="true">
          |
        </span>
      )}
    </span>
  );
}
