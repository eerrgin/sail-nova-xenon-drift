'use strict';

const $ = (id) => document.getElementById(id);
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const fmtTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`;
};
const toast = (message) => {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2800);
};

const deckState = {
  A: { id:'A', name:'Midnight Current', genre:'ORİJİNAL DEMO / DEEP HOUSE', bpm:124, originalBpm:124, pitch:0, volume:.82, filter:.5, low:0, mid:0, high:0, echo:0, reverb:0, loop:0, loopStart:0, audio:new Audio(), objectUrl:null, mediaSource:null, input:null, lowNode:null, midNode:null, highNode:null, hp:null, lp:null, gain:null, analyser:null, output:null, echoSend:null, reverbSend:null, demoBuffer:null, demoSource:null, demoStart:0, playing:false, demoOffset:0, waveform:null, originalName:'Demo ritmi • 124 BPM • 4 ölçü' },
  B: { id:'B', name:'Neon Pressure', genre:'ORİJİNAL DEMO / TECHNO', bpm:128, originalBpm:128, pitch:0, volume:.82, filter:.5, low:0, mid:0, high:0, echo:0, reverb:0, loop:0, loopStart:0, audio:new Audio(), objectUrl:null, mediaSource:null, input:null, lowNode:null, midNode:null, highNode:null, hp:null, lp:null, gain:null, analyser:null, output:null, echoSend:null, reverbSend:null, demoBuffer:null, demoSource:null, demoStart:0, playing:false, demoOffset:0, waveform:null, originalName:'Demo ritmi • 128 BPM • 4 ölçü' }
};

let ctx = null;
let masterGain = null;
let masterAnalyser = null;
let mediaDestination = null;
let echoDelay = null;
let echoFeedback = null;
let echoWet = null;
let reverb = null;
let reverbWet = null;
let recorder = null;
let recordedChunks = [];
let recording = false;
let engineReady = false;
let masterVolume = .78;
let crossValue = .5;
let sessionStarted = performance.now();
let toastTimer = null;

function makeImpulse(context, seconds=2.4, decay=2.8) {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const envelope = Math.pow(1 - i / length, decay);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
  }
  return buffer;
}

function buildDeckAudio(d) {
  d.input = ctx.createGain();
  d.lowNode = ctx.createBiquadFilter(); d.lowNode.type = 'lowshelf'; d.lowNode.frequency.value = 110;
  d.midNode = ctx.createBiquadFilter(); d.midNode.type = 'peaking'; d.midNode.frequency.value = 1050; d.midNode.Q.value = .85;
  d.highNode = ctx.createBiquadFilter(); d.highNode.type = 'highshelf'; d.highNode.frequency.value = 8500;
  d.hp = ctx.createBiquadFilter(); d.hp.type = 'highpass'; d.hp.frequency.value = 10; d.hp.Q.value = .7;
  d.lp = ctx.createBiquadFilter(); d.lp.type = 'lowpass'; d.lp.frequency.value = 20000; d.lp.Q.value = .7;
  d.gain = ctx.createGain(); d.gain.gain.value = d.volume;
  d.lowNode.gain.value = d.low; d.midNode.gain.value = d.mid; d.highNode.gain.value = d.high;
  d.analyser = ctx.createAnalyser(); d.analyser.fftSize = 1024; d.analyser.smoothingTimeConstant = .76;
  d.output = ctx.createGain(); d.output.gain.value = d.id === 'A' ? Math.SQRT1_2 : Math.SQRT1_2;
  d.echoSend = ctx.createGain(); d.echoSend.gain.value = d.echo * .38;
  d.reverbSend = ctx.createGain(); d.reverbSend.gain.value = d.reverb * .28;
  d.hp.frequency.value = d.filter < .5 ? 18 * Math.pow(500, (.5 - d.filter) * 2) : 10;
  d.lp.frequency.value = d.filter > .5 ? 20000 / Math.pow(65, (d.filter - .5) * 2) : 20000;
  d.input.connect(d.lowNode).connect(d.midNode).connect(d.highNode).connect(d.hp).connect(d.lp).connect(d.gain).connect(d.analyser).connect(d.output);
  d.output.connect(masterGain);
  d.output.connect(d.echoSend).connect(echoDelay);
  d.output.connect(d.reverbSend).connect(reverb).connect(reverbWet).connect(masterGain);
  d.mediaSource = ctx.createMediaElementSource(d.audio);
  d.mediaSource.connect(d.input);
  $('filter-value-' + d.id).textContent = Math.abs(d.filter-.5)<.04 ? 'OPEN' : d.filter<.5 ? 'HP' : 'LP';
  d.audio.preload = 'metadata';
  // Local object URLs are same-session media; leaving crossOrigin unset also
  // keeps file:// launches from triggering an unnecessary CORS check.
  d.audio.addEventListener('ended', () => { if (!d.loop) { d.playing = false; updateTransport(d); } });
  d.audio.addEventListener('loadedmetadata', () => {
    if (d.audio.duration && Number.isFinite(d.audio.duration)) {
      $( `duration-${d.id}` ).textContent = fmtTime(d.audio.duration);
      updateTrackDetails(d);
    }
  });
  d.audio.addEventListener('error', () => toast(`${d.id} güvertesi bu ses biçimini açamadı. WAV veya MP3 deneyebilirsin.`));
}

function initAudio() {
  if (ctx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Bu tarayıcı Web Audio API desteklemiyor. Güncel Chrome, Edge veya Firefox kullan.');
  ctx = new AudioContextClass();
  masterGain = ctx.createGain(); masterGain.gain.value = masterVolume;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -12; compressor.knee.value = 8; compressor.ratio.value = 4; compressor.attack.value = .006; compressor.release.value = .18;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -3; limiter.knee.value = 1; limiter.ratio.value = 18; limiter.attack.value = .002; limiter.release.value = .12;
  masterAnalyser = ctx.createAnalyser(); masterAnalyser.fftSize = 2048; masterAnalyser.smoothingTimeConstant = .82;
  mediaDestination = ctx.createMediaStreamDestination();
  masterGain.connect(compressor).connect(limiter).connect(masterAnalyser).connect(ctx.destination);
  limiter.connect(mediaDestination);

  echoDelay = ctx.createDelay(1.5); echoDelay.delayTime.value = .375;
  echoFeedback = ctx.createGain(); echoFeedback.gain.value = .34;
  const echoTone = ctx.createBiquadFilter(); echoTone.type = 'lowpass'; echoTone.frequency.value = 4200;
  echoWet = ctx.createGain(); echoWet.gain.value = .65;
  echoDelay.connect(echoTone).connect(echoWet).connect(masterGain);
  echoTone.connect(echoFeedback).connect(echoDelay);
  reverb = ctx.createConvolver(); reverb.buffer = makeImpulse(ctx);
  reverbWet = ctx.createGain(); reverbWet.gain.value = .65;
  for (const d of Object.values(deckState)) buildDeckAudio(d);
  setCross(crossValue * 100);
  engineReady = true;
  $('engine-status').textContent = 'SES MOTORU AKTİF';
}

async function resumeAudio() {
  initAudio();
  if (ctx.state !== 'running') await ctx.resume();
}

function createDemoBuffer(d) {
  if (d.demoBuffer) return d.demoBuffer;
  const bpm = d.originalBpm;
  const seconds = 16 * 60 / bpm;
  const length = Math.ceil(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  const left = buffer.getChannelData(0), right = buffer.getChannelData(1);
  const beatSeconds = 60 / bpm;
  let seed = d.id === 'A' ? 9817 : 25731;
  const noise = () => { seed = (seed * 16807) % 2147483647; return (seed / 1073741823.5) - 1; };
  const add = (start, duration, fn, pan=0) => {
    const first = Math.max(0, Math.floor(start * ctx.sampleRate));
    const last = Math.min(length, Math.floor((start + duration) * ctx.sampleRate));
    for (let i = first; i < last; i++) {
      const t = (i - first) / ctx.sampleRate;
      const s = fn(t) * Math.min(1, t / .002);
      left[i] += s * (pan < 0 ? 1 : 1 - pan * .55);
      right[i] += s * (pan > 0 ? 1 : 1 + pan * .55);
    }
  };
  for (let beat = 0; beat < 16; beat++) {
    const t = beat * beatSeconds;
    const kickAmp = d.id === 'A' ? .72 : .8;
    add(t, .32, (x) => Math.sin(2 * Math.PI * (47 + 115 * Math.exp(-x * 29)) * x) * Math.exp(-x * 12) * kickAmp);
    if (beat % 4 === 1 || beat % 4 === 3) {
      add(t, .19, (x) => (noise() * .25 + Math.sin(2 * Math.PI * 185 * x) * .12) * Math.exp(-x * 23), beat % 2 ? .1 : -.1);
    }
    add(t + beatSeconds * .5, .055, (x) => noise() * Math.exp(-x * 74) * (d.id === 'A' ? .11 : .14), beat % 2 ? -.3 : .3);
    if (beat % 4 === 2 && d.id === 'A') add(t, .12, (x) => Math.sin(2 * Math.PI * 95 * x) * Math.exp(-x * 19) * .24);
  }
  // Quiet synthetic bass pulses add a musical reference without embedding a recording.
  for (let bar = 0; bar < 4; bar++) {
    for (const offset of [0, 1.5, 2.5, 3.5]) {
      const t = (bar * 4 + offset) * beatSeconds;
      const note = (bar % 2 ? 49 : 55) * (offset === 2.5 ? 1.5 : 1);
      add(t, .22, (x) => Math.sin(2 * Math.PI * note * x) * Math.exp(-x * 7) * .14, .08);
    }
  }
  // Prevent the generated preview from clipping before it reaches the mixer.
  let peak = 0;
  for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  const scale = peak > .88 ? .88 / peak : 1;
  for (let i = 0; i < length; i++) { left[i] *= scale; right[i] *= scale; }
  d.demoBuffer = buffer;
  return buffer;
}

function updateRate(d) {
  const rate = clamp((d.bpm / d.originalBpm) * (1 + d.pitch / 100), .7, 1.3);
  if (d.audio.src) {
    d.audio.playbackRate = rate;
    d.audio.preservesPitch = true;
    d.audio.mozPreservesPitch = true;
    d.audio.webkitPreservesPitch = true;
  }
  if (d.demoSource) d.demoSource.playbackRate.setTargetAtTime(rate, ctx.currentTime, .03);
  $('pitch-value-' + d.id).textContent = `${d.pitch >= 0 ? '+' : ''}${d.pitch.toFixed(1)}%`;
}

function startDemo(d) {
  if (d.demoSource) { try { d.demoSource.stop(); } catch {} }
  const source = ctx.createBufferSource();
  source.buffer = createDemoBuffer(d); source.loop = true; source.connect(d.input);
  source.playbackRate.value = clamp((d.bpm / d.originalBpm) * (1 + d.pitch / 100), .7, 1.3);
  source.start(0, d.demoOffset || 0); d.demoSource = source; d.demoStart = ctx.currentTime; d.playing = true;
  updateTransport(d);
}

async function togglePlay(id) {
  const d = deckState[id];
  try { await resumeAudio(); } catch (err) { toast(err.message || 'Ses motoru başlatılamadı.'); return; }
  if (d.playing) {
    if (d.audio.src) d.audio.pause();
    if (d.demoSource) { d.demoOffset = (d.demoOffset + ctx.currentTime - d.demoStart) % d.demoBuffer.duration; try { d.demoSource.stop(); } catch {} d.demoSource = null; }
    d.playing = false;
  } else if (d.audio.src) {
    try { await d.audio.play(); d.playing = true; }
    catch { toast('Parça başlatılamadı. Dosyayı yeniden yüklemeyi dene.'); return; }
  } else {
    startDemo(d);
  }
  updateTransport(d);
}

function stopDeck(id, reset=true) {
  const d = deckState[id];
  if (d.audio.src) { d.audio.pause(); if (reset) d.audio.currentTime = 0; }
  if (d.demoSource) { try { d.demoSource.stop(); } catch {} d.demoSource = null; }
  if (reset) d.demoOffset = 0;
  d.playing = false;
  updateTransport(d);
}

function updateTransport(d) {
  const icon = $('play-icon-' + d.id);
  icon.textContent = d.playing ? 'Ⅱ' : '▶';
  const btn = document.querySelector(`[data-action="play"][data-deck="${d.id}"]`);
  btn?.setAttribute('aria-label', `Güverte ${d.id} ${d.playing ? 'duraklat' : 'çal'}`);
  $('deck-' + d.id.toLowerCase()).classList.toggle('playing', d.playing);
  $('state-' + d.id).textContent = d.playing ? 'PLAYING / LIVE OUTPUT' : d.genre;
}

function seekDeck(d, ratio) {
  if (!d.audio.src) return;
  if (!Number.isFinite(d.audio.duration)) return;
  d.audio.currentTime = clamp(ratio, 0, 1) * d.audio.duration;
  d.loopStart = d.audio.currentTime;
}

function setFilter(d, value) {
  d.filter = value / 100;
  if (d.hp && d.lp) {
    if (d.filter < .5) {
      const amount = (.5 - d.filter) * 2;
      d.hp.frequency.setTargetAtTime(18 * Math.pow(500, amount), ctx.currentTime, .025);
      d.lp.frequency.setTargetAtTime(20000, ctx.currentTime, .025);
      $('filter-value-' + d.id).textContent = amount < .06 ? 'OPEN' : `HP ${Math.round(d.hp.frequency.value)}Hz`;
    } else {
      const amount = (d.filter - .5) * 2;
      d.hp.frequency.setTargetAtTime(10, ctx.currentTime, .025);
      d.lp.frequency.setTargetAtTime(20000 / Math.pow(65, amount), ctx.currentTime, .025);
      $('filter-value-' + d.id).textContent = amount < .06 ? 'OPEN' : `LP ${Math.round(d.lp.frequency.value)}Hz`;
    }
  }
}

function setDeckVolume(d, value) { d.volume = value / 100; if (d.gain) d.gain.gain.setTargetAtTime(d.volume, ctx.currentTime, .02); $('volume-value-' + d.id).textContent = `${value}%`; }
function setEq(d, band, value) {
  d[band] = Number(value);
  const node = band === 'low' ? d.lowNode : band === 'mid' ? d.midNode : d.highNode;
  if (node) node.gain.setTargetAtTime(d[band], ctx.currentTime, .025);
  $(band + '-value-' + d.id).textContent = `${d[band] > 0 ? '+' : ''}${d[band]} dB`;
}
function setFx(d, type, value) {
  d[type] = value / 100;
  if (type === 'echo' && d.echoSend) d.echoSend.gain.setTargetAtTime(d.echo * .38, ctx.currentTime, .03);
  if (type === 'reverb' && d.reverbSend) d.reverbSend.gain.setTargetAtTime(d.reverb * .28, ctx.currentTime, .03);
  $(type + '-value-' + d.id).textContent = `${value}%`;
}
function setCross(value) {
  const x = value / 100;
  crossValue = x;
  if (!ctx) return;
  const a = Math.cos(x * Math.PI / 2), b = Math.sin(x * Math.PI / 2);
  deckState.A.output.gain.setTargetAtTime(a, ctx.currentTime, .025);
  deckState.B.output.gain.setTargetAtTime(b, ctx.currentTime, .025);
}

function updateTrackDetails(d) {
  $('title-' + d.id).textContent = d.name;
  $('file-' + d.id).textContent = d.originalName;
  $('bpm-' + d.id).value = d.bpm;
  $('duration-' + d.id).textContent = d.audio.src && Number.isFinite(d.audio.duration) ? fmtTime(d.audio.duration) : 'DEMO LOOP';
}

async function loadFile(d, file) {
  if (!file) return;
  if (!file.type.startsWith('audio/') && !/\.(mp3|wav|ogg|m4a|flac|aac|aiff?)$/i.test(file.name)) {
    toast('Ses dosyası seçmelisin.'); return;
  }
  try { await resumeAudio(); } catch (err) { toast(err.message); return; }
  stopDeck(d.id, false);
  if (d.objectUrl) URL.revokeObjectURL(d.objectUrl);
  d.objectUrl = URL.createObjectURL(file);
  d.audio.src = d.objectUrl;
  d.audio.load();
  d.demoBuffer = null; d.demoOffset = 0;
  d.name = file.name.replace(/\.[^.]+$/, '');
  d.genre = 'LOCAL FILE / READY TO MIX';
  d.originalName = `${file.name} • cihazından yüklendi`;
  d.originalBpm = d.bpm;
  d.pitch = 0;
  $('pitch-' + d.id).value = '0';
  $('pitch-value-' + d.id).textContent = '0.0%';
  updateTrackDetails(d);
  drawIdleWave(d);
  $('state-' + d.id).textContent = d.genre;
  try {
    const buffer = await file.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buffer.slice(0));
    d.waveform = decoded;
    drawWave(d);
  } catch {
    d.waveform = null;
    drawIdleWave(d);
  }
  toast(`${file.name} ${d.id} güvertesine yüklendi.`);
}

function drawIdleWave(d) {
  const canvas = $('wave-' + d.id); if (!canvas) return;
  const rect = canvas.getBoundingClientRect(); if (!rect.width) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
  const g = canvas.getContext('2d'); g.setTransform(ratio,0,0,ratio,0,0); g.clearRect(0,0,rect.width,rect.height);
  const color = d.id === 'A' ? '#f2a93b' : '#3ed7c4';
  const count = Math.floor(rect.width / 3.6), mid = rect.height / 2;
  for (let i=0;i<count;i++) {
    const v = .12 + Math.abs(Math.sin(i*.42)*Math.cos(i*.083))*.58 + Math.abs(Math.sin(i*.071))*.12;
    g.fillStyle = color; g.globalAlpha = .2 + v*.6;
    g.fillRect(i*3.6,mid-v*mid*.8,2,v*mid*1.6);
  }
  g.globalAlpha=1;
}
function drawWave(d, progress = -1) {
  const canvas = $('wave-' + d.id); if (!canvas) return;
  const rect = canvas.getBoundingClientRect(); if (!rect.width) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width*ratio); canvas.height = Math.round(rect.height*ratio);
  const g=canvas.getContext('2d'); g.setTransform(ratio,0,0,ratio,0,0); g.clearRect(0,0,rect.width,rect.height);
  const color=d.id==='A'?'#f2a93b':'#3ed7c4', data=d.waveform?.getChannelData(0);
  if(!data){drawIdleWave(d);return;}
  const mid=rect.height/2, samples=Math.max(1,Math.floor(data.length/(rect.width*1.35)));
  for(let x=0;x<rect.width;x++){
    const start=Math.floor(x*samples),end=Math.min(data.length,start+samples);let min=1,max=-1;
    for(let j=start;j<end;j+=Math.max(1,Math.floor(samples/25))){min=Math.min(min,data[j]);max=Math.max(max,data[j]);}
    const height=Math.max(1,(max-min)*mid*.86);g.fillStyle=color;g.globalAlpha=.58+Math.min(1,height/mid)*.3;g.fillRect(x,mid-height/2,1.35,height);
  }
  g.globalAlpha=1;
  if(progress>=0){g.fillStyle=color;g.globalAlpha=.95;g.fillRect(clamp(progress,0,1)*rect.width-1,0,2,rect.height);g.globalAlpha=1;}
}

function drawDeckMeter(d) {
  const canvas=$('wave-'+d.id); if(!canvas) return;
  if (!d.playing) return;
  if (!d.waveform) {
    const g=canvas.getContext('2d'), w=canvas.clientWidth,h=canvas.clientHeight;
    const ratio=Math.min(2,window.devicePixelRatio||1);if(canvas.width!==Math.round(w*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);}g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,w,h);
    const data=new Uint8Array(d.analyser.frequencyBinCount);d.analyser.getByteFrequencyData(data);const color=d.id==='A'?'#f2a93b':'#3ed7c4';
    for(let i=0;i<Math.floor(w/3);i++){const v=data[Math.floor(i/Math.floor(w/3)*data.length)]/255;g.fillStyle=color;g.globalAlpha=.25+v*.75;g.fillRect(i*3,h*(1-v),2,h*v); }g.globalAlpha=1;
  } else {
    const pos=d.audio.src?(d.audio.currentTime/(d.audio.duration||1)):((d.demoOffset+ctx.currentTime-d.demoStart)%d.demoBuffer.duration)/d.demoBuffer.duration;
    drawWave(d,pos);
  }
}

function drawSpectrum() {
  const canvas=$('spectrum'), meter=$('master-meter'); if(!canvas || !masterAnalyser) return;
  const w=canvas.clientWidth,h=canvas.clientHeight,ratio=Math.min(2,window.devicePixelRatio||1);
  if(!w || !h) return;
  if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);}
  const g=canvas.getContext('2d');g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,w,h);
  const data=new Uint8Array(masterAnalyser.frequencyBinCount);masterAnalyser.getByteFrequencyData(data);const bars=100,gap=2,bw=(w-gap*(bars-1))/bars;
  for(let i=0;i<bars;i++){const ix=Math.floor(Math.pow(i/bars,1.7)*data.length),v=data[ix]/255;const bh=Math.max(1,v*h*.94);g.fillStyle=i<bars*.48?'#f2a93b':'#3ed7c4';g.globalAlpha=.3+v*.7;g.fillRect(i*(bw+gap),h-bh,bw,bh);}
  g.globalAlpha=1;
  if(meter){const mw=meter.clientWidth,mh=meter.clientHeight;const mr=Math.min(2,window.devicePixelRatio||1);if(meter.width!==Math.round(mw*mr)||meter.height!==Math.round(mh*mr)){meter.width=Math.round(mw*mr);meter.height=Math.round(mh*mr);}const mg=meter.getContext('2d');mg.setTransform(mr,0,0,mr,0,0);mg.clearRect(0,0,mw,mh);const n=36,barW=(mw-n*2)/n;for(let i=0;i<n;i++){const v=data[Math.floor((i/n)*data.length)]/255;mg.fillStyle=i>n*.84?'#ff626a':i>n*.65?'#f2a93b':'#3ed7c4';mg.globalAlpha=.28+v*.72;mg.fillRect(i*(barW+2),mh-v*mh,barW,v*mh);}mg.globalAlpha=1;const peak=Math.max(...data.slice(0,80));$('master-level').textContent=peak?`${(20*Math.log10(peak/255)).toFixed(1)} dB`:'−∞ dB';}
}

function updateClockAndPosition() {
  const elapsed=Math.floor((performance.now()-sessionStarted)/1000);
  $('session-clock').textContent=`${String(Math.floor(elapsed/3600)).padStart(2,'0')}:${String(Math.floor((elapsed%3600)/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`;
  for(const d of Object.values(deckState)){
    let current=0,duration=8;
    if(d.audio.src){duration=Number.isFinite(d.audio.duration)?d.audio.duration:0;current=d.audio.currentTime||0;
      if(d.loop&&duration){const loopLength=d.loop*4*60/d.bpm;if(loopLength>0&&current>=d.loopStart+loopLength)d.audio.currentTime=d.loopStart;}
    }else if(d.demoBuffer){duration=d.demoBuffer.duration;current=d.playing?(d.demoOffset+ctx.currentTime-d.demoStart)%duration:d.demoOffset;}
    $('time-'+d.id).textContent=fmtTime(current);
    $('remain-'+d.id).textContent=duration?`−${fmtTime(Math.max(0,duration-current))}`:'LIVE';
    if(d.audio.src&&duration){$('seek-'+d.id).value=Math.round(current/duration*1000);}
    else if(d.demoBuffer){$('seek-'+d.id).value=Math.round(current/duration*1000);}
    drawDeckMeter(d);
  }
  if(masterAnalyser)drawSpectrum();
  requestAnimationFrame(updateClockAndPosition);
}

function setBpm(d,value){
  const next=clamp(Math.round(Number(value)||d.bpm),60,190);d.bpm=next;$('bpm-'+d.id).value=next;updateRate(d);
  if(d.loop){const len=d.loop*4*60/d.bpm;if(d.audio.src)d.loopStart=clamp(d.loopStart,0,Math.max(0,(d.audio.duration||0)-len));}
}
function syncDeck(id){
  const d=deckState[id],other=deckState[id==='A'?'B':'A'];
  setBpm(d,other.bpm);d.pitch=0;$('pitch-'+id).value='0';updateRate(d);
  document.querySelector(`[data-action="sync"][data-deck="${id}"]`).classList.add('active');
  toast(`Güverte ${id}, ${other.bpm} BPM değerine eşlendi.`);
  setTimeout(()=>document.querySelector(`[data-action="sync"][data-deck="${id}"]`)?.classList.remove('active'),1400);
}

function setLoop(d,bars){
  d.loop=bars;
  const loopLength = bars * 4 * 60 / d.bpm;
  d.loopStart = d.audio.src && Number.isFinite(d.audio.duration) && loopLength ? Math.min(d.audio.currentTime||0,Math.max(0,d.audio.duration-loopLength)) : (d.audio.currentTime||0);
  document.querySelectorAll(`.loop-btn[data-deck="${d.id}"]`).forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.loop)===bars));
  toast(bars?`${d.id} güvertesinde ${bars} ölçülük döngü açıldı.`:`${d.id} döngüsü kapatıldı.`);
}

function triggerPad(name){
  if(!ctx) return;
  const t=ctx.currentTime;
  const out=ctx.createGain();out.gain.value=.6;out.connect(masterGain);
  const noiseBuffer=()=>{const b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.5),ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;return b;};
  const env=(node,peak,dur,attack=.003)=>{node.gain.setValueAtTime(.0001,t);node.gain.exponentialRampToValueAtTime(peak,t+attack);node.gain.exponentialRampToValueAtTime(.0001,t+dur);};
  if(name==='kick'||name==='tom'||name==='zap'){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=name==='zap'?'sawtooth':'sine';
    const start=name==='kick'?145:name==='tom'?260:980,end=name==='kick'?42:name==='tom'?78:110;
    o.frequency.setValueAtTime(start,t);o.frequency.exponentialRampToValueAtTime(end,t+(name==='zap'?.24:.14));env(g,name==='kick'?.78:.38,name==='kick'?.34:.3,.002);o.connect(g).connect(out);o.start(t);o.stop(t+.38);
  } else if(name==='snare'||name==='clap'||name==='hat'||name==='open'||name==='riser'){
    const source=ctx.createBufferSource();source.buffer=noiseBuffer();const filter=ctx.createBiquadFilter();filter.type=name==='hat'||name==='open'?'highpass':'bandpass';filter.frequency.value=name==='hat'?7500:name==='open'?5500:name==='riser'?900:1900;
    const g=ctx.createGain();const dur=name==='hat'?.055:name==='open'?.32:name==='riser'?.8:name==='clap'?.14:.2;
    g.gain.setValueAtTime(.0001,t);if(name==='riser'){g.gain.exponentialRampToValueAtTime(.44,t+dur*.85);g.gain.exponentialRampToValueAtTime(.0001,t+dur);filter.frequency.exponentialRampToValueAtTime(9000,t+dur);}else{g.gain.exponentialRampToValueAtTime(name==='snare'?.35:.23,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);}
    source.connect(filter).connect(g).connect(out);source.start(t);source.stop(t+dur+.03);
  }
  const btn=document.querySelector(`[data-pad="${name}"]`);btn?.classList.add('hit');setTimeout(()=>btn?.classList.remove('hit'),110);
}

async function toggleRecording(){
  try{await resumeAudio();}catch(err){toast(err.message);return;}
  if(!window.MediaRecorder||!mediaDestination){toast('Bu tarayıcıda canlı kayıt desteği bulunamadı.');return;}
  if(!recording){
    const mime=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(type=>MediaRecorder.isTypeSupported(type));
    try{recorder=new MediaRecorder(mediaDestination.stream,mime?{mimeType:mime}:undefined);}catch{toast('Kayıt başlatılamadı. Tarayıcı kayıt biçimini desteklemiyor.');return;}
    recordedChunks=[];recorder.ondataavailable=e=>{if(e.data&&e.data.size)recordedChunks.push(e.data);};
    recorder.onstop=()=>{
      const blob=new Blob(recordedChunks,{type:recorder.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ergin-dj-mix-${new Date().toISOString().slice(0,10)}.webm`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);toast('Miks kaydı indirildi.');
    };
    recorder.start(250);recording=true;$('record-label').textContent='KAYDI BİTİR';$('record-btn').classList.add('recording');toast('Ana miks kaydediliyor.');
  }else{
    recorder.stop();recording=false;$('record-label').textContent='MİKSİ KAYDET';$('record-btn').classList.remove('recording');
  }
}

function bindEvents(){
  document.querySelectorAll('[data-load]').forEach(btn=>btn.addEventListener('click',()=> $('file-input-'+btn.dataset.load).click()));
  for(const id of ['A','B']){
    const d=deckState[id];const input=$('file-input-'+id);
    input.addEventListener('change',e=>{const f=e.target.files?.[0];if(f)void loadFile(d,f);e.target.value='';});
    const card=$('deck-'+id.toLowerCase());
    card.addEventListener('dragover',e=>{e.preventDefault();card.classList.add('dragover');});
    card.addEventListener('dragleave',()=>card.classList.remove('dragover'));
    card.addEventListener('drop',e=>{e.preventDefault();card.classList.remove('dragover');const f=e.dataTransfer.files?.[0];if(f)void loadFile(d,f);});
    $('bpm-'+id).addEventListener('change',e=>setBpm(d,e.target.value));
    $('pitch-'+id).addEventListener('input',e=>{d.pitch=Number(e.target.value);if(ctx)updateRate(d);else $('pitch-value-'+id).textContent=`${d.pitch>=0?'+':''}${d.pitch.toFixed(1)}%`;});
    $('filter-'+id).addEventListener('input',e=>{if(!ctx){void resumeAudio().then(()=>setFilter(d,e.target.value)).catch(err=>toast(err.message));return;}setFilter(d,e.target.value);});
    $('volume-'+id).addEventListener('input',e=>{if(!ctx){d.volume=Number(e.target.value)/100;$('volume-value-'+id).textContent=`${e.target.value}%`;return;}setDeckVolume(d,Number(e.target.value));});
    for(const band of ['low','mid','high'])$(band+'-'+id).addEventListener('input',e=>{if(!ctx){d[band]=Number(e.target.value);$(band+'-value-'+id).textContent=`${d[band]>0?'+':''}${d[band]} dB`;return;}setEq(d,band,e.target.value);});
    for(const fx of ['echo','reverb'])$(fx+'-'+id).addEventListener('input',e=>{if(!ctx){d[fx]=Number(e.target.value)/100;$(fx+'-value-'+id).textContent=`${e.target.value}%`;return;}setFx(d,fx,Number(e.target.value));});
    $('seek-'+id).addEventListener('input',e=>{if(d.audio.src&&Number.isFinite(d.audio.duration))seekDeck(d,Number(e.target.value)/1000);});
  }
  document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.deck,action=btn.dataset.action;
    if(action==='play')void togglePlay(id);
    if(action==='cue'){stopDeck(id,true);deckState[id].loopStart=0;}
    if(action==='stop')stopDeck(id,true);
    if(action==='sync')syncDeck(id);
  }));
  document.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{const d=deckState[btn.dataset.deck];setBpm(d,d.bpm+Number(btn.dataset.step));}));
  document.querySelectorAll('[data-loop]').forEach(btn=>btn.addEventListener('click',()=>setLoop(deckState[btn.dataset.deck],Number(btn.dataset.loop))));
  $('crossfader').addEventListener('input',e=>setCross(Number(e.target.value)));
  $('master-volume').addEventListener('input',e=>{const v=Number(e.target.value);masterVolume=v/100;$('master-value').textContent=`${v}%`;if(masterGain)masterGain.gain.setTargetAtTime(masterVolume,ctx.currentTime,.02);});
  $('stop-all').addEventListener('click',()=>{stopDeck('A',true);stopDeck('B',true);});
  $('record-btn').addEventListener('click',()=>void toggleRecording());
  document.querySelectorAll('[data-pad]').forEach(btn=>btn.addEventListener('click',async()=>{try{await resumeAudio();triggerPad(btn.dataset.pad);}catch(err){toast(err.message);}}));
  $('help-btn').addEventListener('click',()=> $('help-dialog').showModal());
  $('close-help').addEventListener('click',()=> $('help-dialog').close());
  $('help-dialog').addEventListener('click',e=>{if(e.target===$('help-dialog'))$('help-dialog').close();});
  window.addEventListener('resize',()=>{for(const d of Object.values(deckState)){if(d.waveform)drawWave(d);else drawIdleWave(d);}});
  window.addEventListener('beforeunload',()=>{for(const d of Object.values(deckState)){if(d.objectUrl)URL.revokeObjectURL(d.objectUrl);}});
}

bindEvents();
for(const d of Object.values(deckState)){drawIdleWave(d);updateTransport(d);}
requestAnimationFrame(updateClockAndPosition);
