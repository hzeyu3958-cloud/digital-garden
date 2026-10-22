/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Footer: Contact section with botanical styling, dark ink background
 */
import { motion } from "framer-motion";
import { Leaf, Mail, Github, ArrowUp } from "lucide-react";
import { useInView } from "../hooks/useInView";
import { site } from "../content/site";
import { scrollPageToTop } from "./SmoothScroll";

/* 目录：与页面板块一一对应，不再按数据多少动态拼 */
const catalogue = [
  { label: "择一匣", href: "#archive" },
  { label: "身份帖", href: "#identity" },
  { label: "此刻志", href: "#moments" },
  { label: "知行录", href: "#experiences" },
  { label: "关于我", href: "#about" },
  { label: "全部入口", href: "#links" },
];

export default function Footer() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const scrollToTop = () => {
    scrollPageToTop();
  };

  return (
    <footer id="contact" className="relative pt-20 pb-8 lg:pt-24 lg:pb-10 bg-ink text-parchment overflow-hidden">
      {/* Decorative botanical watermark */}
      <div className="absolute top-8 right-8 opacity-[0.03] pointer-events-none select-none">
        <Leaf className="w-64 h-64 text-emerald-light" />
      </div>

      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[1px]">
        <svg viewBox="0 0 1440 48" className="w-full h-10 lg:h-12" preserveAspectRatio="none">
          {/* 波浪填色走同一个 token：写死数值的话会和中性色不同步，顶部出现一条接缝 */}
          <path
            d="M0,48 L0,24 C240,8 480,0 720,16 C960,32 1200,8 1440,24 L1440,48 Z"
            fill="var(--color-ink)"
          />
        </svg>
      </div>

      <div ref={ref as React.RefObject<HTMLDivElement>} className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-light" />
              <span
                className="text-xl tracking-wide"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-parchment)" }}
              >
                {site.meta.siteName}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed opacity-60 max-w-xs"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {site.profile.footerNote}
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4
              className="text-sm uppercase tracking-widest mb-5 opacity-40"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              Catalogue
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {catalogue.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-50 hover:opacity-100 hover:text-emerald-light transition-all duration-300"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4
              className="text-sm uppercase tracking-widest mb-5 opacity-40"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${site.profile.email}`}
                className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 hover:text-emerald-light transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                {site.profile.email}
              </a>
              <div className="flex items-center gap-3 mt-2">
                <a
                  href={site.links
                    .flatMap((group) => group.items)
                    .find((item) => item.title === "GitHub")?.href ?? "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-sm border border-white/8 opacity-50 hover:opacity-100 hover:border-emerald-light/30 hover:text-emerald-light hover:bg-emerald-light/5 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom line */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-30" style={{ fontFamily: "var(--font-accent)" }}>
            Cultivated with care. All specimens documented.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs opacity-30">
              &copy; {new Date().getFullYear()} {site.profile.name}. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-sm border border-white/8 opacity-30 hover:opacity-80 hover:border-emerald-light/30 hover:text-emerald-light transition-all duration-300"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
