/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * ArchiveSection: 对齐参考站「Choose an Archive」
 *   三张磨砂玻璃卡立在场景里，带 3D 张角、鼠标倾斜与跟随光标的高光
 *   这一屏同时承担原来的 Linktree 职能：三个档案入口 = 简历 / 作品 / 联系
 *   底图不用照片：深绿渐变 + 光井 + 林间光柱 + 水面碎光 + 粒子场，全部代码现算
 */
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Crosshair } from "lucide-react";
import { site } from "../../content/site";
import { useInView } from "../../hooks/useInView";
import { useTilt } from "../../hooks/useTilt";
import GardenParticles from "../GardenParticles";
import SplitHeading from "../SplitHeading";
import { FilmGrain, Sparkles } from "../SceneFX";
import { scrollToSection } from "../SmoothScroll";
import { sfx } from "../../lib/gardenAudio";

const { archives } = site;

/** 三张卡的静态张角：左右两张向内立，中间正对镜头 */
const FAN = [-16, 0, 16];
const LIFT = [18, 0, 18];

/**
 * 档案屏专属场景：不依赖任何素材
 * 五层叠出景深：渐变底色 → 光井 → 光柱 → 树影 → 水面碎光 → 粒子与胶片颗粒
 */
function ArchiveStage() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 底色：从上往下由浅绿转深墨 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(178deg, oklch(0.34 0.055 165) 0%, oklch(0.22 0.040 162) 38%, oklch(0.135 0.024 158) 78%, oklch(0.105 0.018 155) 100%)",
        }}
      />

      {/* 光井：左上大面积暖光，缓慢呼吸 */}
      <div
        className="archive-breathe absolute -left-[10%] -top-[18%] h-[85%] w-[70%] blur-[10px]"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.86 0.10 96 / 0.42), oklch(0.72 0.10 110 / 0.14) 55%, transparent 78%)",
        }}
      />

      {/* 林间光柱：斜射的重复线性渐变，用蒙版从上往下淡出 */}
      <div
        className="archive-rays absolute -top-[20%] left-0 h-[125%] w-full opacity-70 mix-blend-screen"
        style={{
          background:
            "repeating-linear-gradient(96deg, transparent 0 78px, oklch(0.9 0.07 100 / 0.10) 78px 122px, transparent 122px 232px)",
          WebkitMaskImage:
            "linear-gradient(180deg, oklch(0 0 0 / 0.95) 0%, oklch(0 0 0 / 0.35) 48%, transparent 82%)",
          maskImage:
            "linear-gradient(180deg, oklch(0 0 0 / 0.95) 0%, oklch(0 0 0 / 0.35) 48%, transparent 82%)",
        }}
      />

      {/* 远景树影：两层模糊团块拉开前后景 */}
      <div
        className="absolute bottom-[18%] left-[-6%] h-[46%] w-[52%] rounded-[50%] blur-[52px] opacity-45"
        style={{ background: "oklch(0.30 0.060 160)" }}
      />
      <div
        className="absolute bottom-[14%] right-[-8%] h-[38%] w-[46%] rounded-[50%] blur-[46px] opacity-40"
        style={{ background: "oklch(0.26 0.050 158)" }}
      />

      {/* 水面：三条横向亮线错开漂，提示脚边有一片湖 */}
      <div className="absolute bottom-0 left-0 h-[26%] w-full">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="archive-water absolute left-[6%] h-px w-[74%] blur-[1px]"
            style={{
              bottom: `${18 + i * 26}%`,
              animationDelay: `${i * 1.6}s`,
              background:
                "linear-gradient(90deg, transparent, oklch(0.92 0.08 98 / 0.62) 22%, oklch(0.98 0.03 92 / 0.85) 50%, oklch(0.9 0.07 104 / 0.5) 78%, transparent)",
            }}
          />
        ))}
      </div>

      {/* 粒子场 + 零星亮点 + 胶片颗粒 */}
      <GardenParticles className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-70" />
      <div className="absolute inset-0 z-[2]">
        <Sparkles count={14} />
      </div>
      <FilmGrain id="grain-archive" opacity={0.085} />

      {/* 暗角 + 底部压深，保证玻璃卡上的字读得清 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 38%, transparent 42%, oklch(0.11 0.02 156 / 0.72) 100%), linear-gradient(180deg, oklch(0.13 0.02 158 / 0.34) 0%, transparent 34%, oklch(0.10 0.018 156 / 0.62) 100%)",
        }}
      />
    </div>
  );
}

function GlassCard({
  card,
  index,
  inView,
}: {
  card: (typeof archives.cards)[number];
  index: number;
  inView: boolean;
}) {
  const tilt = useTilt(9, 12);
  const href = card.href;

  /* 高光跟随：把光标归一化坐标写成 CSS 变量，避开逐帧重渲染 */
  const handleMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    tilt.onPointerMove(e);
    if (e.pointerType === "touch") return;
    const box = e.currentTarget.getBoundingClientRect();
    if (!box.width || !box.height) return;
    e.currentTarget.style.setProperty("--gx", `${((e.clientX - box.left) / box.width) * 100}%`);
    e.currentTarget.style.setProperty(
      "--gy",
      `${((e.clientY - box.top) / box.height) * 100}%`,
    );
  };

  const go = () => {
    sfx.click();
    if (href.startsWith("#")) scrollToSection(href);
    else window.open(href, "_blank", "noopener");
  };

  return (
    <motion.button
      type="button"
      onClick={go}
      onMouseEnter={() => sfx.hover()}
      initial={{ opacity: 0, y: 90, rotateY: FAN[index] * 2.4, z: -180 }}
      animate={
        inView
          ? { opacity: 1, y: 0, rotateY: FAN[index], z: 0, rotateX: 0 }
          : {}
      }
      transition={{
        duration: 1,
        delay: 0.15 + index * 0.13,
        ease: [0.2, 0.9, 0.24, 1],
      }}
      whileHover={{ y: -14, scale: 1.025 }}
      onPointerMove={handleMove}
      onPointerLeave={tilt.onPointerLeave}
      style={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformPerspective: 1200,
        translateZ: 0,
        marginTop: LIFT[index] ? -LIFT[index] : 0,
      }}
      className="group relative flex h-[clamp(19rem,38vw,26rem)] w-[clamp(11rem,22vw,15.5rem)] flex-col overflow-hidden rounded-[14px] p-5 text-left backdrop-blur-[10px] lg:p-6"
    >
      {/* 玻璃本体：半透白 + 内高光 + 外投影 */}
      <span
        className="absolute inset-0 rounded-[14px] transition-opacity duration-500 group-hover:opacity-90"
        style={{
          background:
            "linear-gradient(165deg, oklch(0.99 0.006 85 / 0.30) 0%, oklch(0.96 0.01 90 / 0.12) 42%, oklch(0.90 0.02 100 / 0.22) 100%)",
          border: "1px solid oklch(1 0 0 / 0.42)",
          boxShadow:
            "0 30px 60px -28px oklch(0.1 0.02 158 / 0.75), inset 0 1px 0 oklch(1 0 0 / 0.55), inset 0 -18px 30px -22px oklch(1 0 0 / 0.35)",
        }}
      />
      {/* 顶部一道斜反光 */}
      <span
        className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-[18deg] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.35), transparent)",
        }}
      />

      {/* 跟随光标的高光：像有人拿灯在亚克力上扫过 */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(200px circle at var(--gx, 50%) var(--gy, 50%), oklch(1 0 0 / 0.40), oklch(1 0 0 / 0.08) 46%, transparent 72%)",
          mixBlendMode: "soft-light",
        }}
      />

      <span className="relative flex items-start justify-between">
        <span
          className="text-lg text-parchment/90"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {card.no}
        </span>
        <Crosshair className="h-4 w-4 text-parchment/60" strokeWidth={1.2} />
      </span>

      <span className="relative mt-1 block h-px w-8 bg-parchment/45" />

      <span
        className="relative mt-5 block text-2xl leading-snug text-parchment lg:text-[1.7rem]"
        style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 12px oklch(0.12 0.02 158 / 0.6)" }}
      >
        {card.cn}
      </span>
      <span
        className="relative mt-2 block text-[0.62rem] uppercase text-parchment/70"
        style={{ letterSpacing: "0.24em" }}
      >
        {card.en}
      </span>
      <span
        className="relative mt-4 block text-[0.8rem] leading-relaxed text-parchment/75"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {card.desc}
      </span>

      <span className="relative mt-auto flex justify-end">
        <ArrowRight
          className="h-5 w-5 text-parchment/80 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-gold"
          strokeWidth={1.4}
        />
      </span>
    </motion.button>
  );
}

export default function ArchiveSection({ active = true }: { active?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const run = active && inView;

  /* 滚动视差：标题与卡阵以相反方向轻微位移，整屏读起来像一个景深空间 */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headY = useTransform(scrollYProgress, [0, 1], [56, -56]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [-28, 28]);

  return (
    <section
      id="archive"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden py-24"
    >
      <ArchiveStage />

      <div className="container relative z-10">
        <motion.div className="flex flex-col items-center text-center" style={{ y: headY }}>
          <span
            className="mb-5 block h-px origin-center bg-gold/70 transition-transform duration-[900ms] ease-out"
            style={{ width: "3rem", transform: run ? "scaleX(1)" : "scaleX(0)" }}
          />
          <SplitHeading
            text={archives.title}
            active={run}
            delay={0.1}
            className="text-4xl leading-[1.05] text-parchment lg:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 8px 34px oklch(0.1 0.02 158 / 0.65)",
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={run ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-sm text-parchment/70"
            style={{ letterSpacing: "0.34em" }}
          >
            {archives.sub}
          </motion.p>
        </motion.div>

        {/* 三张立着的玻璃卡 */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-5 lg:gap-7"
          style={{ perspective: "1600px", y: cardsY }}
        >
          {archives.cards.map((card, i) => (
            <GlassCard key={card.no} card={card} index={i} inView={run} />
          ))}
        </motion.div>
      </div>

      {/* 右侧漂浮小卡 */}
      <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-5 xl:flex">
        {archives.floating.map((f, i) => (
          <motion.a
            key={f.cn}
            href={f.href}
            initial={{ opacity: 0, x: 60, rotate: i % 2 ? 4 : -5 }}
            animate={run ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06, rotate: 0 }}
            onMouseEnter={() => sfx.hover()}
            className="float-slow w-40 rounded-[10px] p-3 backdrop-blur-md"
            style={
              {
                "--r": `${i % 2 ? 3 : -4}deg`,
                animationDelay: `${i * 0.9}s`,
                background:
                  "linear-gradient(150deg, oklch(0.99 0.006 85 / 0.34), oklch(0.94 0.014 95 / 0.16))",
                border: "1px solid oklch(1 0 0 / 0.4)",
                boxShadow: "0 22px 44px -24px oklch(0.1 0.02 158 / 0.7)",
              } as React.CSSProperties
            }
          >
            <span
              className="block text-base text-parchment"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {f.cn}
            </span>
            <span
              className="mt-1 block text-[0.58rem] uppercase text-parchment/65"
              style={{ letterSpacing: "0.22em" }}
            >
              {f.en}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
