/*
 * AnimatedBackground: Floating botanical particles for visual depth
 * Creates organic floating orbs that give the page a living, breathing feel
 */
import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;    // percentage
  y: number;    // percentage
  size: number; // px
  duration: number; // seconds
  delay: number;
  color: string;
  blur: number;
}

export default function AnimatedBackground() {
  const particles = useMemo<Particle[]>(() => {
    /* 光斑以暖纸/金为主，绿只留两颗当点缀：五个里四个绿会把整页染成青苔色 */
    const colors = [
      "oklch(0.900 0.020 88 / 0.10)",
      "oklch(0.700 0.130 85 / 0.05)",
      "oklch(0.575 0.115 165 / 0.04)",
      "oklch(0.860 0.028 145 / 0.06)",
      "oklch(0.940 0.010 80 / 0.09)",
    ];
    const items: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 40 + Math.random() * 120,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        blur: 30 + Math.random() * 40,
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            filter: `blur(${p.blur}px)`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}