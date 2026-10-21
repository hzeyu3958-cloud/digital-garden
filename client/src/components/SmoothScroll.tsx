/*
 * SmoothScroll: Lenis 平滑滚动
 * 与 danica-garden 一致的惯性滚动（lerp 0.085），尊重「减少动态效果」设置
 */
import { useEffect } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** 全站统一的锚点跳转：走 Lenis 惯性，避免和原生平滑滚动打架 */
export function scrollToSection(target: string | HTMLElement) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -72, duration: 1.15 });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollPageToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: { offset: -72 },
    });
    lenisInstance = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
