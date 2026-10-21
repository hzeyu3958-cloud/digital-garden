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
    const colors = [
      "oklch(0.596 0.145 163.225 / 0.08)",
      "oklch(0.765 0.115 163.225 / 0.06)",
      "oklch(0.700 0.130 85 / 0.05)",
      "oklch(0.432 0.120 163.225 / 0.06)",
      "oklch(0.940 0.025 163 / 0.07)",
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