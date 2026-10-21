/*
 * Design: Neo-Swiss Botanical — 「数字花园」
 * IdentitySection: 对齐参考站 #identity
 *   - 标题逐字 3D 翻入（y 52 / rotateX -68 / z -36 / 每字 0.085s / 单字 0.9s / cubic-bezier(.2,1.4,.4,1)）
 *   - 13 枚身份胶囊用 Matter.js 真实重力掉落（gravity 0.72 / restitution 0.46），落定后可以拖拽
 */
import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { site } from "../../content/site";
import { useInView } from "../../hooks/useInView";
import { sfx } from "../../lib/gardenAudio";
import SectionHeader from "../SectionHeader";

const { identity } = site;

/** 掉落节奏：每枚间隔 90ms，参考站的错帧手感 */
const STAGGER_MS = 90;

interface Chip {
  el: HTMLDivElement;
  body: Matter.Body;
  w: number;
  h: number;
  delay: number;
  live: boolean;
}

export default function IdentitySection({ active = true }: { active?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const stageRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<(HTMLDivElement | null)[]>([]);
  /** false：胶囊还在正常流里排版（用于测量尺寸）；true：交给物理引擎接管 */
  const [armed, setArmed] = useState(false);
  const sizesRef = useRef<{ w: number; h: number }[]>([]);
  const reduceRef = useRef(false);

  const run = active && inView;

  /* 先测量：胶囊还在文档流里时取自然宽高 */
  useEffect(() => {
    if (!run || armed) return;
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    sizesRef.current = chipsRef.current
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
    setArmed(true);
  }, [run, armed]);

  /* 再交给 Matter.js */
  useEffect(() => {
    const stage = stageRef.current;
    if (!run || !armed || !stage || reduceRef.current) return;

    const els = chipsRef.current.filter(
      (el): el is HTMLDivElement => Boolean(el)
    );
    if (!els.length) return;

    const engine = Matter.Engine.create();
    engine.gravity.y = 0.72;
    /* 打开休眠：落定之后可以停掉循环 */
    engine.enableSleeping = true;

    let width = stage.clientWidth;
    let height = stage.clientHeight;

    const walls = [
      Matter.Bodies.rectangle(width / 2, height + 24, width * 3, 48, {
        isStatic: true,
        friction: 0.4,
        restitution: 0.2,
      }),
      Matter.Bodies.rectangle(-24, height / 2, 48, height * 3, {
        isStatic: true,
      }),
      Matter.Bodies.rectangle(width + 24, height / 2, 48, height * 3, {
        isStatic: true,
      }),
    ];
    Matter.Composite.add(engine.world, walls);

    const chips: Chip[] = els.map((el, i) => {
      const size = sizesRef.current[i] ?? { w: 160, h: 48 };
      const body = Matter.Bodies.rectangle(
        /* 起始位置：舞台上方，横向随机 */
        size.w / 2 + Math.random() * Math.max(width - size.w, 1),
        -size.h / 2 - i * 46,
        size.w,
        size.h,
        {
          restitution: 0.46,
          friction: 0.08,
          frictionAir: 0.028,
          density: 0.0018,
          chamfer: { radius: size.h / 2 },
        }
      );
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      el.style.opacity = "0";
      el.style.transform = `translate3d(${Math.random() * width}px, ${-size.h}px, 0)`;
      return { el, body, w: size.w, h: size.h, delay: i * STAGGER_MS, live: false };
    });

    /* 拖拽：和参考站一样，落定的胶囊还能拨 */
    const mouse = Matter.Mouse.create(stage);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.16, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    /* 落地与互撞的闷响：音量跟着撞击速度走 */
    let lastThud = 0;
    Matter.Events.on(engine, "collisionStart", (event) => {
      const now = performance.now();
      if (now - lastThud < 45) return;
      let k = 0;
      for (const pair of event.pairs) {
        const s = Math.max(pair.bodyA.speed, pair.bodyB.speed);
        k = Math.max(k, Math.min(s / 11, 1));
      }
      if (k > 0.06) {
        lastThud = now;
        sfx.thunk(k);
      }
    });

    const start = performance.now();
    let raf = 0;
    let last = start;
    let settledAt = 0;

    const step = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      Matter.Engine.update(engine, dt);

      let sleeping = true;
      for (const c of chips) {
        if (!c.live) {
          if (now - start >= c.delay) {
            Matter.Composite.add(engine.world, c.body);
            c.el.style.opacity = "1";
            c.live = true;
          }
          sleeping = false;
          continue;
        }
        const { position, angle } = c.body;
        c.el.style.transform =
          `translate3d(${position.x - c.w / 2}px, ${position.y - c.h / 2}px, 0)` +
          ` rotate(${angle}rad)`;
        if (!c.body.isSleeping) sleeping = false;
      }

      /* 全部静止半秒后收工，省电 */
      if (sleeping) {
        if (!settledAt) settledAt = now;
        else if (now - settledAt > 500) return;
      } else {
        settledAt = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    /* 宽度变了就重建舞台，避免胶囊卡在墙外 */
    const onResize = () => {
      const nextW = stage.clientWidth;
      const nextH = stage.clientHeight;
      if (nextW === width && nextH === height) return;
      width = nextW;
      height = nextH;
      Matter.Body.setPosition(walls[0], { x: width / 2, y: height + 24 });
      Matter.Body.setPosition(walls[1], { x: -24, y: height / 2 });
      Matter.Body.setPosition(walls[2], { x: width + 24, y: height / 2 });
      Matter.Body.setStatic(walls[0], true);
      settledAt = 0;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      Matter.World.remove(engine.world, mouseConstraint);
      Matter.Engine.clear(engine);
    };
  }, [run, armed]);

  return (
    <section id="identity" ref={ref} className="relative overflow-hidden py-20 lg:py-28">
      <div className="container relative z-10">
        <SectionHeader
          kicker={identity.kicker}
          title={identity.title}
          lead={identity.lead}
          active={inView}
          onDone={() => sfx.chime()}
          titleClass="text-3xl leading-[1.08] text-ink lg:text-5xl xl:text-[3.4rem]"
        />

        {/* 物理舞台 */}
        <div
          ref={stageRef}
          className={`mt-10 h-[420px] touch-none select-none sm:h-[460px] lg:h-[520px] ${
            armed && !reduceRef.current ? "block cursor-grab" : "flex flex-wrap content-start gap-3"
          }`}
        >
          {identity.capsules.map((c, i) => (
            <div
              key={c.label}
              ref={(el) => {
                chipsRef.current[i] = el;
              }}
              className="will-change-transform rounded-full border border-emerald/25 bg-parchment px-5 py-2.5 shadow-[0_14px_28px_-18px_oklch(0.28_0.03_160/0.55)]"
            >
              <span
                className="block text-base text-ink leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.label}
              </span>
              {c.sub && (
                <span className="mt-1 block text-[0.68rem] tracking-wide text-ink/45">
                  {c.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
