/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * News: Journalism works from 华发集团 period
 * Content: 135 articles, 42万+ words, various publications
 */
import { motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { useInView } from "../../hooks/useInView";
import { Newspaper, Calendar, BookOpen } from "lucide-react";
import { site } from "../../content/site";

const newsWorks = site.news;

export default function NewsSection() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <SectionWrapper
      id="news"
      number="06"
      title="内容与写作"
      subtitle="写过的文章、报道与长文。"
    >
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        {/* Featured articles - larger cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {newsWorks.filter(n => n.featured).map((news, i) => (
            <AnimatedCard key={news.title} index={i} inView={inView} className="lg:min-h-[240px]">
              <div className="p-6 lg:p-7 h-full flex flex-col">
                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 text-[11px] font-medium text-white bg-emerald rounded-sm">
                    {news.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink/40">
                    <Calendar className="w-3 h-3" />
                    {news.date}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-normal text-ink mb-3 group-hover:text-emerald-dark transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {news.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-ink/55 leading-relaxed flex-1 mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  {news.excerpt}
                </p>

                {/* Publication */}
                <div className="flex items-center gap-2">
                  <Newspaper className="w-3.5 h-3.5 text-emerald/50" />
                  <span className="specimen-label text-sm text-emerald-dark/70">
                    {news.publication}
                  </span>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Other articles - compact list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsWorks.filter(n => !n.featured).map((news, i) => (
            <AnimatedCard key={news.title} index={i + 2} inView={inView}>
              <div className="p-5 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-emerald/8 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-emerald" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-normal text-ink mb-1.5 group-hover:text-emerald-dark transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-ink/40">
                    <span className="specimen-label">{news.publication}</span>
                    <span>·</span>
                    <span>{news.date}</span>
                    <span>·</span>
                    <span className="text-emerald/70">{news.type}</span>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}