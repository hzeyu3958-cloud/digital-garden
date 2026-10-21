/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * AIGC: AI Agent & Prompt Engineering works showcase
 * Content: Coze/Dify agents, Prompt templates, AI toolchain
 */
import { motion } from "framer-motion";
import AnimatedCard from "../AnimatedCard";
import { useInView } from "../../hooks/useInView";
import { site } from "../../content/site";

const aigcWorks = site.aigc;

export default function AigcSection() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <section id="aigc" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 parchment-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-parchment via-transparent to-parchment" />

      {/* Decorative watermark */}
      <div className="absolute top-20 left-0 pointer-events-none select-none">
        <span
          className="watermark-text text-[6rem] lg:text-[10rem] leading-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-accent)" }}
        >
          ai agent & prompt
        </span>
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="section-number text-sm tracking-widest uppercase">
              Specimen No.04
            </span>
            <div className="botanical-divider flex-1 max-w-[120px]" />
          </div>
          <h2
            className="text-3xl lg:text-4xl xl:text-5xl text-ink leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI 工具与作品
          </h2>
          <p className="mt-3 text-base lg:text-lg text-ink/60 max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            用工具做的实验、模板与自动化流程。
          </p>
        </motion.div>

        {/* Works grid */}
        <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aigcWorks.map((work, i) => (
            <AnimatedCard key={work.title} index={i} inView={inView}>
              <div className="p-5">
                {/* Type badge */}
                <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-emerald/8 border border-emerald/10 rounded-sm w-fit">
                  <work.icon className="w-3 h-3 text-emerald" />
                  <span className="text-[11px] text-emerald-dark font-medium">{work.type}</span>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-normal text-ink mb-2 group-hover:text-emerald-dark transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {work.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-ink/55 leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  {work.desc}
                </p>

                {/* Tool badge */}
                <div className="flex items-center gap-1.5 text-xs text-ink/40">
                  <span className="text-emerald/60">🛠</span>
                  <span>{work.tool}</span>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}