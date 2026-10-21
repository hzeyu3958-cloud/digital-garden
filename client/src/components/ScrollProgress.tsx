/*
 * ScrollProgress: 顶部一根金色细线，指示整页滚动进度
 * 用弹簧平滑，避免 Lenis 高频更新带来的抖动
 */
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, oklch(0.596 0.145 163.225) 0%, oklch(0.700 0.130 85) 100%)",
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left opacity-70"
    />
  );
}
