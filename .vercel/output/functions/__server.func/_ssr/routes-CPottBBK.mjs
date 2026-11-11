import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pause, i as Play, n as Square, o as Disc3, r as RotateCcw } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPottBBK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NOTE_TR = [
	"Do",
	"Do#",
	"Re",
	"Mib",
	"Mi",
	"Fa",
	"Fa#",
	"Sol",
	"Sol#",
	"La",
	"Sib",
	"Si"
];
var MINOR = [
	0,
	2,
	3,
	5,
	7,
	8,
	10
];
var MAJOR = [
	0,
	2,
	4,
	5,
	7,
	9,
	11
];
function midiToFreq(midi) {
	return 440 * Math.pow(2, (midi - 69) / 12);
}
function wrapPc(n) {
	return (n % 12 + 12) % 12;
}
function degreeToSemi(mode, degree) {
	const scale = mode === "min" ? MINOR : MAJOR;
	const wrapped = (degree % 7 + 7) % 7;
	const oct = Math.floor(degree / 7);
	return scale[wrapped] + oct * 12;
}
function keyLabel(root, mode, transpose = 0) {
	return `${NOTE_TR[wrapPc(root + transpose)]} ${mode === "min" ? "minör" : "majör"}`;
}
function voiceChord(rootPc, pcs, transpose, base) {
	const midis = [];
	let prev = base - 12;
	for (const pc of pcs) {
		let midi = base + wrapPc(rootPc + pc + transpose);
		while (midi <= prev) midi += 12;
		midis.push(midi);
		prev = midi;
	}
	return midis;
}
function clock(bar, step, bpm) {
	const beats = bar * 4 + step / 4;
	const sec = Math.max(0, beats * (60 / Math.max(1, bpm)));
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);
	return `${m}:${String(s).padStart(2, "0")}`;
}
function lengthLabel(bars, bpm) {
	const sec = bars * 4 * (60 / Math.max(1, bpm));
	const m = Math.floor(sec / 60);
	const s = Math.round(sec % 60) % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
var DRUMS = {
	four: {
		kick: "x...x...x...x...",
		snare: "................",
		clap: "....x.......x...",
		hat: "x.x.x.x.x.x.x.x.",
		open: "..x...x...x...x.",
		perc: "..............o."
	},
	disco: {
		kick: "x...x...x...x...",
		snare: "................",
		clap: "....x.......x..o",
		hat: "x.x.x.x.x.x.x.x.",
		open: "..x...x...x...x.",
		perc: "..x...x...x...x."
	},
	tech: {
		kick: "x...x...x...x...",
		snare: "................",
		clap: "....x.......x...",
		hat: "xxxxxxxxxxxxxxxx",
		open: "................",
		perc: "................"
	},
	minimal: {
		kick: "x...x...x...x...",
		snare: "................",
		clap: "................",
		hat: "x.......x.......",
		open: "................",
		perc: "......x.......x."
	},
	deep: {
		kick: "x...x...x...x...",
		snare: "................",
		clap: "....x.......x...",
		hat: "x...x.x.x...x.x.",
		open: "..x.......x.....",
		perc: "..............o."
	},
	big: {
		kick: "x...x...x...x...",
		snare: "............x...",
		clap: "....x.......x...",
		hat: "x.xxx.xxx.xxx.xx",
		open: "..x...x...x...x.",
		perc: "..............x."
	},
	trap: {
		kick: "x.......x..x....",
		snare: "....x.......x...",
		clap: "....o.......o...",
		hat: "x.xxx.xx.xxx.xxx",
		open: "..............x.",
		perc: "................"
	},
	boom: {
		kick: "x.....x...x.....",
		snare: "....x.......x...",
		clap: "....o.......o...",
		hat: "x.x.x.x.x.x.x.x.",
		open: "..............x.",
		perc: "......o........."
	},
	slow: {
		kick: "x.......x.......",
		snare: "....x.......x...",
		clap: "................",
		hat: "x...x...x...x...",
		open: "..............o.",
		perc: "................"
	},
	half: {
		kick: "x...............",
		snare: "........x.......",
		clap: "................",
		hat: "x...x...x...x...",
		open: "..............o.",
		perc: "................"
	},
	dusty: {
		kick: "x.....x...x.....",
		snare: "....x.......x...",
		clap: "................",
		hat: "o.x.o.x.o.x.o.x.",
		open: "..............x.",
		perc: "....o.......o..."
	},
	air: {
		kick: "x...............",
		snare: "................",
		clap: "................",
		hat: "o...............",
		open: "................",
		perc: "..............o."
	},
	funk: {
		kick: "x...x.....x.x...",
		snare: "....x.......x...",
		clap: "....o.......o...",
		hat: "x.x.x.x.x.x.x.x.",
		open: "..x.......x.....",
		perc: "......x........."
	},
	dembow: {
		kick: "x..x..x.x..x....",
		snare: "....x..x....x..x",
		clap: "....x..x....x...",
		hat: "x.x.x.x.x.x.x.x.",
		open: "........x.......",
		perc: "x..x..x..x..x..x"
	},
	afro: {
		kick: "x..x..x...x.x...",
		snare: "....x.......x...",
		clap: "....x.......x..o",
		hat: "x.x.x.x.x.x.x.x.",
		open: "..x.....x...x...",
		perc: "x..x.x..x..x.x.."
	},
	breakz: {
		kick: "x..x....x.x.....",
		snare: "....x..x....x...",
		clap: "................",
		hat: "xxxxxxxxxxxxxxxx",
		open: "......x.......x.",
		perc: "................"
	},
	dnb: {
		kick: "x.......x.x.....",
		snare: "....x.......x...",
		clap: "....o.......o...",
		hat: "xxxxxxxxxxxxxxxx",
		open: "..x.......x.....",
		perc: "................"
	},
	synth: {
		kick: "x...x...x...x...",
		snare: "....x.......x...",
		clap: "....o.......o...",
		hat: "x.x.x.x.x.x.x.x.",
		open: "........x.......",
		perc: "................"
	}
};
var MIN_1 = [
	[
		0,
		3,
		7,
		10
	],
	[
		8,
		0,
		3,
		7
	],
	[
		3,
		7,
		10,
		2
	],
	[
		10,
		2,
		5,
		8
	]
];
var MIN_2 = [
	[
		0,
		3,
		7
	],
	[
		5,
		8,
		0
	],
	[
		3,
		7,
		10
	],
	[
		7,
		10,
		2
	]
];
var MIN_3 = [
	[
		0,
		3,
		7,
		10
	],
	[
		10,
		2,
		5,
		8
	],
	[
		8,
		0,
		3
	],
	[
		5,
		8,
		0,
		3
	]
];
var MAJ_1 = [
	[
		0,
		4,
		7,
		11
	],
	[
		7,
		11,
		2,
		5
	],
	[
		9,
		0,
		4,
		7
	],
	[
		5,
		9,
		0,
		4
	]
];
var MAJ_2 = [
	[
		0,
		4,
		7
	],
	[
		9,
		0,
		4
	],
	[
		5,
		9,
		0
	],
	[
		7,
		11,
		2
	]
];
var DOR = [
	[
		0,
		3,
		7,
		10
	],
	[
		5,
		8,
		0,
		3
	],
	[
		10,
		2,
		5,
		8
	],
	[
		7,
		10,
		2,
		5
	]
];
var SUS = [
	[
		0,
		5,
		7,
		10
	],
	[
		10,
		2,
		5,
		7
	],
	[
		8,
		0,
		3,
		7
	],
	[
		5,
		10,
		0,
		3
	]
];
var HOOK = [
	0,
	-1,
	4,
	-1,
	7,
	-1,
	4,
	-1,
	3,
	-1,
	7,
	-1,
	8,
	-1,
	7,
	4
];
var ARP = [
	0,
	2,
	4,
	7,
	4,
	2,
	0,
	-1,
	0,
	3,
	4,
	7,
	8,
	7,
	4,
	2
];
var SLOW = [
	-1,
	0,
	-1,
	-1,
	4,
	-1,
	2,
	-1,
	-1,
	7,
	-1,
	-1,
	4,
	-1,
	0,
	-1
];
var DISCO_M = [
	4,
	-1,
	7,
	-1,
	9,
	-1,
	7,
	4,
	-1,
	2,
	-1,
	4,
	0,
	-1,
	-1,
	7
];
var TR = [
	0,
	0,
	4,
	4,
	7,
	7,
	4,
	2,
	0,
	0,
	3,
	3,
	7,
	4,
	2,
	0
];
var PENT = [
	0,
	-1,
	2,
	-1,
	4,
	-1,
	2,
	4,
	-1,
	7,
	-1,
	4,
	2,
	-1,
	0,
	-1
];
var GENRES = {
	yavas: {
		id: "yavas",
		label: "Yavaş",
		group: "Yavaş",
		bpm: 78,
		swing: .08,
		mode: "min",
		kick: "soft",
		drums: "slow",
		bass: "sparse",
		harm: "rhodes",
		lead: true,
		duck: .22,
		perc: "none",
		energy: 1,
		progs: [MIN_3, MIN_1],
		motif: SLOW,
		bed: "none"
	},
	slowjam: {
		id: "slowjam",
		label: "Slow",
		group: "Yavaş",
		bpm: 86,
		swing: .1,
		mode: "min",
		kick: "soft",
		drums: "half",
		bass: "long",
		harm: "rhodes",
		lead: true,
		duck: .28,
		perc: "none",
		energy: 2,
		progs: [MIN_1, MIN_2],
		motif: SLOW,
		bed: "none"
	},
	lofi: {
		id: "lofi",
		label: "Lo-fi",
		group: "Yavaş",
		bpm: 84,
		swing: .18,
		mode: "maj",
		kick: "soft",
		drums: "dusty",
		bass: "sparse",
		harm: "rhodes",
		lead: true,
		duck: .2,
		perc: "rim",
		energy: 2,
		progs: [MAJ_2, MAJ_1],
		motif: PENT,
		bed: "lofi"
	},
	ambient: {
		id: "ambient",
		label: "Ambient",
		group: "Yavaş",
		bpm: 68,
		swing: 0,
		mode: "min",
		kick: "soft",
		drums: "air",
		bass: "long",
		harm: "strings",
		lead: false,
		duck: .08,
		perc: "none",
		energy: 1,
		progs: [MIN_3, SUS],
		motif: SLOW,
		bed: "air"
	},
	disko: {
		id: "disko",
		label: "Disko",
		group: "Disko",
		bpm: 118,
		swing: .06,
		mode: "maj",
		kick: "house",
		drums: "disco",
		bass: "octave",
		harm: "stab",
		lead: true,
		duck: .42,
		perc: "cow",
		energy: 4,
		progs: [MAJ_2, MAJ_1],
		motif: DISCO_M,
		bed: "none"
	},
	funk: {
		id: "funk",
		label: "Funk",
		group: "Disko",
		bpm: 106,
		swing: .12,
		mode: "min",
		kick: "house",
		drums: "funk",
		bass: "walk",
		harm: "pluck",
		lead: true,
		duck: .3,
		perc: "rim",
		energy: 4,
		progs: [DOR, MIN_2],
		motif: PENT,
		bed: "none"
	},
	synthwave: {
		id: "synthwave",
		label: "Synthwave",
		group: "Disko",
		bpm: 102,
		swing: 0,
		mode: "min",
		kick: "house",
		drums: "synth",
		bass: "octave",
		harm: "pad",
		lead: true,
		duck: .35,
		perc: "none",
		energy: 3,
		progs: [MIN_1, MIN_2],
		motif: HOOK,
		bed: "none"
	},
	house: {
		id: "house",
		label: "House",
		group: "Kulüp",
		bpm: 124,
		swing: 0,
		mode: "min",
		kick: "house",
		drums: "four",
		bass: "offbeat",
		harm: "stab",
		lead: true,
		duck: .55,
		perc: "rim",
		energy: 4,
		progs: [MIN_1, MIN_2],
		motif: HOOK,
		bed: "none"
	},
	deephouse: {
		id: "deephouse",
		label: "Deep House",
		group: "Kulüp",
		bpm: 121,
		swing: .02,
		mode: "min",
		kick: "house",
		drums: "deep",
		bass: "offbeat",
		harm: "rhodes",
		lead: false,
		duck: .48,
		perc: "rim",
		energy: 3,
		progs: [MIN_3, MIN_1],
		motif: SLOW,
		bed: "none"
	},
	techno: {
		id: "techno",
		label: "Techno",
		group: "Kulüp",
		bpm: 132,
		swing: 0,
		mode: "min",
		kick: "short",
		drums: "tech",
		bass: "rumble",
		harm: "stab",
		lead: false,
		duck: .62,
		perc: "none",
		energy: 5,
		progs: [MIN_2, SUS],
		motif: ARP,
		bed: "none"
	},
	minimal: {
		id: "minimal",
		label: "Minimal",
		group: "Kulüp",
		bpm: 126,
		swing: 0,
		mode: "min",
		kick: "short",
		drums: "minimal",
		bass: "offbeat",
		harm: "pluck",
		lead: false,
		duck: .4,
		perc: "rim",
		energy: 3,
		progs: [SUS, MIN_2],
		motif: ARP,
		bed: "none"
	},
	trance: {
		id: "trance",
		label: "Trance",
		group: "Kulüp",
		bpm: 138,
		swing: 0,
		mode: "min",
		kick: "house",
		drums: "four",
		bass: "roll",
		harm: "arp",
		lead: true,
		duck: .58,
		perc: "none",
		energy: 5,
		progs: [MIN_1, MIN_3],
		motif: TR,
		bed: "none"
	},
	hareketli: {
		id: "hareketli",
		label: "Hareketli",
		group: "Hareketli",
		bpm: 128,
		swing: 0,
		mode: "min",
		kick: "house",
		drums: "big",
		bass: "offbeat",
		harm: "stab",
		lead: true,
		duck: .6,
		perc: "none",
		energy: 5,
		progs: [MIN_1, MAJ_1],
		motif: HOOK,
		bed: "none"
	},
	dnb: {
		id: "dnb",
		label: "Drum & Bass",
		group: "Hareketli",
		bpm: 174,
		swing: 0,
		mode: "min",
		kick: "short",
		drums: "dnb",
		bass: "reese",
		harm: "pad",
		lead: true,
		duck: .5,
		perc: "none",
		energy: 5,
		progs: [MIN_2, MIN_1],
		motif: ARP,
		bed: "none"
	},
	breakbeat: {
		id: "breakbeat",
		label: "Breakbeat",
		group: "Hareketli",
		bpm: 132,
		swing: .04,
		mode: "min",
		kick: "house",
		drums: "breakz",
		bass: "walk",
		harm: "stab",
		lead: true,
		duck: .4,
		perc: "none",
		energy: 4,
		progs: [MIN_2, DOR],
		motif: PENT,
		bed: "none"
	},
	trap: {
		id: "trap",
		label: "Trap",
		group: "Ritim",
		bpm: 142,
		swing: .05,
		mode: "min",
		kick: "808",
		drums: "trap",
		bass: "glide",
		harm: "pad",
		lead: false,
		duck: .35,
		perc: "none",
		energy: 4,
		progs: [MIN_1, MIN_2],
		motif: HOOK,
		bed: "none"
	},
	hiphop: {
		id: "hiphop",
		label: "Hip-hop",
		group: "Ritim",
		bpm: 92,
		swing: .16,
		mode: "min",
		kick: "808",
		drums: "boom",
		bass: "sparse",
		harm: "rhodes",
		lead: true,
		duck: .3,
		perc: "rim",
		energy: 3,
		progs: [MIN_3, MIN_2],
		motif: PENT,
		bed: "none"
	},
	latin: {
		id: "latin",
		label: "Latin",
		group: "Ritim",
		bpm: 100,
		swing: .04,
		mode: "min",
		kick: "house",
		drums: "dembow",
		bass: "dembow",
		harm: "stab",
		lead: true,
		duck: .38,
		perc: "clave",
		energy: 4,
		progs: [MIN_2, MIN_1],
		motif: DISCO_M,
		bed: "none"
	},
	afro: {
		id: "afro",
		label: "Afro",
		group: "Ritim",
		bpm: 112,
		swing: .05,
		mode: "maj",
		kick: "house",
		drums: "afro",
		bass: "afro",
		harm: "pluck",
		lead: true,
		duck: .34,
		perc: "conga",
		energy: 4,
		progs: [MAJ_2, MAJ_1],
		motif: PENT,
		bed: "none"
	}
};
function T(id, title, genre, root, prog, bpm) {
	return {
		id,
		title,
		genre,
		root,
		prog,
		bpm
	};
}
var TRACKS = [
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
	T("kum-saati", "Kum Saati", "afro", 2, 0, 110)
];
var GROUPS = [
	"Tümü",
	"Yavaş",
	"Disko",
	"Kulüp",
	"Hareketli",
	"Ritim"
];
var SECTIONS = [
	{
		id: "giris",
		label: "Giriş",
		at: 0,
		bars: 8
	},
	{
		id: "groove",
		label: "Groove",
		at: 8,
		bars: 16
	},
	{
		id: "yukselis",
		label: "Yükseliş",
		at: 24,
		bars: 8
	},
	{
		id: "drop",
		label: "Drop",
		at: 32,
		bars: 16
	},
	{
		id: "ara",
		label: "Ara",
		at: 48,
		bars: 8
	},
	{
		id: "final",
		label: "Final",
		at: 56,
		bars: 16
	}
];
function getTrack(id) {
	return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}
function getGenre(id) {
	return GENRES[id];
}
function sectionFor(bar) {
	const b = (bar % 72 + 72) % 72;
	let current = SECTIONS[0];
	for (const s of SECTIONS) if (b >= s.at) current = s;
	return {
		...current,
		bar,
		wrapped: b,
		barIn: b - current.at
	};
}
function gridHit(pattern, step) {
	const c = pattern[step] ?? ".";
	if (c === "x" || c === "X") return 1;
	if (c === "o" || c === "O") return .48;
	return 0;
}
function bassAt(style, step, bar) {
	switch (style) {
		case "offbeat":
			if (step === 4 || step === 12) return {
				semi: 0,
				dur: 2
			};
			if (step === 7) return {
				semi: 0,
				dur: 1,
				quiet: true
			};
			if (step === 14) return {
				semi: 7,
				dur: 2
			};
			return null;
		case "octave":
			if (step === 0) return {
				semi: 0,
				dur: 2
			};
			if (step === 3) return {
				semi: 12,
				dur: 1
			};
			if (step === 6) return {
				semi: 0,
				dur: 2
			};
			if (step === 10) return {
				semi: 7,
				dur: 1
			};
			if (step === 12) return {
				semi: 0,
				dur: 2
			};
			if (step === 14) return {
				semi: 12,
				dur: 2
			};
			return null;
		case "long":
			if (step === 0) return {
				semi: 0,
				dur: 8
			};
			if (step === 8) return {
				semi: bar % 2 ? 7 : 3,
				dur: 8
			};
			return null;
		case "reese":
			if (step === 0) return {
				semi: 0,
				dur: 14
			};
			return null;
		case "glide":
			if (step === 0) return {
				semi: 0,
				dur: 6
			};
			if (step === 7) return {
				semi: 3,
				dur: 2,
				glide: true
			};
			if (step === 10) return {
				semi: bar % 2 ? 10 : 7,
				dur: 4,
				glide: true
			};
			if (step === 14) return {
				semi: 0,
				dur: 2,
				glide: true,
				quiet: true
			};
			return null;
		case "walk":
			if (step === 0) return {
				semi: 0,
				dur: 2
			};
			if (step === 3) return {
				semi: 3,
				dur: 1
			};
			if (step === 6) return {
				semi: 7,
				dur: 2
			};
			if (step === 10) return {
				semi: 10,
				dur: 2
			};
			if (step === 13) return {
				semi: 12,
				dur: 2
			};
			return null;
		case "roll":
			if (step % 2 === 0) return {
				semi: [
					0,
					0,
					7,
					0,
					12,
					7,
					3,
					0
				][step / 2] ?? 0,
				dur: 2
			};
			return null;
		case "sparse":
			if (step === 0) return {
				semi: 0,
				dur: 6
			};
			if (step === 8) return {
				semi: bar % 2 ? 5 : 7,
				dur: 6
			};
			return null;
		case "rumble": return {
			semi: step % 8 === 4 ? 0 : -12,
			dur: 1,
			quiet: step % 2 === 1
		};
		case "dembow":
			if (step === 0 || step === 8) return {
				semi: 0,
				dur: 2
			};
			if (step === 3) return {
				semi: 0,
				dur: 1,
				quiet: true
			};
			if (step === 6) return {
				semi: 10,
				dur: 2
			};
			if (step === 11) return {
				semi: 0,
				dur: 2
			};
			return null;
		case "afro":
			if (step === 0) return {
				semi: 0,
				dur: 2
			};
			if (step === 4) return {
				semi: 0,
				dur: 1
			};
			if (step === 7) return {
				semi: 12,
				dur: 1
			};
			if (step === 10) return {
				semi: 7,
				dur: 2
			};
			if (step === 14) return {
				semi: 0,
				dur: 2
			};
			return null;
		default: return null;
	}
}
function trackBpm(track) {
	return track.bpm ?? GENRES[track.genre].bpm;
}
function trackLength(track) {
	return lengthLabel(72, trackBpm(track));
}
function mixHint(a, ta, b, tb) {
	const ga = GENRES[a.genre];
	const gb = GENRES[b.genre];
	const pa = wrapPc(a.root + ta);
	const pb = wrapPc(b.root + tb);
	const diff = Math.min((pa - pb + 12) % 12, (pb - pa + 12) % 12);
	const relative = ga.mode !== gb.mode && (diff === 3 || diff === 9);
	if (diff === 0 || diff === 7 || relative) return {
		label: "Uyumlu ton",
		tone: "ok"
	};
	if (diff <= 2 || diff === 5) return {
		label: "Yakın ton",
		tone: "near"
	};
	return {
		label: "Ton riski",
		tone: "risk"
	};
}
function filterTracks(group, query) {
	const q = query.trim().toLocaleLowerCase("tr");
	return TRACKS.filter((t) => {
		const g = GENRES[t.genre];
		if (group !== "Tümü" && g.group !== group) return false;
		if (!q) return true;
		return `${t.title} ${g.label}`.toLocaleLowerCase("tr").includes(q);
	});
}
function envGain(ctx, t, peak, attack, dur) {
	const g = ctx.createGain();
	const a = Math.max(.002, attack);
	const end = Math.max(a + .02, dur);
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak), t + a);
	g.gain.exponentialRampToValueAtTime(1e-4, t + end);
	return g;
}
function noiseSrc(ctx, buffer, t, dur) {
	const src = ctx.createBufferSource();
	src.buffer = buffer;
	src.loop = true;
	src.playbackRate.value = .9 + Math.random() * .2;
	src.start(t, Math.random() * Math.max(.1, buffer.duration - .2));
	src.stop(t + dur + .02);
	return src;
}
function makeNoise(ctx, seconds) {
	const len = Math.floor(ctx.sampleRate * seconds);
	const buf = ctx.createBuffer(1, len, ctx.sampleRate);
	const d = buf.getChannelData(0);
	for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
	return buf;
}
function makeImpulse(ctx) {
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
function playKick(ctx, t, kind, vel, dest, noise) {
	const osc = ctx.createOscillator();
	osc.type = "sine";
	let f0 = 156;
	let f1 = 46;
	let dur = .38;
	let amp = .92;
	if (kind === "808") {
		f0 = 130;
		f1 = 40;
		dur = .72;
		amp = .88;
	} else if (kind === "soft") {
		f0 = 110;
		f1 = 50;
		dur = .3;
		amp = .55;
	} else if (kind === "short") {
		f0 = 190;
		f1 = 58;
		dur = .18;
		amp = .86;
	}
	osc.frequency.setValueAtTime(f0, t);
	osc.frequency.exponentialRampToValueAtTime(f1, t + .07);
	const g = ctx.createGain();
	g.gain.setValueAtTime(amp * vel, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	osc.connect(g).connect(dest);
	osc.start(t);
	osc.stop(t + dur + .02);
	const click = noiseSrc(ctx, noise, t, .03);
	const hp = ctx.createBiquadFilter();
	hp.type = "highpass";
	hp.frequency.value = 1400;
	const cg = ctx.createGain();
	cg.gain.setValueAtTime(.28 * vel, t);
	cg.gain.exponentialRampToValueAtTime(1e-4, t + .025);
	click.connect(hp).connect(cg).connect(dest);
}
function playSnare(ctx, t, vel, dest, noise) {
	const n = noiseSrc(ctx, noise, t, .22);
	const bp = ctx.createBiquadFilter();
	bp.type = "bandpass";
	bp.frequency.value = 1800;
	bp.Q.value = .7;
	const g = envGain(ctx, t, .48 * vel, .003, .18);
	n.connect(bp).connect(g).connect(dest);
	const tone = ctx.createOscillator();
	tone.type = "triangle";
	tone.frequency.setValueAtTime(196, t);
	tone.frequency.exponentialRampToValueAtTime(140, t + .08);
	const tg = envGain(ctx, t, .22 * vel, .002, .1);
	tone.connect(tg).connect(dest);
	tone.start(t);
	tone.stop(t + .12);
}
function playClap(ctx, t, vel, dest, noise) {
	[
		0,
		.011,
		.022
	].forEach((delay, i) => {
		const n = noiseSrc(ctx, noise, t + delay, .05);
		const bp = ctx.createBiquadFilter();
		bp.type = "bandpass";
		bp.frequency.value = 1250;
		bp.Q.value = .9;
		const g = ctx.createGain();
		g.gain.setValueAtTime((.42 - i * .06) * vel, t + delay);
		g.gain.exponentialRampToValueAtTime(1e-4, t + delay + .05);
		n.connect(bp).connect(g).connect(dest);
	});
	const tail = noiseSrc(ctx, noise, t + .02, .2);
	const hp = ctx.createBiquadFilter();
	hp.type = "highpass";
	hp.frequency.value = 900;
	const tg = envGain(ctx, t + .02, .16 * vel, .005, .16);
	tail.connect(hp).connect(tg).connect(dest);
}
function playHat(ctx, t, open, vel, dest, noise) {
	const dur = open ? .28 : .045;
	const mix = ctx.createGain();
	[
		2.1,
		3.4,
		4.8
	].forEach((r) => {
		const o = ctx.createOscillator();
		o.type = "square";
		o.frequency.value = 320 * r;
		const og = ctx.createGain();
		og.gain.value = .12;
		o.connect(og).connect(mix);
		o.start(t);
		o.stop(t + dur + .02);
	});
	const n = noiseSrc(ctx, noise, t, dur + .02);
	const ng = ctx.createGain();
	ng.gain.value = .55;
	n.connect(ng).connect(mix);
	const hp = ctx.createBiquadFilter();
	hp.type = "highpass";
	hp.frequency.value = open ? 6800 : 8600;
	const g = ctx.createGain();
	g.gain.setValueAtTime((open ? .18 : .22) * vel, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	mix.connect(hp).connect(g).connect(dest);
}
function playTick(ctx, t, freq, vel, dur, dest) {
	const o = ctx.createOscillator();
	o.type = "square";
	o.frequency.value = freq;
	const bp = ctx.createBiquadFilter();
	bp.type = "bandpass";
	bp.frequency.value = freq;
	bp.Q.value = 4;
	const g = ctx.createGain();
	g.gain.setValueAtTime(.22 * vel, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	o.connect(bp).connect(g).connect(dest);
	o.start(t);
	o.stop(t + dur + .02);
}
function playConga(ctx, t, high, vel, dest, noise) {
	const o = ctx.createOscillator();
	o.type = "sine";
	const f = high ? 340 : 190;
	o.frequency.setValueAtTime(f * 1.5, t);
	o.frequency.exponentialRampToValueAtTime(f, t + .045);
	const g = envGain(ctx, t, .32 * vel, .003, high ? .12 : .18);
	o.connect(g).connect(dest);
	o.start(t);
	o.stop(t + .22);
	const n = noiseSrc(ctx, noise, t, .04);
	const bp = ctx.createBiquadFilter();
	bp.type = "bandpass";
	bp.frequency.value = 900;
	const ng = envGain(ctx, t, .12 * vel, .002, .03);
	n.connect(bp).connect(ng).connect(dest);
}
function playTom(ctx, t, vel, dest) {
	const o = ctx.createOscillator();
	o.type = "sine";
	o.frequency.setValueAtTime(180, t);
	o.frequency.exponentialRampToValueAtTime(78, t + .18);
	const g = envGain(ctx, t, .4 * vel, .004, .28);
	o.connect(g).connect(dest);
	o.start(t);
	o.stop(t + .32);
}
function playCrash(ctx, t, vel, dest, noise) {
	const n = noiseSrc(ctx, noise, t, 1.1);
	const hp = ctx.createBiquadFilter();
	hp.type = "highpass";
	hp.frequency.value = 4200;
	const g = envGain(ctx, t, .18 * vel, .008, .9);
	n.connect(hp).connect(g).connect(dest);
}
function playRiser(ctx, t, dur, dest, noise) {
	const n = noiseSrc(ctx, noise, t, dur);
	const bp = ctx.createBiquadFilter();
	bp.type = "bandpass";
	bp.Q.value = 3;
	bp.frequency.setValueAtTime(280, t);
	bp.frequency.exponentialRampToValueAtTime(7200, t + dur);
	const g = ctx.createGain();
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(.16, t + dur * .92);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	n.connect(bp).connect(g).connect(dest);
}
function playBass(ctx, t, midi, dur, kind, vel, dest, glideFrom) {
	const freq = Math.max(28, midiToFreq(midi));
	const g = ctx.createGain();
	const peak = (kind === "808" ? .5 : .42) * vel;
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(peak, t + (kind === "808" ? .01 : .012));
	g.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak * .72), t + Math.min(dur * .45, .2));
	g.gain.exponentialRampToValueAtTime(1e-4, t + Math.max(.06, dur));
	const lp = ctx.createBiquadFilter();
	lp.type = "lowpass";
	lp.Q.value = kind === "reese" ? 7 : 5;
	lp.frequency.setValueAtTime(kind === "reese" ? 980 : 640, t);
	lp.frequency.exponentialRampToValueAtTime(160, t + Math.max(.08, Math.min(dur, .45)));
	if (kind === "808" || kind === "sub") {
		const sub = ctx.createOscillator();
		sub.type = "sine";
		const start = glideFrom ? Math.max(28, midiToFreq(glideFrom)) : freq * (kind === "808" ? 1.8 : 1);
		sub.frequency.setValueAtTime(start, t);
		sub.frequency.exponentialRampToValueAtTime(freq, t + (glideFrom || kind === "808" ? .07 : .01));
		sub.connect(g).connect(dest);
		sub.start(t);
		sub.stop(t + dur + .05);
		return;
	}
	const sub = ctx.createOscillator();
	sub.type = "sine";
	sub.frequency.value = freq / (kind === "octave" ? 1 : 2);
	if (kind !== "octave") sub.frequency.value = freq / 2;
	const sg = ctx.createGain();
	sg.gain.value = .85;
	sub.connect(sg).connect(g);
	const saw = ctx.createOscillator();
	saw.type = "sawtooth";
	saw.frequency.value = freq;
	const wg = ctx.createGain();
	wg.gain.value = kind === "reese" ? .28 : .18;
	saw.connect(wg).connect(lp);
	if (kind === "reese") {
		const saw2 = ctx.createOscillator();
		saw2.type = "sawtooth";
		saw2.frequency.value = freq;
		saw2.detune.value = 16;
		const wg2 = ctx.createGain();
		wg2.gain.value = .22;
		saw2.connect(wg2).connect(lp);
		saw2.start(t);
		saw2.stop(t + dur + .05);
	}
	if (kind === "octave") {
		const up = ctx.createOscillator();
		up.type = "square";
		up.frequency.value = freq * 2;
		const ug = ctx.createGain();
		ug.gain.setValueAtTime(.08, t);
		ug.gain.exponentialRampToValueAtTime(1e-4, t + Math.min(.12, dur));
		up.connect(ug).connect(dest);
		up.start(t);
		up.stop(t + dur + .02);
	}
	lp.connect(g);
	g.connect(dest);
	sub.start(t);
	saw.start(t);
	sub.stop(t + dur + .05);
	saw.stop(t + dur + .05);
}
function playChord(ctx, t, midis, dur, harm, vel, dest) {
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
			mg.gain.exponentialRampToValueAtTime(20, t + Math.min(.45, dur));
			mod.connect(mg).connect(car.frequency);
			const g = envGain(ctx, t, .11 * vel, .02, dur);
			const pan = ctx.createStereoPanner();
			pan.pan.value = (i - 1) * .35;
			car.connect(pan).connect(g).connect(dest);
			car.start(t);
			mod.start(t);
			car.stop(t + dur + .05);
			mod.stop(t + dur + .05);
		});
		return;
	}
	const lp = ctx.createBiquadFilter();
	lp.type = "lowpass";
	lp.Q.value = harm === "stab" ? 4 : .7;
	const attack = harm === "strings" || harm === "pad" ? .18 : harm === "stab" ? .005 : .01;
	const peak = (harm === "stab" ? .11 : harm === "strings" || harm === "pad" ? .07 : .09) * vel;
	if (harm === "stab") {
		lp.frequency.setValueAtTime(2800, t);
		lp.frequency.exponentialRampToValueAtTime(700, t + Math.max(.08, dur));
	} else lp.frequency.setValueAtTime(harm === "strings" ? 1400 : 2200, t);
	const g = envGain(ctx, t, peak, attack, dur);
	g.connect(lp).connect(dest);
	(harm === "arp" || harm === "pluck" ? midis.slice(0, 1) : midis.slice(0, 3)).forEach((m, i) => {
		const o = ctx.createOscillator();
		o.type = harm === "pluck" ? "triangle" : "sawtooth";
		o.frequency.value = midiToFreq(m);
		o.detune.value = (i - 1) * 7;
		const pan = ctx.createStereoPanner();
		pan.pan.value = (i - 1) * .28;
		o.connect(pan).connect(g);
		o.start(t);
		o.stop(t + dur + .06);
	});
}
function playLead(ctx, t, midi, dur, vel, dest, bright) {
	const o = ctx.createOscillator();
	o.type = bright ? "sawtooth" : "square";
	const freq = midiToFreq(midi);
	o.frequency.setValueAtTime(freq, t);
	const lfo = ctx.createOscillator();
	const lg = ctx.createGain();
	lfo.frequency.value = 5.2;
	lg.gain.value = freq * .008;
	lfo.connect(lg).connect(o.frequency);
	const lp = ctx.createBiquadFilter();
	lp.type = "lowpass";
	lp.frequency.setValueAtTime(bright ? 4200 : 2400, t);
	lp.frequency.exponentialRampToValueAtTime(900, t + dur);
	const g = envGain(ctx, t, (bright ? .07 : .055) * vel, .01, dur);
	o.connect(lp).connect(g).connect(dest);
	o.start(t);
	lfo.start(t);
	o.stop(t + dur + .04);
	lfo.stop(t + dur + .04);
}
function playPluck(ctx, t, midi, dur, vel, dest) {
	const o = ctx.createOscillator();
	o.type = "triangle";
	o.frequency.value = midiToFreq(midi);
	const lp = ctx.createBiquadFilter();
	lp.type = "lowpass";
	lp.frequency.setValueAtTime(3200, t);
	lp.frequency.exponentialRampToValueAtTime(500, t + dur);
	const g = envGain(ctx, t, .12 * vel, .004, dur);
	o.connect(lp).connect(g).connect(dest);
	o.start(t);
	o.stop(t + dur + .03);
}
function bassKind(style) {
	if (style === "reese") return "reese";
	if (style === "glide") return "808";
	if (style === "octave" || style === "afro") return "octave";
	if (style === "long" || style === "sparse") return "sub";
	return "saw";
}
function pcOf(root, transpose) {
	return ((root + transpose) % 12 + 12) % 12;
}
function other(id) {
	return id === "A" ? "B" : "A";
}
function motionFreq(section, barIn, step) {
	if (section === "giris") return 780;
	if (section === "groove") return 2400;
	if (section === "yukselis") {
		const p = (barIn * 16 + step) / 128;
		return 420 * Math.pow(9800 / 420, Math.min(1, Math.max(0, p)));
	}
	if (section === "drop") return 14e3;
	if (section === "ara") return 620;
	return barIn > 12 ? 1600 : 7600;
}
var engine = null;
function getEngine() {
	return engine;
}
async function bootEngine() {
	if (!engine) engine = new DjEngine();
	await engine.resume();
	return engine;
}
var DjEngine = class {
	ctx;
	masterAnalyser;
	noise;
	ch;
	timer = null;
	recorder = null;
	chunks = [];
	mediaDest;
	constructor() {
		const Ctor = window.AudioContext || window.webkitAudioContext;
		this.ctx = new Ctor();
		this.noise = makeNoise(this.ctx, 2);
		const masterIn = this.ctx.createGain();
		const master = this.ctx.createGain();
		master.gain.value = .75;
		const comp = this.ctx.createDynamicsCompressor();
		comp.threshold.value = -12;
		comp.knee.value = 8;
		comp.ratio.value = 4;
		comp.attack.value = .008;
		comp.release.value = .18;
		const limiter = this.ctx.createDynamicsCompressor();
		limiter.threshold.value = -4;
		limiter.knee.value = 2;
		limiter.ratio.value = 16;
		limiter.attack.value = .002;
		limiter.release.value = .12;
		this.masterAnalyser = this.ctx.createAnalyser();
		this.masterAnalyser.fftSize = 1024;
		this.masterAnalyser.smoothingTimeConstant = .78;
		this.mediaDest = this.ctx.createMediaStreamDestination();
		masterIn.connect(master);
		master.connect(comp);
		comp.connect(limiter);
		limiter.connect(this.masterAnalyser);
		this.masterAnalyser.connect(this.ctx.destination);
		limiter.connect(this.mediaDest);
		this.master = master;
		const delay = this.ctx.createDelay(1.2);
		delay.delayTime.value = .33;
		const fb = this.ctx.createGain();
		fb.gain.value = .38;
		const tone = this.ctx.createBiquadFilter();
		tone.type = "lowpass";
		tone.frequency.value = 3800;
		const delayIn = this.ctx.createGain();
		const delayOut = this.ctx.createGain();
		delayOut.gain.value = .85;
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
		reverbOut.gain.value = .9;
		reverbIn.connect(conv);
		conv.connect(reverbOut);
		reverbOut.connect(masterIn);
		this.reverbIn = reverbIn;
		const perf = this.ctx.createGain();
		perf.gain.value = .9;
		perf.connect(masterIn);
		this.perfBus = perf;
		this.ch = {
			A: this.makeChannel(masterIn, "dort-dort"),
			B: this.makeChannel(masterIn, "ayna-topu")
		};
		this.setCross(.5);
	}
	master;
	delay;
	delayIn;
	reverbIn;
	perfBus;
	makeChannel(masterIn, trackId) {
		const ctx = this.ctx;
		const music = ctx.createGain();
		const drums = ctx.createGain();
		const duck = ctx.createGain();
		duck.gain.value = 1;
		const pre = ctx.createGain();
		const motion = ctx.createBiquadFilter();
		motion.type = "lowpass";
		motion.frequency.value = 2400;
		motion.Q.value = .5;
		const perf = ctx.createBiquadFilter();
		perf.type = "lowpass";
		perf.frequency.value = 18e3;
		perf.Q.value = .7;
		const eqLow = ctx.createBiquadFilter();
		eqLow.type = "lowshelf";
		eqLow.frequency.value = 180;
		const eqMid = ctx.createBiquadFilter();
		eqMid.type = "peaking";
		eqMid.frequency.value = 1100;
		eqMid.Q.value = .85;
		const eqHigh = ctx.createBiquadFilter();
		eqHigh.type = "highshelf";
		eqHigh.frequency.value = 5400;
		const delaySend = ctx.createGain();
		delaySend.gain.value = 0;
		const reverbSend = ctx.createGain();
		reverbSend.gain.value = .12;
		const flangerDelay = ctx.createDelay(.03);
		flangerDelay.delayTime.value = .004;
		const flangerFb = ctx.createGain();
		flangerFb.gain.value = .32;
		const flangerWet = ctx.createGain();
		flangerWet.gain.value = 0;
		const lfo = ctx.createOscillator();
		const lfoGain = ctx.createGain();
		lfo.frequency.value = .28;
		lfoGain.gain.value = .0022;
		lfo.connect(lfoGain).connect(flangerDelay.delayTime);
		lfo.start();
		const fader = ctx.createGain();
		fader.gain.value = .82;
		const gate = ctx.createGain();
		gate.gain.value = 1;
		const xfade = ctx.createGain();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 512;
		analyser.smoothingTimeConstant = .75;
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
		return {
			trackId,
			bpm: trackBpm(getTrack(trackId)),
			transpose: 0,
			bar: 0,
			step: 0,
			nextNoteTime: 0,
			playing: false,
			loopBars: 0,
			loopOrigin: 0,
			sync: false,
			lastBass: 36,
			filter: .5,
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
			analyser
		};
	}
	analyser(id) {
		return this.ch[id].analyser;
	}
	async resume() {
		if (this.ctx.state === "suspended") await this.ctx.resume();
	}
	position(id) {
		const d = this.ch[id];
		const s = sectionFor(d.bar);
		return {
			bar: s.wrapped,
			step: d.step,
			bpm: d.bpm,
			playing: d.playing,
			section: s.id,
			sectionLabel: s.label
		};
	}
	load(id, trackId) {
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
	play(id) {
		const d = this.ch[id];
		if (d.playing) return;
		d.playing = true;
		d.nextNoteTime = this.ctx.currentTime + .05;
		if (d.sync) {
			const o = this.ch[other(id)];
			d.bpm = o.bpm;
			if (o.playing) {
				d.nextNoteTime = o.nextNoteTime;
				d.step = o.step;
			}
		}
		if (getGenre(getTrack(d.trackId).genre).bed !== "none" && !d.bed) this.ensureBed(id);
		this.setBed(id, true);
		this.ensureTimer();
	}
	stop(id) {
		this.ch[id].playing = false;
		this.setBed(id, false);
		if (!this.ch.A.playing && !this.ch.B.playing && this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
	cue(id) {
		const d = this.ch[id];
		this.stop(id);
		d.bar = 0;
		d.step = 0;
		d.loopBars = 0;
		d.loopOrigin = 0;
	}
	toggle(id) {
		if (this.ch[id].playing) this.stop(id);
		else this.play(id);
	}
	setBpm(id, bpm) {
		const next = Math.max(64, Math.min(190, bpm));
		this.ch[id].bpm = next;
		const o = other(id);
		if (this.ch[o].sync) this.ch[o].bpm = next;
		if (this.ch[id].sync) this.ch[o].bpm = next;
		this.syncDelay();
	}
	nudge(id, active, dir, base) {
		this.setBpm(id, active ? base + dir * 2.4 : base);
	}
	setSync(id, on) {
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
	setLoop(id, bars) {
		const d = this.ch[id];
		d.loopBars = bars;
		d.loopOrigin = sectionFor(d.bar).wrapped;
	}
	jump(id, section) {
		const at = [
			0,
			8,
			24,
			32,
			48,
			56
		][[
			"giris",
			"groove",
			"yukselis",
			"drop",
			"ara",
			"final"
		].indexOf(section)] ?? 0;
		this.ch[id].bar = at;
		if (this.ch[id].loopBars > 0) this.ch[id].loopOrigin = at;
	}
	setTranspose(id, semis) {
		this.ch[id].transpose = Math.max(-6, Math.min(6, semis));
	}
	setVolume(id, v) {
		this.ch[id].fader.gain.setTargetAtTime(v, this.ctx.currentTime, .02);
	}
	setEq(id, band, db) {
		(band === "low" ? this.ch[id].eqLow : band === "mid" ? this.ch[id].eqMid : this.ch[id].eqHigh).gain.setTargetAtTime(db, this.ctx.currentTime, .02);
	}
	setSend(id, fx, amount) {
		(fx === "delay" ? this.ch[id].delaySend : fx === "reverb" ? this.ch[id].reverbSend : this.ch[id].flangerWet).gain.setTargetAtTime(amount, this.ctx.currentTime, .03);
	}
	setFilter(id, norm) {
		this.ch[id].filter = norm;
		this.applyPerf(id);
	}
	setMaster(v) {
		this.master.gain.setTargetAtTime(v, this.ctx.currentTime, .02);
	}
	setCross(pos) {
		const p = Math.min(1, Math.max(0, pos));
		this.ch.A.xfade.gain.setTargetAtTime(Math.cos(p * Math.PI / 2), this.ctx.currentTime, .015);
		this.ch.B.xfade.gain.setTargetAtTime(Math.sin(p * Math.PI / 2), this.ctx.currentTime, .015);
	}
	repeat(id) {
		const d = this.ch[id];
		const step = 60 / d.bpm / 2;
		const now = this.ctx.currentTime + .02;
		const g = d.gate.gain;
		g.cancelScheduledValues(now);
		for (let i = 0; i < 8; i++) {
			const on = now + i * step;
			g.setValueAtTime(i % 2 === 0 ? 1 : 1e-4, on);
		}
		g.setValueAtTime(1, now + 8 * step);
	}
	stopAll() {
		this.stop("A");
		this.stop("B");
	}
	pad(name) {
		const t = this.ctx.currentTime + .02;
		const dest = this.perfBus;
		const track = getTrack(this.ch.A.trackId);
		const genre = getGenre(track.genre);
		if (name === "kick") playKick(this.ctx, t, "house", 1, dest, this.noise);
		if (name === "clap") playClap(this.ctx, t, 1, dest, this.noise);
		if (name === "hat") playHat(this.ctx, t, false, 1, dest, this.noise);
		if (name === "snare") playSnare(this.ctx, t, 1, dest, this.noise);
		if (name === "tom") playTom(this.ctx, t, 1, dest);
		if (name === "cow") playTick(this.ctx, t, 587, 1, .12, dest);
		if (name === "stab") {
			const midis = voiceChord(track.root, genre.progs[track.prog % genre.progs.length][0], this.ch.A.transpose, 60);
			playChord(this.ctx, t, midis, .22, "stab", 1.1, dest);
		}
		if (name === "sub") playBass(this.ctx, t, 36 + (track.root + this.ch.A.transpose) % 12, .4, "sub", 1, dest);
	}
	startRecord() {
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
	async stopRecord() {
		const rec = this.recorder;
		if (!rec || rec.state === "inactive") return null;
		const blob = await new Promise((resolve) => {
			rec.onstop = () => resolve(new Blob(this.chunks, { type: rec.mimeType || "audio/webm" }));
			rec.stop();
		});
		this.recorder = null;
		return blob;
	}
	syncDelay() {
		const time = 60 / (this.ch.A.playing ? this.ch.A.bpm : this.ch.B.bpm) * .75;
		this.delay.delayTime.setTargetAtTime(Math.min(1.1, time), this.ctx.currentTime, .05);
	}
	ensureTimer() {
		if (this.timer) return;
		this.timer = setInterval(() => this.pump(), 25);
	}
	pump() {
		const horizon = this.ctx.currentTime + .12;
		["A", "B"].forEach((id) => {
			const d = this.ch[id];
			if (!d.playing) return;
			if (d.nextNoteTime < this.ctx.currentTime - .08) d.nextNoteTime = this.ctx.currentTime + .02;
			let guard = 0;
			while (d.nextNoteTime < horizon && guard++ < 24) {
				this.scheduleStep(id, d.nextNoteTime);
				d.nextNoteTime += 60 / d.bpm / 4;
				this.advance(d);
			}
		});
	}
	advance(d) {
		d.step += 1;
		if (d.step < 16) return;
		d.step = 0;
		d.bar += 1;
		if (d.loopBars > 0) {
			if (d.bar >= d.loopOrigin + d.loopBars) d.bar = d.loopOrigin;
			return;
		}
		if (d.bar >= 72) d.bar = 0;
	}
	applyPerf(id) {
		const d = this.ch[id];
		const norm = d.filter;
		const now = this.ctx.currentTime;
		const node = d.perf;
		if (Math.abs(norm - .5) < .03) {
			node.type = "lowpass";
			node.frequency.setTargetAtTime(18e3, now, .02);
			node.Q.setTargetAtTime(.7, now, .02);
			return;
		}
		if (norm < .5) {
			const k = 1 - norm / .5;
			const f = 50 * Math.pow(104, k);
			node.type = "highpass";
			node.frequency.setTargetAtTime(f, now, .02);
			node.Q.setTargetAtTime(.7 + k * 3.2, now, .02);
		} else {
			const k = (norm - .5) / .5;
			const f = 16e3 * Math.pow(240 / 16e3, k);
			node.type = "lowpass";
			node.frequency.setTargetAtTime(f, now, .02);
			node.Q.setTargetAtTime(.7 + k * 5, now, .02);
		}
	}
	ensureBed(id) {
		const d = this.ch[id];
		const genre = getGenre(getTrack(d.trackId).genre);
		if (d.bed) {
			try {
				d.bed.stop();
			} catch {}
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
		bp.Q.value = .6;
		const g = this.ctx.createGain();
		g.gain.value = 0;
		src.connect(bp).connect(g).connect(d.music);
		src.start();
		d.bed = src;
		d.bedGain = g;
		this.setBed(id, d.playing);
	}
	setBed(id, on) {
		const gain = this.ch[id].bedGain;
		if (!gain) return;
		const level = getGenre(getTrack(this.ch[id].trackId).genre).bed === "lofi" ? .018 : .028;
		gain.gain.setTargetAtTime(on ? level : 0, this.ctx.currentTime, .04);
	}
	duck(id, t, depth) {
		if (depth < .05) return;
		const g = this.ch[id].duck.gain;
		const floor = Math.max(.12, 1 - depth);
		g.setValueAtTime(floor, t);
		g.exponentialRampToValueAtTime(1, t + .16);
	}
	scheduleStep(id, time) {
		const d = this.ch[id];
		const track = getTrack(d.trackId);
		const genre = getGenre(track.genre);
		const sec = sectionFor(d.bar);
		const step = d.step;
		const drums = DRUMS[genre.drums];
		const stepDur = 60 / d.bpm / 4;
		const t = time + (step % 2 === 1 ? genre.swing * stepDur : 0);
		const breakSec = sec.id === "ara";
		const intro = sec.id === "giris";
		const build = sec.id === "yukselis";
		const drop = sec.id === "drop" || sec.id === "final";
		const thinEnd = sec.id === "final" && sec.barIn >= 12;
		d.motion.frequency.setTargetAtTime(Math.abs(d.filter - .5) < .08 ? motionFreq(sec.id, sec.barIn, step) : 15e3, t, .04);
		if (!breakSec && !(intro && sec.barIn < 2 && step % 8 !== 0)) {
			const kick = gridHit(drums.kick, step);
			const kickOk = !(intro && step % 8 !== 0) && !(thinEnd && step % 8 !== 0);
			if (kick && kickOk) {
				playKick(this.ctx, t, genre.kick, kick, d.drums, this.noise);
				this.duck(id, t, genre.duck * (drop ? 1 : .75));
			}
			if (!intro || sec.barIn >= 4) {
				const sn = gridHit(drums.snare, step);
				if (sn && !thinEnd) playSnare(this.ctx, t, sn * .95, d.drums, this.noise);
				const cl = gridHit(drums.clap, step);
				if (cl && !thinEnd) playClap(this.ctx, t, cl * .85, d.drums, this.noise);
			}
			const hatVel = gridHit(drums.hat, step);
			const openVel = gridHit(drums.open, step);
			if (openVel && !thinEnd) playHat(this.ctx, t, true, openVel * .9, d.drums, this.noise);
			else if (hatVel && !(intro && step % 4 !== 0) && !(thinEnd && step % 4 !== 0)) playHat(this.ctx, t, false, hatVel * (genre.drums === "tech" || genre.drums === "dnb" ? .55 : .85), d.drums, this.noise);
			if ((!intro || sec.barIn >= 4) && !thinEnd) this.playPerc(genre.perc, drums.perc, step, t, d);
		} else if (breakSec && (step === 4 || step === 12)) playHat(this.ctx, t, true, .25, d.drums, this.noise);
		if (build && sec.barIn >= 6) playSnare(this.ctx, t, .28 + (sec.barIn - 6) * .22 + step / 40, d.drums, this.noise);
		if (drop && sec.barIn === 0 && step === 0) playCrash(this.ctx, t, .9, d.drums, this.noise);
		if (build && sec.barIn === 4 && step === 0) playRiser(this.ctx, t, 960 / d.bpm, d.music, this.noise);
		if (genre.bed === "lofi" && Math.random() < .07) playHat(this.ctx, t, false, .08, d.drums, this.noise);
		if (!(intro && sec.barIn < 4) && !(thinEnd && step % 8 !== 0)) {
			const hit = bassAt(genre.bass, step, sec.wrapped);
			if (hit && !(breakSec && step !== 0)) {
				const midi = 36 + pcOf(track.root, d.transpose) + hit.semi;
				const dur = Math.max(.05, hit.dur * stepDur * .92);
				const kind = bassKind(genre.bass);
				const vel = (hit.quiet ? .55 : 1) * (breakSec ? .45 : 1) * (intro ? .7 : 1);
				playBass(this.ctx, t, midi, dur, kind, vel, d.music, hit.glide ? d.lastBass : void 0);
				d.lastBass = midi;
			}
		}
		this.playHarmony(track, step, t, stepDur, sec.id, sec.barIn, d);
	}
	playPerc(kind, pattern, step, t, d) {
		const vel = gridHit(pattern, step);
		if (!vel || kind === "none") return;
		if (kind === "rim") playTick(this.ctx, t, 1850, vel, .04, d.drums);
		if (kind === "cow") playTick(this.ctx, t, step % 8 === 2 ? 800 : 540, vel * .8, .09, d.drums);
		if (kind === "clave") playTick(this.ctx, t, 2100, vel, .05, d.drums);
		if (kind === "conga") playConga(this.ctx, t, step % 4 === 0, vel, d.drums, this.noise);
		if (kind === "shaker") playHat(this.ctx, t, false, vel * .4, d.drums, this.noise);
	}
	playHarmony(track, step, t, stepDur, section, barIn, d) {
		const genre = getGenre(track.genre);
		const prog = genre.progs[track.prog % genre.progs.length];
		const pcs = prog[sectionFor(d.bar).wrapped % prog.length];
		const harm = genre.harm;
		const inBreak = section === "ara";
		const intro = section === "giris";
		const drop = section === "drop" || section === "final";
		const lateGroove = section === "groove" && barIn >= 8;
		if ((harm === "stab" ? [4, 12] : harm === "rhodes" ? [0, 8] : harm === "arp" || harm === "pluck" ? [
			0,
			2,
			4,
			6,
			8,
			10,
			12,
			14
		] : [0]).includes(step) && !(intro && barIn < 2 && harm === "stab")) {
			const base = harm === "stab" || harm === "pluck" || harm === "arp" ? 60 : 48;
			const midis = voiceChord(track.root, pcs, d.transpose, base);
			const dur = (harm === "stab" ? 1.3 : harm === "pluck" || harm === "arp" ? 1.1 : harm === "rhodes" ? 7 : 15) * stepDur;
			const vel = inBreak ? .7 : intro ? .55 : 1;
			if (harm === "arp" || harm === "pluck") {
				const tone = midis[step % midis.length];
				playPluck(this.ctx, t, tone, dur, vel, d.music);
			} else playChord(this.ctx, t, midis, dur, harm === "strings" && inBreak ? "strings" : harm, vel, d.music);
		}
		if (!(genre.lead && (drop || lateGroove) && section !== "final" || section === "final" && barIn < 12 && genre.lead) || inBreak) return;
		const degree = genre.motif[step] ?? -1;
		if (degree < 0) return;
		const midi = 72 + pcOf(track.root, d.transpose) + degreeToSemi(genre.mode, degree);
		const bright = genre.id === "hareketli" || genre.id === "trance" || genre.id === "disko";
		playLead(this.ctx, t, midi, stepDur * .9, drop ? 1 : .75, d.music, bright);
	}
};
function deck(trackId, reverb) {
	return {
		trackId,
		bpm: trackBpm(getTrack(trackId)),
		volume: .82,
		filter: .5,
		eqLow: 0,
		eqMid: 0,
		eqHigh: 0,
		delay: 0,
		reverb,
		flanger: 0,
		transpose: 0,
		loopBars: 0,
		sync: false,
		playing: false
	};
}
function pushDeck(id, d) {
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
var useDj = create((set, get) => ({
	booted: false,
	booting: false,
	master: .78,
	cross: .5,
	target: "A",
	group: "Tümü",
	query: "",
	tab: "A",
	recording: false,
	decks: {
		A: deck("dort-dort", .16),
		B: deck("ayna-topu", .18)
	},
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
		set({
			booted: true,
			booting: false
		});
	},
	toggle: async (id) => {
		if (!get().booted) await get().boot();
		const e = getEngine();
		if (!e) return;
		const playing = !get().decks[id].playing;
		if (playing) e.play(id);
		else e.stop(id);
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				playing
			}
		} }));
	},
	cue: async (id) => {
		if (!get().booted) await get().boot();
		getEngine()?.cue(id);
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				playing: false,
				loopBars: 0
			}
		} }));
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
					loopBars: 0
				}
			},
			tab: id
		}));
		const e = getEngine();
		if (!e) return;
		const was = get().decks[id].playing;
		e.load(id, trackId);
		if (synced) e.setBpm(id, get().decks[id].bpm);
		else {
			const other = id === "A" ? "B" : "A";
			if (get().decks[other].sync) {
				const bpm = trackBpm(track);
				e.setBpm(other, bpm);
				set((s) => ({ decks: {
					...s.decks,
					[other]: {
						...s.decks[other],
						bpm
					}
				} }));
			}
		}
		if (was) e.play(id);
	},
	setBpm: (id, bpm) => {
		const next = Math.max(64, Math.min(190, Math.round(bpm)));
		getEngine()?.setBpm(id, next);
		set((s) => {
			const decks = {
				...s.decks,
				[id]: {
					...s.decks[id],
					bpm: next
				}
			};
			const other = id === "A" ? "B" : "A";
			if (decks[other].sync || decks[id].sync) decks[other] = {
				...decks[other],
				bpm: decks[id].sync ? s.decks[other].bpm : next
			};
			if (decks[other].sync) decks[other] = {
				...decks[other],
				bpm: next
			};
			if (decks[id].sync) decks[id === "A" ? "B" : "A"] = {
				...decks[id === "A" ? "B" : "A"],
				bpm: next
			};
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
			const other = id === "A" ? "B" : "A";
			return { decks: {
				...s.decks,
				[id]: {
					...s.decks[id],
					sync: on,
					bpm: on ? s.decks[other].bpm : s.decks[id].bpm
				},
				[other]: {
					...s.decks[other],
					sync: on ? false : s.decks[other].sync
				}
			} };
		});
	},
	setLoop: (id, bars) => {
		getEngine()?.setLoop(id, bars);
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				loopBars: bars
			}
		} }));
	},
	jump: async (id, section) => {
		if (!get().booted) await get().boot();
		getEngine()?.jump(id, section);
	},
	setTranspose: (id, semis) => {
		const next = Math.max(-6, Math.min(6, semis));
		getEngine()?.setTranspose(id, next);
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				transpose: next
			}
		} }));
	},
	setVolume: (id, v) => {
		getEngine()?.setVolume(id, v);
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				volume: v
			}
		} }));
	},
	setFilter: (id, v) => {
		getEngine()?.setFilter(id, v);
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				filter: v
			}
		} }));
	},
	setEq: (id, band, db) => {
		getEngine()?.setEq(id, band, db);
		const key = band === "low" ? "eqLow" : band === "mid" ? "eqMid" : "eqHigh";
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				[key]: db
			}
		} }));
	},
	setSend: (id, fx, v) => {
		getEngine()?.setSend(id, fx, v);
		const key = fx === "delay" ? "delay" : fx === "reverb" ? "reverb" : "flanger";
		set((s) => ({ decks: {
			...s.decks,
			[id]: {
				...s.decks[id],
				[key]: v
			}
		} }));
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
		set((s) => ({ decks: {
			A: {
				...s.decks.A,
				playing: false
			},
			B: {
				...s.decks.B,
				playing: false
			}
		} }));
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
	setTarget: (target) => set({ target })
}));
if (typeof window !== "undefined") useDj.subscribe((s) => {
	localStorage.setItem("ergin-dj-lab", JSON.stringify({
		a: s.decks.A.trackId,
		b: s.decks.B.trackId,
		master: s.master,
		cross: s.cross
	}));
});
var LOOPS = [
	0,
	1,
	2,
	4,
	8
];
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function idlePos() {
	return {
		bar: 0,
		step: 0,
		bpm: 0,
		playing: false,
		section: "giris",
		sectionLabel: "Giriş"
	};
}
function Knob({ label, value, min, max, step = .01, display, accent, onChange }) {
	const drag = (0, import_react.useRef)(null);
	const angle = -135 + clamp((value - min) / (max - min || 1), 0, 1) * 270;
	const move = (e) => {
		if (!drag.current) return;
		const dy = drag.current.y - e.clientY;
		const sens = e.shiftKey ? .0025 : .008;
		const raw = drag.current.v + dy * (max - min) * sens;
		const snapped = Math.round(clamp(raw, min, max) / step) * step;
		onChange(Number(snapped.toFixed(3)));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "slider",
			tabIndex: 0,
			"aria-label": label,
			"aria-valuemin": min,
			"aria-valuemax": max,
			"aria-valuenow": Number(value.toFixed(2)),
			"aria-valuetext": display,
			className: "relative grid size-12 place-items-center rounded-full border border-line bg-surface-2",
			onPointerDown: (e) => {
				drag.current = {
					y: e.clientY,
					v: value
				};
				e.currentTarget.setPointerCapture(e.pointerId);
			},
			onPointerMove: move,
			onPointerUp: () => {
				drag.current = null;
			},
			onKeyDown: (e) => {
				const dir = e.key === "ArrowUp" || e.key === "ArrowRight" ? 1 : e.key === "ArrowDown" || e.key === "ArrowLeft" ? -1 : 0;
				if (!dir) return;
				e.preventDefault();
				onChange(Number(clamp(value + dir * step * (e.shiftKey ? 1 : 4), min, max).toFixed(3)));
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-1 rounded-full border border-line",
				style: { transform: `rotate(${angle}deg)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full ${accent}` })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted",
				children: display
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted",
			children: label
		})]
	});
}
function Wave({ id }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
						const x = s.at / 72 * w;
						const bw = s.bars / 72 * w;
						g.globalAlpha = .95;
						g.fillStyle = line;
						g.fillRect(x + 1, h * .62, Math.max(2, bw - 2), 4);
					});
					const engine = getEngine();
					const pos = engine?.position(id);
					const head = ((pos?.bar ?? 0) + (pos?.step ?? 0) / 16) / 72 * w;
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
							const y = h * .38 + v * h * .28;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "h-16 w-full rounded-md bg-surface-2"
	});
}
function Spectrum() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
					const bw = (w - 72) / bars;
					for (let i = 0; i < bars; i++) {
						const v = engine ? data[Math.floor(i / bars * 80)] / 255 : .08;
						const bh = Math.max(2, v * h);
						g.fillStyle = i < bars / 2 ? amber : ice;
						g.globalAlpha = engine ? .9 : .35;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "h-14 w-full",
		"aria-hidden": true
	});
}
function Energy({ n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex items-end gap-0.5",
		"aria-label": `Enerji ${n} / 5`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `w-1 rounded-sm ${i <= n ? "bg-amber" : "bg-line"}`,
			style: { height: `${6 + i * 2}px` }
		}, i))
	});
}
function DeckFace({ id, pos }) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `font-mono text-xs tracking-widest ${accentText}`,
							children: ["GÜVERTE ", id]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate text-xl font-semibold",
							children: track.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								genre.label,
								" · ",
								keyLabel(track.root, genre.mode, deck.transpose),
								" · Ergin Stüdyo"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `platter relative size-14 shrink-0 rounded-full border border-line ${deck.playing ? "on" : ""}`,
					style: {
						animationDuration: `${(120 / Math.max(64, liveBpm)).toFixed(2)}s`,
						background: "conic-gradient(from 30deg, var(--color-surface-2), var(--color-line), var(--color-surface-2) 55%, var(--color-bg))"
					},
					"aria-hidden": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-1 left-1/2 h-3 w-0.5 -translate-x-1/2 ${accentBg}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-4 rounded-full bg-bg" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-4xl leading-none",
					children: Math.round(liveBpm)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						"BPM · ",
						clock(bar, pos.step, liveBpm),
						" / ",
						trackLength(track)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Energy, { n: genre.energy }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 w-11 rounded-md border border-line font-mono",
							"aria-label": "Geçici yavaşlat",
							onPointerDown: () => nudge(id, true, -1),
							onPointerUp: () => nudge(id, false, -1),
							onPointerLeave: () => nudge(id, false, -1),
							children: "−"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 w-11 rounded-md border border-line font-mono",
							"aria-label": "Geçici hızlandır",
							onPointerDown: () => nudge(id, true, 1),
							onPointerUp: () => nudge(id, false, 1),
							onPointerLeave: () => nudge(id, false, 1),
							children: "+"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wave, { id }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `inline-flex h-12 items-center gap-2 rounded-md px-4 font-medium text-bg ${accentBg}`,
						onClick: () => void toggle(id),
						children: [deck.playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), deck.playing ? "Durdur" : "Çal"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex h-12 items-center gap-2 rounded-md border border-line px-3 text-sm",
						onClick: () => void cue(id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Başa al"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `h-12 rounded-md border px-3 text-sm ${deck.sync ? `${accentBg} border-transparent text-bg` : "border-line"}`,
						onClick: () => setSync(id, !deck.sync),
						children: "Senkron"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 rounded-md border border-line px-3 text-sm",
						onClick: () => void repeat(id),
						children: "Tekrar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2 sm:grid-cols-6",
				children: SECTIONS.map((s) => {
					const on = pos.section === s.id && (deck.playing || pos.bar > 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `h-11 rounded-md border text-sm ${on ? `${accentBg} border-transparent text-bg` : "border-line text-fg"}`,
						onClick: () => void jump(id, s.id),
						children: s.label
					}, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Döngü"
					}),
					LOOPS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `h-11 min-w-11 rounded-md border px-2 text-sm ${deck.loopBars === n ? `${accentBg} border-transparent text-bg` : "border-line"}`,
						onClick: () => setLoop(id, n),
						children: n === 0 ? "Kapalı" : `${n}`
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "size-11 rounded-md border border-line",
								onClick: () => setTranspose(id, deck.transpose - 1),
								"aria-label": "Ton indir",
								children: "−"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-24 text-center text-sm",
								children: keyLabel(track.root, genre.mode, deck.transpose)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "size-11 rounded-md border border-line",
								onClick: () => setTranspose(id, deck.transpose + 1),
								"aria-label": "Ton yükselt",
								children: "+"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted",
					htmlFor: `bpm-${id}`,
					children: "Hız"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `bpm-${id}`,
					type: "range",
					min: 64,
					max: 190,
					value: deck.bpm,
					onChange: (e) => setBpm(id, Number(e.target.value)),
					className: "w-full"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-4 gap-2 sm:grid-cols-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Filtre",
						value: deck.filter,
						min: 0,
						max: 1,
						display: filterText(deck.filter),
						accent: accentBg,
						onChange: (v) => setFilter(id, v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Bas",
						value: deck.eqLow,
						min: -12,
						max: 6,
						step: 1,
						display: db(deck.eqLow),
						accent: accentBg,
						onChange: (v) => setEq(id, "low", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Orta",
						value: deck.eqMid,
						min: -12,
						max: 6,
						step: 1,
						display: db(deck.eqMid),
						accent: accentBg,
						onChange: (v) => setEq(id, "mid", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Tiz",
						value: deck.eqHigh,
						min: -12,
						max: 6,
						step: 1,
						display: db(deck.eqHigh),
						accent: accentBg,
						onChange: (v) => setEq(id, "high", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Gecikme",
						value: deck.delay,
						min: 0,
						max: .75,
						display: pct(deck.delay),
						accent: accentBg,
						onChange: (v) => setSend(id, "delay", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Yankı",
						value: deck.reverb,
						min: 0,
						max: .75,
						display: pct(deck.reverb),
						accent: accentBg,
						onChange: (v) => setSend(id, "reverb", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Flanj",
						value: deck.flanger,
						min: 0,
						max: .7,
						display: pct(deck.flanger),
						accent: accentBg,
						onChange: (v) => setSend(id, "flanger", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Knob, {
						label: "Ses",
						value: deck.volume,
						min: 0,
						max: 1,
						display: pct(deck.volume),
						accent: accentBg,
						onChange: (v) => setVolume(id, v)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Filtre ortada açıktır. Sola yüksek geçiren, sağa alçak geçiren."
			})
		]
	});
}
function db(n) {
	return `${n > 0 ? "+" : ""}${Math.round(n)}`;
}
function pct(n) {
	return `${Math.round(n * 100)}`;
}
function filterText(n) {
	if (n < .47) return "HP";
	if (n > .53) return "LP";
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-muted",
				children: "KÜTÜPHANE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-lg font-semibold",
				children: [TRACKS.length, " orijinal set"]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Set veya tür ara",
				className: "h-11 rounded-md border border-line bg-bg px-3 text-sm outline-none",
				"aria-label": "Set ara"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `h-11 rounded-md border px-3 text-sm ${group === g ? "border-transparent bg-fg text-bg" : "border-line text-muted"}`,
					onClick: () => setGroup(g),
					children: g
				}, g))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "flex max-h-[28rem] flex-col gap-2 overflow-auto lg:max-h-[calc(100vh-16rem)]",
				children: [list.map((t) => {
					const g = getGenre(t.genre);
					const onA = decks.A.trackId === t.id;
					const onB = decks.B.trackId === t.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-line bg-bg p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										g.label,
										" · ",
										keyLabel(t.root, g.mode),
										" · ",
										trackBpm(t),
										" BPM"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Energy, { n: g.energy })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `h-11 flex-1 rounded-md text-sm ${onA ? "bg-amber text-bg" : "border border-line"}`,
								onClick: () => void load("A", t.id),
								children: "Güverte A"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `h-11 flex-1 rounded-md text-sm ${onB ? "bg-ice text-bg" : "border border-line"}`,
								onClick: () => void load("B", t.id),
								children: "Güverte B"
							})]
						})]
					}, t.id);
				}), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Bu süzgeçte set yok."
				})]
			})
		]
	});
}
function Mixer({ pos }) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-muted",
				children: "MİKSER"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spectrum, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `text-sm ${hint.tone === "ok" ? "text-ok" : hint.tone === "near" ? "text-amber" : "text-rec"}`,
				children: hint.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					"A ",
					pos.A.sectionLabel,
					" · B ",
					pos.B.sectionLabel
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs text-muted",
				htmlFor: "xfade",
				children: "Geçiş"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "xfade",
				type: "range",
				min: 0,
				max: 1,
				step: .01,
				value: cross,
				onChange: (e) => setCross(Number(e.target.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between font-mono text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "B" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs text-muted",
				htmlFor: "master",
				children: "Ana ses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "master",
				type: "range",
				min: 0,
				max: 1,
				step: .01,
				value: master,
				onChange: (e) => setMaster(Number(e.target.value))
			}),
			!booted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-12 rounded-md bg-amber font-medium text-bg",
				onClick: () => void boot(),
				disabled: booting,
				children: booting ? "Açılıyor" : "Sesi aç"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line text-sm",
				onClick: stopAll,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }), "Hepsini durdur"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `h-11 rounded-md text-sm font-medium ${recording ? "bg-rec text-fg" : "border border-line"}`,
				onClick: () => void toggleRecord(),
				children: recording ? "Kaydı bitir ve indir" : "Miksi kaydet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Kayıt yalnızca bu stüdyonun ürettiği sesi indirir. Başka eser eklenmez."
			})
		]
	});
}
var PADS = [
	["kick", "Kick"],
	["clap", "Alkış"],
	["hat", "Zil"],
	["snare", "Trampet"],
	["tom", "Tom"],
	["cow", "Çan"],
	["stab", "Akor"],
	["sub", "Bas"]
];
function Studio() {
	const tab = useDj((s) => s.tab);
	const setTab = useDj((s) => s.setTab);
	const [pos, setPos] = (0, import_react.useState)({
		A: idlePos(),
		B: idlePos()
	});
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("ergin-dj-lab");
			if (!raw) return;
			const data = JSON.parse(raw);
			if (data.a && TRACKS.some((t) => t.id === data.a)) useDj.getState().load("A", data.a);
			if (data.b && TRACKS.some((t) => t.id === data.b)) useDj.getState().load("B", data.b);
			if (typeof data.master === "number") useDj.getState().setMaster(data.master);
			if (typeof data.cross === "number") useDj.getState().setCross(data.cross);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			const engine = getEngine();
			if (!engine) return;
			setPos({
				A: engine.position("A"),
				B: engine.position("B")
			});
		}, 90);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.code === "Space") {
				e.preventDefault();
				useDj.getState().toggle(e.shiftKey ? "B" : "A");
			} else if (e.key === "ArrowLeft") useDj.getState().setCross(useDj.getState().cross - .04);
			else if (e.key === "ArrowRight") useDj.getState().setCross(useDj.getState().cross + .04);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const show = (name) => tab === name ? "block" : "hidden lg:block";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-bg px-3 py-3 lg:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disc3, {
						className: "size-6 text-amber",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold tracking-wide",
						children: "ERGIN DJ LAB"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Orijinal sentez · sample yok · telif yok"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-xs text-muted sm:block",
					children: "Boşluk A · Shift boşluk B · oklar geçiş"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-2 overflow-auto px-3 py-2 lg:hidden",
				children: [
					["lib", "Kütüphane"],
					["A", "Güverte A"],
					["mix", "Mikser"],
					["B", "Güverte B"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `h-11 shrink-0 rounded-md border px-3 text-sm ${tab === id ? "border-transparent bg-fg text-bg" : "border-line"}`,
					onClick: () => setTab(id),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-3 px-3 pb-4 lg:grid-cols-[18rem_minmax(0,1fr)_16rem_minmax(0,1fr)] lg:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: show("lib"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: show("A"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeckFace, {
							id: "A",
							pos: pos.A
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: show("mix"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mixer, { pos })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: show("B"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeckFace, {
							id: "B",
							pos: pos.B
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-3 mb-6 rounded-md border border-line bg-surface p-3 lg:mx-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Performans pedleri"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Vuruşlar da burada üretilir, dosyadan gelmez."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2 sm:grid-cols-8",
						children: PADS.map(([name, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-14 rounded-md border border-line bg-surface-2 text-sm active:bg-amber active:text-bg",
							onPointerDown: () => void useDj.getState().pad(name),
							children: label
						}, name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "19 tür, 72 ölçülük düzen: giriş, groove, yükseliş, drop, ara, final. Ergin Kaplan. Üçüncü taraf müzik, vokal veya sample yoktur."
					})
				]
			})
		]
	});
}
var SplitComponent = Studio;
//#endregion
export { SplitComponent as component };
