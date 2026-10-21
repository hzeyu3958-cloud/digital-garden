/*
 * GSAP 统一入口
 * ------------------------------------------------------------------
 * 为什么从「手搓 CSS 关键帧」换成 GSAP：
 *   GSAP 3.13 起（Webflow 赞助）全部插件免费，包含 SplitText / ScrollTrigger。
 *   它解决了三个自己写很难写好的问题：
 *     1. 分行的遮罩揭示 —— 需要真实测量换行位置，字体加载完还要重算
 *     2. 时间线编排 —— 多个元素的进出用 delay 硬凑，一改就乱
 *     3. 与平滑滚动同频 —— 统一挂到 gsap.ticker，不再各开各的 rAF
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/** 尊重系统「减少动态效果」：命中时只做淡入，不做位移与遮罩揭示 */
export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
