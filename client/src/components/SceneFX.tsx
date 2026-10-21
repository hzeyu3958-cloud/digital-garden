/*
 * SceneFX: 画面里的「活物」——蝴蝶、花瓣、光点、胶片颗粒
 * 全部用 CSS 关键帧驱动，不占 JS 主线程，也不引入动画库
 */
import { useMemo } from "react";

/** 稳定伪随机：同一个 index 永远得到同一组参数，避免重渲染时蝴蝶乱跳 */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const FLY = ["fly-a", "fly-b", "fly-c", "fly-d"];
const HUES = ["#f2a8bd", "#8fd0ea", "#f4d782", "#b9e6a5", "#d7b4ff", "#fff3e0"];

function Butterfly({ hue, size, flap }: { hue: string; size: number; flap: number }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 32 26" className="overflow-visible">
      <g className="butterfly-wing" style={{ animationDuration: `${flap}s` }}>
        <path d="M16 13C11 3 2 4.5 3 10.5 4 16.8 11 16 16 13Z" fill={hue} opacity="0.92" />
        <path d="M16 13C21 3 30 4.5 29 10.5 28 16.8 21 16 16 13Z" fill={hue} opacity="0.72" />
        <path d="M16 13C12 19 6.5 19.5 6.5 16 6.5 12.6 12 12.2 16 13Z" fill={hue} opacity="0.55" />
        <path d="M16 13C20 19 25.5 19.5 25.5 16 25.5 12.6 20 12.2 16 13Z" fill={hue} opacity="0.42" />
      </g>
      <ellipse cx="16" cy="13" rx="1.05" ry="4.4" fill="#5b4a3a" opacity="0.85" />
    </svg>
  );
}

export function Butterflies({ count = 9 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        fly: FLY[i % FLY.length],
        dur: 17 + rand(i + 1) * 15,
        delay: -rand(i + 7) * 26,
        size: 17 + rand(i + 13) * 24,
        hue: HUES[i % HUES.length],
        flap: 0.19 + rand(i + 19) * 0.17,
        top: 4 + rand(i + 23) * 66,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${b.top}%`,
            left: 0,
            animation: `${b.fly} ${b.dur}s linear ${b.delay}s infinite`,
            filter: "drop-shadow(0 6px 10px oklch(0.2 0.02 160 / 0.28))",
          }}
        >
          <Butterfly hue={b.hue} size={b.size} flap={b.flap} />
        </div>
      ))}
    </div>
  );
}

export function Petals({ count = 12 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rand(i + 3) * 100,
        dur: 13 + rand(i + 5) * 13,
        delay: -rand(i + 11) * 22,
        size: 7 + rand(i + 17) * 9,
        hue: HUES[(i + 2) % HUES.length],
        sway: 2.6 + rand(i + 29) * 2.4,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((p, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            animation: `petal-fall ${p.dur}s linear ${p.delay}s infinite`,
          }}
        >
          <div style={{ animation: `petal-sway ${p.sway}s ease-in-out infinite` }}>
            <div
              style={{
                width: p.size,
                height: p.size * 0.72,
                borderRadius: "62% 38% 55% 45% / 55% 48% 52% 45%",
                background: `linear-gradient(140deg, ${p.hue}, oklch(0.98 0.01 85))`,
                opacity: 0.85,
                animation: `petal-spin ${(p.dur / 2).toFixed(2)}s linear infinite`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Sparkles({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rand(i + 31) * 100,
        top: rand(i + 37) * 100,
        size: 1.6 + rand(i + 41) * 3.2,
        delay: -rand(i + 43) * 4,
        dur: 2.4 + rand(i + 47) * 3.4,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((s, i) => (
        <span
          key={i}
          className="sparkle absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "oklch(0.86 0.11 85)",
            boxShadow: "0 0 10px 2px oklch(0.78 0.14 85 / 0.55)",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/** 胶片颗粒 + 暗角 + 轻微曝光抖动：让静帧读起来像视频 */
export function FilmGrain({ id, opacity = 0.075 }: { id: string; opacity?: number }) {
  return (
    <>
      <svg
        className="film-grain pointer-events-none absolute -inset-[12%] h-[124%] w-[124%]"
        style={{ opacity, mixBlendMode: "overlay" }}
        aria-hidden="true"
      >
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="3" stitchTiles="stitch">
            <animate
              attributeName="baseFrequency"
              values="0.86;0.79;0.93;0.86"
              dur="0.42s"
              repeatCount="indefinite"
            />
          </feTurbulence>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 45%, transparent 42%, oklch(0.14 0.025 160 / 0.6) 100%)",
        }}
      />
      <div
        className="crt-flicker pointer-events-none absolute inset-0 bg-parchment mix-blend-soft-light"
        aria-hidden="true"
      />
    </>
  );
}
