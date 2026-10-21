/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * ExperienceSection: 对齐参考站 #experiences —— 深色底 + 96 颗粒子星雾 + 时间线
 *   粒子场由 GardenParticles 以 absolute 作用域渲染（Canvas 2D 复刻 Three.js Points）
 */
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { site } from "../../content/site";
import { useInView } from "../../hooks/useInView";
import { sfx } from "../../lib/gardenAudio";
import GardenParticles from "../GardenParticles";
import SectionHeader from "../SectionHeader";

const { experiences } = site;

export default function ExperienceSection({ active = true }: { active?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.12 });
  const whooshed = useRef(false);

  /* 进入深色星雾带：一声由近及远的风 */
  useEffect(() => {
    if (!inView || whooshed.current) return;
    whooshed.current = true;
    sfx.whoosh();
  }, [inView]);

  return (
    <section
      id="experiences"
      ref={ref}
      className="relative min-h-[890px] overflow-hidden py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.185 0.032 160) 0%, oklch(0.240 0.038 158) 48%, oklch(0.175 0.028 156) 100%)",
      }}
    >
      <GardenParticles className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      <div className="container relative z-10">
        <SectionHeader
          kicker={experiences.kicker}
          title={experiences.title}
          lead={experiences.lead}
          active={inView}
          tone="dark"
        />

        {/* 时间线 */}
        <div className="mt-14 border-l border-parchment/15 pl-8 lg:pl-12">
          {experiences.items.map((item, i) => (
            <motion.article
              key={item.role + item.period}
              initial={{ opacity: 0, y: 44 }}
              animate={active && inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative pb-12 last:pb-0"
            >
              {/* 节点 */}
              <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full bg-emerald shadow-[0_0_0_5px_oklch(0.596_0.145_163.225/0.18)] lg:-left-[49px]" />

              <p
                className="text-xs uppercase tracking-[0.24em] text-gold/70"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.period}
              </p>
              <h3
                className="mt-2 text-xl text-parchment lg:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.role}
              </h3>
              <p className="mt-1 text-sm text-parchment/50">{item.place}</p>
              <p
                className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-parchment/70"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
