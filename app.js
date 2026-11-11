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

const PRESETS = {
  "deep-house": { label:"Deep House", name:"Velvet Current", bpm:124, kick:[0,4,8,12], snare:[4,12], clap:[4,12], hat:[2,6,10,14], open:[6,14], perc:[3,11], bass:[0,6,8,14], chord:[0,8], melody:"soft", scale:[0,3,7,10], tone:0 },
  "melodic-house": { label:"Melodic House", name:"Amber Horizon", bpm:122, kick:[0,4,8,12], snare:[4,12], clap:[4,12], hat:[2,6,10,14], open:[6,14], perc:[7,15], bass:[0,4,8,12], chord:[0,8], melody:"arpeggio", scale:[0,3,7,10], tone:1 },
  "techno": { label:"Peak-Time Techno", name:"Concrete Pulse", bpm:132, kick:[0,4,8,12], snare:[4,12], clap:[], hat:[0,2,4,6,8,10,12,14], open:[6,14], perc:[7,15], bass:[0,8], chord:[0], melody:"minimal", scale:[0,3,5,7,10], tone:2 },
  "trance": { label:"Progressive Trance", name:"Orbit Signal", bpm:138, kick:[0,4,8,12], snare:[4,12], clap:[4,12], hat:[2,6,10,14], open:[6,14], perc:[3,11], bass:[0,4,8,12], chord:[0,4,8,12], melody:"arpeggio", scale:[0,2,3,7,9], tone:3 },
  "disco-funk": { label:"Disco Funk", name:"Chrome Steps", bpm:118, kick:[0,4,8,12], snare:[4,12], clap:[4,12], hat:[2,6,10,14], open:[6,14], perc:[3,7,11,15], bass:[0,3,6,8,11,14], chord:[0,8], melody:"funk", scale:[0,2,4,7,9], tone:4 },
  "afro-house": { label:"Afro House", name:"Saffron Tide", bpm:116, kick:[0,5,8,13], snare:[4,12], clap:[4,12], hat:[2,6,10,14], open:[6,14], perc:[1,3,7,9,11,15], bass:[0,6,8,14], chord:[0,8], melody:"afro", scale:[0,3,5,7,10], tone:5 },
  "drum-bass": { label:"Drum & Bass", name:"Velocity Bloom", bpm:174, kick:[0,10], snare:[4,12], clap:[4,12], hat:[0,2,4,6,8,10,12,14], open:[6,14], perc:[7,15], bass:[0,6,8,14], chord:[0,8], melody:"dnb", scale:[0,3,5,7,10], tone:6 },
  "uk-garage": { label:"UK Garage", name:"Side Street", bpm:130, kick:[0,7,10], snare:[4,12], clap:[4,12], hat:[2,6,10,14], open:[6,14], perc:[3,7,11,15], bass:[0,5,8,13], chord:[0,8], melody:"garage", scale:[0,3,5,7,10], tone:7 },
  "breakbeat": { label:"Breakbeat", name:"Fracture Theory", bpm:132, kick:[0,3,8,11], snare:[4,12], clap:[], hat:[0,2,4,6,8,10,12,14], open:[6,14], perc:[3,11], bass:[0,6,8,14], chord:[0,8], melody:"break", scale:[0,3,5,7,10], tone:8 },
  "lofi": { label:"Lo-Fi", name:"Dust on Glass", bpm:86, kick:[0,10], snare:[4,12], clap:[], hat:[0,4,8,12], open:[14], perc:[7], bass:[0,8], chord:[0,8], melody:"lofi", scale:[0,2,3,7,9], tone:9 },
  "ambient": { label:"Ambient", name:"Blue Silence", bpm:74, kick:[], snare:[], clap:[], hat:[], open:[], perc:[], bass:[0,8], chord:[0], melody:"ambient", scale:[0,2,5,7,9], tone:10 },
  "electro": { label:"Electro", name:"Voltage Garden", bpm:126, kick:[0,4,8,12], snare:[4,12], clap:[4,12], hat:[0,2,4,6,8,10,12,14], open:[6,14], perc:[3,11], bass:[0,4,8,12], chord:[0,8], melody:"electro", scale:[0,3,5,7,10], tone:11 }
};
const deckState = {
  A: { id:'A', preset:'deep-house', name:PRESETS['deep-house'].name, genre:'ORİJİNAL SENTEZ / DEEP HOUSE', bpm:124, originalBpm:124, pitch:0, volume:.82, filter:.5, low:0, mid:0, high:0, echo:0, reverb:0, loop:0, loopStart:0, input:null, lowNode:null, midNode:null, highNode:null, hp:null, lp:null, gain:null, analyser:null, output:null, echoSend:null, reverbSend:null, demoBuffer:null, demoSource:null, demoStart:0, playing:false, demoOffset:0, waveform:null },
  B: { id:'B', preset:'techno', name:PRESETS.techno.name, genre:'ORİJİNAL SENTEZ / TECHNO', bpm:132, originalBpm:132, pitch:0, volume:.82, filter:.5, low:0, mid:0, high:0, echo:0, reverb:0, loop:0, loopStart:0, input:null, lowNode:null, midNode:null, highNode:null, hp:null, lp:null, gain:null, analyser:null, output:null, echoSend:null, reverbSend:null, demoBuffer:null, demoSource:null, demoStart:0, playing:false, demoOffset:0, waveform:null }
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
  d.input=ctx.createGain();
  d.lowNode=ctx.createBiquadFilter();d.lowNode.type='lowshelf';d.lowNode.frequency.value=110;
  d.midNode=ctx.createBiquadFilter();d.midNode.type='peaking';d.midNode.frequency.value=1050;d.midNode.Q.value=.85;
  d.highNode=ctx.createBiquadFilter();d.highNode.type='highshelf';d.highNode.frequency.value=8500;
  d.hp=ctx.createBiquadFilter();d.hp.type='highpass';d.hp.frequency.value=10;d.hp.Q.value=.7;
  d.lp=ctx.createBiquadFilter();d.lp.type='lowpass';d.lp.frequency.value=20000;d.lp.Q.value=.7;
  d.gain=ctx.createGain();d.gain.gain.value=d.volume;
  d.lowNode.gain.value=d.low;d.midNode.gain.value=d.mid;d.highNode.gain.value=d.high;
  d.analyser=ctx.createAnalyser();d.analyser.fftSize=1024;d.analyser.smoothingTimeConstant=.76;
  d.output=ctx.createGain();
  d.echoSend=ctx.createGain();d.echoSend.gain.value=d.echo*.38;
  d.reverbSend=ctx.createGain();d.reverbSend.gain.value=d.reverb*.28;
  d.input.connect(d.lowNode).connect(d.midNode).connect(d.highNode).connect(d.hp).connect(d.lp).connect(d.gain).connect(d.analyser).connect(d.output);
  d.output.connect(masterGain);
  d.output.connect(d.echoSend).connect(echoDelay);
  d.output.connect(d.reverbSend).connect(reverb).connect(reverbWet).connect(masterGain);
  $('filter-value-'+d.id).textContent='OPEN';
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
  if(d.demoBuffer)return d.demoBuffer;
  const p=PRESETS[d.preset]||PRESETS['deep-house'],bpm=d.originalBpm,beat=60/bpm,step=beat/4,seconds=16*beat;
  const length=Math.ceil(ctx.sampleRate*seconds),buffer=ctx.createBuffer(2,length,ctx.sampleRate);
  const left=buffer.getChannelData(0),right=buffer.getChannelData(1);
  let seed=(p.tone+11)*(d.id==='A'?7919:15401);
  const noise=()=>{seed=(seed*16807)%2147483647;return seed/1073741823.5-1;};
  const hz=m=>440*Math.pow(2,(m-69)/12);
  const env=(x,dur,attack=.003,release=.08)=>Math.min(1,x/Math.max(.001,attack),Math.max(.0001,(dur-x)/Math.max(.001,release)));
  const add=(start,dur,voice,pan=0)=>{
    const first=Math.max(0,Math.floor(start*ctx.sampleRate)),last=Math.min(length,Math.floor((start+dur)*ctx.sampleRate));
    for(let i=first;i<last;i++){const x=(i-first)/ctx.sampleRate,s=voice(x,dur);left[i]+=s*(pan>0?1-pan*.45:1);right[i]+=s*(pan<0?1+pan*.45:1);}
  };
  const kick=(t,level=1)=>add(t,.34,(x,dur)=>{
    const f=43+145*Math.exp(-x*27),body=Math.sin(2*Math.PI*f*x)*Math.exp(-x*10.5),click=noise()*Math.exp(-x*105)*.12;
    return (body*.78+click)*env(x,dur,.001,.08)*level;
  },-.02);
  const snare=(t,level=1,isClap=false)=>{
    const dur=isClap ? .16 : .22;
    add(t,dur,(x,d)=>{
      const body=Math.sin(2*Math.PI*(isClap?210:178)*x)*Math.exp(-x*(isClap?31:19))*(isClap ? .08 : .2);
      const hiss=noise()*Math.exp(-x*(isClap?37:22))*(isClap ? .38 : .33);
      const snap=isClap?noise()*Math.exp(-Math.abs(x-.012)*150)*.16:0;
      return (body+hiss+snap)*env(x,d,.001,.045)*level;
    },isClap?.12:0);
    if(isClap)add(t+.018,.09,(x,d)=>noise()*Math.exp(-x*38)*.18*env(x,d,.001,.035)*level,-.12);
  };
  const hat=(t,open=false,level=1,pan=.18)=>{
    const dur=open ? .31 : .055;
    add(t,dur,(x,d)=>{
      const metal=(Math.sin(2*Math.PI*7130*x)+Math.sin(2*Math.PI*9130*x)*.55+Math.sin(2*Math.PI*11300*x)*.32)*.055;
      const hiss=noise()*(open ? .22 : .19);
      return (metal+hiss)*Math.exp(-x*(open?12:65))*env(x,d,.001,open ? .11 : .02)*level;
    },pan);
  };
  const rim=(t,level=1,pan=.25)=>add(t,.09,(x,d)=>{
    const tone=Math.sin(2*Math.PI*1850*x)*Math.exp(-x*50)*.22;
    return (tone+noise()*Math.exp(-x*75)*.12)*env(x,d,.001,.025)*level;
  },pan);
  const tom=(t,midi=48,level=.8,pan=-.2)=>{
    const f=hz(midi);add(t,.27,(x,d)=>Math.sin(2*Math.PI*(f+f*.4*Math.exp(-x*18))*x)*Math.exp(-x*9)*.35*env(x,d,.002,.08)*level,pan);
  };
  const bass=(t,midi,dur=.22,level=1,glide=false)=>{
    const f=hz(midi);add(t,dur,(x,d)=>{
      const sweep=glide?1+(.16*Math.exp(-x*13)):1;
      return (Math.sin(2*Math.PI*f*sweep*x)*.68+Math.sin(2*Math.PI*f*2*sweep*x)*.16+Math.sin(2*Math.PI*f*3*sweep*x)*.055)*Math.exp(-x*(p.tone===9?6:5.8))*env(x,d,.006,.08)*level;
    },.04);
  };
  const pad=(t,root,dur,level=.12)=>[root,root+3,root+7,root+10].forEach((note,index)=>{
    const f=hz(note);add(t,dur,(x,d)=>(Math.sin(2*Math.PI*f*x)+Math.sin(2*Math.PI*f*2.01*x)*.19+Math.sin(2*Math.PI*f*3.98*x)*.055)*env(x,d,.35,.65)*level/(index===0?1:1.35),(index-1.5)*.24);
  });
  const pluck=(t,midi,level=.14,pan=0)=>{
    const f=hz(midi);add(t,.32,(x,d)=>(Math.sin(2*Math.PI*f*x)+Math.sin(2*Math.PI*f*2.01*x)*.27+Math.sin(2*Math.PI*f*3.01*x)*.08)*Math.exp(-x*10)*env(x,d,.003,.1)*level,pan);
  };
  if(p.melody==='ambient'){
    const f=hz(50+p.tone);add(0,seconds,(x,d)=>(Math.sin(2*Math.PI*f*x)+Math.sin(2*Math.PI*f*1.5*x)*.17)*(.55+.45*Math.sin(Math.PI*x/d))*.035,.08);
  }
  for(let bar=0;bar<4;bar++){
    const barStart=bar*4*beat;
    if(p.chord.length&&(p.melody==='ambient'||p.melody==='lofi'||bar%2===0||p.melody==='arpeggio')){
      const root=48+(p.scale[bar%p.scale.length]||0);
      pad(barStart,root,beat*3.8,p.melody==='ambient' ? .105 : p.melody==='lofi' ? .085 : .055);
    }
    for(let s=0;s<16;s++){
      const t=barStart+s*step;
      if(p.kick.includes(s))kick(t,p.melody==='lofi' ? .78 : 1);
      if(p.snare.includes(s))snare(t,.85,false);
      if(p.clap.includes(s))snare(t,.62,true);
      if(p.hat.includes(s))hat(t,false,p.melody==='lofi' ? .48 : .8,s%4===0?-.22:.2);
      if(p.open.includes(s))hat(t,true,.65,s%2?-.25:.25);
      if(p.perc.includes(s)){if(p.melody==='afro'||p.melody==='break')tom(t,s%2?55:59,.65,s%2?-.35:.35);else rim(t,.65,s%2?-.35:.35);}
    }
    p.bass.forEach((s,index)=>{
      const scale=p.scale[(bar+index)%p.scale.length]||0,octave=p.melody==='dnb'||p.melody==='techno'?36:38;
      const dur=p.melody==='ambient'?beat*2:p.melody==='lofi'?beat*.72:beat*.48;
      bass(barStart+s*step,octave+scale,dur,p.melody==='ambient' ? .55 : .9,p.melody==='ukgarage'&&index>0);
    });
    if(p.melody!=='ambient'){
      const line=p.melody==='minimal'?[0,2,4,6]:p.melody==='funk'?[2,6,10,14]:p.melody==='lofi'?[3,11]:[0,4,8,12];
      line.forEach((s,index)=>pluck(barStart+s*step,(p.melody==='lofi'?67:72)+(p.scale[(bar+index*2)%p.scale.length]||0),p.melody==='minimal' ? .045 : p.melody==='lofi' ? .055 : .075,index%2?-.22:.22));
    }
    if(p.melody==='afro')[2,6,10,14].forEach((s,i)=>tom(barStart+s*step,i%2?60:53,.32,i%2?.38:-.38));
    if(p.melody==='trap'){[12,13,14,15].forEach(s=>hat(barStart+s*step,false,.36,.28));bass(barStart+3*beat,31,beat*.8,.88,true);}
    if(p.melody==='dnb')[6,14].forEach(s=>hat(barStart+s*step,false,.55,-.25));
    if(p.melody==='lofi')add(barStart+beat*1.5,.045,(x,d)=>noise()*Math.exp(-x*62)*.035*env(x,d,.001,.02),-.3);
  }
  let peak=0;for(let i=0;i<length;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
  const scale=peak>.82 ? .82/peak : 1;
  for(let i=0;i<length;i++){left[i]=Math.tanh(left[i]*1.12*scale);right[i]=Math.tanh(right[i]*1.12*scale);}
  d.demoBuffer=buffer;d.waveform=buffer;return buffer;
}


function updateRate(d) {
  const rate=clamp((d.bpm/d.originalBpm)*(1+d.pitch/100),.7,1.3);
  if(d.demoSource)d.demoSource.playbackRate.setTargetAtTime(rate,ctx.currentTime,.03);
  $('pitch-value-'+d.id).textContent=`${d.pitch>=0?'+':''}${d.pitch.toFixed(1)}%`;
}
function startDemo(d) {
  if(d.demoSource){try{d.demoSource.stop();}catch{}}
  const buffer=createDemoBuffer(d),source=ctx.createBufferSource();
  source.buffer=buffer;source.loop=true;source.connect(d.input);
  source.playbackRate.value=clamp((d.bpm/d.originalBpm)*(1+d.pitch/100),.7,1.3);
  source.start(0,(d.demoOffset||0)%buffer.duration);
  d.demoSource=source;d.demoStart=ctx.currentTime;d.playing=true;
  drawWave(d,(d.demoOffset||0)/buffer.duration);updateTransport(d);
}
function currentPosition(d) {
  if(!d.demoBuffer)return 0;
  const rate=clamp((d.bpm/d.originalBpm)*(1+d.pitch/100),.7,1.3);
  const elapsed=d.playing&&ctx?(ctx.currentTime-d.demoStart)*rate:0;
  return (d.demoOffset+elapsed)%d.demoBuffer.duration;
}
async function togglePlay(id) {
  const d=deckState[id];
  try{await resumeAudio();}catch(err){toast(err.message||'Ses motoru başlatılamadı.');return;}
  if(d.playing){d.demoOffset=currentPosition(d);if(d.demoSource){try{d.demoSource.stop();}catch{}d.demoSource=null;}d.playing=false;}
  else startDemo(d);
  updateTransport(d);
}
function stopDeck(id,reset=true) {
  const d=deckState[id];
  if(d.demoSource){try{d.demoSource.stop();}catch{}d.demoSource=null;}
  if(reset)d.demoOffset=0;
  d.playing=false;updateTransport(d);
}
function updateTransport(d) {
  $('play-icon-'+d.id).textContent=d.playing?'Ⅱ':'▶';
  const btn=document.querySelector(`[data-action="play"][data-deck="${d.id}"]`);
  btn?.setAttribute('aria-label',`Güverte ${d.id} ${d.playing?'duraklat':'çal'}`);
  $('deck-'+d.id.toLowerCase()).classList.toggle('playing',d.playing);
  $('state-'+d.id).textContent=d.playing?'SENTEZ MOTORU / CANLI':d.genre;
}
function seekDeck(d,ratio) {
  if(!d.demoBuffer)return;
  d.demoOffset=clamp(ratio,0,1)*d.demoBuffer.duration;
  if(d.playing)startDemo(d);
  drawWave(d,ratio);
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
  const p=PRESETS[d.preset];
  $('title-'+d.id).textContent=d.name;
  $('file-'+d.id).textContent=`${p.label} • sıfırdan sentez • harici kayıt yok`;
  $('bpm-'+d.id).value=d.bpm;
  $('duration-'+d.id).textContent='4 BAR LOOP';
}
async function choosePreset(d,presetId) {
  const p=PRESETS[presetId];if(!p)return;
  stopDeck(d.id,true);
  d.preset=presetId;d.name=p.name;d.genre=`ORİJİNAL SENTEZ / ${p.label.toLocaleUpperCase('tr')}`;
  d.bpm=p.bpm;d.originalBpm=p.bpm;d.pitch=0;d.demoBuffer=null;d.waveform=null;d.loop=0;d.loopStart=0;
  $('bpm-'+d.id).value=p.bpm;$('pitch-'+d.id).value='0';$('pitch-value-'+d.id).textContent='0.0%';
  document.querySelectorAll(`.loop-btn[data-deck="${d.id}"]`).forEach(btn=>btn.classList.toggle('active',Number(btn.dataset.loop)===0));
  updateTrackDetails(d);
  if(ctx){d.waveform=createDemoBuffer(d);drawWave(d,0);}else drawIdleWave(d);
  toast(`${p.label} ses düzeni ${d.id} güvertesine hazır.`);
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
  if(!d.playing||!d.demoBuffer)return;
  drawWave(d,currentPosition(d)/d.demoBuffer.duration);
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
    const duration=d.demoBuffer?.duration||16*60/d.bpm;
    let current=d.demoBuffer?currentPosition(d):0;
    if(d.loop&&d.playing&&d.demoBuffer){
      const loopLength=d.loop*4*60/d.bpm;
      if(loopLength>0&&current>=d.loopStart+loopLength){d.demoOffset=d.loopStart;startDemo(d);current=d.loopStart;}
    }
    $('time-'+d.id).textContent=fmtTime(current);
    $('remain-'+d.id).textContent=`−${fmtTime(Math.max(0,duration-current))}`;
    $('seek-'+d.id).value=duration?Math.round(current/duration*1000):0;
    drawDeckMeter(d);
  }
  if(masterAnalyser)drawSpectrum();
  requestAnimationFrame(updateClockAndPosition);
}


function setBpm(d,value){
  const next=clamp(Math.round(Number(value)||d.bpm),60,190);
  if(d.playing){d.demoOffset=currentPosition(d);d.bpm=next;$('bpm-'+d.id).value=next;startDemo(d);}
  else{d.bpm=next;$('bpm-'+d.id).value=next;updateRate(d);}
}


function syncDeck(id){
  const d=deckState[id],other=deckState[id==='A'?'B':'A'];
  setBpm(d,other.bpm);d.pitch=0;$('pitch-'+id).value='0';updateRate(d);
  document.querySelector(`[data-action="sync"][data-deck="${id}"]`).classList.add('active');
  toast(`Güverte ${id}, ${other.bpm} BPM değerine eşlendi.`);
  setTimeout(()=>document.querySelector(`[data-action="sync"][data-deck="${id}"]`)?.classList.remove('active'),1400);
}

function setLoop(d,bars){
  d.loop=bars;d.loopStart=bars?currentPosition(d):0;
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
  for(const id of ['A','B']){
    const d=deckState[id];
    $('preset-'+id).addEventListener('change',e=>void choosePreset(d,e.target.value));
    $('bpm-'+id).addEventListener('change',e=>setBpm(d,e.target.value));
    $('pitch-'+id).addEventListener('input',e=>{d.pitch=Number(e.target.value);if(ctx)updateRate(d);else $('pitch-value-'+id).textContent=`${d.pitch>=0?'+':''}${d.pitch.toFixed(1)}%`;});
    $('filter-'+id).addEventListener('input',e=>{if(!ctx){void resumeAudio().then(()=>setFilter(d,e.target.value)).catch(err=>toast(err.message));return;}setFilter(d,e.target.value);});
    $('volume-'+id).addEventListener('input',e=>{if(!ctx){d.volume=Number(e.target.value)/100;$('volume-value-'+id).textContent=`${e.target.value}%`;return;}setDeckVolume(d,Number(e.target.value));});
    for(const band of ['low','mid','high'])$(band+'-'+id).addEventListener('input',e=>{if(!ctx){d[band]=Number(e.target.value);$(band+'-value-'+id).textContent=`${d[band]>0?'+':''}${d[band]} dB`;return;}setEq(d,band,e.target.value);});
    for(const fx of ['echo','reverb'])$(fx+'-'+id).addEventListener('input',e=>{if(!ctx){d[fx]=Number(e.target.value)/100;$(fx+'-value-'+id).textContent=`${e.target.value}%`;return;}setFx(d,fx,Number(e.target.value));});
    $('seek-'+id).addEventListener('input',e=>seekDeck(d,Number(e.target.value)/1000));
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
}


bindEvents();
for(const d of Object.values(deckState)){$('preset-'+d.id).value=d.preset;updateTrackDetails(d);drawIdleWave(d);updateTransport(d);}
requestAnimationFrame(updateClockAndPosition);
