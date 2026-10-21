/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Plans: Strategy & planning works with timeline layout
 * Content: 真实策划案与产品方案
 */
import { motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import { useInView } from "../../hooks/useInView";
import { FileCheck, Award } from "lucide-react";
import { site } from "../../content/site";

const plans = site.plans;

export default function PlansSection() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <SectionWrapper
      id="plans"
      number="05"
      title="策划与方案"
      subtitle="完整的方案文档与执行复盘。"
      bgClassName="parchment-bg"
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald/40 via-emerald/20 to-transparent lg:-translate-x-[1px]" />

        {/* Timeline items */}
        <div className="space-y-10 lg:space-y-14">
          {plans.map((plan, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative flex items-start gap-6 lg:gap-0 ${
                  isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-5 lg:left-1/2 w-3 h-3 bg-emerald rounded-full border-[3px] border-parchment -translate-x-1.5 lg:-translate-x-1.5 mt-7 z-10 shadow-[0_0_0_4px_oklch(0.596_0.145_163.225/0.15)]" />

                {/* Content card */}
                <div className={`ml-12 lg:ml-0 lg:w-[calc(50%-2.5rem)] ${isLeft ? "lg:pr-0" : "lg:pl-0"}`}>
                  <div className="group bg-card border border-border/60 rounded-sm p-6 hover:shadow-[0_6px_20px_oklch(0.596_0.145_163.225/0.1)] hover:border-emerald/25 transition-all duration-300">
                    {/* Year + Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <plan.icon className="w-4 h-4 text-emerald" />
                        <span className="section-number text-xs">{plan.year}</span>
                      </div>
                      <FileCheck className="w-4 h-4 text-emerald/25 group-hover:text-emerald/50 transition-colors" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base font-normal text-ink mb-2 group-hover:text-emerald-dark transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {plan.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-ink/55 leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
                      {plan.desc}
                    </p>

                    {/* Result */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald/5 border border-emerald/10 rounded-sm">
                      <Award className="w-3.5 h-3.5 text-amber-gold flex-shrink-0" />
                      <span className="text-xs text-emerald-dark font-medium" style={{ fontFamily: "var(--font-body)" }}>
                        {plan.result}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}