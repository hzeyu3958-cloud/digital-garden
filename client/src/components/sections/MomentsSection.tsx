/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * MomentsSection: 对齐参考站的双轨流（180vh sticky）
 *   - 外层 180vh，内层 sticky 满屏；两条流相向而行（右 126px/s、左 108px/s）
 *   - 滚动位移按 0.46 / 0.36 的比例叠加到轨道上，形成视差拖影
 *   - 卡面默认是「文字版」：不需要照片也能站得住，填了 src 自动换成图
 */
import { useEffect, useRef } from "react";
import { Leaf } from "lucide-react";
import { site, type MomentItem } from "../../content/site";
import { useInView } from "../../hooks/useInView";
import SectionHeader from "../SectionHeader";

const { moments } = site;

const SPEED_RIGHT = 126; // px/s
const SPEED_LEFT = 108; // px/s
const SCROLL_A = 0.46;
const SCROLL_B = 0.36;
const COPIES = 3; // 每条轨道重复 3 组，保证首尾无缝

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** 卡片尺寸循环，参考站的大小错落节奏 */
const SIZES = [
  "h-[300px] w-[220px]",
  "h-[360px] w-[268px]",
  "h-[260px] w-[330px]",
  "h-[320px] w-[240px]",
];

/** 文字卡的植物底：四色轮换，避免一整排同一个调子 */
const PLATES = [
  "linear-gradient(150deg, oklch(0.94 0.022 150) 0%, oklch(0.86 0.048 158) 55%, oklch(0.74 0.068 152) 100%)",
  "linear-gradient(200deg, oklch(0.96 0.016 90) 0%, oklch(0.9 0.035 140) 60%, oklch(0.79 0.055 158) 100%)",
  "linear-gradient(160deg, oklch(0.93 0.03 165) 0%, oklch(0.83 0.05 160) 50%, oklch(0.7 0.06 150) 100%)",
  "linear-gradient(215deg, oklch(0.95 0.02 100) 0%, oklch(0.88 0.04 150) 45%, oklch(0.76 0.06 160) 100%)",
];

function Card({
  item,
  size,
  index,
}: {
  item: MomentItem;
  size: string;
  index: number;
}) {
  return (
    <figure
      className={`group relative shrink-0 overflow-hidden rounded-[18px] border border-ink/10 bg-parchment shadow-[0_24px_48px_-28px_oklch(0.28_0.03_160/0.45)] transition-transform duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:scale-[1.035] ${size}`}
    >
      {item.src ? (
        <img
          src={item.src}
          alt={item.caption}
          className="ken-burns absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <>
          <div
            className="absolute inset-[-8%]"
            style={{ background: PLATES[index % PLATES.length] }}
          />
          {/* 叶脉水印：给底版一点纹理，不留成一整块纯色 */}
          <Leaf
            className="absolute -right-4 -top-4 h-28 w-28 text-emerald-dark/10"
            strokeWidth={1}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.4) 50%, transparent 70%)",
            }}
          />
        </>
      )}

      <figcaption className="relative flex h-full flex-col justify-end p-5">
        <span
          className="absolute right-4 top-3 text-2xl text-emerald-dark/35"
          style={{ fontFamily: "var(--font-accent)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="text-[0.6rem] uppercase text-emerald-dark/80"
          style={{ letterSpacing: "0.36em", fontFamily: "var(--font-body)" }}
        >
          {item.caption}
        </span>
        {item.line && (
          <span
            className="mt-2 block text-xl leading-snug text-ink"
            style={{
              fontFamily: "var(--font-display)",
              textWrap: "balance",
            }}
          >
            {item.line}
          </span>
        )}
        {item.note && (
          <span
            className="mt-2 block text-[0.75rem] leading-relaxed text-ink/55"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item.note}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export default function MomentsSection({ active = true }: { active?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.05, once: false });
  const trackA = useRef<HTMLDivElement>(null);
  const trackB = useRef<HTMLDivElement>(null);

  const live = active && inView;

  useEffect(() => {
    if (!live) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const a = trackA.current;
    const b = trackB.current;
    if (!a || !b) return;

    /* 单组宽度 = 整条 scrollWidth / 重复份数 */
    let setA = 0;
    let setB = 0;
    const measure = () => {
      setA = a.scrollWidth / COPIES;
      setB = b.scrollWidth / COPIES;
    };
    measure();

    const section = a.closest("section");
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      /* sticky 内已滚过的距离（rect.top 为负 = 已经往上滚过去多少） */
      const scrolled = section
        ? Math.max(0, -section.getBoundingClientRect().top)
        : 0;
      if (setA > 0) {
        a.style.transform = `translate3d(${-mod(t * SPEED_RIGHT + scrolled * SCROLL_A, setA)}px, 0, 0)`;
      }
      if (setB > 0) {
        b.style.transform = `translate3d(${mod(t * SPEED_LEFT - scrolled * SCROLL_B, setB) - setB}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", measure);
    /* 图片是异步加载的，load 之后再量一次 */
    const imgs = Array.from(a.querySelectorAll("img"));
    imgs.forEach((img) => img.addEventListener("load", measure, { once: true }));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [live]);

  const tracks = [
    { ref: trackA, items: moments.items },
    { ref: trackB, items: [...moments.items].reverse() },
  ];

  return (
    <section id="moments" ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="container pt-24 lg:pt-28">
          <SectionHeader
            kicker={moments.kicker}
            title={moments.title}
            lead={moments.lead}
            active={live}
            leadLayout="aside"
            titleClass="text-3xl leading-[1.08] text-ink lg:text-5xl"
          />
        </div>

        {/* 两条轨道 */}
        <div
          className="relative mt-10 flex-1"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)",
          }}
        >
          {tracks.map((track, i) => (
            <div
              key={i}
              ref={track.ref}
              className="absolute left-0 flex w-max gap-6 will-change-transform"
              style={{ top: i === 0 ? "4%" : "46%" }}
            >
              {Array.from({ length: COPIES }).flatMap((_, copy) =>
                track.items.map((m, idx) => (
                  <Card
                    key={`${copy}-${idx}`}
                    item={m}
                    size={SIZES[(idx + i) % SIZES.length]}
                    index={idx}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
