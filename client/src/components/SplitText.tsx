/*
 * SplitText: 逐字 3D 翻入
 * 参考 danica-garden 的 GSAP SplitText：y 52 / rotateX -68 / z -36，逐字 85ms
 * 不依赖 GSAP，用 framer-motion 实现同样的观感
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  charDelay?: number;
  /** 为 false 时保持不可见，等进入视口/开场门结束后再放行 */
  active?: boolean;
  /** 父级用渐变文字时打开，字符自带一份渐变，避免被父级 text-fill 变透明 */
  gradient?: boolean;
  onDone?: () => void;
}

const GRADIENT_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, oklch(0.432 0.120 163.225) 0%, oklch(0.596 0.145 163.225) 55%, oklch(0.700 0.130 85) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export default function SplitText({
  text,
  className = "",
  style,
  delay = 0,
  charDelay = 0.085,
  active = true,
  gradient = false,
  onDone,
}: SplitTextProps) {
  const chars = Array.from(text);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!active) return;
    const total = (delay + chars.length * charDelay + 0.9) * 1000;
    const timer = setTimeout(() => onDoneRef.current?.(), total);
    return () => clearTimeout(timer);
  }, [active, delay, charDelay, chars.length]);

  return (
    <span
      className={className}
      style={{ ...style, perspective: 800 }}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: 52, rotateX: -68, z: -36 }}
          animate={active ? { opacity: 1, y: 0, rotateX: 0, z: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: delay + i * charDelay,
            ease: [0.2, 1.4, 0.4, 1],
          }}
          style={{
            transformStyle: "preserve-3d",
            ...(gradient ? GRADIENT_STYLE : null),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
