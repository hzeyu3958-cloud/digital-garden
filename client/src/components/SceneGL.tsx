/*
 * SceneGL: 用 WebGL 着色器把一张静帧渲染成「每一帧都在动」的画面
 * ------------------------------------------------------------------
 * 为什么要有这个文件：
 *   CSS 位移层只能让整张图平移缩放，眼睛一眼看出是「一张图在飘」。
 *   着色器可以逐像素改 UV —— 水面真的在起波纹、植物真的在风中摆、
 *   镜头有呼吸式的推拉与手持微抖、高光处有色散、暗角随曝光浮动。
 *   观感上就接近一段循环视频，而且不依赖任何素材。
 *
 * 安全网：
 *   - 上下文创建失败 / 着色器编译失败 → 组件什么都不画，下层的 CSS 静帧接管
 *   - 首帧成功才通过 onReady 通知外部关掉 CSS 动画层，绝不会出现黑屏
 *   - prefers-reduced-motion → 只渲染一帧静态画面
 *   - 元素离屏 / 标签页隐藏 → 停掉 rAF，不烧 CPU
 */
import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexSize;
uniform vec2 uRes;
uniform float uTime;
uniform float uAmp;
uniform float uPan;
uniform float uScroll;   /* 本分区在视口里的穿过进度 0~1 */
uniform vec2 uPointer;   /* 光标归一化坐标，默认居中 */
uniform vec3 uRipples[6]; /* xy=落点 z=起始时刻（z<0 表示槽位空） */
uniform vec4 uBloom;     /* 花朵绽放：xy=花心（纹理坐标） z=影响半径 w=绽放进度（w<0 不启用） */

void main() {
  /* ---- 等比 cover 铺满，不变形 ---- */
  float screenA = uRes.x / uRes.y;
  float imgA = uTexSize.x / uTexSize.y;
  vec2 fit = imgA > screenA ? vec2(screenA / imgA, 1.0) : vec2(1.0, imgA / screenA);
  vec2 uv = (vUv - 0.5) * fit + 0.5;

  /* 纵向对焦：等价于 CSS background-position 的垂直百分比 */
  uv.y += (uPan - 0.5) * (1.0 - fit.y);

  /* ---- 花朵绽放 ----
   * 放在镜头变换之前、用纹理坐标做，所以花跟着画面一起推拉摆动，不会错位。
   * 未开：外圈纹理往花心收拢（整朵小一圈）+ 螺旋扭转（花瓣叠成花苞）
   * 开足：只剩六瓣周期性的轻微起伏，让它一直「活着」而不是贴回静帧
   */
  if (uBloom.w >= 0.0) {
    vec2 px = vec2(imgA, 1.0); /* 拉成等比空间，影响区才是圆不是椭圆 */
    vec2 off = (uv - uBloom.xy) * px;
    float r = length(off);
    float f = 1.0 - smoothstep(0.0, uBloom.z, r);
    float open = clamp(uBloom.w, 0.0, 1.0);
    float squeeze = mix(1.0 + 0.55 * f, 1.0, open);
    float twist = (1.0 - open) * 1.25 * f;
    float cs = cos(twist), sn = sin(twist);
    vec2 ro = mat2(cs, -sn, sn, cs) * off;
    vec2 nrm = r > 0.0005 ? off / r : vec2(0.0);
    float petal =
      sin(atan(off.y, off.x) * 6.0 + uTime * 1.05) * 0.006 * f * (0.25 + 0.75 * open) * uAmp;
    uv = uBloom.xy + (ro + nrm * petal) * squeeze / px;
  }

  float sc = clamp(uScroll, 0.0, 1.0);
  /* 滚动推镜：分区从下方升到充满视口时，镜头从稍远推到稍近，视线往下走 */
  uv.y += (sc - 0.5) * 0.050;

  float t = uTime;
  /* ---- 镜头呼吸：缓慢推拉 + 手持微抖 + 滚动推镜 ---- */
  float zoom = 1.06 + 0.024 * sin(t * 0.062) + (sc - 0.5) * 0.075;
  uv = (uv - 0.5) / zoom + 0.5;
  uv.x += (0.0075 * sin(t * 0.131) + 0.0026 * sin(t * 0.53)) * uAmp;
  uv.y += 0.0055 * cos(t * 0.107) * uAmp;

  /* ---- 水面：越靠下波纹越强，两个方向叠加成碎光 ---- */
  float water = smoothstep(0.50, 1.0, vUv.y);
  uv.x += sin(vUv.y * 27.0 + t * 1.25) * 0.0045 * water * uAmp;
  uv.y += sin(vUv.x * 19.0 + t * 0.92) * 0.0032 * water * uAmp;
  uv.x += sin(vUv.y * 61.0 - t * 2.1) * 0.0016 * water * water * uAmp;

  /* ---- 植物随风摆动：围绕画面中部逐渐增强，滚动越深风越大 ---- */
  float sway = sin(t * 0.72 + vUv.x * 3.4) * 0.0028 * uAmp * (1.0 + sc * 0.5);
  uv.x += sway * (0.30 + 0.70 * water);
  uv.y += cos(t * 0.55 + vUv.x * 5.1) * 0.0013 * uAmp;

  /* ---- 指针视差：画面朝光标让位，越靠前景让得越多 ---- */
  uv -= (uPointer - 0.5) * 0.011 * uAmp;

  /* ---- 点击涟漪：从落点一圈圈推开，带衰减的两个指数相乘 ---- */
  float aspect = uRes.x / uRes.y;
  for (int i = 0; i < 6; i++) {
    float born = uRipples[i].z;
    float age = t - born;
    if (born < 0.0 || age < 0.0 || age > 2.6) continue;
    vec2 delta = vUv - uRipples[i].xy;
    delta.x *= aspect;
    float d = length(delta);
    if (d < 0.0005) continue;
    vec2 n = delta / d;
    float wave = sin(d * 26.0 - age * 6.2) * exp(-d * 5.2) * exp(-age * 1.45);
    uv += n * wave * 0.015;
  }

  /* ---- 取样 + 高光处轻微色散 ---- */
  vec3 col = texture2D(uTex, uv).rgb;
  float ca = 0.0013 * uAmp * (0.4 + 0.6 * col.r);
  col.r = texture2D(uTex, uv + vec2(ca, 0.0)).r;
  col.b = texture2D(uTex, uv - vec2(ca, 0.0)).b;

  /* ---- 光标处提亮，像有人拿手电筒扫过画面 ---- */
  vec2 lp = vUv - uPointer;
  lp.x *= aspect;
  col *= 1.0 + 0.12 * uAmp * exp(-length(lp) * 3.1);

  /* ---- 曝光浮动 + 暗角，抹掉「数字感」 ---- */
  col *= 0.968 + 0.032 * sin(t * 0.33) + 0.011 * sin(t * 2.7) + 0.035 * (sc - 0.5);
  vec2 q = vUv - 0.5;
  col *= 1.0 - 0.40 * dot(q, q);

  gl_FragColor = vec4(col, 1.0);
}
`;

interface SceneGLProps {
  src: string;
  /** 动画强度，1 = 默认 */
  amp?: number;
  /** 纵向对焦 0~1，0.5 = 居中 */
  panY?: number;
  /**
   * 花朵绽放的几何参数：x/y 是花心在「原图」里的位置（0~1，直接对着图量），
   * radius 以图高为单位，delay/duration 单位秒。
   */
  flowerBloom?: { x: number; y: number; radius: number; delay?: number; duration?: number };
  /** 绽放开关：false 保持花苞，true 时按 duration 展开（着色器不可用时退化为静帧） */
  flowerOpen?: boolean;
  className?: string;
  onReady?: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function SceneGL({
  src,
  amp = 1,
  panY = 0.5,
  flowerBloom,
  flowerOpen = false,
  className = "",
  onReady,
}: SceneGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  /*
   * 绽放配置走 ref 而不是 effect 依赖：外层每次渲染都会传新的字面量对象，
   * 进依赖会把整个 WebGL 上下文重建一次（画面闪一下）。
   */
  const cfg = useRef({ flowerBloom, flowerOpen });
  cfg.current = { flowerBloom, flowerOpen };
  const clock = useRef({ on: false, t0: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || failed) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }
    const prog = gl.createProgram();
    if (!prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    /* 全屏四边形 */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = {
      tex: gl.getUniformLocation(prog, "uTex"),
      texSize: gl.getUniformLocation(prog, "uTexSize"),
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      amp: gl.getUniformLocation(prog, "uAmp"),
      pan: gl.getUniformLocation(prog, "uPan"),
      scroll: gl.getUniformLocation(prog, "uScroll"),
      pointer: gl.getUniformLocation(prog, "uPointer"),
      ripples: gl.getUniformLocation(prog, "uRipples"),
      bloom: gl.getUniformLocation(prog, "uBloom"),
    };
    gl.uniform1i(U.tex, 0);
    gl.uniform1f(U.amp, amp);
    gl.uniform1f(U.pan, panY);
    /* 默认不启用绽放，等 draw() 里按进度接管 */
    gl.uniform4f(U.bloom, 0.5, 0.5, 0.34, -1);
    /* 静态帧（reduced-motion 只画一帧）用居中进度，保证构图与动帧一致 */
    gl.uniform1f(U.scroll, 0.5);

    /* 指针与涟漪：6 个槽位循环覆盖 */
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    /* 滚动穿过进度：每帧根据分区包围盒重算，再用阻尼平滑，镜头才不会跳 */
    const scrollState = { v: 0.5, t: 0.5 };
    const rippleData = new Float32Array(6 * 3);
    for (let i = 0; i < 6; i++) rippleData[i * 3 + 2] = -1;
    let rippleIdx = 0;
    gl.uniform2f(U.pointer, 0.5, 0.5);
    gl.uniform3fv(U.ripples, rippleData);

    /* 纹理：图加载完再上传 */
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    const image = new Image();
    image.crossOrigin = "anonymous";
    let killed = false;
    image.onload = () => {
      if (killed) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(U.texSize, image.naturalWidth || 1, image.naturalHeight || 1);
      draw();
    };
    image.onerror = () => !killed && setFailed(true);
    image.src = src;

    /* 尺寸：dpr 上限 1.5，手机上也够看 */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(U.res, w, h);
    };
    resize();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let raf = 0;
    let told = false;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let onVis: (() => void) | null = null;
    let onMove: ((e: PointerEvent) => void) | null = null;
    let onLeaveScene: (() => void) | null = null;
    let onDownScene: ((e: PointerEvent) => void) | null = null;
    let region: HTMLElement | null = null;
    const start = performance.now();

    const draw = () => {
      if (killed) return;
      resize();
      const t = reduce ? 0 : (performance.now() - start) / 1000;
      gl.uniform1f(U.time, t);

      /* 光标平滑跟随（阻尼 0.09），不然视差会抖 */
      pointer.x += (pointer.tx - pointer.x) * 0.09;
      pointer.y += (pointer.ty - pointer.y) * 0.09;
      gl.uniform2f(U.pointer, pointer.x, pointer.y);

      /* 分区从下沿进入视口到上沿离开，进度 0 → 1 */
      if (region) {
        const box = region.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        scrollState.t = Math.min(1, Math.max(0, (vh - box.top) / (vh + box.height)));
      }
      scrollState.v += (scrollState.t - scrollState.v) * 0.07;
      gl.uniform1f(U.scroll, scrollState.v);

      /* ---- 花朵绽放：翻开开关那一帧起算，缓出展开，开足后留一丝呼吸 ---- */
      const fb = cfg.current.flowerBloom;
      if (fb) {
        const want = !!cfg.current.flowerOpen;
        if (want !== clock.current.on) {
          clock.current.on = want;
          clock.current.t0 = performance.now();
        }
        const dur = Math.max(0.2, fb.duration ?? 2.6);
        const el = (performance.now() - clock.current.t0) / 1000 - (fb.delay ?? 0);
        /* reduced-motion 不播动画，直接给开足的那一帧 */
        const p = reduce ? 1 : want ? Math.min(1, Math.max(0, el / dur)) : 0;
        const ease = 1 - Math.pow(1 - p, 3);
        const open = ease >= 0.999 ? 0.985 + 0.015 * Math.sin(t * 0.5) : ease;
        gl.uniform4f(U.bloom, fb.x, fb.y, fb.radius, open);
      }

      /* 过期的涟漪槽回收，保证循环里只剩活跃波形 */
      for (let i = 0; i < 6; i++) {
        const born = rippleData[i * 3 + 2];
        if (born >= 0 && t - born > 2.6) rippleData[i * 3 + 2] = -1;
      }
      gl.uniform3fv(U.ripples, rippleData);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (gl.getError() !== gl.NO_ERROR) {
        setFailed(true);
        return;
      }
      if (!told) {
        told = true;
        onReady?.();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (!reduce) {
      /* 指针互动：只要光标在本分区内就跟着走，点击/触摸产生涟漪 */
      region = canvas.closest("section") ?? canvas;
      const scope = region;
      const norm = (cx: number, cy: number) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        return {
          x: Math.min(1, Math.max(0, (cx - rect.left) / rect.width)),
          y: Math.min(1, Math.max(0, (cy - rect.top) / rect.height)),
        };
      };

      onMove = (e: PointerEvent) => {
        if (!scope.contains(e.target as Node)) return;
        const p = norm(e.clientX, e.clientY);
        if (!p) return;
        pointer.tx = p.x;
        pointer.ty = p.y;
      };
      onLeaveScene = () => {
        pointer.tx = 0.5;
        pointer.ty = 0.5;
      };
      onDownScene = (e: PointerEvent) => {
        const el = e.target as HTMLElement | null;
        /* 链接和按钮自己要有反馈，不给它们铺涟漪 */
        if (el?.closest?.("a,button,input,textarea")) return;
        if (!scope.contains(e.target as Node)) return;
        const p = norm(e.clientX, e.clientY);
        if (!p) return;
        const t = (performance.now() - start) / 1000;
        rippleData[rippleIdx * 3] = p.x;
        rippleData[rippleIdx * 3 + 1] = p.y;
        rippleData[rippleIdx * 3 + 2] = t;
        rippleIdx = (rippleIdx + 1) % 6;
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      scope.addEventListener("pointerleave", onLeaveScene);
      scope.addEventListener("pointerdown", onDownScene);

      /* 离屏 / 隐藏标签页就停 rAF */
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !document.hidden && !raf) raf = requestAnimationFrame(loop);
          if (!visible && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);

      onVis = () => {
        if (document.hidden) {
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        } else if (visible && !raf) {
          raf = requestAnimationFrame(loop);
        }
      };
      document.addEventListener("visibilitychange", onVis);

      ro = new ResizeObserver(() => resize());
      ro.observe(canvas);
    }

    return () => {
      killed = true;
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (region) {
        if (onLeaveScene) region.removeEventListener("pointerleave", onLeaveScene);
        if (onDownScene) region.removeEventListener("pointerdown", onDownScene);
      }
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteTexture(tex);
      image.onload = null;
      image.onerror = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, amp, panY, failed]);

  if (failed) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
