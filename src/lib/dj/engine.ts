import {
  DRUMS,
  TOTAL_BARS,
  bassAt,
  getGenre,
  getTrack,
  gridHit,
  sectionFor,
  trackBpm,
  type BassKind,
  type PercKind,
  type SectionId,
  type Track,
} from "./catalog";
import { degreeToSemi, voiceChord } from "./theory";
import {
  makeImpulse,
  makeNoise,
  playBass,
  playChord,
  playClap,
  playConga,
  playCrash,
  playHat,
  playKick,
  playLead,
  playPluck,
  playRiser,
  playSnare,
  playTick,
  playTom,
} from "./voices";

export type DeckId = "A" | "B";
export type LoopBars = 0 | 1 | 2 | 4 | 8;

export interface DeckPosition {
  bar: number;
  step: number;
  bpm: number;
  playing: boolean;
  section: SectionId;
  sectionLabel: string;
}

interface Channel {
  trackId: string;
  bpm: number;
  transpose: number;
  bar: number;
  step: number;
  nextNoteTime: number;
  playing: boolean;
  loopBars: LoopBars;
  loopOrigin: number;
  sync: boolean;
  lastBass: number;
  filter: number;
  bed: AudioBufferSourceNode | null;
  bedGain: GainNode | null;
  music: GainNode;
  drums: GainNode;
  duck: GainNode;
  motion: BiquadFilterNode;
  perf: BiquadFilterNode;
  eqLow: BiquadFilterNode;
  eqMid: BiquadFilterNode;
  eqHigh: BiquadFilterNode;
  delaySend: GainNode;
  reverbSend: GainNode;
  flangerWet: GainNode;
  fader: GainNode;
  gate: GainNode;
  xfade: GainNode;
  analyser: AnalyserNode;
}

function bassKind(style: BassKind): "sub" | "saw" | "reese" | "808" | "octave" {
  if (style === "reese") return "reese";
  if (style === "glide") return "808";
  if (style === "octave" || style === "afro") return "octave";
  if (style === "long" || style === "sparse") return "sub";
  return "saw";
}

function pcOf(root: number, transpose: number): number {
  return ((root + transpose) % 12 + 12) % 12;
}

function other(id: DeckId): DeckId {
  return id === "A" ? "B" : "A";
}

function motionFreq(section: SectionId, barIn: number, step: number): number {
  if (section === "giris") return 780;
  if (section === "groove") return 2400;
  if (section === "yukselis") {
    const p = (barIn * 16 + step) / (8 * 16);
    return 420 * Math.pow(9800 / 420, Math.min(1, Math.max(0, p)));
  }
  if (section === "drop") return 14000;
  if (section === "ara") return 620;
  return barIn > 12 ? 1600 : 7600;
}

let engine: DjEngine | null = null;

export function getEngine(): DjEngine | null {
  return engine;
}

export async function bootEngine(): Promise<DjEngine> {
  if (!engine) engine = new DjEngine();
  await engine.resume();
  return engine;
}

export class DjEngine {
  readonly ctx: AudioContext;
  readonly masterAnalyser: AnalyserNode;
  private readonly noise: AudioBuffer;
  private readonly ch: Record<DeckId, Channel>;
  private timer: ReturnType<typeof setInterval> | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private readonly mediaDest: MediaStreamAudioDestinationNode;

  constructor() {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.noise = makeNoise(this.ctx, 2);

    const masterIn = this.ctx.createGain();
    const master = this.ctx.createGain();
    master.gain.value = 0.75;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 8;
    comp.ratio.value = 4;
    comp.attack.value = 0.008;
    comp.release.value = 0.18;
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.value = -4;
    limiter.knee.value = 2;
    limiter.ratio.value = 16;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.12;
    this.masterAnalyser = this.ctx.createAnalyser();
    this.masterAnalyser.fftSize = 1024;
    this.masterAnalyser.smoothingTimeConstant = 0.78;
    this.mediaDest = this.ctx.createMediaStreamDestination();

    masterIn.connect(master);
    master.connect(comp);
    comp.connect(limiter);
    limiter.connect(this.masterAnalyser);
    this.masterAnalyser.connect(this.ctx.destination);
    limiter.connect(this.mediaDest);
    this.master = master;

    const delay = this.ctx.createDelay(1.2);
    delay.delayTime.value = 0.33;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.38;
    const tone = this.ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 3800;
    const delayIn = this.ctx.createGain();
    const delayOut = this.ctx.createGain();
    delayOut.gain.value = 0.85;
    delayIn.connect(delay);
    delay.connect(tone);
    tone.connect(fb);
    fb.connect(delay);
    tone.connect(delayOut);
    delayOut.connect(masterIn);
    this.delay = delay;
    this.delayIn = delayIn;

    const reverbIn = this.ctx.createGain();
    const conv = this.ctx.createConvolver();
    conv.buffer = makeImpulse(this.ctx);
    const reverbOut = this.ctx.createGain();
    reverbOut.gain.value = 0.9;
    reverbIn.connect(conv);
    conv.connect(reverbOut);
    reverbOut.connect(masterIn);
    this.reverbIn = reverbIn;

    const perf = this.ctx.createGain();
    perf.gain.value = 0.9;
    perf.connect(masterIn);
    this.perfBus = perf;

    this.ch = {
      A: this.makeChannel(masterIn, "dort-dort"),
      B: this.makeChannel(masterIn, "ayna-topu"),
    };
    this.setCross(0.5);
  }

  private master: GainNode;
  private delay: DelayNode;
  private delayIn: GainNode;
  private reverbIn: GainNode;
  private perfBus: GainNode;

  private makeChannel(masterIn: GainNode, trackId: string): Channel {
    const ctx = this.ctx;
    const music = ctx.createGain();
    const drums = ctx.createGain();
    const duck = ctx.createGain();
    duck.gain.value = 1;
    const pre = ctx.createGain();
    const motion = ctx.createBiquadFilter();
    motion.type = "lowpass";
    motion.frequency.value = 2400;
    motion.Q.value = 0.5;
    const perf = ctx.createBiquadFilter();
    perf.type = "lowpass";
    perf.frequency.value = 18000;
    perf.Q.value = 0.7;
    const eqLow = ctx.createBiquadFilter();
    eqLow.type = "lowshelf";
    eqLow.frequency.value = 180;
    const eqMid = ctx.createBiquadFilter();
    eqMid.type = "peaking";
    eqMid.frequency.value = 1100;
    eqMid.Q.value = 0.85;
    const eqHigh = ctx.createBiquadFilter();
    eqHigh.type = "highshelf";
    eqHigh.frequency.value = 5400;
    const delaySend = ctx.createGain();
    delaySend.gain.value = 0;
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.12;
    const flangerDelay = ctx.createDelay(0.03);
    flangerDelay.delayTime.value = 0.004;
    const flangerFb = ctx.createGain();
    flangerFb.gain.value = 0.32;
    const flangerWet = ctx.createGain();
    flangerWet.gain.value = 0;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.28;
    lfoGain.gain.value = 0.0022;
    lfo.connect(lfoGain).connect(flangerDelay.delayTime);
    lfo.start();
    const fader = ctx.createGain();
    fader.gain.value = 0.82;
    const gate = ctx.createGain();
    gate.gain.value = 1;
    const xfade = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.75;

    music.connect(duck);
    duck.connect(pre);
    drums.connect(pre);
    pre.connect(motion);
    motion.connect(perf);
    perf.connect(eqLow);
    eqLow.connect(eqMid);
    eqMid.connect(eqHigh);
    eqHigh.connect(fader);
    eqHigh.connect(delaySend);
    eqHigh.connect(reverbSend);
    eqHigh.connect(flangerDelay);
    flangerDelay.connect(flangerFb);
    flangerFb.connect(flangerDelay);
    flangerDelay.connect(flangerWet);
    flangerWet.connect(gate);
    fader.connect(gate);
    gate.connect(xfade);
    gate.connect(analyser);
    xfade.connect(masterIn);
    delaySend.connect(this.delayIn);
    reverbSend.connect(this.reverbIn);

    const track = getTrack(trackId);
    return {
      trackId,
      bpm: trackBpm(track),
      transpose: 0,
      bar: 0,
      step: 0,
      nextNoteTime: 0,
      playing: false,
      loopBars: 0,
      loopOrigin: 0,
      sync: false,
      lastBass: 36,
      filter: 0.5,
      bed: null,
      bedGain: null,
      music,
      drums,
      duck,
      motion,
      perf,
      eqLow,
      eqMid,
      eqHigh,
      delaySend,
      reverbSend,
      flangerWet,
      fader,
      gate,
      xfade,
      analyser,
    };
  }

  analyser(id: DeckId): AnalyserNode {
    return this.ch[id].analyser;
  }

  async resume() {
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  position(id: DeckId): DeckPosition {
    const d = this.ch[id];
    const s = sectionFor(d.bar);
    return {
      bar: s.wrapped,
      step: d.step,
      bpm: d.bpm,
      playing: d.playing,
      section: s.id,
      sectionLabel: s.label,
    };
  }

  load(id: DeckId, trackId: string) {
    const d = this.ch[id];
    const track = getTrack(trackId);
    d.trackId = track.id;
    if (!d.sync) d.bpm = trackBpm(track);
    d.bar = 0;
    d.step = 0;
    d.loopBars = 0;
    d.loopOrigin = 0;
    this.syncDelay();
    this.ensureBed(id);
    if (this.ch[other(id)].sync) this.ch[other(id)].bpm = d.bpm;
  }

  play(id: DeckId) {
    const d = this.ch[id];
    if (d.playing) return;
    d.playing = true;
    d.nextNoteTime = this.ctx.currentTime + 0.05;
    if (d.sync) {
      const o = this.ch[other(id)];
      d.bpm = o.bpm;
      if (o.playing) {
        d.nextNoteTime = o.nextNoteTime;
        d.step = o.step;
      }
    }
    const genre = getGenre(getTrack(d.trackId).genre);
    if (genre.bed !== "none" && !d.bed) this.ensureBed(id);
    this.setBed(id, true);
    this.ensureTimer();
  }

  stop(id: DeckId) {
    this.ch[id].playing = false;
    this.setBed(id, false);
    if (!this.ch.A.playing && !this.ch.B.playing && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  cue(id: DeckId) {
    const d = this.ch[id];
    this.stop(id);
    d.bar = 0;
    d.step = 0;
    d.loopBars = 0;
    d.loopOrigin = 0;
  }

  toggle(id: DeckId) {
    if (this.ch[id].playing) this.stop(id);
    else this.play(id);
  }

  setBpm(id: DeckId, bpm: number) {
    const next = Math.max(64, Math.min(190, bpm));
    this.ch[id].bpm = next;
    const o = other(id);
    if (this.ch[o].sync) this.ch[o].bpm = next;
    if (this.ch[id].sync) this.ch[o].bpm = next;
    this.syncDelay();
  }

  nudge(id: DeckId, active: boolean, dir: number, base: number) {
    this.setBpm(id, active ? base + dir * 2.4 : base);
  }

  setSync(id: DeckId, on: boolean) {
    const d = this.ch[id];
    d.sync = on;
    if (!on) return;
    this.ch[other(id)].sync = false;
    const o = this.ch[other(id)];
    d.bpm = o.bpm;
    if (o.playing) {
      d.step = o.step;
      d.nextNoteTime = o.nextNoteTime;
    }
    this.syncDelay();
  }

  setLoop(id: DeckId, bars: LoopBars) {
    const d = this.ch[id];
    d.loopBars = bars;
    d.loopOrigin = sectionFor(d.bar).wrapped;
  }

  jump(id: DeckId, section: SectionId) {
    const table = ["giris", "groove", "yukselis", "drop", "ara", "final"] as const;
    const at = [0, 8, 24, 32, 48, 56][table.indexOf(section)] ?? 0;
    this.ch[id].bar = at;
    if (this.ch[id].loopBars > 0) this.ch[id].loopOrigin = at;
  }

  setTranspose(id: DeckId, semis: number) {
    this.ch[id].transpose = Math.max(-6, Math.min(6, semis));
  }

  setVolume(id: DeckId, v: number) {
    this.ch[id].fader.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
  }

  setEq(id: DeckId, band: "low" | "mid" | "high", db: number) {
    const node = band === "low" ? this.ch[id].eqLow : band === "mid" ? this.ch[id].eqMid : this.ch[id].eqHigh;
    node.gain.setTargetAtTime(db, this.ctx.currentTime, 0.02);
  }

  setSend(id: DeckId, fx: "delay" | "reverb" | "flanger", amount: number) {
    const node = fx === "delay" ? this.ch[id].delaySend : fx === "reverb" ? this.ch[id].reverbSend : this.ch[id].flangerWet;
    node.gain.setTargetAtTime(amount, this.ctx.currentTime, 0.03);
  }

  setFilter(id: DeckId, norm: number) {
    this.ch[id].filter = norm;
    this.applyPerf(id);
  }

  setMaster(v: number) {
    this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
  }

  setCross(pos: number) {
    const p = Math.min(1, Math.max(0, pos));
    this.ch.A.xfade.gain.setTargetAtTime(Math.cos((p * Math.PI) / 2), this.ctx.currentTime, 0.015);
    this.ch.B.xfade.gain.setTargetAtTime(Math.sin((p * Math.PI) / 2), this.ctx.currentTime, 0.015);
  }

  repeat(id: DeckId) {
    const d = this.ch[id];
    const step = 60 / d.bpm / 2;
    const now = this.ctx.currentTime + 0.02;
    const g = d.gate.gain;
    g.cancelScheduledValues(now);
    for (let i = 0; i < 8; i++) {
      const on = now + i * step;
      g.setValueAtTime(i % 2 === 0 ? 1 : 0.0001, on);
    }
    g.setValueAtTime(1, now + 8 * step);
  }

  stopAll() {
    this.stop("A");
    this.stop("B");
  }

  pad(name: "kick" | "clap" | "hat" | "snare" | "tom" | "cow" | "stab" | "sub") {
    const t = this.ctx.currentTime + 0.02;
    const dest = this.perfBus;
    const track = getTrack(this.ch.A.trackId);
    const genre = getGenre(track.genre);
    if (name === "kick") playKick(this.ctx, t, "house", 1, dest, this.noise);
    if (name === "clap") playClap(this.ctx, t, 1, dest, this.noise);
    if (name === "hat") playHat(this.ctx, t, false, 1, dest, this.noise);
    if (name === "snare") playSnare(this.ctx, t, 1, dest, this.noise);
    if (name === "tom") playTom(this.ctx, t, 1, dest);
    if (name === "cow") playTick(this.ctx, t, 587, 1, 0.12, dest);
    if (name === "stab") {
      const midis = voiceChord(track.root, genre.progs[track.prog % genre.progs.length][0], this.ch.A.transpose, 60);
      playChord(this.ctx, t, midis, 0.22, "stab", 1.1, dest);
    }
    if (name === "sub") playBass(this.ctx, t, 36 + ((track.root + this.ch.A.transpose) % 12), 0.4, "sub", 1, dest);
  }

  startRecord(): boolean {
    if (this.recorder && this.recorder.state === "recording") return true;
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "";
    try {
      this.chunks = [];
      this.recorder = mime ? new MediaRecorder(this.mediaDest.stream, { mimeType: mime }) : new MediaRecorder(this.mediaDest.stream);
    } catch {
      return false;
    }
    this.recorder.ondataavailable = (e) => {
      if (e.data.size) this.chunks.push(e.data);
    };
    this.recorder.start();
    return true;
  }

  async stopRecord(): Promise<Blob | null> {
    const rec = this.recorder;
    if (!rec || rec.state === "inactive") return null;
    const blob = await new Promise<Blob>((resolve) => {
      rec.onstop = () => resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" }));
      rec.stop();
    });
    this.recorder = null;
    return blob;
  }

  private syncDelay() {
    const bpm = this.ch.A.playing ? this.ch.A.bpm : this.ch.B.bpm;
    const time = (60 / bpm) * 0.75;
    this.delay.delayTime.setTargetAtTime(Math.min(1.1, time), this.ctx.currentTime, 0.05);
  }

  private ensureTimer() {
    if (this.timer) return;
    this.timer = setInterval(() => this.pump(), 25);
  }

  private pump() {
    const horizon = this.ctx.currentTime + 0.12;
    (["A", "B"] as const).forEach((id) => {
      const d = this.ch[id];
      if (!d.playing) return;
      if (d.nextNoteTime < this.ctx.currentTime - 0.08) d.nextNoteTime = this.ctx.currentTime + 0.02;
      let guard = 0;
      while (d.nextNoteTime < horizon && guard++ < 24) {
        this.scheduleStep(id, d.nextNoteTime);
        d.nextNoteTime += 60 / d.bpm / 4;
        this.advance(d);
      }
    });
  }

  private advance(d: Channel) {
    d.step += 1;
    if (d.step < 16) return;
    d.step = 0;
    d.bar += 1;
    if (d.loopBars > 0) {
      if (d.bar >= d.loopOrigin + d.loopBars) d.bar = d.loopOrigin;
      return;
    }
    if (d.bar >= TOTAL_BARS) d.bar = 0;
  }

  private applyPerf(id: DeckId) {
    const d = this.ch[id];
    const norm = d.filter;
    const now = this.ctx.currentTime;
    const node = d.perf;
    if (Math.abs(norm - 0.5) < 0.03) {
      node.type = "lowpass";
      node.frequency.setTargetAtTime(18000, now, 0.02);
      node.Q.setTargetAtTime(0.7, now, 0.02);
      return;
    }
    if (norm < 0.5) {
      const k = 1 - norm / 0.5;
      const f = 50 * Math.pow(5200 / 50, k);
      node.type = "highpass";
      node.frequency.setTargetAtTime(f, now, 0.02);
      node.Q.setTargetAtTime(0.7 + k * 3.2, now, 0.02);
    } else {
      const k = (norm - 0.5) / 0.5;
      const f = 16000 * Math.pow(240 / 16000, k);
      node.type = "lowpass";
      node.frequency.setTargetAtTime(f, now, 0.02);
      node.Q.setTargetAtTime(0.7 + k * 5, now, 0.02);
    }
  }

  private ensureBed(id: DeckId) {
    const d = this.ch[id];
    const genre = getGenre(getTrack(d.trackId).genre);
    if (d.bed) {
      try {
        d.bed.stop();
      } catch {
        /* already stopped */
      }
      d.bed.disconnect();
      d.bed = null;
      d.bedGain = null;
    }
    if (genre.bed === "none") return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = genre.bed === "lofi" ? 1600 : 520;
    bp.Q.value = 0.6;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    src.connect(bp).connect(g).connect(d.music);
    src.start();
    d.bed = src;
    d.bedGain = g;
    this.setBed(id, d.playing);
  }

  private setBed(id: DeckId, on: boolean) {
    const gain = this.ch[id].bedGain;
    if (!gain) return;
    const genre = getGenre(getTrack(this.ch[id].trackId).genre);
    const level = genre.bed === "lofi" ? 0.018 : 0.028;
    gain.gain.setTargetAtTime(on ? level : 0, this.ctx.currentTime, 0.04);
  }

  private duck(id: DeckId, t: number, depth: number) {
    if (depth < 0.05) return;
    const g = this.ch[id].duck.gain;
    const floor = Math.max(0.12, 1 - depth);
    g.setValueAtTime(floor, t);
    g.exponentialRampToValueAtTime(1, t + 0.16);
  }

  private scheduleStep(id: DeckId, time: number) {
    const d = this.ch[id];
    const track = getTrack(d.trackId);
    const genre = getGenre(track.genre);
    const sec = sectionFor(d.bar);
    const step = d.step;
    const drums = DRUMS[genre.drums];
    const stepDur = 60 / d.bpm / 4;
    const swing = step % 2 === 1 ? genre.swing * stepDur : 0;
    const t = time + swing;
    const breakSec = sec.id === "ara";
    const intro = sec.id === "giris";
    const build = sec.id === "yukselis";
    const drop = sec.id === "drop" || sec.id === "final";
    const thinEnd = sec.id === "final" && sec.barIn >= 12;

    d.motion.frequency.setTargetAtTime(
      Math.abs(d.filter - 0.5) < 0.08 ? motionFreq(sec.id, sec.barIn, step) : 15000,
      t,
      0.04,
    );

    const allowDrums = !breakSec;
    if (allowDrums && !(intro && sec.barIn < 2 && step % 8 !== 0)) {
      const kick = gridHit(drums.kick, step);
      const kickOk = !(intro && step % 8 !== 0) && !(thinEnd && step % 8 !== 0);
      if (kick && kickOk) {
        playKick(this.ctx, t, genre.kick, kick, d.drums, this.noise);
        this.duck(id, t, genre.duck * (drop ? 1 : 0.75));
      }
      if (!intro || sec.barIn >= 4) {
        const sn = gridHit(drums.snare, step);
        if (sn && !thinEnd) playSnare(this.ctx, t, sn * 0.95, d.drums, this.noise);
        const cl = gridHit(drums.clap, step);
        if (cl && !thinEnd) playClap(this.ctx, t, cl * 0.85, d.drums, this.noise);
      }
      const hatVel = gridHit(drums.hat, step);
      const openVel = gridHit(drums.open, step);
      if (openVel && !thinEnd) playHat(this.ctx, t, true, openVel * 0.9, d.drums, this.noise);
      else if (hatVel && !(intro && step % 4 !== 0) && !(thinEnd && step % 4 !== 0)) {
        playHat(this.ctx, t, false, hatVel * (genre.drums === "tech" || genre.drums === "dnb" ? 0.55 : 0.85), d.drums, this.noise);
      }
      if ((!intro || sec.barIn >= 4) && !thinEnd) this.playPerc(genre.perc, drums.perc, step, t, d);
    } else if (breakSec && (step === 4 || step === 12)) {
      playHat(this.ctx, t, true, 0.25, d.drums, this.noise);
    }

    if (build && sec.barIn >= 6) {
      playSnare(this.ctx, t, 0.28 + (sec.barIn - 6) * 0.22 + step / 40, d.drums, this.noise);
    }
    if (drop && sec.barIn === 0 && step === 0) playCrash(this.ctx, t, 0.9, d.drums, this.noise);
    if (build && sec.barIn === 4 && step === 0) {
      playRiser(this.ctx, t, (4 * 4 * 60) / d.bpm, d.music, this.noise);
    }
    if (genre.bed === "lofi" && Math.random() < 0.07) {
      playHat(this.ctx, t, false, 0.08, d.drums, this.noise);
    }

    const bassAllowed = !(intro && sec.barIn < 4) && !(thinEnd && step % 8 !== 0);
    if (bassAllowed) {
      const hit = bassAt(genre.bass, step, sec.wrapped);
      if (hit && !(breakSec && step !== 0)) {
        const root = 36 + pcOf(track.root, d.transpose);
        const midi = root + hit.semi;
        const dur = Math.max(0.05, hit.dur * stepDur * 0.92);
        const kind = bassKind(genre.bass);
        const vel = (hit.quiet ? 0.55 : 1) * (breakSec ? 0.45 : 1) * (intro ? 0.7 : 1);
        playBass(this.ctx, t, midi, dur, kind, vel, d.music, hit.glide ? d.lastBass : undefined);
        d.lastBass = midi;
      }
    }

    this.playHarmony(track, step, t, stepDur, sec.id, sec.barIn, d);
  }

  private playPerc(kind: PercKind, pattern: string, step: number, t: number, d: Channel) {
    const vel = gridHit(pattern, step);
    if (!vel || kind === "none") return;
    if (kind === "rim") playTick(this.ctx, t, 1850, vel, 0.04, d.drums);
    if (kind === "cow") playTick(this.ctx, t, step % 8 === 2 ? 800 : 540, vel * 0.8, 0.09, d.drums);
    if (kind === "clave") playTick(this.ctx, t, 2100, vel, 0.05, d.drums);
    if (kind === "conga") playConga(this.ctx, t, step % 4 === 0, vel, d.drums, this.noise);
    if (kind === "shaker") playHat(this.ctx, t, false, vel * 0.4, d.drums, this.noise);
  }

  private playHarmony(
    track: Track,
    step: number,
    t: number,
    stepDur: number,
    section: SectionId,
    barIn: number,
    d: Channel,
  ) {
    const genre = getGenre(track.genre);
    const prog = genre.progs[track.prog % genre.progs.length];
    const chord = prog[sectionFor(d.bar).wrapped % prog.length];
    const pcs = chord;
    const harm = genre.harm;

    const inBreak = section === "ara";
    const intro = section === "giris";
    const drop = section === "drop" || section === "final";
    const lateGroove = section === "groove" && barIn >= 8;
    const steps =
      harm === "stab"
        ? [4, 12]
        : harm === "rhodes"
          ? [0, 8]
          : harm === "arp" || harm === "pluck"
            ? [0, 2, 4, 6, 8, 10, 12, 14]
            : [0];
    if (steps.includes(step) && !(intro && barIn < 2 && harm === "stab")) {
      const base = harm === "stab" || harm === "pluck" || harm === "arp" ? 60 : 48;
      const midis = voiceChord(track.root, pcs, d.transpose, base);
      const durSteps = harm === "stab" ? 1.3 : harm === "pluck" || harm === "arp" ? 1.1 : harm === "rhodes" ? 7 : 15;
      const dur = durSteps * stepDur;
      const vel = inBreak ? 0.7 : intro ? 0.55 : 1;
      if (harm === "arp" || harm === "pluck") {
        const tone = midis[step % midis.length];
        playPluck(this.ctx, t, tone, dur, vel, d.music);
      } else {
        playChord(this.ctx, t, midis, dur, harm === "strings" && inBreak ? "strings" : harm, vel, d.music);
      }
    }

    const motifOn = (genre.lead && (drop || lateGroove) && section !== "final") || (section === "final" && barIn < 12 && genre.lead);
    if (!motifOn || inBreak) return;
    const degree = genre.motif[step] ?? -1;
    if (degree < 0) return;
    const midi = 72 + pcOf(track.root, d.transpose) + degreeToSemi(genre.mode, degree);
    const bright = genre.id === "hareketli" || genre.id === "trance" || genre.id === "disko";
    playLead(this.ctx, t, midi, stepDur * 0.9, drop ? 1 : 0.75, d.music, bright);
  }
}
