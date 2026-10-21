/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Home: Main portfolio page composing all sections
 * Layout: Single-page scroll with animated botanical dividers
 */
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import ScrollProgress from "../components/ScrollProgress";
import SmoothScroll from "../components/SmoothScroll";
import GardenIntro from "../components/GardenIntro";
import GardenCursorTrail from "../components/GardenCursorTrail";
import HeroSection from "../components/sections/HeroSection";
import ArchiveSection from "../components/sections/ArchiveSection";
import IdentitySection from "../components/sections/IdentitySection";
import MomentsSection from "../components/sections/MomentsSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import AboutSection from "../components/sections/AboutSection";
import LinksSection from "../components/sections/LinksSection";
import Footer from "../components/Footer";
import { sfx } from "../lib/gardenAudio";

function BotanicalDivider() {
  return (
    <div className="relative flex items-center justify-center py-2 overflow-hidden">
      <svg width="240" height="28" viewBox="0 0 240 28" fill="none" className="opacity-20">
        <path
          d="M0,14 C30,14 40,6 60,6 C80,6 80,22 100,22 C120,22 120,6 140,6 C160,6 170,14 200,14 C230,14 240,6 240,14"
          stroke="oklch(0.596 0.145 163.225)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="120" cy="14" r="2.5" fill="oklch(0.596 0.145 163.225)" />
        <circle cx="60" cy="6" r="1.5" fill="oklch(0.596 0.145 163.225 / 0.4)" />
        <circle cx="180" cy="14" r="1.5" fill="oklch(0.596 0.145 163.225 / 0.4)" />
      </svg>
    </div>
  );
}

export default function Home() {
  /* 开场门：同一会话内只走一次 */
  const [entered, setEntered] = useState(() => {
    try {
      return sessionStorage.getItem("garden-entered") === "1";
    } catch {
      return false;
    }
  });

  /* 进门之后：环境风声与鸟鸣一直垫底 */
  useEffect(() => {
    if (!entered) return;
    sfx.ambient(true);
    return () => sfx.ambient(false);
  }, [entered]);

  /* 任何一个链接或按钮按下都给一声轻响，不用逐个组件埋点 */
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("a,button")) sfx.click();
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => window.removeEventListener("pointerdown", onDown, true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SmoothScroll />
      <ScrollProgress />
      <GardenCursorTrail />
      {!entered && <GardenIntro onEnter={() => setEntered(true)} />}
      <AnimatedBackground />
      <Navbar />

      {/* 与参考站同序：home → archive → identity → moments → experiences → about → links */}
      <HeroSection active={entered} />
      <ArchiveSection active={entered} />
      <BotanicalDivider />
      <IdentitySection active={entered} />
      <MomentsSection active={entered} />
      <ExperienceSection active={entered} />
      <BotanicalDivider />
      <AboutSection active={entered} />
      <BotanicalDivider />
      <LinksSection />

      <Footer />
    </div>
  );
}