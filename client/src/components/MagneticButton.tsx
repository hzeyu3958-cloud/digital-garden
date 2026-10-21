/*
 * MagneticButton: 磁吸热区
 * ------------------------------------------------------------------
 * 包住任意按钮或链接（内部元素保留自己的 a/button 语义），光标进入外扩热区后
 * 整个元素被朝光标方向“吸”过去一点点，离开时弹性回位。
 * 内层再额外多走 40%，于是按钮有了厚度。
 * 触屏不跟（pointerType === "touch"），避免点一下就粘在某个方向。
 */
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  /** 位移系数，0.3 表示光标偏移 100px 时按钮走 30px */
  strength?: number;
  /** 位移上限（px） */
  max?: number;
  /** 热区外扩，默认四周各 12px */
  hitClassName?: string;
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.3,
  max = 20,
  hitClassName = "p-3 -m-3",
  className = "",
}: MagneticButtonProps) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  /* 弹性参数：够软但不拖泥带水，回位时有一下轻微过冲 */
  const spring = { stiffness: 180, damping: 15, mass: 0.45 };
  const x = useSpring(px, spring);
  const y = useSpring(py, spring);
  /* 内层再走远一点，做出厚度 */
  const innerX = useTransform(x, (v) => v * 0.4);
  const innerY = useTransform(y, (v) => v * 0.4);

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  const handleMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === "touch") return;
    const box = e.currentTarget.getBoundingClientRect();
    if (!box.width || !box.height) return;
    px.set(clamp((e.clientX - (box.left + box.width / 2)) * strength));
    py.set(clamp((e.clientY - (box.top + box.height / 2)) * strength * 1.1));
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.span
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform ${hitClassName} ${className}`}
    >
      <motion.span
        style={{ x: innerX, y: innerY }}
        className="inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
