/*
 * GardenIntro: 开场电影门（对齐参考站第一帧）
 *   满屏会动的花园场景 + 左上双语标识 + CRT 屏幕上逐字打出欢迎语 +
 *   底部 Enter Digital Garden / 进入数字花园 + 跳过 intro
 *   进入时镜头「推进」穿过画面，而不是拉幕布
 * 音效：进度滴答 → 就绪琶音 → 进门风声与和弦
 */
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, SkipForward, Volume2 } from "lucide-react";
import Typewriter from "./Typewriter";
import LivingScene from "./LivingScene";
import SplitHeading from "./SplitHeading";
import { site } from "../content/site";
import { sfx } from "../lib/gardenAudio";

const INK = "oklch(0.270 0.020 168)";
const PARCHMENT = "oklch(0.978 0.005 88)";
const GOLD = "oklch(0.700 0.130 85)";
/* 纱幕专用近中性：带绿相会把花园照片的天蓝洗成菜汤色 */
const scrim = (alpha: number) => `oklch(0.11 0.005 245 / ${alpha})`;
const LOAD_MS = 2100;
const AUTO_ENTER_MS = 12000;

/** CRT 屏幕在图里的位置（按生成图实测的百分比），文字要贴在这块玻璃上 */
const SCREEN = {
  left: "31.7%",
  top: "36.6%",
  width: "16.1%",
  height: "27%",
};

export default function GardenIntro({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [armed, setArmed] = useState(false);

  /* 首次点击/按键解锁 AudioContext（浏览器策略） */
  useEffect(() => {
    const arm = () => {
      sfx.unlock();
      setArmed(true);
    };
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);

  /* 加载进度：2.1s 缓出到 100% */
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let shown = -1;
    let decade = -1;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / LOAD_MS);
      const value = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      if (value !== shown) {
        shown = value;
        setProgress(value);
      }
      const d = Math.floor(value / 12);
      if (d !== decade) {
        decade = d;
        sfx.tick();
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setReady(true);
        sfx.chime();
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

  const enter = useCallback(
    (skipped = false) => {
      if (leaving || (!ready && !skipped)) return;
      setLeaving(true);
      sfx.unlock();
      sfx.whoosh();
      window.setTimeout(() => sfx.enter(), 200);
      /* 推进镜头 1.15s，走完再卸载 */
      window.setTimeout(onEnter, skipped ? 780 : 1200);
    },
    [ready, leaving, onEnter]
  );

  /* 就绪后回车/空格也能进；久等自动进 */
  useEffect(() => {
    if (!ready || leaving) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    const auto = window.setTimeout(() => enter(true), AUTO_ENTER_MS);

    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(auto);
    };
  }, [ready, leaving, enter]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-label="进入数字花园"
      initial={{ opacity: 1 }}
      animate={
        leaving
          ? { opacity: 0, scale: 1.28, filter: "blur(16px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{
        duration: leaving ? 1.15 : 0.5,
        ease: [0.66, 0, 0.24, 1],
      }}
    >
      {/* ---------- 会动的花园 ---------- */}
      <LivingScene
        src={site.profile.introCover}
        videoSrc={site.profile.introVideo || undefined}
        grainId="grain-intro"
        position="center 62%"
        panY={0.62}
        bloomAt={{ x: "39.8%", y: "50%", size: "26%" }}
        shimmerAt={{ left: "0%", top: "36%", width: "24%", height: "14%" }}
        butterflies={8}
        petals={9}
        sparkles={16}
        overlay={`linear-gradient(180deg, ${scrim(0.24)} 0%, transparent 26%, transparent 62%, ${scrim(0.5)} 100%)`}
      />

      {/* ---------- 左上双语标识 ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-6 top-6 z-20 lg:left-10 lg:top-8"
      >
        <p
          className="text-[10px] uppercase lg:text-[11px]"
          style={{ color: PARCHMENT, letterSpacing: "0.44em", opacity: 0.82 }}
        >
          Digital Garden
        </p>
        <SplitHeading
          as="h1"
          text="数字花园"
          active
          delay={0.35}
          duration={1.2}
          className="mt-2 text-2xl lg:text-3xl"
          style={{ color: PARCHMENT, fontFamily: "var(--font-display)" }}
        />
      </motion.div>

      {/* ---------- 打在 CRT 玻璃上的欢迎语 ---------- */}
      <motion.div
        className="crt-flicker absolute z-20 flex flex-col items-center justify-center text-center"
        style={{
          ...SCREEN,
          transform: "perspective(760px) rotateY(-9deg)",
          color: INK,
          fontFamily: "var(--font-display)",
          lineHeight: 1.35,
          fontSize: "clamp(0.58rem, 1.5vw, 1.35rem)",
          textShadow: "0 0 12px oklch(0.95 0.06 85 / 0.55)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <span className="block">
          <Typewriter
            text="Welcome to"
            active={ready}
            initialDelay={260}
            speed={110}
            sound
          />
        </span>
        <span className="block">
          <Typewriter
            text={`${site.profile.name}的世界`}
            active={ready}
            initialDelay={1200}
            speed={130}
            sound
          />
        </span>
      </motion.div>

      {/* ---------- 底部：进度 + 进入 + 跳过 ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-4 pb-7 lg:pb-9">
        {/* 进度条：加载时才有 */}
        <motion.div
          className="flex w-[min(22rem,72vw)] flex-col gap-2"
          animate={{ opacity: ready ? 0 : 1, height: ready ? 0 : "auto" }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="relative h-px w-full"
            style={{ backgroundColor: "oklch(1 0 0 / 0.22)" }}
          >
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${progress}%`,
                backgroundColor: GOLD,
                transition: "width 80ms linear",
              }}
            />
          </div>
          <div
            className="flex items-center justify-between text-[10px] uppercase"
            style={{ color: PARCHMENT, opacity: 0.55, letterSpacing: "0.3em" }}
          >
            <span>{site.profile.nameEn}</span>
            <span>{String(progress).padStart(3, "0")}%</span>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => enter()}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0.45, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={ready ? { scale: 1.035 } : {}}
          whileTap={ready ? { scale: 0.97 } : {}}
          className="group inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm tracking-wide backdrop-blur-md"
          style={{
            backgroundColor: "oklch(0.98 0.006 85 / 0.16)",
            border: `1px solid oklch(1 0 0 / 0.35)`,
            color: PARCHMENT,
            boxShadow: `0 14px 40px -18px ${scrim(0.75)}`,
          }}
        >
          Enter Digital Garden
          <span style={{ opacity: 0.7 }}>/</span>
          <span>进入数字花园</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => enter(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] transition-colors"
            style={{
              color: PARCHMENT,
              opacity: 0.6,
              backgroundColor: scrim(0.4),
              border: "1px solid oklch(1 0 0 / 0.16)",
            }}
          >
            <SkipForward className="h-3 w-3" />
            跳过 intro
          </button>
          {!armed && (
            <span
              className="inline-flex items-center gap-1.5 text-[11px]"
              style={{ color: PARCHMENT, opacity: 0.5 }}
            >
              <Volume2 className="h-3 w-3" />
              点一下开启声音
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
