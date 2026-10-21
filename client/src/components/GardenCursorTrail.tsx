/*
 * GardenCursorTrail: 鼠标叶片轨迹
 * 对齐 danica-garden：移动累计 ≥88px 生成一枚叶片，最多 18 枚，1.45s 内淡出
 * 触屏与「减少动态效果」下自动关闭
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TrailLeaf {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  variant: number;
}

const MAX_LEAVES = 18;
const MIN_DISTANCE = 88;
const LIFE_MS = 1450;

const LEAF_PATHS = [
  "M20 2 C31 11 34 22 20 38 C6 22 9 11 20 2 Z",
  "M20 3 C33 13 30 26 20 37 C10 26 7 13 20 3 Z",
];

export default function GardenCursorTrail() {
  const [leaves, setLeaves] = useState<TrailLeaf[]>([]);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      const prev = lastPoint.current;
      if (!prev) {
        lastPoint.current = { x: e.clientX, y: e.clientY };
        return;
      }
      if (Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < MIN_DISTANCE) return;
      lastPoint.current = { x: e.clientX, y: e.clientY };

      const leaf: TrailLeaf = {
        id: (idRef.current += 1),
        x: e.clientX,
        y: e.clientY,
        rotate: Math.round(Math.random() * 360),
        size: 20 + Math.round(Math.random() * 16),
        variant: Math.random() > 0.5 ? 0 : 1,
      };

      setLeaves((prevLeaves) => [...prevLeaves, leaf].slice(-MAX_LEAVES));

      const timer = window.setTimeout(() => {
        setLeaves((prevLeaves) => prevLeaves.filter((item) => item.id !== leaf.id));
      }, LIFE_MS);
      timersRef.current.push(timer);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          style={{
            position: "fixed",
            left: leaf.x,
            top: leaf.y,
            transform: `translate(-50%, -50%) rotate(${leaf.rotate}deg)`,
          }}
        >
          <motion.svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 40 40"
            fill="none"
            initial={{ opacity: 0, scale: 0.18 }}
            animate={{
              opacity: [0, 1, 0.9, 0],
              scale: [0.18, 1, 0.82, 0.62],
            }}
            transition={{
              duration: LIFE_MS / 1000,
              times: [0, 0.28, 0.62, 1],
              ease: "easeOut",
            }}
          >
            <path
              d={LEAF_PATHS[leaf.variant]}
              fill="oklch(0.596 0.145 163.225 / 0.16)"
              stroke="oklch(0.432 0.120 163.225 / 0.5)"
              strokeWidth="1"
            />
            <path
              d="M20 7 L20 33 M20 16 L14 11 M20 16 L26 11 M20 24 L15 19 M20 24 L25 19"
              stroke="oklch(0.432 0.120 163.225 / 0.35)"
              strokeWidth="0.7"
            />
          </motion.svg>
        </div>
      ))}
    </div>
  );
}
