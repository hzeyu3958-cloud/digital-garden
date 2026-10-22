/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * HeroSection: 对齐参考站 #home —— 满幅会动的花园场景 + 左下打字机大标题 + 右下滚动箭头
 */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Mail, MapPin } from "lucide-react";
import { site } from "../../content/site";
import { sfx } from "../../lib/gardenAudio";
import Typewriter from "../Typewriter";
import LivingScene from "../LivingScene";
import MagneticButton from "../MagneticButton";
import { scrollToSection } from "../SmoothScroll";

const { profile } = site;

export default function HeroSection({ active = true }: { active?: boolean }) {
  const [line, setLine] = useState(0);
  const [titleDone, setTitleDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* 标题第二行打完 → 进入漂浮呼吸 */
  useEffect(() => {
    if (!active) return;
    if (line < 1) return;
    const t = setTimeout(() => setTitleDone(true), 400);
    return () => clearTimeout(t);
  }, [active, line]);

  /* 整行打完 → 一串上行琶音 */
  useEffect(() => {
    if (line === 2) sfx.chime();
  }, [line]);

  /* 内容随滚动下沉并淡出 */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 lg:pb-20"
    >
      {/* ---------- 会动的场景：巨花、蝴蝶、兔子、湖面波光 ---------- */}
      <LivingScene
        src={profile.cover}
        videoSrc={profile.coverVideo || undefined}
        grainId="grain-home"
        position="center 68%"
        panY={0.68}
        bloomAt={{ x: "50%", y: "36%", size: "34%" }}
        /* 进门那一刻从花苞展开：坐标对着 garden-hero.jpg 量，半径以图高为单位 */
        flowerBloom={{ x: 0.5, y: 0.41, radius: 0.36, delay: 0.35, duration: 2.8 }}
        flowerOpen={active}
        shimmerAt={{ left: "0%", top: "57%", width: "46%", height: "16%" }}
        butterflies={11}
        petals={14}
        sparkles={22}
        overlay="linear-gradient(180deg, oklch(0.13 0.005 245 / 0.22) 0%, transparent 32%, oklch(0.11 0.005 245 / 0.44) 88%, oklch(0.10 0.005 245 / 0.62) 100%)"
      />

      {/* ---------- 内容：左下对齐 ---------- */}
      <motion.div className="container relative z-10" style={{ y: textY, opacity: textOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="block h-px w-10 bg-gold/70" />
          <p
            className="text-[0.7rem] uppercase text-gold/85"
            style={{ letterSpacing: "0.46em", fontFamily: "var(--font-body)" }}
          >
            Digital Garden
          </p>
          <span className="hidden h-px w-24 bg-parchment/20 sm:block" />
        </motion.div>

        <motion.h1
          initial={false}
          animate={titleDone ? { y: [0, -7, 0] } : {}}
          transition={
            titleDone
              ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          className="text-[clamp(2.4rem,8.6vw,7rem)] leading-[1.04] text-parchment"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: "0 6px 30px oklch(0.10 0.004 240 / 0.55), 0 1px 3px oklch(0.10 0.004 240 / 0.45)",
          }}
        >
          <span className="block">
            <Typewriter
              text="Welcome to"
              active={active}
              initialDelay={620}
              speed={105}
              onDone={() => setLine(1)}
            />
          </span>
          <span className="block">
            {line >= 1 ? (
              <Typewriter
                text={`${profile.nameEn}'s world`}
                active={active}
                initialDelay={120}
                speed={105}
                onDone={() => setLine(2)}
              />
            ) : (
              <span className="opacity-0">|</span>
            )}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-parchment/70"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="text-base text-parchment/90">{profile.tagline}</span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald" />
            {profile.location}
          </span>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-gold"
          >
            <Mail className="h-4 w-4 text-emerald" />
            {profile.email}
          </a>
        </motion.div>
      </motion.div>

      {/* ---------- 右下：滚动到下一分区（磁吸） ---------- */}
      <MagneticButton
        className="absolute bottom-7 right-6 z-10 hidden lg:block"
        hitClassName="p-2 -m-2"
        strength={0.5}
        max={10}
      >
        <motion.button
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.1 }}
          onClick={() => scrollToSection("#archive")}
          className="grid h-11 w-11 place-items-center rounded-full border border-parchment/25 text-parchment/70 transition-colors hover:border-gold/60 hover:text-gold"
          aria-label="下一屏"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.button>
      </MagneticButton>
    </section>
  );
}
