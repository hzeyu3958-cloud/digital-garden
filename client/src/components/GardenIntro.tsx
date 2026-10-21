/*
 * GardenIntro: 开场进入门
 * 对齐 danica-garden 的第一印象：深墨绿全屏 + 加载进度 + Enter Digital Garden
 * 进入后幕布上下分开，并记住本次会话（sessionStorage）
 */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Typewriter from "./Typewriter";
import { site } from "../content/site";

interface GardenIntroProps {
  onEnter: () => void;
}

const INK = "oklch(0.185 0.035 160)";
const PARCHMENT = "oklch(0.975 0.008 85)";
const GOLD = "oklch(0.700 0.130 85)";
const LOAD_MS = 2100;
const AUTO_ENTER_MS = 9000;

export default function GardenIntro({ onEnter }: GardenIntroProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  /* 加载进度：2.1s 缓出到 100% */
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let shown = -1;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / LOAD_MS);
      const value = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      if (value !== shown) {
        shown = value;
        setProgress(value);
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setReady(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* 锁滚动 */
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  const enter = useCallback(() => {
    if (!ready || leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem("garden-entered", "1");
    } catch {
      /* 隐私模式下忽略 */
    }
    /* 幕布 0.3s 延迟 + 0.95s 滑完，等它彻底分开再卸载 */
    window.setTimeout(onEnter, 1300);
  }, [ready, leaving, onEnter]);

  /* 就绪后按回车/空格也能进；久等自动进 */
  useEffect(() => {
    if (!ready || leaving) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    const auto = window.setTimeout(enter, AUTO_ENTER_MS);

    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(auto);
    };
  }, [ready, leaving, enter]);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-label="进入数字花园">
      {/* 幕布：上下两扇门 */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[50.5%]"
        style={{ backgroundColor: INK }}
        animate={leaving ? { y: "-101%" } : { y: 0 }}
        transition={{ duration: 0.95, delay: leaving ? 0.3 : 0, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[50.5%]"
        style={{ backgroundColor: INK }}
        animate={leaving ? { y: "101%" } : { y: 0 }}
        transition={{ duration: 0.95, delay: leaving ? 0.3 : 0, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* 门上的叶影 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={leaving ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Leaf
          className="w-[36rem] h-[36rem]"
          strokeWidth={0.35}
          style={{ color: PARCHMENT, opacity: 0.045 }}
        />
      </motion.div>

      {/* 内容 */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        animate={leaving ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[10px] sm:text-[11px] uppercase mb-7"
          style={{
            color: GOLD,
            fontFamily: "var(--font-accent)",
            letterSpacing: "0.5em",
          }}
        >
          Digital Garden
        </motion.p>

        <h2
          className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3"
          style={{ color: PARCHMENT, fontFamily: "var(--font-display)" }}
        >
          <Typewriter text="花园加载中" speed={210} initialDelay={260} showCursor={false} />
        </h2>

        <p
          className="text-xs sm:text-sm italic mb-12"
          style={{ color: `${PARCHMENT}`, opacity: 0.42, fontFamily: "var(--font-accent)" }}
        >
          Preparing {site.meta.siteName}
        </p>

        {/* 进度线 */}
        <div className="w-full max-w-[22rem] sm:max-w-sm">
          <div className="relative h-px w-full" style={{ backgroundColor: "oklch(1 0 0 / 0.12)" }}>
            <div
              className="absolute inset-y-0 left-0"
              style={{ width: `${progress}%`, backgroundColor: GOLD, transition: "width 80ms linear" }}
            />
          </div>
          <div
            className="mt-3 flex items-center justify-between text-[10px] uppercase"
            style={{ color: PARCHMENT, opacity: 0.38, fontFamily: "var(--font-accent)", letterSpacing: "0.28em" }}
          >
            <span>{site.profile.nameEn}</span>
            <span>{String(progress).padStart(3, "0")}%</span>
          </div>
        </div>

        {/* 进入按钮 */}
        <div className="mt-14 h-12 flex items-center">
          {ready ? (
            <motion.button
              type="button"
              onClick={enter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-7 py-3 rounded-sm text-sm tracking-wide"
              style={{
                backgroundColor: PARCHMENT,
                color: INK,
                fontFamily: "var(--font-body)",
              }}
            >
              Enter Digital Garden
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          ) : (
            <span
              className="inline-flex items-center gap-3 px-7 py-3 rounded-sm text-sm tracking-wide"
              style={{
                color: PARCHMENT,
                opacity: 0.35,
                border: `1px solid oklch(1 0 0 / 0.16)`,
                fontFamily: "var(--font-body)",
              }}
              aria-disabled="true"
            >
              花园加载中
              <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: GOLD }} />
            </span>
          )}
        </div>

        <p
          className="mt-6 text-[10px] uppercase"
          style={{ color: PARCHMENT, opacity: 0.22, fontFamily: "var(--font-accent)", letterSpacing: "0.3em" }}
        >
          {ready ? "点击或按 Enter" : "请稍候"}
        </p>
      </motion.div>
    </div>
  );
}
