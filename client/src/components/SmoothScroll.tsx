/*
 * SmoothScroll: Lenis 平滑滚动 + GSAP ticker 同频
 * lerp 0.085 与参考站一致；关键是把 Lenis 挂到 gsap.ticker 上，
 * 全站只剩一个 rAF，ScrollTrigger 也能跟着惯性帧准确更新
 */
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsapConfig";

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

    /* 成熟做法：滚动事件喂给 ScrollTrigger，raf 交给 gsap.ticker 统一驱动 */
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenisInstance = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
