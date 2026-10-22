/*
 * LivingScene: 把一张静帧变成「会动的场景」
 *   0. 给了 videoSrc 就直接播循环视频（跟参考站同构）
 *   1. 默认走 WebGL 着色器：逐像素扰动 UV —— 水面起波、植物摆动、镜头呼吸
 *      着色器不可用时自动回退到 CSS 双层视差（下面 2、3 两套共存）
 *   2. 同一张图铺两层，前后层用不同速率、不同幅度漂移 → 2.5D 景深
 *   3. 前层只保留近景（遮罩渐隐），所以移动时不会看到重影
 *   4. 主体处叠一团呼吸光斑；水面处叠一层滑动的波光
 *   5. 蝴蝶沿路径飞、花瓣飘落、金色光点闪烁
 *   6. 最后盖胶片颗粒 + 暗角 + 曝光抖动 —— 眼睛会把它读成视频
 */
import { useState } from "react";
import { Butterflies, FilmGrain, Petals, Sparkles } from "./SceneFX";
import SceneGL from "./SceneGL";

interface LivingSceneProps {
  src: string;
  /** 循环背景视频路径；非空时优先于 src 图片 */
  videoSrc?: string;
  /** 每个场景的颗粒滤镜 id 必须唯一，否则同页多个场景会串味 */
  grainId: string;
  position?: string;
  /** 着色器的纵向对焦 0~1（对应 position 的垂直百分比） */
  panY?: number;
  /** 呼吸光斑的中心，百分比字符串 */
  bloomAt?: { x: string; y: string; size: string };
  /** 花朵绽放：花心用「原图」坐标 0~1，radius 以图高为单位 */
  flowerBloom?: { x: number; y: number; radius: number; delay?: number; duration?: number };
  /** 绽放开关，一般接分区的 active */
  flowerOpen?: boolean;
  /** 水面波光覆盖的矩形 */
  shimmerAt?: { left: string; top: string; width: string; height: string };
  overlay?: string;
  butterflies?: number;
  petals?: number;
  sparkles?: number;
  blur?: number;
  className?: string;
  children?: React.ReactNode;
}

/* 压暗层只负责可读性，不参与上色：带绿相的纱幕会把照片自己的天蓝与花色吃掉 */
const DEFAULT_OVERLAY =
  "linear-gradient(180deg, oklch(0.13 0.005 245 / 0.26) 0%, oklch(0.13 0.005 245 / 0.02) 38%, oklch(0.11 0.005 245 / 0.46) 100%)";

export default function LivingScene({
  src,
  videoSrc,
  grainId,
  position = "center",
  panY = 0.5,
  bloomAt,
  flowerBloom,
  flowerOpen,
  shimmerAt,
  overlay = DEFAULT_OVERLAY,
  butterflies = 9,
  petals = 12,
  sparkles = 18,
  blur = 0,
  className = "",
  children,
}: LivingSceneProps) {
  const [glOn, setGlOn] = useState(false);

  const imagePlane = {
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: position,
  } as const;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {videoSrc ? (
        /* 真视频层：自动接管所有运动，不再铺视差静帧 */
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ filter: `saturate(1.06) brightness(1.02)` }}
          />
          {blur > 0 && (
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
              }}
            />
          )}
        </>
      ) : (
        <>
          {/* WebGL 层：首帧成功后接管所有运动 */}
          <div
            className={`absolute ${blur > 0 ? "inset-[-4%]" : "inset-0"}`}
            style={blur ? { filter: `blur(${blur}px)` } : undefined}
          >
            <SceneGL
              src={src}
              panY={panY}
              flowerBloom={flowerBloom}
              flowerOpen={flowerOpen}
              onReady={() => setGlOn(true)}
            />
          </div>

          {/* 回退层：着色器不可用时才动 */}
          {!glOn && (
            <>
              {/* 远景层：慢，幅度小 */}
              <div
                className="scene-back absolute inset-[-4%]"
                style={{
                  ...imagePlane,
                  filter: `saturate(1.06) brightness(1.02)${blur ? ` blur(${blur}px)` : ""}`,
                }}
              />

              {/* 近景层：快，幅度大，只留画面下方，制造视差 */}
              <div
                className="scene-front absolute inset-[-8%]"
                style={{
                  ...imagePlane,
                  filter: "blur(1.6px) saturate(1.1)",
                  WebkitMaskImage:
                    "linear-gradient(to top, #000 0%, #000 20%, transparent 56%)",
                  maskImage:
                    "linear-gradient(to top, #000 0%, #000 20%, transparent 56%)",
                }}
              />
            </>
          )}
        </>
      )}

      {bloomAt && (
        <div
          className="bloom absolute rounded-full"
          style={{
            left: bloomAt.x,
            top: bloomAt.y,
            width: bloomAt.size,
            height: bloomAt.size,
            background:
              "radial-gradient(circle, oklch(0.93 0.10 85 / 0.5) 0%, oklch(0.9 0.08 95 / 0.18) 42%, transparent 68%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {shimmerAt && (
        <div
          className="water-shimmer absolute mix-blend-overlay"
          style={shimmerAt}
        />
      )}

      {butterflies > 0 && <Butterflies count={butterflies} />}
      {petals > 0 && <Petals count={petals} />}
      {sparkles > 0 && <Sparkles count={sparkles} />}

      {/* 压暗层，保证文字对比度 */}
      <div className="absolute inset-0" style={{ background: overlay }} />

      <FilmGrain id={grainId} />

      {children}
    </div>
  );
}
