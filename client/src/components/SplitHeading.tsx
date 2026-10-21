/*
 * SplitHeading: 遮罩行揭示标题（GSAP SplitText）
 * ------------------------------------------------------------------
 * 效果：文字按「真实的排版行」从下方滑入，行与行之间错峰 85ms。
 * 每一行外面套一层 overflow:hidden 的遮罩，所以像是从纸缝里抽出来的，
 * 而不是整体淡入——这是成熟站点标题最常见的做法。
 *
 * 三个坑要处理：
 *   1. 换行位置只有渲染后才知道，而字体是异步加载的 → fonts.ready 后重算一次
 *   2. React 19 的开发期双挂载 → 用 useLayoutEffect + 干净 revert
 *   3. 入场要能被外部门控（开场门没进完之前不能提前放） → active 变 true 才播
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { SplitText, gsap, prefersReduced } from "../lib/gsapConfig";

interface SplitHeadingProps {
  text: string;
  /** 由外层门控：变 true 的那一瞬间才开始播 */
  active?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  stagger?: number;
  /** 播完回调：用来和音效对齐（标题落定 → 一声琶音） */
  onDone?: () => void;
}

export default function SplitHeading({
  text,
  active = true,
  as = "h2",
  className = "",
  style,
  delay = 0,
  duration = 1.05,
  stagger = 0.085,
  onDone,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const activeRef = useRef(active);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const playedRef = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  activeRef.current = active;

  const play = (split: SplitText) => {
    if (playedRef.current) return;
    playedRef.current = true;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(split.lines, {
      yPercent: 0,
      duration,
      ease: "expo.out",
      stagger,
      delay,
      onComplete: () => doneRef.current?.(),
    });
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = prefersReduced();
    let alive = true;
    let split: SplitText | null = null;

    const setup = () => {
      if (!alive || !ref.current) return;
      split?.revert();
      playedRef.current = false;
      split = SplitText.create(ref.current, { type: "lines", mask: "lines" });
      splitRef.current = split;

      if (reduced) {
        gsap.set(split.lines, { yPercent: 0, opacity: 1 });
        playedRef.current = true;
        return;
      }
      // 先藏起来；已经该播的（active 早就为 true）立刻播
      gsap.set(split.lines, { yPercent: 110 });
      if (activeRef.current) play(split);
    };

    setup();

    /* 字体是异步的：DM Serif Display 落地前后行宽会变，必须重算一次 */
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(setup).catch(() => undefined);
    }

    const onResize = () => {
      if (!playedRef.current) setup();
    };
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      tweenRef.current?.kill();
      tweenRef.current = null;
      split?.revert();
      splitRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (!active) return;
    const split = splitRef.current;
    if (split) play(split);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const Tag = as as "h2";

  return (
    <Tag ref={ref} className={className} style={style}>
      {text}
    </Tag>
  );
}
