/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Links: 链接聚合区（Linktree 的替代品）
 * 数据来自 content/site.ts 的 site.links，按分组渲染成卡片列
 */
import { motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import { useInView } from "../../hooks/useInView";
import { ArrowUpRight } from "lucide-react";
import { site } from "../../content/site";

export default function LinksSection() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <SectionWrapper
      id="links"
      number="01"
      title="全部入口"
      subtitle="简历、作品、社交平台与联系方式，都收在这一页。"
      bgClassName="parchment-bg"
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {site.links.map((group, groupIndex) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: groupIndex * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="bg-card border border-border/60 rounded-sm p-6 lg:p-7
              hover:border-emerald/25 hover:shadow-[0_8px_24px_oklch(0.596_0.145_163.225/0.08)]
              transition-all duration-300"
          >
            {/* Group header */}
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h3
                className="text-lg text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {group.group}
              </h3>
              <span className="section-number text-[11px] opacity-40 tracking-widest">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
            </div>
            {group.caption && (
              <p
                className="text-xs text-ink/40 mb-3 -mt-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {group.caption}
              </p>
            )}

            {/* Items */}
            <div className="divide-y divide-border/50">
              {group.items.map((item) => {
                const isPlaceholder = item.href === "#";
                const isExternal = /^https?:\/\//.test(item.href);

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    title={
                      isPlaceholder
                        ? "链接待填：在 client/src/content/site.ts 中修改 href"
                        : undefined
                    }
                    aria-disabled={isPlaceholder || undefined}
                    className={`group/item flex items-center gap-4 py-3.5 first:pt-1 last:pb-0
                      ${isPlaceholder ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <span
                      className="flex-shrink-0 w-10 h-10 rounded-sm bg-emerald/8 border border-emerald/12
                        flex items-center justify-center
                        group-hover/item:bg-emerald/12 group-hover/item:border-emerald/25
                        transition-colors duration-300"
                    >
                      <item.icon className="w-4 h-4 text-emerald-dark" />
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <span
                          className="text-sm text-ink group-hover/item:text-emerald-dark transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] leading-none text-emerald-dark/70 bg-emerald/8 border border-emerald/10 rounded-sm">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {item.desc && (
                        <span
                          className="block text-xs text-ink/40 mt-0.5 truncate"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item.desc}
                        </span>
                      )}
                    </span>

                    <ArrowUpRight
                      className="w-4 h-4 flex-shrink-0 text-emerald/25
                        group-hover/item:text-emerald group-hover/item:-translate-y-0.5
                        transition-all duration-300"
                    />
                  </a>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
