/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * AnimatedCard: Premium card with 3D hover, gradient accent, and stagger animation
 */
import { motion } from "framer-motion";
import { useTilt } from "../hooks/useTilt";
import { sfx } from "../lib/gardenAudio";

interface AnimatedCardProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  inView?: boolean;
}

export default function AnimatedCard({
  index,
  children,
  className = "",
  inView = true,
}: AnimatedCardProps) {
  /* 鼠标跟随倾斜：原站亚克力卡片的手感 */
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      onPointerEnter={() => sfx.hover()}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative bg-card border border-border/60 rounded-sm overflow-hidden
        shadow-[0_2px_8px_oklch(0.265_0.014_88/0.06)]
        hover:shadow-[0_12px_32px_oklch(0.265_0.014_88/0.14)]
        hover:border-emerald/20
        transition-[box-shadow,border-color] duration-300
        ${className}`}
    >
      {/* Top accent line — grows on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

      {/* Bottom subtle glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {children}
    </motion.div>
  );
}