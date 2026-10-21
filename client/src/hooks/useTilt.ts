/*
 * useTilt: 鼠标跟随的 3D 倾斜
 * 对齐 danica-garden 的亚克力卡片：rotateX 最大 ±13°、rotateY 最大 ±17°
 */
import { useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

export function useTilt(maxX = 13, maxY = 17) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const rotateX = useSpring(rx, { stiffness: 210, damping: 20, mass: 0.4 });
  const rotateY = useSpring(ry, { stiffness: 210, damping: 20, mass: 0.4 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(dx * maxY * 2);
    rx.set(-dy * maxX * 2);
  };

  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
