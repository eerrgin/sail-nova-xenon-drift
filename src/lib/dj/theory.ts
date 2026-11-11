export const NOTE_TR = ["Do", "Do#", "Re", "Mib", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "Sib", "Si"] as const;

const MINOR = [0, 2, 3, 5, 7, 8, 10];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function wrapPc(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function degreeToSemi(mode: "maj" | "min", degree: number): number {
  const scale = mode === "min" ? MINOR : MAJOR;
  const wrapped = ((degree % 7) + 7) % 7;
  const oct = Math.floor(degree / 7);
  return scale[wrapped] + oct * 12;
}

export function keyLabel(root: number, mode: "maj" | "min", transpose = 0): string {
  const pc = wrapPc(root + transpose);
  return `${NOTE_TR[pc]} ${mode === "min" ? "minör" : "majör"}`;
}

export function voiceChord(rootPc: number, pcs: number[], transpose: number, base: number): number[] {
  const midis: number[] = [];
  let prev = base - 12;
  for (const pc of pcs) {
    let midi = base + wrapPc(rootPc + pc + transpose);
    while (midi <= prev) midi += 12;
    midis.push(midi);
    prev = midi;
  }
  return midis;
}

export function clock(bar: number, step: number, bpm: number): string {
  const beats = bar * 4 + step / 4;
  const sec = Math.max(0, beats * (60 / Math.max(1, bpm)));
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function lengthLabel(bars: number, bpm: number): string {
  const sec = bars * 4 * (60 / Math.max(1, bpm));
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
