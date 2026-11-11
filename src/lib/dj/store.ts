import { create } from "zustand";
import { GENRES, getTrack, trackBpm, type GroupId } from "./catalog";
import { bootEngine, getEngine, type DeckId, type LoopBars } from "./engine";

export type TabId = "lib" | "A" | "mix" | "B";

export interface DeckUi {
  trackId: string;
  bpm: number;
  volume: number;
  filter: number;
  eqLow: number;
  eqMid: number;
  eqHigh: number;
  delay: number;
  reverb: number;
  flanger: number;
  transpose: number;
  loopBars: LoopBars;
  sync: boolean;
  playing: boolean;
}

interface DjState {
  booted: boolean;
  booting: boolean;
  master: number;
  cross: number;
  target: DeckId;
  group: GroupId;
  query: string;
  tab: TabId;
  recording: boolean;
  decks: Record<DeckId, DeckUi>;
  boot: () => Promise<void>;
  toggle: (id: DeckId) => Promise<void>;
  cue: (id: DeckId) => Promise<void>;
  load: (id: DeckId, trackId: string) => Promise<void>;
  setBpm: (id: DeckId, bpm: number) => void;
  nudge: (id: DeckId, active: boolean, dir: number) => void;
  setSync: (id: DeckId, on: boolean) => void;
  setLoop: (id: DeckId, bars: LoopBars) => void;
  jump: (id: DeckId, section: "giris" | "groove" | "yukselis" | "drop" | "ara" | "final") => Promise<void>;
  setTranspose: (id: DeckId, semis: number) => void;
  setVolume: (id: DeckId, v: number) => void;
  setFilter: (id: DeckId, v: number) => void;
  setEq: (id: DeckId, band: "low" | "mid" | "high", db: number) => void;
  setSend: (id: DeckId, fx: "delay" | "reverb" | "flanger", v: number) => void;
  setMaster: (v: number) => void;
  setCross: (v: number) => void;
  repeat: (id: DeckId) => Promise<void>;
  pad: (name: "kick" | "clap" | "hat" | "snare" | "tom" | "cow" | "stab" | "sub") => Promise<void>;
  stopAll: () => void;
  toggleRecord: () => Promise<void>;
  setGroup: (g: GroupId) => void;
  setQuery: (q: string) => void;
  setTab: (t: TabId) => void;
  setTarget: (id: DeckId) => void;
}

function deck(trackId: string, reverb: number): DeckUi {
  return {
    trackId,
    bpm: trackBpm(getTrack(trackId)),
    volume: 0.82,
    filter: 0.5,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    delay: 0,
    reverb,
    flanger: 0,
    transpose: 0,
    loopBars: 0,
    sync: false,
    playing: false,
  };
}

function pushDeck(id: DeckId, d: DeckUi) {
  const e = getEngine();
  if (!e) return;
  e.setVolume(id, d.volume);
  e.setFilter(id, d.filter);
  e.setEq(id, "low", d.eqLow);
  e.setEq(id, "mid", d.eqMid);
  e.setEq(id, "high", d.eqHigh);
  e.setSend(id, "delay", d.delay);
  e.setSend(id, "reverb", d.reverb);
  e.setSend(id, "flanger", d.flanger);
  e.setTranspose(id, d.transpose);
  e.setBpm(id, d.bpm);
  e.setLoop(id, d.loopBars);
}

export const useDj = create<DjState>((set, get) => ({
  booted: false,
  booting: false,
  master: 0.78,
  cross: 0.5,
  target: "A",
  group: "Tümü",
  query: "",
  tab: "A",
  recording: false,
  decks: { A: deck("dort-dort", 0.16), B: deck("ayna-topu", 0.18) },

  boot: async () => {
    if (get().booted || get().booting) return;
    set({ booting: true });
    await bootEngine();
    const s = get();
    const e = getEngine();
    if (!e) {
      set({ booting: false });
      return;
    }
    e.load("A", s.decks.A.trackId);
    e.load("B", s.decks.B.trackId);
    e.setMaster(s.master);
    e.setCross(s.cross);
    pushDeck("A", get().decks.A);
    pushDeck("B", get().decks.B);
    e.setSync("A", get().decks.A.sync);
    e.setSync("B", get().decks.B.sync);
    set({ booted: true, booting: false });
  },

  toggle: async (id) => {
    if (!get().booted) await get().boot();
    const e = getEngine();
    if (!e) return;
    const playing = !get().decks[id].playing;
    if (playing) e.play(id);
    else e.stop(id);
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], playing } } }));
  },

  cue: async (id) => {
    if (!get().booted) await get().boot();
    getEngine()?.cue(id);
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], playing: false, loopBars: 0 } } }));
  },

  load: async (id, trackId) => {
    const track = getTrack(trackId);
    const synced = get().decks[id].sync;
    set((s) => ({
      decks: {
        ...s.decks,
        [id]: {
          ...s.decks[id],
          trackId,
          bpm: synced ? s.decks[id].bpm : trackBpm(track),
          loopBars: 0,
        },
      },
      tab: id,
    }));
    const e = getEngine();
    if (!e) return;
    const was = get().decks[id].playing;
    e.load(id, trackId);
    if (synced) e.setBpm(id, get().decks[id].bpm);
    else {
      const other: DeckId = id === "A" ? "B" : "A";
      if (get().decks[other].sync) {
        const bpm = trackBpm(track);
        e.setBpm(other, bpm);
        set((s) => ({ decks: { ...s.decks, [other]: { ...s.decks[other], bpm } } }));
      }
    }
    if (was) e.play(id);
  },

  setBpm: (id, bpm) => {
    const next = Math.max(64, Math.min(190, Math.round(bpm)));
    getEngine()?.setBpm(id, next);
    set((s) => {
      const decks = { ...s.decks, [id]: { ...s.decks[id], bpm: next } };
      const other: DeckId = id === "A" ? "B" : "A";
      if (decks[other].sync || decks[id].sync) decks[other] = { ...decks[other], bpm: decks[id].sync ? s.decks[other].bpm : next };
      if (decks[other].sync) decks[other] = { ...decks[other], bpm: next };
      if (decks[id].sync) decks[id === "A" ? "B" : "A"] = { ...decks[id === "A" ? "B" : "A"], bpm: next };
      return { decks };
    });
  },

  nudge: (id, active, dir) => {
    const base = get().decks[id].bpm;
    getEngine()?.nudge(id, active, dir, base);
  },

  setSync: (id, on) => {
    getEngine()?.setSync(id, on);
    set((s) => {
      const other: DeckId = id === "A" ? "B" : "A";
      const decks = {
        ...s.decks,
        [id]: { ...s.decks[id], sync: on, bpm: on ? s.decks[other].bpm : s.decks[id].bpm },
        [other]: { ...s.decks[other], sync: on ? false : s.decks[other].sync },
      };
      return { decks };
    });
  },

  setLoop: (id, bars) => {
    getEngine()?.setLoop(id, bars);
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], loopBars: bars } } }));
  },

  jump: async (id, section) => {
    if (!get().booted) await get().boot();
    getEngine()?.jump(id, section);
  },

  setTranspose: (id, semis) => {
    const next = Math.max(-6, Math.min(6, semis));
    getEngine()?.setTranspose(id, next);
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], transpose: next } } }));
  },

  setVolume: (id, v) => {
    getEngine()?.setVolume(id, v);
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], volume: v } } }));
  },

  setFilter: (id, v) => {
    getEngine()?.setFilter(id, v);
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], filter: v } } }));
  },

  setEq: (id, band, db) => {
    getEngine()?.setEq(id, band, db);
    const key = band === "low" ? "eqLow" : band === "mid" ? "eqMid" : "eqHigh";
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], [key]: db } } }));
  },

  setSend: (id, fx, v) => {
    getEngine()?.setSend(id, fx, v);
    const key = fx === "delay" ? "delay" : fx === "reverb" ? "reverb" : "flanger";
    set((s) => ({ decks: { ...s.decks, [id]: { ...s.decks[id], [key]: v } } }));
  },

  setMaster: (v) => {
    getEngine()?.setMaster(v);
    set({ master: v });
  },

  setCross: (v) => {
    const next = Math.min(1, Math.max(0, v));
    getEngine()?.setCross(next);
    set({ cross: next });
  },

  repeat: async (id) => {
    if (!get().booted) await get().boot();
    getEngine()?.repeat(id);
  },

  pad: async (name) => {
    if (!get().booted) await get().boot();
    getEngine()?.pad(name);
  },

  stopAll: () => {
    getEngine()?.stopAll();
    set((s) => ({
      decks: {
        A: { ...s.decks.A, playing: false },
        B: { ...s.decks.B, playing: false },
      },
    }));
  },

  toggleRecord: async () => {
    if (!get().booted) await get().boot();
    const e = getEngine();
    if (!e) return;
    if (get().recording) {
      const blob = await e.stopRecord();
      set({ recording: false });
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ergin-dj-lab.webm";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    set({ recording: e.startRecord() });
  },

  setGroup: (group) => set({ group }),
  setQuery: (query) => set({ query }),
  setTab: (tab) => set({ tab }),
  setTarget: (target) => set({ target }),
}));

export function genreOf(trackId: string) {
  return GENRES[getTrack(trackId).genre];
}

if (typeof window !== "undefined") {
  useDj.subscribe((s) => {
    localStorage.setItem(
      "ergin-dj-lab",
      JSON.stringify({ a: s.decks.A.trackId, b: s.decks.B.trackId, master: s.master, cross: s.cross }),
    );
  });
}
