/*
 * SectionHeader: 全站统一的分区标题排
 * ------------------------------------------------------------------
 * 之前每个分区各写一套 h2 + kicker，字号、间距、颜色全都漂移，
 * 页面就显得「没设计过」。统一成一条排：
 *   金色细线 + 大字距 kicker（先拉开）
 *   遮罩行揭示的大标题
 *   灰色导语（可以放右侧，做成 editorial 的两栏）
 * tone 决定深底/浅底用色，避免每个分区自己调 contrast。
 */
import SplitHeading from "./SplitHeading";

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  lead?: string;
  active?: boolean;
  /** light = 米白底；dark = 深色场景底 */
  tone?: "light" | "dark";
  /** 导语跟随标题下方，还是与标题两端对齐 */
  leadLayout?: "below" | "aside";
  className?: string;
  titleClass?: string;
  onDone?: () => void;
}

export default function SectionHeader({
  kicker,
  title,
  lead,
  active = true,
  tone = "light",
  leadLayout = "below",
  className = "",
  titleClass = "text-3xl leading-[1.08] lg:text-5xl xl:text-[3.4rem]",
  onDone,
}: SectionHeaderProps) {
  const ink = tone === "dark" ? "text-parchment" : "text-ink";
  const soft = tone === "dark" ? "text-parchment/60" : "text-ink/55";
  const kickerColor = tone === "dark" ? "text-gold/85" : "text-emerald-dark/75";

  const titleNode = (
    <SplitHeading
      text={title}
      active={active}
      delay={0.12}
      onDone={onDone}
      className={`font-display ${titleClass} ${ink}`}
      style={{ textWrap: "balance" }}
    />
  );

  const leadNode = lead && (
    <p
      className={`max-w-xl text-[0.95rem] leading-[1.8] transition-all duration-700 ease-out ${soft} ${
        active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ fontFamily: "var(--font-body)", transitionDelay: "420ms" }}
    >
      {lead}
    </p>
  );

  return (
    <div className={className}>
      {kicker && (
        <div
          className="mb-4 flex items-center gap-3 transition-all duration-700 ease-out"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "none" : "translateY(10px)",
          }}
        >
          <span
            className="block h-px origin-left bg-gold/70 transition-transform duration-[900ms] ease-out"
            style={{
              width: "2.25rem",
              transform: active ? "scaleX(1)" : "scaleX(0)",
              transitionDelay: "120ms",
            }}
          />
          <p
            className={`text-[0.68rem] uppercase ${kickerColor}`}
            style={{ letterSpacing: "0.44em", fontFamily: "var(--font-body)" }}
          >
            {kicker}
          </p>
        </div>
      )}

      {leadLayout === "aside" ? (
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          {titleNode}
          {leadNode}
        </div>
      ) : (
        <>
          {titleNode}
          {leadNode && <div className="mt-4">{leadNode}</div>}
        </>
      )}
    </div>
  );
}
