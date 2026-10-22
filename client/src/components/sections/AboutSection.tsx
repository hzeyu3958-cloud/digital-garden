/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * AboutSection: 对齐参考站 #about —— 左像右文，标题逐字翻入，亮点随滚动错帧出现
 *   首屏摘下来的三张亮点卡放在这里，保证首屏与参考站一样「只有标题」
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft } from "lucide-react";
import { site } from "../../content/site";
import { useInView } from "../../hooks/useInView";
import AnimatedCard from "../AnimatedCard";
import MagneticButton from "../MagneticButton";
import SectionHeader from "../SectionHeader";
import { scrollToSection } from "../SmoothScroll";

const { about, profile, highlights, cta } = site;

export default function AboutSection({ active = true }: { active?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-20 lg:py-28">
      <div className="container relative z-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* 左：肖像 + 亮点 */}
        <div className="flex flex-col gap-6">
          <AnimatedCard index={0} inView={inView} className="relative aspect-[4/5] overflow-hidden p-0">
            {photoOk ? (
              <img
                src={profile.photo}
                alt={profile.name}
                onError={() => setPhotoOk(false)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center"
                style={{
                  background:
                    "linear-gradient(150deg, oklch(0.340 0.040 172) 0%, oklch(0.185 0.018 200) 100%)",
                }}
              >
                <span
                  className="text-6xl text-parchment/80"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {profile.name.slice(0, 1)}
                </span>
              </div>
            )}
          </AnimatedCard>

          <div className="flex flex-col gap-3">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label + h.value}
                initial={{ opacity: 0, x: -24 }}
                animate={active && inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.25 + i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-baseline gap-3 border-l-2 pl-4"
                style={{ borderColor: h.accent }}
              >
                <span
                  className="text-lg text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {h.value}
                </span>
                <span className="text-xs uppercase tracking-wider text-ink/45">
                  {h.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 右：正文 */}
        <div>
          <SectionHeader kicker={about.kicker} title={about.title} active={inView} />

          <div className="mt-8 flex max-w-2xl flex-col gap-5">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={p.slice(0, 12)}
                initial={{ opacity: 0, y: 22 }}
                animate={active && inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
                className="text-[1.02rem] leading-[1.85] text-ink/70"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={active && inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton strength={0.34} max={16}>
              <button
                onClick={() => scrollToSection(cta.primary.href)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm tracking-wide text-parchment transition-colors hover:bg-emerald-dark"
              >
                {cta.primary.label}
                <ArrowDownLeft className="h-4 w-4" />
              </button>
            </MagneticButton>
            <MagneticButton strength={0.34} max={16}>
              <a
                href={cta.secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm tracking-wide text-ink/70 transition-colors hover:border-emerald hover:text-emerald"
              >
                {cta.secondary.label}
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
