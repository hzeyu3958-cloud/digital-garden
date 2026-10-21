/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Home: Main portfolio page composing all sections
 * Layout: Single-page scroll with animated botanical dividers
 */
import { useState } from "react";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import GardenParticles from "../components/GardenParticles";
import SmoothScroll from "../components/SmoothScroll";
import GardenIntro from "../components/GardenIntro";
import GardenCursorTrail from "../components/GardenCursorTrail";
import HeroSection from "../components/sections/HeroSection";
import LinksSection from "../components/sections/LinksSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import SkillsSection from "../components/sections/SkillsSection";
import AigcSection from "../components/sections/AigcSection";
import PlansSection from "../components/sections/PlansSection";
import NewsSection from "../components/sections/NewsSection";
import WorkSection from "../components/sections/WorkSection";
import LiterarySection from "../components/sections/LiterarySection";
import Footer from "../components/Footer";
import { site } from "../content/site";

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

  return (
    <div className="min-h-screen bg-background">
      <SmoothScroll />
      <GardenCursorTrail />
      {!entered && <GardenIntro onEnter={() => setEntered(true)} />}
      <AnimatedBackground />
      <GardenParticles />
      <Navbar />
      <HeroSection active={entered} />
      <BotanicalDivider />
      <LinksSection />

      {/* 以下板块只在 site.ts 里填了数据后才会出现 */}
      {site.skills.length > 0 && <SkillsSection />}
      {site.projects.length > 0 && (
        <>
          <BotanicalDivider />
          <ProjectsSection />
        </>
      )}
      {site.aigc.length > 0 && (
        <>
          <BotanicalDivider />
          <AigcSection />
        </>
      )}
      {site.plans.length > 0 && (
        <>
          <BotanicalDivider />
          <PlansSection />
        </>
      )}
      {site.news.length > 0 && (
        <>
          <BotanicalDivider />
          <NewsSection />
        </>
      )}
      {site.work.length > 0 && (
        <>
          <BotanicalDivider />
          <WorkSection />
        </>
      )}
      {site.literary.length > 0 && (
        <>
          <BotanicalDivider />
          <LiterarySection />
        </>
      )}
      <Footer />
    </div>
  );
}