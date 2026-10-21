/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * SectionWrapper: Premium section with staggered reveal animations
 */
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import SplitText from "./SplitText";

interface SectionWrapperProps {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  bgClassName?: string;
}

export default function SectionWrapper({
  id,
  number,
  title,
  subtitle,
  children,
  className = "",
  bgClassName = "",
}: SectionWrapperProps) {
  const { ref, inView } = useInView({ threshold: 0.08 });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-20 lg:py-28 overflow-hidden ${bgClassName}`}
    >
      <div className={`container relative z-10 ${className}`}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-number text-sm tracking-widest uppercase"
            >
              Specimen No.{number}
            </motion.span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="botanical-divider flex-1 max-w-[120px] origin-left"
            />
          </div>

          <h2
            className="text-3xl lg:text-4xl xl:text-5xl text-ink leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {/* 逐字 3D 翻入：对齐原站 #identity 标题 */}
            <SplitText
              text={title}
              gradient
              active={inView}
              delay={0.15}
              charDelay={0.045}
            />
          </h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3 text-base lg:text-lg text-ink/55 max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {children}
      </div>
    </section>
  );
}