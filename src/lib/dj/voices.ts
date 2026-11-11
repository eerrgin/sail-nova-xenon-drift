import { midiToFreq } from "./theory";
import type { HarmKind, KickKind } from "./catalog";

function envGain(ctx: AudioContext, t: number, peak: number, attack: number, dur: number): GainNode {
  const g = ctx.createGain();
  const a = Math.max(0.002, attack);
  const end = Math.max(a + 0.02, dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + end);
  return g;
}

function noiseSrc(ctx: AudioContext, buffer: AudioBuffer, t: number, dur: number): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.playbackRate.value = 0.9 + Math.random() * 0.2;
  src.start(t, Math.random() * Math.max(0.1, buffer.duration - 0.2));
  src.stop(t + dur + 0.02);
  return src;
}

export function makeNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

export function makeImpulse(ctx: AudioContext): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * 2.2);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, ch ? 2.4 : 2.8);
    }
  }
  return buf;
}

export function playKick(ctx: AudioContext, t: number, kind: KickKind, vel: number, dest: AudioNode, noise: AudioBuffer) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  let f0 = 156;
  let f1 = 46;
  let dur = 0.38;
  let amp = 0.92;
  if (kind === "808") {
    f0 = 130;
    f1 = 40;
    dur = 0.72;
    amp = 0.88;
  } else if (kind === "soft") {
    f0 = 110;
    f1 = 50;
    dur = 0.3;
    amp = 0.55;
  } else if (kind === "short") {
    f0 = 190;
    f1 = 58;
    dur = 0.18;
    amp = 0.86;
  }
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(f1, t + 0.07);
  const g = ctx.createGain();
  g.gain.setValueAtTime(amp * vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);

  const click = noiseSrc(ctx, noise, t, 0.03);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1400;
  const cg = ctx.createGain();
  cg.gain.setValueAtTime(0.28 * vel, t);
  cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  click.connect(hp).connect(cg).connect(dest);
}

export function playSnare(ctx: AudioContext, t: number, vel: number, dest: AudioNode, noise: AudioBuffer) {
  const n = noiseSrc(ctx, noise, t, 0.22);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1800;
  bp.Q.value = 0.7;
  const g = envGain(ctx, t, 0.48 * vel, 0.003, 0.18);
  n.connect(bp).connect(g).connect(dest);

  const tone = ctx.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(196, t);
  tone.frequency.exponentialRampToValueAtTime(140, t + 0.08);
  const tg = envGain(ctx, t, 0.22 * vel, 0.002, 0.1);
  tone.connect(tg).connect(dest);
  tone.start(t);
  tone.stop(t + 0.12);
}

export function playClap(ctx: AudioContext, t: number, vel: number, dest: AudioNode, noise: AudioBuffer) {
  [0, 0.011, 0.022].forEach((delay, i) => {
    const n = noiseSrc(ctx, noise, t + delay, 0.05);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1250;
    bp.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime((0.42 - i * 0.06) * vel, t + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.05);
    n.connect(bp).connect(g).connect(dest);
  });
  const tail = noiseSrc(ctx, noise, t + 0.02, 0.2);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 900;
  const tg = envGain(ctx, t + 0.02, 0.16 * vel, 0.005, 0.16);
  tail.connect(hp).connect(tg).connect(dest);
}

export function playHat(ctx: AudioContext, t: number, open: boolean, vel: number, dest: AudioNode, noise: AudioBuffer) {
  const dur = open ? 0.28 : 0.045;
  const mix = ctx.createGain();
  const ratios = [2.1, 3.4, 4.8];
  ratios.forEach((r) => {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = 320 * r;
    const og = ctx.createGain();
    og.gain.value = 0.12;
    o.connect(og).connect(mix);
    o.start(t);
    o.stop(t + dur + 0.02);
  });
  const n = noiseSrc(ctx, noise, t, dur + 0.02);
  const ng = ctx.createGain();
  ng.gain.value = 0.55;
  n.connect(ng).connect(mix);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = open ? 6800 : 8600;
  const g = ctx.createGain();
  g.gain.setValueAtTime((open ? 0.18 : 0.22) * vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  mix.connect(hp).connect(g).connect(dest);
}

export function playTick(ctx: AudioContext, t: number, freq: number, vel: number, dur: number, dest: AudioNode) {
  const o = ctx.createOscillator();
  o.type = "square";
  o.frequency.value = freq;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 4;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.22 * vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(bp).connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function playConga(ctx: AudioContext, t: number, high: boolean, vel: number, dest: AudioNode, noise: AudioBuffer) {
  const o = ctx.createOscillator();
  o.type = "sine";
  const f = high ? 340 : 190;
  o.frequency.setValueAtTime(f * 1.5, t);
  o.frequency.exponentialRampToValueAtTime(f, t + 0.045);
  const g = envGain(ctx, t, 0.32 * vel, 0.003, high ? 0.12 : 0.18);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + 0.22);
  const n = noiseSrc(ctx, noise, t, 0.04);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  const ng = envGain(ctx, t, 0.12 * vel, 0.002, 0.03);
  n.connect(bp).connect(ng).connect(dest);
}

export function playTom(ctx: AudioContext, t: number, vel: number, dest: AudioNode) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(180, t);
  o.frequency.exponentialRampToValueAtTime(78, t + 0.18);
  const g = envGain(ctx, t, 0.4 * vel, 0.004, 0.28);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + 0.32);
}

export function playCrash(ctx: AudioContext, t: number, vel: number, dest: AudioNode, noise: AudioBuffer) {
  const n = noiseSrc(ctx, noise, t, 1.1);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 4200;
  const g = envGain(ctx, t, 0.18 * vel, 0.008, 0.9);
  n.connect(hp).connect(g).connect(dest);
}

export function playRiser(ctx: AudioContext, t: number, dur: number, dest: AudioNode, noise: AudioBuffer) {
  const n = noiseSrc(ctx, noise, t, dur);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 3;
  bp.frequency.setValueAtTime(280, t);
  bp.frequency.exponentialRampToValueAtTime(7200, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + dur * 0.92);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(bp).connect(g).connect(dest);
}

export function playBass(
  ctx: AudioContext,
  t: number,
  midi: number,
  dur: number,
  kind: "sub" | "saw" | "reese" | "808" | "octave",
  vel: number,
  dest: AudioNode,
  glideFrom?: number,
) {
  const freq = Math.max(28, midiToFreq(midi));
  const g = ctx.createGain();
  const peak = (kind === "808" ? 0.5 : 0.42) * vel;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + (kind === "808" ? 0.01 : 0.012));
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * 0.72), t + Math.min(dur * 0.45, 0.2));
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.06, dur));

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = kind === "reese" ? 7 : 5;
  lp.frequency.setValueAtTime(kind === "reese" ? 980 : 640, t);
  lp.frequency.exponentialRampToValueAtTime(160, t + Math.max(0.08, Math.min(dur, 0.45)));

  if (kind === "808" || kind === "sub") {
    const sub = ctx.createOscillator();
    sub.type = "sine";
    const start = glideFrom ? Math.max(28, midiToFreq(glideFrom)) : freq * (kind === "808" ? 1.8 : 1);
    sub.frequency.setValueAtTime(start, t);
    sub.frequency.exponentialRampToValueAtTime(freq, t + (glideFrom || kind === "808" ? 0.07 : 0.01));
    sub.connect(g).connect(dest);
    sub.start(t);
    sub.stop(t + dur + 0.05);
    return;
  }

  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.value = freq / (kind === "octave" ? 1 : 2);
  if (kind !== "octave") sub.frequency.value = freq / 2;
  const sg = ctx.createGain();
  sg.gain.value = 0.85;
  sub.connect(sg).connect(g);

  const saw = ctx.createOscillator();
  saw.type = "sawtooth";
  saw.frequency.value = freq;
  const wg = ctx.createGain();
  wg.gain.value = kind === "reese" ? 0.28 : 0.18;
  saw.connect(wg).connect(lp);

  if (kind === "reese") {
    const saw2 = ctx.createOscillator();
    saw2.type = "sawtooth";
    saw2.frequency.value = freq;
    saw2.detune.value = 16;
    const wg2 = ctx.createGain();
    wg2.gain.value = 0.22;
    saw2.connect(wg2).connect(lp);
    saw2.start(t);
    saw2.stop(t + dur + 0.05);
  }
  if (kind === "octave") {
    const up = ctx.createOscillator();
    up.type = "square";
    up.frequency.value = freq * 2;
    const ug = ctx.createGain();
    ug.gain.setValueAtTime(0.08, t);
    ug.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(0.12, dur));
    up.connect(ug).connect(dest);
    up.start(t);
    up.stop(t + dur + 0.02);
  }

  lp.connect(g);
  g.connect(dest);
  sub.start(t);
  saw.start(t);
  sub.stop(t + dur + 0.05);
  saw.stop(t + dur + 0.05);
}

export function playChord(
  ctx: AudioContext,
  t: number,
  midis: number[],
  dur: number,
  harm: HarmKind,
  vel: number,
  dest: AudioNode,
) {
  if (harm === "rhodes") {
    midis.slice(0, 3).forEach((m, i) => {
      const freq = midiToFreq(m);
      const car = ctx.createOscillator();
      const mod = ctx.createOscillator();
      const mg = ctx.createGain();
      car.type = "sine";
      mod.type = "sine";
      car.frequency.value = freq;
      mod.frequency.value = freq * 2;
      mg.gain.setValueAtTime(freq * 1.5, t);
      mg.gain.exponentialRampToValueAtTime(20, t + Math.min(0.45, dur));
      mod.connect(mg).connect(car.frequency);
      const g = envGain(ctx, t, 0.11 * vel, 0.02, dur);
      const pan = ctx.createStereoPanner();
      pan.pan.value = (i - 1) * 0.35;
      car.connect(pan).connect(g).connect(dest);
      car.start(t);
      mod.start(t);
      car.stop(t + dur + 0.05);
      mod.stop(t + dur + 0.05);
    });
    return;
  }

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.Q.value = harm === "stab" ? 4 : 0.7;
  const attack = harm === "strings" || harm === "pad" ? 0.18 : harm === "stab" ? 0.005 : 0.01;
  const peak = (harm === "stab" ? 0.11 : harm === "strings" || harm === "pad" ? 0.07 : 0.09) * vel;
  if (harm === "stab") {
    lp.frequency.setValueAtTime(2800, t);
    lp.frequency.exponentialRampToValueAtTime(700, t + Math.max(0.08, dur));
  } else {
    lp.frequency.setValueAtTime(harm === "strings" ? 1400 : 2200, t);
  }
  const g = envGain(ctx, t, peak, attack, dur);
  g.connect(lp).connect(dest);
  const notes = harm === "arp" || harm === "pluck" ? midis.slice(0, 1) : midis.slice(0, 3);
  notes.forEach((m, i) => {
    const o = ctx.createOscillator();
    o.type = harm === "pluck" ? "triangle" : "sawtooth";
    o.frequency.value = midiToFreq(m);
    o.detune.value = (i - 1) * 7;
    const pan = ctx.createStereoPanner();
    pan.pan.value = (i - 1) * 0.28;
    o.connect(pan).connect(g);
    o.start(t);
    o.stop(t + dur + 0.06);
  });
}

export function playLead(ctx: AudioContext, t: number, midi: number, dur: number, vel: number, dest: AudioNode, bright: boolean) {
  const o = ctx.createOscillator();
  o.type = bright ? "sawtooth" : "square";
  const freq = midiToFreq(midi);
  o.frequency.setValueAtTime(freq, t);
  const lfo = ctx.createOscillator();
  const lg = ctx.createGain();
  lfo.frequency.value = 5.2;
  lg.gain.value = freq * 0.008;
  lfo.connect(lg).connect(o.frequency);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(bright ? 4200 : 2400, t);
  lp.frequency.exponentialRampToValueAtTime(900, t + dur);
  const g = envGain(ctx, t, (bright ? 0.07 : 0.055) * vel, 0.01, dur);
  o.connect(lp).connect(g).connect(dest);
  o.start(t);
  lfo.start(t);
  o.stop(t + dur + 0.04);
  lfo.stop(t + dur + 0.04);
}

export function playPluck(ctx: AudioContext, t: number, midi: number, dur: number, vel: number, dest: AudioNode) {
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = midiToFreq(midi);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(3200, t);
  lp.frequency.exponentialRampToValueAtTime(500, t + dur);
  const g = envGain(ctx, t, 0.12 * vel, 0.004, dur);
  o.connect(lp).connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.03);
}
