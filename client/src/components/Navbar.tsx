/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * Navbar: Fixed top navigation with botanical accent, parchment background
 * Font: DM Serif Display for logo, Source Sans 3 for links
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, Volume2, VolumeX } from "lucide-react";
import { site } from "../content/site";
import { sfx } from "../lib/gardenAudio";
import { scrollToSection } from "./SmoothScroll";

/* 双语导航：中文一行、英文小字一行，对齐参考站顶栏 */
const navLinks = [
  { label: "君初见", sub: "ENCOUNTER", href: "#home" },
  { label: "择一匣", sub: "ARCHIVE", href: "#archive" },
  { label: "身份帖", sub: "IDENTITY", href: "#identity" },
  { label: "此刻志", sub: "MOMENTS", href: "#moments" },
  { label: "知行录", sub: "FIELD NOTES", href: "#experiences" },
  { label: "关于我", sub: "ABOUT", href: "#about" },
  { label: "联系我", sub: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [muted, setMuted] = useState(() => sfx.muted);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect active section
      const sections = navLinks.map(l => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    sfx.unlock();
    sfx.click();
    scrollToSection(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-card shadow-[0_1px_0_oklch(0.596_0.145_163.225/0.12)] border-b border-emerald/10"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            className="flex items-center gap-2 group"
          >
            <Leaf className="w-5 h-5 text-emerald transition-transform duration-300 group-hover:rotate-12" />
            <span
              className="text-lg lg:text-xl text-ink tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {site.meta.siteName}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`relative px-3 py-2 transition-colors duration-300 ${
                    isActive
                      ? "text-emerald-dark font-medium"
                      : "text-ink/60 hover:text-emerald"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-[13px]">{link.label}</span>
                    <span
                      className="mt-1 text-[8px] opacity-60"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {link.sub}
                    </span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* 音效开关 + 移动端菜单 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sfx.unlock();
                setMuted(sfx.toggle());
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 transition-colors hover:border-emerald hover:text-emerald"
              aria-label={muted ? "开启音效" : "关闭音效"}
              title={muted ? "开启音效" : "关闭音效"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-ink/70 hover:text-emerald transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 glass-card lg:hidden"
          >
            <div className="container py-8 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                    activeSection === link.href.replace("#", "")
                      ? "bg-emerald/10 text-emerald-dark font-medium"
                      : "text-ink/70 hover:bg-emerald/5 hover:text-emerald"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span className="section-number text-xs opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col leading-tight">
                    {link.label}
                    <span className="text-[10px] opacity-55" style={{ letterSpacing: "0.2em" }}>
                      {link.sub}
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
