/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Skills: AI product capabilities + Vibe Coding + languages
 */
import { motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import { useInView } from "../../hooks/useInView";
import { site } from "../../content/site";

const skillCategories = site.skills;

function SkillBar({ name, level, index, inView, color }: { name: string; level: number; index: number; inView: boolean; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="mb-4 last:mb-0 group/bar"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-ink/75" style={{ fontFamily: "var(--font-body)" }}>
          {name}
        </span>
        <span className="section-number text-xs opacity-60">{level}%</span>
      </div>
      <div className="h-2 bg-emerald/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity duration-500" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <SectionWrapper
      id="skills"
      number="03"
      title="技能图谱"
      subtitle="把能力拆成可度量的部分，方便你快速判断是否匹配。"
      bgClassName="parchment-bg"
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left side — language & tools summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col gap-5"
        >
          {/* Language card */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-base text-ink font-normal" style={{ fontFamily: "var(--font-display)" }}>
                语言能力
              </span>
            </div>
            <div className="space-y-3">
              {site.languages.map((lang) => (
                <div key={lang.label} className="flex justify-between text-sm">
                  <span className="text-ink/60">{lang.label}</span>
                  <span className="text-ink font-medium">{lang.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education card */}
          <div className="bg-card/50 border border-border/40 rounded-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-dark" />
              <span className="text-base text-ink font-normal" style={{ fontFamily: "var(--font-display)" }}>
                教育背景
              </span>
            </div>
            <div className="space-y-4">
              {site.education.map((edu) => (
                <div key={edu.school}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink font-medium">{edu.school}</span>
                    <span className="text-ink/40 text-xs">{edu.period}</span>
                  </div>
                  <p className="text-xs text-ink/50">
                    {edu.degree}
                    {edu.note ? ` · ${edu.note}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skill bars */}
        <div className="lg:col-span-7 space-y-8">
          {skillCategories.map((cat, catIndex) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIndex * 0.15 }}
              className="bg-card/50 border border-border/40 rounded-sm p-5 lg:p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span
                  className="text-base text-ink font-normal"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.category}
                </span>
                <div className="botanical-divider flex-1 max-w-[60px]" />
              </div>
              {cat.skills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  index={catIndex * 5 + i}
                  inView={inView}
                  color={cat.color}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}