/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Hero: Premium identity card with floating particles, gradient text, and glass cards
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { site } from "../../content/site";
import Typewriter from "../Typewriter";
import { scrollToSection } from "../SmoothScroll";

const { profile, highlights, tags, cta } = site;

/** 手绘叶片，用于背景与头像环，不依赖外部图片 */
function LeafShape({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      <path
        d="M20 2 C31 11 34 22 20 38 C6 22 9 11 20 2 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M20 6 L20 34 M20 16 L13 10 M20 16 L27 10 M20 24 L14 18 M20 24 L26 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
    </svg>
  );
}

export default function HeroSection({ active = true }: { active?: boolean }) {
  const [titleDone, setTitleDone] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Floating particles background — now handled globally by Home.tsx */}

      {/* Background: 纸感底 + 手绘植物线稿 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 parchment-bg" />
        <LeafShape
          className="absolute -left-20 top-8 w-80 h-80 rotate-12"
          style={{ color: "oklch(0.596 0.145 163.225)", opacity: 0.07 }}
        />
        <LeafShape
          className="absolute -right-24 top-1/3 w-96 h-96 -rotate-[24deg]"
          style={{ color: "oklch(0.432 0.120 163.225)", opacity: 0.05 }}
        />
        <LeafShape
          className="absolute left-1/3 -bottom-24 w-72 h-72 rotate-[40deg]"
          style={{ color: "oklch(0.700 0.130 85)", opacity: 0.05 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/40 via-transparent to-parchment" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text content — left side */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={active ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Garden kicker */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={active ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-[10px] sm:text-[11px] uppercase mb-5 text-emerald-dark/45"
                style={{ fontFamily: "var(--font-accent)", letterSpacing: "0.46em" }}
              >
                Digital Garden
              </motion.p>

              {/* Identity badge */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-emerald/8 border border-emerald/15 rounded-full
                  hover:bg-emerald/12 hover:border-emerald/25 hover:shadow-[0_4px_12px_oklch(0.596_0.145_163.225/0.15)] transition-all duration-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald" />
                <span
                  className="text-sm text-emerald-dark font-medium tracking-wide"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {profile.badge}
                </span>
              </motion.div>

              {/* Name — 打字机出场（对齐原站 H1），完成后持续轻浮 */}
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl leading-[1.15] mb-4 min-h-[1.15em] gradient-text"
                style={{ fontFamily: "var(--font-display)" }}
                animate={titleDone ? { y: [0, -7, 0] } : {}}
                transition={
                  titleDone
                    ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                    : undefined
                }
              >
                <Typewriter
                  text={profile.name}
                  active={active}
                  initialDelay={620}
                  speed={105}
                  onDone={() => setTitleDone(true)}
                />
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={active ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="text-base lg:text-lg text-ink/55 mb-8 max-w-md"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {profile.tagline}
              </motion.p>

              {/* Highlight cards — glass morphism */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
              >
                {highlights.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="stat-card rounded-sm p-4"
                    initial={{ opacity: 0, y: -90, rotate: i % 2 === 0 ? -3 : 3 }}
                    animate={active ? { opacity: 1, y: 0, rotate: 0 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 17,
                      mass: 0.9,
                      delay: 1.25 + i * 0.1,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: item.accent }}
                      />
                      <span
                        className="text-lg font-medium text-ink"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.value}
                      </span>
                    </div>
                    <p
                      className="text-xs text-ink/70 font-medium mb-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[11px] text-ink/40 leading-snug"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.detail}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Tools */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={active ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="mb-6"
              >
                <p
                  className="text-[11px] text-ink/30 uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-accent)" }}
                >
                  能力标签
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tool, i) => (
                    <motion.span
                      key={tool}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={active ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 1.55 + i * 0.05 }}
                      className="hero-tag px-2.5 py-1 text-xs font-medium text-emerald-dark rounded-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={active ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.7 }}
                className="flex items-center gap-4"
              >
                <a
                  href={cta.primary.href}
                  onClick={(e) => {
                    if (cta.primary.href.startsWith("#")) {
                      e.preventDefault();
                      scrollToSection(cta.primary.href);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald text-white text-sm font-medium rounded-sm
                    hover:bg-emerald-dark transition-all duration-300
                    shadow-[0_2px_8px_oklch(0.596_0.145_163.225/0.3)]
                    hover:shadow-[0_8px_24px_oklch(0.596_0.145_163.225/0.4)]
                    hover:-translate-y-0.5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {cta.primary.label}
                  <ArrowDown className="w-4 h-4" />
                </a>
                <a
                  href={cta.secondary.href}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-emerald-dark
                    border border-emerald/30 rounded-sm
                    hover:bg-emerald/5 hover:border-emerald/50
                    transition-all duration-300 hover:-translate-y-0.5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {cta.secondary.label}
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Profile photo area — right side */}
          <div className="lg:col-span-5 order-2 flex justify-center lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={active ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80"
            >
              {/* 植物学风格头像环 */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-emerald/20" />
                <div className="absolute inset-3 rounded-full border border-amber-gold/15" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${i * 45}deg)` }}
                  >
                    <LeafShape
                      className="absolute left-1/2 top-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2"
                      style={{ color: "oklch(0.596 0.145 163.225)", opacity: 0.45 }}
                    />
                  </span>
                ))}
              </div>
              {/* Profile photo */}
              <div className="absolute inset-[10%] rounded-full overflow-hidden bg-emerald/5 flex items-center justify-center">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add("flex", "items-center", "justify-center");
                      const placeholder = document.createElement("div");
                      placeholder.className = "text-center";
                      placeholder.innerHTML = `
                        <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-emerald/12 flex items-center justify-center border border-emerald/15">
                          <span class="text-2xl text-emerald-dark" style="font-family: var(--font-display)">
                            ${profile.name}
                          </span>
                        </div>
                        <p class="text-xs text-emerald-dark/50" style="font-family: var(--font-accent)">将照片放到 public/images/profile.jpg</p>
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ delay: 2.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-xs text-ink/30 tracking-widest uppercase"
          style={{ fontFamily: "var(--font-accent)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-emerald/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}