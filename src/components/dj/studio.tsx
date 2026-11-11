import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Disc3, Pause, Play, RotateCcw, Square } from "lucide-react";
import {
  GROUPS,
  SECTIONS,
  TOTAL_BARS,
  filterTracks,
  getGenre,
  getTrack,
  mixHint,
  trackBpm,
  trackLength,
  TRACKS,
  type SectionId,
} from "@/lib/dj/catalog";
import { getEngine, type DeckId, type DeckPosition, type LoopBars } from "@/lib/dj/engine";
import { useDj } from "@/lib/dj/store";
import { clock, keyLabel } from "@/lib/dj/theory";

const LOOPS: LoopBars[] = [0, 1, 2, 4, 8];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function idlePos(): DeckPosition {
  return { bar: 0, step: 0, bpm: 0, playing: false, section: "giris", sectionLabel: "Giriş" };
}

function Knob({
  label,
  value,
  min,
  max,
  step = 0.01,
  display,
  accent,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  accent: string;
  onChange: (v: number) => void;
}) {
  const drag = useRef<{ y: number; v: number } | null>(null);
  const norm = (value - min) / (max - min || 1);
  const angle = -135 + clamp(norm, 0, 1) * 270;

  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dy = drag.current.y - e.clientY;
    const sens = e.shiftKey ? 0.0025 : 0.008;
    const raw = drag.current.v + dy * (max - min) * sens;
    const snapped = Math.round(clamp(raw, min, max) / step) * step;
    onChange(Number(snapped.toFixed(3)));
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(2))}
        aria-valuetext={display}
        className="relative grid size-12 place-items-center rounded-full border border-line bg-surface-2"
        onPointerDown={(e) => {
          drag.current = { y: e.clientY, v: value };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null;
        }}
        onKeyDown={(e) => {
          const dir = e.key === "ArrowUp" || e.key === "ArrowRight" ? 1 : e.key === "ArrowDown" || e.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          onChange(Number(clamp(value + dir * step * (e.shiftKey ? 1 : 4), min, max).toFixed(3)));
        }}
      >
        <span className="absolute inset-1 rounded-full border border-line" style={{ transform: `rotate(${angle}deg)` }}>
          <span className={`absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full ${accent}`} />
        </span>
        <span className="font-mono text-xs text-muted">{display}</span>
      </div>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

function Wave({ id }: { id: DeckId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let frame = 0;
    const draw = () => {
      const css = getComputedStyle(document.documentElement);
      const accent = css.getPropertyValue(id === "A" ? "--color-amber" : "--color-ice").trim();
      const line = css.getPropertyValue("--color-line").trim();
      const fg = css.getPropertyValue("--color-fg").trim();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 2 && h > 2) {
        if (canvas.width !== Math.floor(w * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }
        const g = canvas.getContext("2d");
        if (g) {
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.clearRect(0, 0, w, h);
          SECTIONS.forEach((s) => {
            const x = (s.at / TOTAL_BARS) * w;
            const bw = (s.bars / TOTAL_BARS) * w;
            g.globalAlpha = 0.95;
            g.fillStyle = line;
            g.fillRect(x + 1, h * 0.62, Math.max(2, bw - 2), 4);
          });
          const engine = getEngine();
          const pos = engine?.position(id);
          const head = (((pos?.bar ?? 0) + (pos?.step ?? 0) / 16) / TOTAL_BARS) * w;
          g.globalAlpha = 1;
          g.fillStyle = accent;
          g.fillRect(head, 6, 2, h - 12);
          if (engine && pos?.playing) {
            const an = engine.analyser(id);
            const data = new Uint8Array(an.fftSize);
            an.getByteTimeDomainData(data);
            g.strokeStyle = fg;
            g.lineWidth = 1.25;
            g.beginPath();
            const slice = data.length / w;
            for (let i = 0; i < w; i++) {
              const v = data[Math.floor(i * slice)] / 128 - 1;
              const y = h * 0.38 + v * h * 0.28;
              if (i === 0) g.moveTo(i, y);
              else g.lineTo(i, y);
            }
            g.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [id]);
  return <canvas ref={ref} className="h-16 w-full rounded-md bg-surface-2" />;
}

function Spectrum() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let frame = 0;
    const draw = () => {
      const css = getComputedStyle(document.documentElement);
      const amber = css.getPropertyValue("--color-amber").trim();
      const ice = css.getPropertyValue("--color-ice").trim();
      const line = css.getPropertyValue("--color-line").trim();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 2 && h > 2) {
        if (canvas.width !== Math.floor(w * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }
        const g = canvas.getContext("2d");
        const engine = getEngine();
        if (g) {
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.clearRect(0, 0, w, h);
          const bars = 36;
          const data = new Uint8Array(engine ? engine.masterAnalyser.frequencyBinCount : bars);
          if (engine) engine.masterAnalyser.getByteFrequencyData(data);
          const gap = 2;
          const bw = (w - gap * bars) / bars;
          for (let i = 0; i < bars; i++) {
            const v = engine ? data[Math.floor((i / bars) * 80)] / 255 : 0.08;
            const bh = Math.max(2, v * h);
            g.fillStyle = i < bars / 2 ? amber : ice;
            g.globalAlpha = engine ? 0.9 : 0.35;
            g.fillRect(i * (bw + gap), h - bh, bw, bh);
          }
          if (!engine) {
            g.globalAlpha = 1;
            g.fillStyle = line;
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} className="h-14 w-full" aria-hidden />;
}

function Energy({ n }: { n: number }) {
  return (
    <span className="flex items-end gap-0.5" aria-label={`Enerji ${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`w-1 rounded-sm ${i <= n ? "bg-amber" : "bg-line"}`} style={{ height: `${6 + i * 2}px` }} />
      ))}
    </span>
  );
}

function DeckFace({ id, pos }: { id: DeckId; pos: DeckPosition }) {
  const deck = useDj((s) => s.decks[id]);
  const toggle = useDj((s) => s.toggle);
  const cue = useDj((s) => s.cue);
  const setBpm = useDj((s) => s.setBpm);
  const nudge = useDj((s) => s.nudge);
  const setSync = useDj((s) => s.setSync);
  const setLoop = useDj((s) => s.setLoop);
  const jump = useDj((s) => s.jump);
  const setTranspose = useDj((s) => s.setTranspose);
  const setVolume = useDj((s) => s.setVolume);
  const setFilter = useDj((s) => s.setFilter);
  const setEq = useDj((s) => s.setEq);
  const setSend = useDj((s) => s.setSend);
  const repeat = useDj((s) => s.repeat);
  const track = getTrack(deck.trackId);
  const genre = getGenre(track.genre);
  const accentText = id === "A" ? "text-amber" : "text-ice";
  const accentBg = id === "A" ? "bg-amber" : "bg-ice";
  const liveBpm = pos.playing ? pos.bpm : deck.bpm;
  const bar = pos.playing || pos.bar ? pos.bar : 0;

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-mono text-xs tracking-widest ${accentText}`}>GÜVERTE {id}</p>
          <h2 className="truncate text-xl font-semibold">{track.title}</h2>
          <p className="text-sm text-muted">
            {genre.label} · {keyLabel(track.root, genre.mode, deck.transpose)} · Ergin Stüdyo
          </p>
        </div>
        <div
          className={`platter relative size-14 shrink-0 rounded-full border border-line ${deck.playing ? "on" : ""}`}
          style={{
            animationDuration: `${(120 / Math.max(64, liveBpm)).toFixed(2)}s`,
            background: "conic-gradient(from 30deg, var(--color-surface-2), var(--color-line), var(--color-surface-2) 55%, var(--color-bg))",
          }}
          aria-hidden
        >
          <span className={`absolute top-1 left-1/2 h-3 w-0.5 -translate-x-1/2 ${accentBg}`} />
          <span className="absolute inset-4 rounded-full bg-bg" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-4xl leading-none">{Math.round(liveBpm)}</p>
          <p className="text-xs text-muted">BPM · {clock(bar, pos.step, liveBpm)} / {trackLength(track)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Energy n={genre.energy} />
          <button
            type="button"
            className="h-11 w-11 rounded-md border border-line font-mono"
            aria-label="Geçici yavaşlat"
            onPointerDown={() => nudge(id, true, -1)}
            onPointerUp={() => nudge(id, false, -1)}
            onPointerLeave={() => nudge(id, false, -1)}
          >
            −
          </button>
          <button
            type="button"
            className="h-11 w-11 rounded-md border border-line font-mono"
            aria-label="Geçici hızlandır"
            onPointerDown={() => nudge(id, true, 1)}
            onPointerUp={() => nudge(id, false, 1)}
            onPointerLeave={() => nudge(id, false, 1)}
          >
            +
          </button>
        </div>
      </div>

      <Wave id={id} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`inline-flex h-12 items-center gap-2 rounded-md px-4 font-medium text-bg ${accentBg}`}
          onClick={() => void toggle(id)}
        >
          {deck.playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          {deck.playing ? "Durdur" : "Çal"}
        </button>
        <button type="button" className="inline-flex h-12 items-center gap-2 rounded-md border border-line px-3 text-sm" onClick={() => void cue(id)}>
          <RotateCcw className="size-4" />
          Başa al
        </button>
        <button
          type="button"
          className={`h-12 rounded-md border px-3 text-sm ${deck.sync ? `${accentBg} border-transparent text-bg` : "border-line"}`}
          onClick={() => setSync(id, !deck.sync)}
        >
          Senkron
        </button>
        <button type="button" className="h-12 rounded-md border border-line px-3 text-sm" onClick={() => void repeat(id)}>
          Tekrar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SECTIONS.map((s) => {
          const on = pos.section === s.id && (deck.playing || pos.bar > 0);
          return (
            <button
              key={s.id}
              type="button"
              className={`h-11 rounded-md border text-sm ${on ? `${accentBg} border-transparent text-bg` : "border-line text-fg"}`}
              onClick={() => void jump(id, s.id as SectionId)}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Döngü</span>
        {LOOPS.map((n) => (
          <button
            key={n}
            type="button"
            className={`h-11 min-w-11 rounded-md border px-2 text-sm ${deck.loopBars === n ? `${accentBg} border-transparent text-bg` : "border-line"}`}
            onClick={() => setLoop(id, n)}
          >
            {n === 0 ? "Kapalı" : `${n}`}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2">
          <button type="button" className="size-11 rounded-md border border-line" onClick={() => setTranspose(id, deck.transpose - 1)} aria-label="Ton indir">
            −
          </button>
          <span className="min-w-24 text-center text-sm">{keyLabel(track.root, genre.mode, deck.transpose)}</span>
          <button type="button" className="size-11 rounded-md border border-line" onClick={() => setTranspose(id, deck.transpose + 1)} aria-label="Ton yükselt">
            +
          </button>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs text-muted" htmlFor={`bpm-${id}`}>
          Hız
        </label>
        <input
          id={`bpm-${id}`}
          type="range"
          min={64}
          max={190}
          value={deck.bpm}
          onChange={(e) => setBpm(id, Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Knob label="Filtre" value={deck.filter} min={0} max={1} display={filterText(deck.filter)} accent={accentBg} onChange={(v) => setFilter(id, v)} />
        <Knob label="Bas" value={deck.eqLow} min={-12} max={6} step={1} display={db(deck.eqLow)} accent={accentBg} onChange={(v) => setEq(id, "low", v)} />
        <Knob label="Orta" value={deck.eqMid} min={-12} max={6} step={1} display={db(deck.eqMid)} accent={accentBg} onChange={(v) => setEq(id, "mid", v)} />
        <Knob label="Tiz" value={deck.eqHigh} min={-12} max={6} step={1} display={db(deck.eqHigh)} accent={accentBg} onChange={(v) => setEq(id, "high", v)} />
        <Knob label="Gecikme" value={deck.delay} min={0} max={0.75} display={pct(deck.delay)} accent={accentBg} onChange={(v) => setSend(id, "delay", v)} />
        <Knob label="Yankı" value={deck.reverb} min={0} max={0.75} display={pct(deck.reverb)} accent={accentBg} onChange={(v) => setSend(id, "reverb", v)} />
        <Knob label="Flanj" value={deck.flanger} min={0} max={0.7} display={pct(deck.flanger)} accent={accentBg} onChange={(v) => setSend(id, "flanger", v)} />
        <Knob label="Ses" value={deck.volume} min={0} max={1} display={pct(deck.volume)} accent={accentBg} onChange={(v) => setVolume(id, v)} />
      </div>
      <p className="text-xs text-muted">Filtre ortada açıktır. Sola yüksek geçiren, sağa alçak geçiren.</p>
    </section>
  );
}

function db(n: number) {
  return `${n > 0 ? "+" : ""}${Math.round(n)}`;
}
function pct(n: number) {
  return `${Math.round(n * 100)}`;
}
function filterText(n: number) {
  if (n < 0.47) return "HP";
  if (n > 0.53) return "LP";
  return "Açık";
}

function Library() {
  const group = useDj((s) => s.group);
  const query = useDj((s) => s.query);
  const setGroup = useDj((s) => s.setGroup);
  const setQuery = useDj((s) => s.setQuery);
  const load = useDj((s) => s.load);
  const decks = useDj((s) => s.decks);
  const list = filterTracks(group, query);

  return (
    <aside className="flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface p-3">
      <div>
        <p className="font-mono text-xs tracking-widest text-muted">KÜTÜPHANE</p>
        <h2 className="text-lg font-semibold">{TRACKS.length} orijinal set</h2>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Set veya tür ara"
        className="h-11 rounded-md border border-line bg-bg px-3 text-sm outline-none"
        aria-label="Set ara"
      />
      <div className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            className={`h-11 rounded-md border px-3 text-sm ${group === g ? "border-transparent bg-fg text-bg" : "border-line text-muted"}`}
            onClick={() => setGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <ul className="flex max-h-[28rem] flex-col gap-2 overflow-auto lg:max-h-[calc(100vh-16rem)]">
        {list.map((t) => {
          const g = getGenre(t.genre);
          const onA = decks.A.trackId === t.id;
          const onB = decks.B.trackId === t.id;
          return (
            <li key={t.id} className="rounded-md border border-line bg-bg p-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-xs text-muted">
                    {g.label} · {keyLabel(t.root, g.mode)} · {trackBpm(t)} BPM
                  </p>
                </div>
                <Energy n={g.energy} />
              </div>
              <div className="mt-2 flex gap-2">
                <button type="button" className={`h-11 flex-1 rounded-md text-sm ${onA ? "bg-amber text-bg" : "border border-line"}`} onClick={() => void load("A", t.id)}>
                  Güverte A
                </button>
                <button type="button" className={`h-11 flex-1 rounded-md text-sm ${onB ? "bg-ice text-bg" : "border border-line"}`} onClick={() => void load("B", t.id)}>
                  Güverte B
                </button>
              </div>
            </li>
          );
        })}
        {list.length === 0 && <li className="text-sm text-muted">Bu süzgeçte set yok.</li>}
      </ul>
    </aside>
  );
}

function Mixer({ pos }: { pos: Record<DeckId, DeckPosition> }) {
  const cross = useDj((s) => s.cross);
  const master = useDj((s) => s.master);
  const setCross = useDj((s) => s.setCross);
  const setMaster = useDj((s) => s.setMaster);
  const decks = useDj((s) => s.decks);
  const boot = useDj((s) => s.boot);
  const booted = useDj((s) => s.booted);
  const booting = useDj((s) => s.booting);
  const stopAll = useDj((s) => s.stopAll);
  const recording = useDj((s) => s.recording);
  const toggleRecord = useDj((s) => s.toggleRecord);
  const a = getTrack(decks.A.trackId);
  const b = getTrack(decks.B.trackId);
  const hint = mixHint(a, decks.A.transpose, b, decks.B.transpose);

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface p-3">
      <p className="font-mono text-xs tracking-widest text-muted">MİKSER</p>
      <Spectrum />
      <p className={`text-sm ${hint.tone === "ok" ? "text-ok" : hint.tone === "near" ? "text-amber" : "text-rec"}`}>{hint.label}</p>
      <p className="text-xs text-muted">
        A {pos.A.sectionLabel} · B {pos.B.sectionLabel}
      </p>
      <label className="text-xs text-muted" htmlFor="xfade">
        Geçiş
      </label>
      <input id="xfade" type="range" min={0} max={1} step={0.01} value={cross} onChange={(e) => setCross(Number(e.target.value))} />
      <div className="flex justify-between font-mono text-xs text-muted">
        <span>A</span>
        <span>B</span>
      </div>
      <label className="text-xs text-muted" htmlFor="master">
        Ana ses
      </label>
      <input id="master" type="range" min={0} max={1} step={0.01} value={master} onChange={(e) => setMaster(Number(e.target.value))} />
      {!booted && (
        <button type="button" className="h-12 rounded-md bg-amber font-medium text-bg" onClick={() => void boot()} disabled={booting}>
          {booting ? "Açılıyor" : "Sesi aç"}
        </button>
      )}
      <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line text-sm" onClick={stopAll}>
        <Square className="size-4" />
        Hepsini durdur
      </button>
      <button
        type="button"
        className={`h-11 rounded-md text-sm font-medium ${recording ? "bg-rec text-fg" : "border border-line"}`}
        onClick={() => void toggleRecord()}
      >
        {recording ? "Kaydı bitir ve indir" : "Miksi kaydet"}
      </button>
      <p className="text-xs text-muted">Kayıt yalnızca bu stüdyonun ürettiği sesi indirir. Başka eser eklenmez.</p>
    </section>
  );
}

const PADS = [
  ["kick", "Kick"],
  ["clap", "Alkış"],
  ["hat", "Zil"],
  ["snare", "Trampet"],
  ["tom", "Tom"],
  ["cow", "Çan"],
  ["stab", "Akor"],
  ["sub", "Bas"],
] as const;

export function Studio() {
  const tab = useDj((s) => s.tab);
  const setTab = useDj((s) => s.setTab);
  const [pos, setPos] = useState<Record<DeckId, DeckPosition>>({ A: idlePos(), B: idlePos() });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ergin-dj-lab");
      if (!raw) return;
      const data = JSON.parse(raw) as { a?: string; b?: string; master?: number; cross?: number };
      if (data.a && TRACKS.some((t) => t.id === data.a)) void useDj.getState().load("A", data.a);
      if (data.b && TRACKS.some((t) => t.id === data.b)) void useDj.getState().load("B", data.b);
      if (typeof data.master === "number") useDj.getState().setMaster(data.master);
      if (typeof data.cross === "number") useDj.getState().setCross(data.cross);
    } catch {
      /* eski kayıt yok sayılır */
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const engine = getEngine();
      if (!engine) return;
      setPos({ A: engine.position("A"), B: engine.position("B") });
    }, 90);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        void useDj.getState().toggle(e.shiftKey ? "B" : "A");
      } else if (e.key === "ArrowLeft") {
        useDj.getState().setCross(useDj.getState().cross - 0.04);
      } else if (e.key === "ArrowRight") {
        useDj.getState().setCross(useDj.getState().cross + 0.04);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const show = (name: "lib" | "A" | "mix" | "B") => (tab === name ? "block" : "hidden lg:block");

  return (
    <main className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-bg px-3 py-3 lg:px-4">
        <div className="flex items-center gap-3">
          <Disc3 className="size-6 text-amber" aria-hidden />
          <div>
            <p className="text-sm font-semibold tracking-wide">ERGIN DJ LAB</p>
            <p className="text-xs text-muted">Orijinal sentez · sample yok · telif yok</p>
          </div>
        </div>
        <p className="hidden text-xs text-muted sm:block">Boşluk A · Shift boşluk B · oklar geçiş</p>
      </header>

      <nav className="flex gap-2 overflow-auto px-3 py-2 lg:hidden">
        {(
          [
            ["lib", "Kütüphane"],
            ["A", "Güverte A"],
            ["mix", "Mikser"],
            ["B", "Güverte B"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`h-11 shrink-0 rounded-md border px-3 text-sm ${tab === id ? "border-transparent bg-fg text-bg" : "border-line"}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="grid items-start gap-3 px-3 pb-4 lg:grid-cols-[18rem_minmax(0,1fr)_16rem_minmax(0,1fr)] lg:px-4">
        <div className={show("lib")}>
          <Library />
        </div>
        <div className={show("A")}>
          <DeckFace id="A" pos={pos.A} />
        </div>
        <div className={show("mix")}>
          <Mixer pos={pos} />
        </div>
        <div className={show("B")}>
          <DeckFace id="B" pos={pos.B} />
        </div>
      </div>

      <section className="mx-3 mb-6 rounded-md border border-line bg-surface p-3 lg:mx-4">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold">Performans pedleri</h2>
          <p className="text-xs text-muted">Vuruşlar da burada üretilir, dosyadan gelmez.</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {PADS.map(([name, label]) => (
            <button
              key={name}
              type="button"
              className="h-14 rounded-md border border-line bg-surface-2 text-sm active:bg-amber active:text-bg"
              onPointerDown={() => void useDj.getState().pad(name)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          19 tür, 72 ölçülük düzen: giriş, groove, yükseliş, drop, ara, final. Ergin Kaplan. Üçüncü taraf müzik, vokal veya sample yoktur.
        </p>
      </section>
    </main>
  );
}
