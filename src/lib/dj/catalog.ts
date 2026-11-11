import { lengthLabel, wrapPc } from "./theory";

export type GenreId =
  | "yavas"
  | "slowjam"
  | "lofi"
  | "ambient"
  | "disko"
  | "funk"
  | "synthwave"
  | "house"
  | "deephouse"
  | "techno"
  | "minimal"
  | "trance"
  | "hareketli"
  | "dnb"
  | "breakbeat"
  | "trap"
  | "hiphop"
  | "latin"
  | "afro";

export type GroupId = "Tümü" | "Yavaş" | "Disko" | "Kulüp" | "Hareketli" | "Ritim";

export type KickKind = "house" | "808" | "soft" | "short";
export type BassKind = "offbeat" | "octave" | "long" | "reese" | "glide" | "walk" | "roll" | "sparse" | "rumble" | "dembow" | "afro";
export type HarmKind = "stab" | "pad" | "rhodes" | "pluck" | "strings" | "arp";
export type PercKind = "rim" | "cow" | "clave" | "conga" | "shaker" | "none";

export interface DrumGrid {
  kick: string;
  snare: string;
  clap: string;
  hat: string;
  open: string;
  perc: string;
}

export const DRUMS = {
  four: { kick: "x...x...x...x...", snare: "................", clap: "....x.......x...", hat: "x.x.x.x.x.x.x.x.", open: "..x...x...x...x.", perc: "..............o." },
  disco: { kick: "x...x...x...x...", snare: "................", clap: "....x.......x..o", hat: "x.x.x.x.x.x.x.x.", open: "..x...x...x...x.", perc: "..x...x...x...x." },
  tech: { kick: "x...x...x...x...", snare: "................", clap: "....x.......x...", hat: "xxxxxxxxxxxxxxxx", open: "................", perc: "................" },
  minimal: { kick: "x...x...x...x...", snare: "................", clap: "................", hat: "x.......x.......", open: "................", perc: "......x.......x." },
  deep: { kick: "x...x...x...x...", snare: "................", clap: "....x.......x...", hat: "x...x.x.x...x.x.", open: "..x.......x.....", perc: "..............o." },
  big: { kick: "x...x...x...x...", snare: "............x...", clap: "....x.......x...", hat: "x.xxx.xxx.xxx.xx", open: "..x...x...x...x.", perc: "..............x." },
  trap: { kick: "x.......x..x....", snare: "....x.......x...", clap: "....o.......o...", hat: "x.xxx.xx.xxx.xxx", open: "..............x.", perc: "................" },
  boom: { kick: "x.....x...x.....", snare: "....x.......x...", clap: "....o.......o...", hat: "x.x.x.x.x.x.x.x.", open: "..............x.", perc: "......o........." },
  slow: { kick: "x.......x.......", snare: "....x.......x...", clap: "................", hat: "x...x...x...x...", open: "..............o.", perc: "................" },
  half: { kick: "x...............", snare: "........x.......", clap: "................", hat: "x...x...x...x...", open: "..............o.", perc: "................" },
  dusty: { kick: "x.....x...x.....", snare: "....x.......x...", clap: "................", hat: "o.x.o.x.o.x.o.x.", open: "..............x.", perc: "....o.......o..." },
  air: { kick: "x...............", snare: "................", clap: "................", hat: "o...............", open: "................", perc: "..............o." },
  funk: { kick: "x...x.....x.x...", snare: "....x.......x...", clap: "....o.......o...", hat: "x.x.x.x.x.x.x.x.", open: "..x.......x.....", perc: "......x........." },
  dembow: { kick: "x..x..x.x..x....", snare: "....x..x....x..x", clap: "....x..x....x...", hat: "x.x.x.x.x.x.x.x.", open: "........x.......", perc: "x..x..x..x..x..x" },
  afro: { kick: "x..x..x...x.x...", snare: "....x.......x...", clap: "....x.......x..o", hat: "x.x.x.x.x.x.x.x.", open: "..x.....x...x...", perc: "x..x.x..x..x.x.." },
  breakz: { kick: "x..x....x.x.....", snare: "....x..x....x...", clap: "................", hat: "xxxxxxxxxxxxxxxx", open: "......x.......x.", perc: "................" },
  dnb: { kick: "x.......x.x.....", snare: "....x.......x...", clap: "....o.......o...", hat: "xxxxxxxxxxxxxxxx", open: "..x.......x.....", perc: "................" },
  synth: { kick: "x...x...x...x...", snare: "....x.......x...", clap: "....o.......o...", hat: "x.x.x.x.x.x.x.x.", open: "........x.......", perc: "................" },
} as const satisfies Record<string, DrumGrid>;

export type DrumId = keyof typeof DRUMS;

const MIN_1 = [[0, 3, 7, 10], [8, 0, 3, 7], [3, 7, 10, 2], [10, 2, 5, 8]];
const MIN_2 = [[0, 3, 7], [5, 8, 0], [3, 7, 10], [7, 10, 2]];
const MIN_3 = [[0, 3, 7, 10], [10, 2, 5, 8], [8, 0, 3], [5, 8, 0, 3]];
const MAJ_1 = [[0, 4, 7, 11], [7, 11, 2, 5], [9, 0, 4, 7], [5, 9, 0, 4]];
const MAJ_2 = [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]];
const DOR = [[0, 3, 7, 10], [5, 8, 0, 3], [10, 2, 5, 8], [7, 10, 2, 5]];
const SUS = [[0, 5, 7, 10], [10, 2, 5, 7], [8, 0, 3, 7], [5, 10, 0, 3]];

export const HOOK = [0, -1, 4, -1, 7, -1, 4, -1, 3, -1, 7, -1, 8, -1, 7, 4];
export const ARP = [0, 2, 4, 7, 4, 2, 0, -1, 0, 3, 4, 7, 8, 7, 4, 2];
export const SLOW = [-1, 0, -1, -1, 4, -1, 2, -1, -1, 7, -1, -1, 4, -1, 0, -1];
export const DISCO_M = [4, -1, 7, -1, 9, -1, 7, 4, -1, 2, -1, 4, 0, -1, -1, 7];
export const TR = [0, 0, 4, 4, 7, 7, 4, 2, 0, 0, 3, 3, 7, 4, 2, 0];
export const PENT = [0, -1, 2, -1, 4, -1, 2, 4, -1, 7, -1, 4, 2, -1, 0, -1];

export interface Genre {
  id: GenreId;
  label: string;
  group: Exclude<GroupId, "Tümü">;
  bpm: number;
  swing: number;
  mode: "maj" | "min";
  kick: KickKind;
  drums: DrumId;
  bass: BassKind;
  harm: HarmKind;
  lead: boolean;
  duck: number;
  perc: PercKind;
  energy: 1 | 2 | 3 | 4 | 5;
  progs: number[][][];
  motif: number[];
  bed: "lofi" | "air" | "none";
}

export const GENRES: Record<GenreId, Genre> = {
  yavas: { id: "yavas", label: "Yavaş", group: "Yavaş", bpm: 78, swing: 0.08, mode: "min", kick: "soft", drums: "slow", bass: "sparse", harm: "rhodes", lead: true, duck: 0.22, perc: "none", energy: 1, progs: [MIN_3, MIN_1], motif: SLOW, bed: "none" },
  slowjam: { id: "slowjam", label: "Slow", group: "Yavaş", bpm: 86, swing: 0.1, mode: "min", kick: "soft", drums: "half", bass: "long", harm: "rhodes", lead: true, duck: 0.28, perc: "none", energy: 2, progs: [MIN_1, MIN_2], motif: SLOW, bed: "none" },
  lofi: { id: "lofi", label: "Lo-fi", group: "Yavaş", bpm: 84, swing: 0.18, mode: "maj", kick: "soft", drums: "dusty", bass: "sparse", harm: "rhodes", lead: true, duck: 0.2, perc: "rim", energy: 2, progs: [MAJ_2, MAJ_1], motif: PENT, bed: "lofi" },
  ambient: { id: "ambient", label: "Ambient", group: "Yavaş", bpm: 68, swing: 0, mode: "min", kick: "soft", drums: "air", bass: "long", harm: "strings", lead: false, duck: 0.08, perc: "none", energy: 1, progs: [MIN_3, SUS], motif: SLOW, bed: "air" },
  disko: { id: "disko", label: "Disko", group: "Disko", bpm: 118, swing: 0.06, mode: "maj", kick: "house", drums: "disco", bass: "octave", harm: "stab", lead: true, duck: 0.42, perc: "cow", energy: 4, progs: [MAJ_2, MAJ_1], motif: DISCO_M, bed: "none" },
  funk: { id: "funk", label: "Funk", group: "Disko", bpm: 106, swing: 0.12, mode: "min", kick: "house", drums: "funk", bass: "walk", harm: "pluck", lead: true, duck: 0.3, perc: "rim", energy: 4, progs: [DOR, MIN_2], motif: PENT, bed: "none" },
  synthwave: { id: "synthwave", label: "Synthwave", group: "Disko", bpm: 102, swing: 0, mode: "min", kick: "house", drums: "synth", bass: "octave", harm: "pad", lead: true, duck: 0.35, perc: "none", energy: 3, progs: [MIN_1, MIN_2], motif: HOOK, bed: "none" },
  house: { id: "house", label: "House", group: "Kulüp", bpm: 124, swing: 0, mode: "min", kick: "house", drums: "four", bass: "offbeat", harm: "stab", lead: true, duck: 0.55, perc: "rim", energy: 4, progs: [MIN_1, MIN_2], motif: HOOK, bed: "none" },
  deephouse: { id: "deephouse", label: "Deep House", group: "Kulüp", bpm: 121, swing: 0.02, mode: "min", kick: "house", drums: "deep", bass: "offbeat", harm: "rhodes", lead: false, duck: 0.48, perc: "rim", energy: 3, progs: [MIN_3, MIN_1], motif: SLOW, bed: "none" },
  techno: { id: "techno", label: "Techno", group: "Kulüp", bpm: 132, swing: 0, mode: "min", kick: "short", drums: "tech", bass: "rumble", harm: "stab", lead: false, duck: 0.62, perc: "none", energy: 5, progs: [MIN_2, SUS], motif: ARP, bed: "none" },
  minimal: { id: "minimal", label: "Minimal", group: "Kulüp", bpm: 126, swing: 0, mode: "min", kick: "short", drums: "minimal", bass: "offbeat", harm: "pluck", lead: false, duck: 0.4, perc: "rim", energy: 3, progs: [SUS, MIN_2], motif: ARP, bed: "none" },
  trance: { id: "trance", label: "Trance", group: "Kulüp", bpm: 138, swing: 0, mode: "min", kick: "house", drums: "four", bass: "roll", harm: "arp", lead: true, duck: 0.58, perc: "none", energy: 5, progs: [MIN_1, MIN_3], motif: TR, bed: "none" },
  hareketli: { id: "hareketli", label: "Hareketli", group: "Hareketli", bpm: 128, swing: 0, mode: "min", kick: "house", drums: "big", bass: "offbeat", harm: "stab", lead: true, duck: 0.6, perc: "none", energy: 5, progs: [MIN_1, MAJ_1], motif: HOOK, bed: "none" },
  dnb: { id: "dnb", label: "Drum & Bass", group: "Hareketli", bpm: 174, swing: 0, mode: "min", kick: "short", drums: "dnb", bass: "reese", harm: "pad", lead: true, duck: 0.5, perc: "none", energy: 5, progs: [MIN_2, MIN_1], motif: ARP, bed: "none" },
  breakbeat: { id: "breakbeat", label: "Breakbeat", group: "Hareketli", bpm: 132, swing: 0.04, mode: "min", kick: "house", drums: "breakz", bass: "walk", harm: "stab", lead: true, duck: 0.4, perc: "none", energy: 4, progs: [MIN_2, DOR], motif: PENT, bed: "none" },
  trap: { id: "trap", label: "Trap", group: "Ritim", bpm: 142, swing: 0.05, mode: "min", kick: "808", drums: "trap", bass: "glide", harm: "pad", lead: false, duck: 0.35, perc: "none", energy: 4, progs: [MIN_1, MIN_2], motif: HOOK, bed: "none" },
  hiphop: { id: "hiphop", label: "Hip-hop", group: "Ritim", bpm: 92, swing: 0.16, mode: "min", kick: "808", drums: "boom", bass: "sparse", harm: "rhodes", lead: true, duck: 0.3, perc: "rim", energy: 3, progs: [MIN_3, MIN_2], motif: PENT, bed: "none" },
  latin: { id: "latin", label: "Latin", group: "Ritim", bpm: 100, swing: 0.04, mode: "min", kick: "house", drums: "dembow", bass: "dembow", harm: "stab", lead: true, duck: 0.38, perc: "clave", energy: 4, progs: [MIN_2, MIN_1], motif: DISCO_M, bed: "none" },
  afro: { id: "afro", label: "Afro", group: "Ritim", bpm: 112, swing: 0.05, mode: "maj", kick: "house", drums: "afro", bass: "afro", harm: "pluck", lead: true, duck: 0.34, perc: "conga", energy: 4, progs: [MAJ_2, MAJ_1], motif: PENT, bed: "none" },
};

export interface Track {
  id: string;
  title: string;
  genre: GenreId;
  root: number;
  prog: number;
  bpm?: number;
}

function T(id: string, title: string, genre: GenreId, root: number, prog: number, bpm?: number): Track {
  return { id, title, genre, root, prog, bpm };
}

export const TRACKS: Track[] = [
  T("gece-vapuru", "Gece Vapuru", "yavas", 2, 0, 76),
  T("los-oda", "Loş Oda", "yavas", 9, 1, 80),
  T("sahil-sisi", "Sahil Sisi", "yavas", 5, 0),
  T("yarim-tempo", "Yarım Tempo", "slowjam", 7, 0),
  T("kadife", "Kadife", "slowjam", 4, 1, 88),
  T("tozlu-pikap", "Tozlu Pikap", "lofi", 0, 0),
  T("pencere-onu", "Pencere Önü", "lofi", 5, 1, 80),
  T("ogle-yagmuru", "Öğle Yağmuru", "lofi", 9, 0, 86),
  T("bos-iskele", "Boş İskele", "ambient", 2, 0, 66),
  T("uzak-ufuk", "Uzak Ufuk", "ambient", 9, 1),
  T("ayna-topu", "Ayna Topu", "disko", 9, 0),
  T("parke-isigi", "Parke Işığı", "disko", 2, 1, 120),
  T("altin-adim", "Altın Adım", "disko", 7, 0, 116),
  T("siki-bas", "Sıkı Bas", "funk", 5, 0, 108),
  T("cep-ritmi", "Cep Ritmi", "funk", 10, 1),
  T("bakir-hat", "Bakır Hat", "funk", 0, 0, 104),
  T("neon-rihtim", "Neon Rıhtım", "synthwave", 4, 0),
  T("gece-seridi", "Gece Şeridi", "synthwave", 9, 1, 100),
  T("mor-saat", "Mor Saat", "synthwave", 2, 0, 104),
  T("dort-dort", "Dört Dört", "house", 9, 0),
  T("sabah-kulubu", "Sabah Kulübü", "house", 4, 1, 126),
  T("tavan-isigi", "Tavan Işığı", "house", 0, 0, 122),
  T("derin-koridor", "Derin Koridor", "deephouse", 2, 0),
  T("gece-mavisi", "Gece Mavisi", "deephouse", 9, 1, 120),
  T("alcak-tavan", "Alçak Tavan", "deephouse", 7, 0),
  T("celik-hat", "Çelik Hat", "techno", 5, 0, 134),
  T("depo-4", "Depo 4", "techno", 0, 1, 130),
  T("basinc", "Basınç", "techno", 7, 0, 136),
  T("ince-cizgi", "İnce Çizgi", "minimal", 2, 0),
  T("tek-vurus", "Tek Vuruş", "minimal", 9, 1),
  T("uzun-yay", "Uzun Yay", "trance", 4, 0),
  T("isik-tuneli", "Işık Tüneli", "trance", 9, 1, 140),
  T("kivilcim", "Kıvılcım", "hareketli", 7, 0),
  T("tam-gaz", "Tam Gaz", "hareketli", 0, 1, 130),
  T("zirve", "Zirve", "hareketli", 4, 0, 128),
  T("hizli-serit", "Hızlı Şerit", "dnb", 2, 0),
  T("ince-tel", "İnce Tel", "dnb", 9, 1, 172),
  T("kirik-vurus", "Kırık Vuruş", "breakbeat", 5, 0),
  T("ara-sokak", "Ara Sokak", "breakbeat", 10, 1, 128),
  T("gece-808", "Gece 808", "trap", 7, 0, 140),
  T("agir-sapka", "Ağır Şapka", "trap", 2, 1, 146),
  T("beton-ritim", "Beton Ritim", "hiphop", 5, 0, 90),
  T("yavas-bas", "Yavaş Baş", "hiphop", 10, 1, 94),
  T("sicak-adim", "Sıcak Adım", "latin", 0, 0, 98),
  T("mercan", "Mercan", "latin", 7, 1, 102),
  T("yaz-penceresi", "Yaz Penceresi", "latin", 4, 0),
  T("gunes-vurusu", "Güneş Vuruşu", "afro", 5, 0, 114),
  T("acik-meydan", "Açık Meydan", "afro", 9, 1),
  T("kum-saati", "Kum Saati", "afro", 2, 0, 110),
];

export const GROUPS: GroupId[] = ["Tümü", "Yavaş", "Disko", "Kulüp", "Hareketli", "Ritim"];

export const SECTIONS = [
  { id: "giris", label: "Giriş", at: 0, bars: 8 },
  { id: "groove", label: "Groove", at: 8, bars: 16 },
  { id: "yukselis", label: "Yükseliş", at: 24, bars: 8 },
  { id: "drop", label: "Drop", at: 32, bars: 16 },
  { id: "ara", label: "Ara", at: 48, bars: 8 },
  { id: "final", label: "Final", at: 56, bars: 16 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
export const TOTAL_BARS = 72;

export function getTrack(id: string): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}

export function getGenre(id: GenreId): Genre {
  return GENRES[id];
}

export function sectionFor(bar: number) {
  const b = ((bar % TOTAL_BARS) + TOTAL_BARS) % TOTAL_BARS;
  let current: (typeof SECTIONS)[number] = SECTIONS[0];
  for (const s of SECTIONS) if (b >= s.at) current = s;
  return { ...current, bar, wrapped: b, barIn: b - current.at };
}

export function gridHit(pattern: string, step: number): number {
  const c = pattern[step] ?? ".";
  if (c === "x" || c === "X") return 1;
  if (c === "o" || c === "O") return 0.48;
  return 0;
}

export interface BassHit {
  semi: number;
  dur: number;
  glide?: boolean;
  quiet?: boolean;
}

export function bassAt(style: BassKind, step: number, bar: number): BassHit | null {
  switch (style) {
    case "offbeat":
      if (step === 4 || step === 12) return { semi: 0, dur: 2 };
      if (step === 7) return { semi: 0, dur: 1, quiet: true };
      if (step === 14) return { semi: 7, dur: 2 };
      return null;
    case "octave":
      if (step === 0) return { semi: 0, dur: 2 };
      if (step === 3) return { semi: 12, dur: 1 };
      if (step === 6) return { semi: 0, dur: 2 };
      if (step === 10) return { semi: 7, dur: 1 };
      if (step === 12) return { semi: 0, dur: 2 };
      if (step === 14) return { semi: 12, dur: 2 };
      return null;
    case "long":
      if (step === 0) return { semi: 0, dur: 8 };
      if (step === 8) return { semi: bar % 2 ? 7 : 3, dur: 8 };
      return null;
    case "reese":
      if (step === 0) return { semi: 0, dur: 14 };
      return null;
    case "glide":
      if (step === 0) return { semi: 0, dur: 6 };
      if (step === 7) return { semi: 3, dur: 2, glide: true };
      if (step === 10) return { semi: bar % 2 ? 10 : 7, dur: 4, glide: true };
      if (step === 14) return { semi: 0, dur: 2, glide: true, quiet: true };
      return null;
    case "walk":
      if (step === 0) return { semi: 0, dur: 2 };
      if (step === 3) return { semi: 3, dur: 1 };
      if (step === 6) return { semi: 7, dur: 2 };
      if (step === 10) return { semi: 10, dur: 2 };
      if (step === 13) return { semi: 12, dur: 2 };
      return null;
    case "roll":
      if (step % 2 === 0) {
        const seq = [0, 0, 7, 0, 12, 7, 3, 0];
        return { semi: seq[step / 2] ?? 0, dur: 2 };
      }
      return null;
    case "sparse":
      if (step === 0) return { semi: 0, dur: 6 };
      if (step === 8) return { semi: bar % 2 ? 5 : 7, dur: 6 };
      return null;
    case "rumble":
      return { semi: step % 8 === 4 ? 0 : -12, dur: 1, quiet: step % 2 === 1 };
    case "dembow":
      if (step === 0 || step === 8) return { semi: 0, dur: 2 };
      if (step === 3) return { semi: 0, dur: 1, quiet: true };
      if (step === 6) return { semi: 10, dur: 2 };
      if (step === 11) return { semi: 0, dur: 2 };
      return null;
    case "afro":
      if (step === 0) return { semi: 0, dur: 2 };
      if (step === 4) return { semi: 0, dur: 1 };
      if (step === 7) return { semi: 12, dur: 1 };
      if (step === 10) return { semi: 7, dur: 2 };
      if (step === 14) return { semi: 0, dur: 2 };
      return null;
    default:
      return null;
  }
}

export function trackBpm(track: Track): number {
  return track.bpm ?? GENRES[track.genre].bpm;
}

export function trackLength(track: Track): string {
  return lengthLabel(TOTAL_BARS, trackBpm(track));
}

export function mixHint(a: Track, ta: number, b: Track, tb: number): { label: string; tone: "ok" | "near" | "risk" } {
  const ga = GENRES[a.genre];
  const gb = GENRES[b.genre];
  const pa = wrapPc(a.root + ta);
  const pb = wrapPc(b.root + tb);
  const diff = Math.min((pa - pb + 12) % 12, (pb - pa + 12) % 12);
  const relative = ga.mode !== gb.mode && (diff === 3 || diff === 9);
  if (diff === 0 || diff === 7 || relative) return { label: "Uyumlu ton", tone: "ok" };
  if (diff <= 2 || diff === 5) return { label: "Yakın ton", tone: "near" };
  return { label: "Ton riski", tone: "risk" };
}

export function filterTracks(group: GroupId, query: string): Track[] {
  const q = query.trim().toLocaleLowerCase("tr");
  return TRACKS.filter((t) => {
    const g = GENRES[t.genre];
    if (group !== "Tümü" && g.group !== group) return false;
    if (!q) return true;
    return `${t.title} ${g.label}`.toLocaleLowerCase("tr").includes(q);
  });
}
