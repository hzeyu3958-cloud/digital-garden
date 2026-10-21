/*
 * gardenAudio: 用 Web Audio 现场合成整站音效，不依赖任何音频文件
 *   参考站的录音属于原作者，这里只复刻「听感」：
 *   打字机咔嗒 / 进度滴答 / 进门风声+和弦 / 胶囊落地闷响 / 环境风与鸟鸣
 * 浏览器策略：必须由用户手势解锁（Enter Digital Garden 就是那个手势）
 */

type Ctx = AudioContext & { createBufferSource: AudioContext["createBufferSource"] };

const MASTER = 0.5;
const STORAGE_KEY = "garden-muted";

class GardenAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private verb: ConvolverNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private ambientNodes: { src: AudioBufferSourceNode; gain: GainNode; lfo: OscillatorNode } | null = null;
  private birdTimer: number | null = null;
  private _muted = false;
  private _loaded = false;

  constructor() {
    try {
      this._muted = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      this._muted = false;
    }
  }

  get muted() {
    return this._muted;
  }

  /** 首次调用时建上下文；必须在用户手势里调用 */
  private ensure(): Ctx | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      const ctx: Ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = this._muted ? 0 : MASTER;
      master.connect(ctx.destination);

      /* 小混响：让声音像在花园里而不是在手机里 */
      const verb = ctx.createConvolver();
      verb.buffer = this.impulse(ctx, 1.9, 2.6);
      const verbGain = ctx.createGain();
      verbGain.gain.value = 0.34;
      verb.connect(verbGain).connect(master);

      this.ctx = ctx;
      this.master = master;
      this.verb = verb;
      this.noiseBuf = this.noise(ctx, 2.4);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private noise(ctx: Ctx, seconds: number) {
    const buf = ctx.createBuffer(1, Math.round(ctx.sampleRate * seconds), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** 指数衰减噪声当脉冲响应，够用的「空间感」 */
  private impulse(ctx: Ctx, seconds: number, decay: number) {
    const len = Math.round(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  /** 一段噪声打到指定滤波器上，包络由 gains 决定 */
  private burst(
    opts: {
      type: BiquadFilterType;
      from: number;
      to: number;
      q?: number;
      dur: number;
      peak: number;
      attack?: number;
      send?: number;
      pan?: number;
    }
  ) {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.playbackRate.value = 0.86 + Math.random() * 0.3;

    const f = ctx.createBiquadFilter();
    f.type = opts.type;
    f.Q.value = opts.q ?? 1;
    f.frequency.setValueAtTime(opts.from, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(opts.to, 40), t + opts.dur);

    const g = ctx.createGain();
    const atk = opts.attack ?? 0.006;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.peak, t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);

    let tail: AudioNode = g;
    src.connect(f).connect(g);
    if (opts.pan !== undefined && "createStereoPanner" in ctx) {
      const p = ctx.createStereoPanner();
      p.pan.value = opts.pan;
      g.connect(p);
      tail = p;
    }
    tail.connect(this.master!);
    if (opts.send && this.verb) {
      const s = ctx.createGain();
      s.gain.value = opts.send;
      tail.connect(s).connect(this.verb);
    }
    src.start(t);
    src.stop(t + opts.dur + 0.05);
  }

  private tone(
    opts: {
      freq: number;
      glideTo?: number;
      type?: OscillatorType;
      dur: number;
      peak: number;
      delay?: number;
      send?: number;
      pan?: number;
    }
  ) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + (opts.delay ?? 0);
    const o = ctx.createOscillator();
    o.type = opts.type ?? "sine";
    o.frequency.setValueAtTime(opts.freq, t);
    if (opts.glideTo) o.frequency.exponentialRampToValueAtTime(opts.glideTo, t + opts.dur);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.peak, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);

    let tail: AudioNode = g;
    o.connect(g);
    if (opts.pan !== undefined && "createStereoPanner" in ctx) {
      const p = ctx.createStereoPanner();
      p.pan.value = opts.pan;
      g.connect(p);
      tail = p;
    }
    tail.connect(this.master!);
    if (opts.send && this.verb) {
      const s = ctx.createGain();
      s.gain.value = opts.send;
      tail.connect(s).connect(this.verb);
    }
    o.start(t);
    o.stop(t + opts.dur + 0.05);
  }

  /* ---------------- 对外音效 ---------------- */

  /** 打字机：木质小键的短促咔嗒 */
  keystroke() {
    const ctx = this.ready();
    if (!ctx) return;
    this.burst({
      type: "bandpass",
      from: 1900 + Math.random() * 900,
      to: 900,
      q: 5.5,
      dur: 0.055,
      peak: 0.11,
      send: 0.12,
    });
    this.tone({
      freq: 220 + Math.random() * 90,
      type: "triangle",
      dur: 0.045,
      peak: 0.045,
    });
  }

  /** 开场进度：每 10% 一声轻滴 */
  tick() {
    const ctx = this.ready();
    if (!ctx) return;
    this.tone({ freq: 1180, type: "sine", dur: 0.09, peak: 0.05, send: 0.2 });
  }

  /** UI 点击 / 悬停 */
  click() {
    const ctx = this.ready();
    if (!ctx) return;
    this.tone({ freq: 660, glideTo: 880, type: "triangle", dur: 0.12, peak: 0.07, send: 0.18 });
  }

  hover() {
    const ctx = this.ready();
    if (!ctx) return;
    this.tone({ freq: 1320, type: "sine", dur: 0.07, peak: 0.028 });
  }

  /** 进门：一段由远及近的风 + 大三和弦 */
  enter() {
    const ctx = this.ready();
    if (!ctx) return;
    this.burst({ type: "bandpass", from: 240, to: 5200, q: 1.4, dur: 1.15, peak: 0.2, attack: 0.35, send: 0.5 });
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      this.tone({
        freq: f,
        type: "sine",
        dur: 2.4 - i * 0.2,
        peak: 0.075,
        delay: 0.32 + i * 0.09,
        send: 0.7,
        pan: (i - 1.5) * 0.22,
      })
    );
  }

  /** 幕布合上 / 分区转场：下落的风声 */
  whoosh() {
    const ctx = this.ready();
    if (!ctx) return;
    this.burst({ type: "bandpass", from: 4200, to: 260, q: 1.1, dur: 0.85, peak: 0.14, attack: 0.08, send: 0.4 });
  }

  /** 胶囊落地：闷响，音量随撞击强度 */
  thunk(intensity = 0.5) {
    const ctx = this.ready();
    if (!ctx) return;
    const k = Math.min(Math.max(intensity, 0.06), 1);
    this.tone({
      freq: 120 + k * 90,
      glideTo: 58,
      type: "sine",
      dur: 0.16,
      peak: 0.3 * k,
    });
    this.burst({
      type: "lowpass",
      from: 1400,
      to: 300,
      q: 0.8,
      dur: 0.06,
      peak: 0.09 * k,
      send: 0.15,
    });
  }

  /** 标题落定的一串上滑琶音 */
  chime() {
    const ctx = this.ready();
    if (!ctx) return;
    [784, 988, 1175, 1568].forEach((f, i) =>
      this.tone({ freq: f, type: "triangle", dur: 1.1, peak: 0.05, delay: i * 0.06, send: 0.55, pan: i * 0.12 - 0.2 })
    );
  }

  /* ---------------- 环境音：风 + 随机鸟鸣 ---------------- */

  ambient(on: boolean) {
    if (!on) {
      this.stopAmbient();
      return;
    }
    const ctx = this.ready();
    if (!ctx || this.ambientNodes) return;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 340;
    lp.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    /* 慢 LFO 吹动风力 */
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain).connect(gain.gain);

    src.connect(lp).connect(gain).connect(this.master!);
    src.start();
    lfo.start();
    this.ambientNodes = { src, gain, lfo };

    this.scheduleBird();
  }

  private scheduleBird() {
    if (this.birdTimer) window.clearTimeout(this.birdTimer);
    const wait = 5200 + Math.random() * 9000;
    this.birdTimer = window.setTimeout(() => {
      this.chirp();
      this.scheduleBird();
    }, wait);
  }

  /** 一声鸟鸣：几个快速上滑的短音 */
  private chirp() {
    const ctx = this.ready();
    if (!ctx || this._muted) return;
    const base = 2100 + Math.random() * 1300;
    const pan = Math.random() * 1.2 - 0.6;
    const notes = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < notes; i++) {
      this.tone({
        freq: base * (1 + i * 0.08),
        glideTo: base * (1.35 + Math.random() * 0.4),
        type: "sine",
        dur: 0.075,
        peak: 0.03,
        delay: i * 0.105,
        send: 0.6,
        pan,
      });
    }
  }

  private stopAmbient() {
    if (this.ambientNodes) {
      try {
        this.ambientNodes.src.stop();
        this.ambientNodes.lfo.stop();
      } catch {
        /* 已停 */
      }
      this.ambientNodes = null;
    }
    if (this.birdTimer) {
      window.clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
      /* 隐私模式忽略 */
    }
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(muted ? 0 : MASTER, t, 0.08);
    }
    if (muted) this.stopAmbient();
    else if (this.ctx) this.ambient(true);
  }

  toggle() {
    this.setMuted(!this._muted);
    if (!this._muted) {
      this.click();
      this.ambient(true);
    }
    return this._muted;
  }

  /** 用户手势解锁；只提示一次 resume */
  unlock() {
    const ctx = this.ensure();
    if (ctx && this._loaded === false) this._loaded = true;
    return ctx;
  }

  /** 除 unlock 之外的方法都走这里：没解锁就静默跳过 */
  private ready(): Ctx | null {
    if (!this._loaded) return null;
    return this.ensure();
  }
}

export const sfx = new GardenAudio();
