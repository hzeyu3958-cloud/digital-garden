/**
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Work: Professional work showcase with company timeline
 * Content: 数据来自 content/site.ts 的 site.work
 */
import { motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import { useInView } from "../../hooks/useInView";
import { Building2, ArrowUpRight, Briefcase } from "lucide-react";
import { site } from "../../content/site";

const workExperience = site.work;

export default function WorkSection() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <SectionWrapper
      id="work"
      number="07"
      title="工作与实习"
      subtitle="按时间顺序排列的经历，含职责与产出。"
      bgClassName="parchment-bg"
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} className="space-y-12">
        {workExperience.map((exp, expIndex) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: expIndex * 0.15 }}
            className="relative"
          >
            {/* Company header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-sm bg-emerald/10 border border-emerald/15">
                  <Building2 className="w-4 h-4 text-emerald" />
                </div>
                <div>
                  <h3
                    className="text-lg text-ink"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {exp.company}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-ink/50">
                    <Briefcase className="w-3 h-3" />
                    <span style={{ fontFamily: "var(--font-body)" }}>{exp.role}</span>
                  </div>
                </div>
              </div>
              <span className="section-number text-xs sm:ml-auto">{exp.period}</span>
            </div>

            {/* Work items */}
            <div className={`grid grid-cols-1 ${exp.works.length > 1 ? "md:grid-cols-2" : ""} gap-4 pl-0 sm:pl-12`}>
              {exp.works.map((work, workIndex) => (
                <motion.div
                  key={work.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: expIndex * 0.15 + workIndex * 0.1 + 0.2 }}
                  className="group bg-card border border-border/60 rounded-sm p-5 hover:shadow-[0_4px_16px_oklch(0.596_0.145_163.225/0.08)] hover:border-emerald/25 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4
                      className="text-base font-normal text-ink group-hover:text-emerald-dark transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {work.title}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-emerald/25 group-hover:text-emerald transition-colors flex-shrink-0 ml-2 mt-0.5" />
                  </div>
                  <p className="text-sm text-ink/55 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {work.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Divider between companies */}
            {expIndex < workExperience.length - 1 && (
              <div className="botanical-divider mt-12 max-w-xs mx-auto" />
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}