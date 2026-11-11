import { readFile } from 'node:fs/promises';

const [html, app, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8'),
]);

const assert = (condition, message) => {
  if (!condition) {
    console.error('FAIL:', message);
    process.exitCode = 1;
  } else {
    console.log('PASS:', message);
  }
};

assert(/<script[^>]+src=["']\.\/app\.js["']/i.test(html), 'HTML loads the browser audio engine');
assert(/<link[^>]+href=["']\.\/styles\.css["']/i.test(html), 'HTML loads the local stylesheet');
assert(html.includes('id="preset-A"') && html.includes('id="preset-B"'), 'both decks have independent sound-library selectors');
assert((html.match(/<option value=/g) || []).length >= 24, '12 sound choices are available on each deck');
assert(html.includes('id="crossfader"') && html.includes('id="master-volume"'), 'mixer controls are present');
assert(html.includes('id="record-btn"'), 'local mix recording control is present');
assert(!/type=["']file["']/i.test(html), 'there is no file picker in the page');
assert(!/data-load|file-input|PARÇA YÜKLE/i.test(html + app), 'all music-upload controls and handlers are removed');
assert(!/createMediaElementSource|URL\.createObjectURL\(file\)|function loadFile|new Audio\s*\(/.test(app), 'the app does not load external audio files');
assert(app.includes('function createDemoBuffer(d)') && app.includes('const PRESETS = {'), 'sound presets are synthesized in the browser');
assert(!/https?:\/\/|fetch\s*\(|XMLHttpRequest/.test(app), 'the audio engine has no remote media or network dependency');
assert(/@media\(max-width:760px\)/.test(css) && /\.preset-select/.test(css), 'responsive deck and sound selector styles are present');

if (process.exitCode) process.exit(process.exitCode);
console.log('Ergin DJ Studio static validation complete.');

assert(html.includes('id="mobile-mode-btn"') && html.includes('data-mobile-view="mixer"'), 'mobile mode and focused deck/mixer tabs are available');
assert(css.includes('.waveform{display:block;width:100%;height:76px;'), 'both deck waveform canvases receive an explicit responsive size');
assert(app.includes('function canvasSurface(canvas)') && app.includes('canvas.width !== pixelWidth'), 'canvas backing stores resize only when their dimensions change');
assert(app.includes('lastWaveDrawAt') && app.includes('lastSpectrumDrawAt'), 'mobile visualizer drawing is throttled to protect touch-device performance');
assert(app.includes('document.addEventListener(\'visibilitychange\''), 'visualizer animation pauses when the page is in the background');
