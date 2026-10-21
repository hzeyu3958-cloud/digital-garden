/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Projects: Real AI projects + hackathon achievements
 * Content: SpacePlay, 数字幻窗, Coze Agent, etc.
 */
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { useInView } from "../../hooks/useInView";
import { Trophy } from "lucide-react";
import { site } from "../../content/site";

const projects = site.projects;

export default function ProjectsSection() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <SectionWrapper
      id="projects"
      number="02"
      title="项目与实践"
      subtitle="把做过的事按标本编号存档：项目、比赛与作品。"
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <AnimatedCard key={project.title} index={i} inView={inView}>
            <div className="p-6 lg:p-7">
              {/* Icon + Number */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="p-2.5 rounded-sm"
                  style={{ backgroundColor: `${project.accent}15` }}
                >
                  <project.icon className="w-5 h-5" style={{ color: project.accent }} />
                </div>
                <span className="section-number text-xs opacity-40">
                  No.{String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-lg font-normal text-ink mb-3 group-hover:text-emerald-dark transition-colors duration-300"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm text-ink/55 leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] text-emerald-dark/70 bg-emerald/5 border border-emerald/10 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Highlight */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-gold/8 border border-amber-gold/15 rounded-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-gold flex-shrink-0" />
                <span className="text-xs text-amber-gold font-medium">
                  {project.highlight}
                </span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </SectionWrapper>
  );
}