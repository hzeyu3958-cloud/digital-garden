/*
 * GardenParticles: 环境粒子场
 * 对齐 danica-garden 的 Three.js Points（96 颗、opacity 0.48、相机跟随鼠标 lerp 0.045）
 * 用 Canvas 2D 实现，不引入 Three.js
 */
import { useEffect, useRef } from "react";

const COUNT = 96;
const MOUSE_LERP = 0.045;

interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  gold: boolean;
}

export default function GardenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let points: Particle[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      points = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.3 + Math.random() * 0.7,
        r: 0.8 + Math.random() * 1.7,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        gold: Math.random() > 0.72,
      }));
    };

    resize();
    seed();

    let rafId = 0;

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * MOUSE_LERP;
      mouse.y += (mouse.ty - mouse.y) * MOUSE_LERP;
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.x < -24) p.x = width + 24;
        else if (p.x > width + 24) p.x = -24;
        if (p.y < -24) p.y = height + 24;
        else if (p.y > height + 24) p.y = -24;

        const px = p.x + mouse.x * p.z * 26;
        const py = p.y + mouse.y * p.z * 26;

        ctx.beginPath();
        ctx.arc(px, py, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? "rgba(186, 148, 62, 0.34)"
          : "rgba(60, 137, 105, 0.30)";
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
