#!/usr/bin/env node
// Usage: OPENAI_API_KEY=sk-... node generate-reel.mjs <microlearning_id>
// Run from inside the scripts/ directory after: npm install
// Requires: firebase-service-account.json in the project root

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import OpenAI from 'openai';
import { ElevenLabsClient } from 'elevenlabs';
import puppeteer from 'puppeteer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

ffmpeg.setFfmpegPath(ffmpegPath);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Nugget image encoded once at startup
const NUGGET_B64 = readFileSync(join(ROOT, 'assets', 'img', 'nuggeto.png')).toString('base64');
const NUGGET_IMG = `data:image/png;base64,${NUGGET_B64}`;

// ─── Config ───────────────────────────────────────────────────────────────────

const ML_ID = process.argv[2];
if (!ML_ID) {
  console.error('\nUsage: node generate-reel.mjs <microlearning_id>\n');
  process.exit(1);
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('\nFalta env var: OPENAI_API_KEY\n');
  process.exit(1);
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  console.error('\nFalta env var: ELEVENLABS_API_KEY\n');
  process.exit(1);
}

const SERVICE_ACCOUNT_PATH = join(ROOT, 'firebase-service-account.json');
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('\nFalta: firebase-service-account.json en la raíz del proyecto\n');
  process.exit(1);
}

const OUTPUT_DIR = join(ROOT, 'reel-output');
const TEMP_DIR   = join(OUTPUT_DIR, 'temp', ML_ID);
[OUTPUT_DIR, TEMP_DIR].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

const W = 1080;
const H = 1920;

// ElevenLabs — voz neural en español latinoamericano
// Voces recomendadas para español neutro:
//   Valentina  → cálida, latinoamericana  (ID: XrExE9yKIg1WjnnlVkGX)
//   Laura      → clara, neutral           (ID: FGY2WhTYpPnrIDTdsKH5)
//   Matilda    → suave, profesional       (ID: XB0fDUnXU5powFXDhCwa)
const TTS_VOICE_ID  = 'XrExE9yKIg1WjnnlVkGX'; // Valentina
const TTS_EL_MODEL  = 'eleven_multilingual_v2';

// Segundos de pausa al final del slide de carátula (más tiempo para verla)
const TITLE_SLIDE_END_PAUSE = 3.0;
// Segundos de pausa al final del resto de slides
const SLIDE_END_PAUSE = 1.5;

// ─── Category gradients (espeja GeneratedCover.tsx) ──────────────────────────

const GRADIENTS = {
  'comunicacion':        ['#6C63FF', '#3F3D9E'],
  'psicologia':          ['#E91E63', '#9C27B0'],
  'negocios':            ['#FF9800', '#F44336'],
  'desarrollo-personal': ['#4CAF50', '#2E7D32'],
  'finanzas':            ['#00BCD4', '#006064'],
  'liderazgo':           ['#FFC107', '#FF6F00'],
  'habitos':             ['#26C6DA', '#00838F'],
  'productividad':       ['#7C4DFF', '#304FFE'],
};
const DEFAULT_GRADIENT = ['#546E7A', '#263238'];
const getGradient = (cat) => GRADIENTS[cat?.toLowerCase()] ?? DEFAULT_GRADIENT;

// ─── Lucide icon SVGs por categoría (viewBox 0 0 24 24, stroke only) ──────────

const ICON_SVGS = {
  'comunicacion':        `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  'psicologia':          `<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/>`,
  'negocios':            `<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  'desarrollo-personal': `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  'finanzas':            `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
  'liderazgo':           `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  'habitos':             `<path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/>`,
  'productividad':       `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
};
const DEFAULT_ICON_SVG = `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`;

function getCategoryIconSvg(category) {
  const key = (category ?? '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
  return ICON_SVGS[key] ?? DEFAULT_ICON_SVG;
}

// ─── Visual seed (espeja GeneratedCover.tsx) ──────────────────────────────────

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}

function getVisualSeed(tags, title) {
  const arr = (tags?.length > 0 ? tags : (title ? [title] : []));
  return hashString(arr.join('|'));
}

// ─── Lógica de slides (espeja app/microlearning-detail.tsx) ───────────────────

function buildSlides(ml) {
  const slides = [{ type: 'title' }];
  const content = (ml.content ?? '').trim();
  if (content) {
    const sentences = (content.match(/[^.!?]+[.!?]+/g) ?? [content])
      .map(s => s.trim()).filter(Boolean);
    for (let i = 0; i < sentences.length; i += 2) {
      const text = i + 1 < sentences.length
        ? `${sentences[i]} ${sentences[i + 1]}`
        : sentences[i];
      slides.push({ type: 'content', text });
    }
  }
  if (ml.reflectionQuestion?.trim()) {
    slides.push({ type: 'reflection', text: ml.reflectionQuestion.trim() });
  }
  return slides;
}

// Texto que se habla (para TTS)
function slideSpokenText(ml, slide) {
  if (slide.type === 'title') return ml.title;
  return slide.text;
}

// Texto que se muestra en pantalla (para highlighting)
function slideDisplayText(ml, slide) {
  if (slide.type === 'title') return ml.title;
  return slide.text;
}

// ─── Tamaño del nugget en el reel (escala 3× del tamaño base de la app) ───────
const REEL_NUGGET_W  = 690;  // 230 * 3
const REEL_NUGGET_H  = 462;  // 154 * 3
const REEL_ICON_SIZE = 114;  //  38 * 3

// ─── HTML helpers ─────────────────────────────────────────────────────────────

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function hlHtml(text, start, length) {
  if (start < 0 || length <= 0 || start >= text.length) return esc(text);
  return `${esc(text.slice(0, start))}<mark>${esc(text.slice(start, start + length))}</mark>${esc(text.slice(start + length))}`;
}

// Círculos/anillos base siempre presentes (dimensiones escaladas 2.77× para 1080px)
const BASE_DECOS_HTML = `
<div class="dc" style="width:720px;height:720px;top:-221px;left:-221px"></div>
<div class="dc" style="width:554px;height:554px;bottom:-166px;right:-166px"></div>
<div class="dr" style="width:609px;height:609px;bottom:-249px;left:-194px;border-width:1px"></div>
<div class="dr" style="width:305px;height:305px;top:25%;right:-55px"></div>
<div class="dc" style="width:152px;height:152px;top:18%;right:20%;opacity:0.14"></div>
<div style="position:absolute;width:160%;height:100px;left:-30%;top:40%;background:rgba(255,255,255,0.04);transform:rotate(-8deg)"></div>
`;

// Decoraciones variables según seed (MicroDecoration de la app, escaladas)
function microDecoHtml(seed) {
  const v = seed % 4;
  if (v === 0) return `
    <div style="position:absolute;width:160%;height:100px;left:-30%;top:15%;background:rgba(255,255,255,0.08);transform:rotate(-25deg)"></div>
    <div style="position:absolute;width:160%;height:100px;left:-30%;top:50%;background:rgba(255,255,255,0.05);transform:rotate(-25deg)"></div>
    <div class="dc" style="width:222px;height:222px;bottom:-83px;right:-55px"></div>`;
  if (v === 1) return `
    <div class="dr" style="width:388px;height:388px;bottom:-138px;left:-138px"></div>
    <div class="dr" style="width:249px;height:249px;bottom:-55px;left:-55px"></div>
    <div class="dc" style="width:138px;height:138px;top:44px;right:55px"></div>`;
  if (v === 2) return `
    <div style="position:absolute;bottom:-28px;right:-28px;width:0;height:0;border-left:222px solid transparent;border-bottom:277px solid rgba(255,255,255,0.08)"></div>
    <div class="dc" style="width:277px;height:277px;top:-83px;right:-83px"></div>
    <div class="dc" style="width:111px;height:111px;bottom:55px;left:83px"></div>`;
  return `
    <div style="position:absolute;border-radius:22px;background:rgba(255,255,255,0.08);width:249px;height:249px;bottom:-83px;right:-55px;transform:rotate(20deg)"></div>
    <div style="position:absolute;border-radius:14px;background:rgba(255,255,255,0.08);width:138px;height:138px;top:28px;left:28px;transform:rotate(35deg)"></div>
    <div class="dc" style="width:166px;height:166px;bottom:28px;left:-28px"></div>`;
}

// CSS compartido de decoraciones
const DECO_CSS = `
.dc{position:absolute;border-radius:50%;background:rgba(255,255,255,0.09)}
.dr{position:absolute;border-radius:50%;border:1.5px solid rgba(255,255,255,0.12)}
`;

function titleSlideHtml(ml, gradient, start, length, seed) {
  const [c1, c2] = gradient;
  const iconSvg = getCategoryIconSvg(ml.category);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:${W}px;height:${H}px;overflow:hidden;
  background:linear-gradient(135deg,${c1},${c2});
  font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 70px;
}
${DECO_CSS}
.wrap{display:flex;flex-direction:column;align-items:center;gap:50px;width:100%;text-align:center}
.nugget{position:relative;width:${REEL_NUGGET_W}px;height:${REEL_NUGGET_H}px;
  display:flex;align-items:center;justify-content:center;transform:rotate(-37.5deg)}
.nugget img{position:absolute;width:100%;height:100%;object-fit:contain}
.ni{display:flex;align-items:center;justify-content:center;transform:rotate(37.5deg)}
.title{font-size:58px;font-weight:700;color:#fff;line-height:1.22;letter-spacing:-1px}
mark{background:rgba(255,255,255,0.35);border-radius:8px;padding:0 6px;color:#fff}
.divider{width:52px;height:4px;background:rgba(255,255,255,0.35);border-radius:2px}
.book{font-size:30px;font-weight:500;color:rgba(255,255,255,0.85);line-height:1.3}
.author{font-size:26px;font-weight:400;color:rgba(255,255,255,0.6)}
.brand{position:absolute;bottom:44px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.35);letter-spacing:3px}
</style></head><body>
${BASE_DECOS_HTML}
${microDecoHtml(seed)}
<div class="wrap">
  <div class="nugget">
    <img src="${NUGGET_IMG}">
    <div class="ni">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round"
           style="width:${REEL_ICON_SIZE}px;height:${REEL_ICON_SIZE}px">
        ${iconSvg}
      </svg>
    </div>
  </div>
  <div class="title">${hlHtml(ml.title, start, length)}</div>
  <div class="divider"></div>
  <div class="book">${esc(ml.bookTitle)}</div>
  <div class="author">por ${esc(ml.bookAuthor)}</div>
</div>
<div class="brand">nuggeto</div>
</body></html>`;
}

function contentSlideHtml(text, gradient, start, length, isReflection, seed) {
  const [c1, c2] = gradient;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:${W}px;height:${H}px;overflow:hidden;
  background:linear-gradient(135deg,${c1},${c2});
  font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:100px 80px;
}
${DECO_CSS}
.wrap{display:flex;flex-direction:column;align-items:center;gap:44px;width:100%;text-align:center}
.emoji{font-size:160px;line-height:1}
.txt{
  font-size:${isReflection ? 44 : 48}px;
  font-weight:${isReflection ? 500 : 600};
  font-style:${isReflection ? 'italic' : 'normal'};
  color:#fff;line-height:1.45;letter-spacing:-0.3px;
}
mark{background:rgba(255,255,255,0.35);border-radius:8px;padding:0 6px;color:#fff}
.brand{position:absolute;bottom:44px;font-size:22px;font-weight:600;color:rgba(255,255,255,0.35);letter-spacing:3px}
</style></head><body>
${BASE_DECOS_HTML}
${microDecoHtml(seed)}
<div class="wrap">
  ${isReflection ? '<div class="emoji">💭</div>' : ''}
  <div class="txt">${hlHtml(text, start, length)}</div>
</div>
<div class="brand">nuggeto</div>
</body></html>`;
}

// ─── Mapeo de palabras Whisper → posición en texto ────────────────────────────

function mapWords(displayText, whisperWords) {
  // Avanza un cursor para evitar re-matchear palabras ya procesadas
  const result = [];
  let cursor = 0;
  const lower = displayText.toLowerCase();

  for (const w of whisperWords) {
    const clean = w.word.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9]/g, '').toLowerCase();
    if (!clean) continue;
    const idx = lower.indexOf(clean, cursor);
    if (idx >= 0) {
      result.push({ start: idx, length: clean.length, time: w.start, endTime: w.end });
      cursor = idx + clean.length;
    }
  }
  return result;
}

// ─── Firebase ─────────────────────────────────────────────────────────────────

function initFirebase() {
  const sa = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  initializeApp({ credential: cert(sa) });
}

async function fetchML(id) {
  const db = getFirestore();
  const doc = await db.collection('microlearnings').doc(id).get();
  if (!doc.exists) throw new Error(`Microlearning no encontrado: ${id}`);
  return { id: doc.id, ...doc.data() };
}

// ─── ElevenLabs TTS ───────────────────────────────────────────────────────────

let elClient;

async function generateTTS(text, outPath) {
  const stream = await elClient.textToSpeech.convert(TTS_VOICE_ID, {
    text,
    model_id: TTS_EL_MODEL,
    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    output_format: 'mp3_44100_128',
  });
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  writeFileSync(outPath, Buffer.concat(chunks));
}

// ─── OpenAI (solo Whisper para timestamps) ────────────────────────────────────

let ai;

async function getTimestamps(audioPath) {
  const buf  = readFileSync(audioPath);
  const file = new File([buf], 'audio.mp3', { type: 'audio/mpeg' });
  const res  = await ai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
    language: 'es',
  });
  return res.words ?? [];
}

// ─── Rendering de frames ──────────────────────────────────────────────────────

async function renderFrames(browser, ml, slide, slideIdx, wordMap, gradient) {
  const displayText  = slideDisplayText(ml, slide);
  const isTitle      = slide.type === 'title';
  const isReflection = slide.type === 'reflection';
  const seed         = getVisualSeed(ml.tags, ml.title);

  // Primer keyframe sin highlight, luego uno por palabra
  const keyframes = [{ start: -1, length: 0, time: 0 }, ...wordMap];
  const frames    = [];
  const page      = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  for (let i = 0; i < keyframes.length; i++) {
    const kf = keyframes[i];
    const html = isTitle
      ? titleSlideHtml(ml, gradient, kf.start, kf.length, seed)
      : contentSlideHtml(displayText, gradient, kf.start, kf.length, isReflection, seed);

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const framePath = join(TEMP_DIR, `s${slideIdx}_f${String(i).padStart(3, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });

    const nextTime = i + 1 < keyframes.length ? keyframes[i + 1].time : null;
    const lastEnd  = wordMap.length > 0 ? (wordMap.at(-1).endTime + 0.4) : 3;
    const isLast   = i === keyframes.length - 1;
    const endPause = isTitle ? TITLE_SLIDE_END_PAUSE : SLIDE_END_PAUSE;
    const duration = nextTime != null
      ? (nextTime - kf.time)
      : (lastEnd - kf.time) + (isLast ? endPause : 0);

    frames.push({ path: framePath, duration: Math.max(0.08, duration) });
  }

  await page.close();
  return frames;
}

// ─── FFmpeg ───────────────────────────────────────────────────────────────────

function writeConcatFile(frames, outPath) {
  const lines = ['ffconcat version 1.0'];
  for (const f of frames) {
    lines.push(`file '${f.path.replace(/\\/g, '/')}'`);
    lines.push(`duration ${f.duration.toFixed(4)}`);
  }
  // ffconcat necesita repetir el último frame
  if (frames.length) lines.push(`file '${frames.at(-1).path.replace(/\\/g, '/')}'`);
  writeFileSync(outPath, lines.join('\n'));
}

const runFfmpeg = (cmd) =>
  new Promise((res, rej) => cmd.on('end', res).on('error', rej).run());

async function buildSlideVideo(concatPath, audioPath, outPath) {
  await runFfmpeg(
    ffmpeg()
      .input(concatPath).inputOptions(['-f', 'concat', '-safe', '0'])
      .input(audioPath)
      .outputOptions([
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k',
        '-shortest',
        '-movflags', '+faststart',
      ])
      .output(outPath)
  );
}

async function joinVideos(paths, outPath) {
  const listPath = join(TEMP_DIR, 'parts.txt');
  writeFileSync(listPath, paths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  await runFfmpeg(
    ffmpeg()
      .input(listPath).inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions([
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k',
        '-movflags', '+faststart',
      ])
      .output(outPath)
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🎬  Generando reel: ${ML_ID}\n`);

  initFirebase();
  ai       = new OpenAI({ apiKey: OPENAI_API_KEY });
  elClient = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

  console.log('📦  Fetching microlearning...');
  const ml = await fetchML(ML_ID);
  console.log(`    "${ml.title}"\n    ${ml.bookTitle} — ${ml.bookAuthor}\n`);

  const slides   = buildSlides(ml);
  const gradient = getGradient(ml.category);
  console.log(`📋  ${slides.length} slides (${slides.map(s => s.type).join(', ')})\n`);

  console.log('🌐  Iniciando browser...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  const parts = [];

  for (let i = 0; i < slides.length; i++) {
    const slide     = slides[i];
    const spoken    = slideSpokenText(ml, slide);
    const display   = slideDisplayText(ml, slide);
    const audioPath = join(TEMP_DIR, `s${i}.mp3`);
    const concatPath = join(TEMP_DIR, `s${i}.concat`);
    const partPath  = join(TEMP_DIR, `s${i}.mp4`);

    console.log(`━━  Slide ${i + 1}/${slides.length}  [${slide.type}]`);

    process.stdout.write('    🔊 TTS... ');
    await generateTTS(spoken, audioPath);
    console.log('✓');

    process.stdout.write('    📝 Whisper... ');
    const allWords = await getTimestamps(audioPath);
    console.log(`✓  (${allWords.length} palabras)`);

    // Para el slide de título, solo mapeamos las palabras del título (no del libro/autor)
    const titleWordCount = ml.title.split(/\s+/).length;
    const wordsToMap = slide.type === 'title'
      ? allWords.slice(0, titleWordCount)
      : allWords;

    const wordMap = mapWords(display, wordsToMap);

    process.stdout.write(`    🖼️  ${keyframeCount(wordMap)} frames... `);
    const frames = await renderFrames(browser, ml, slide, i, wordMap, gradient);
    console.log('✓');

    writeConcatFile(frames, concatPath);

    process.stdout.write('    🎞️  Ensamblando slide... ');
    await buildSlideVideo(concatPath, audioPath, partPath);
    console.log('✓\n');

    parts.push(partPath);
  }

  await browser.close();

  const outPath = join(OUTPUT_DIR, `${ML_ID}.mp4`);
  process.stdout.write('🔗  Uniendo slides... ');
  await joinVideos(parts, outPath);
  console.log('✓');

  console.log(`\n✅  Listo → ${outPath}\n`);
}

function keyframeCount(wordMap) { return wordMap.length + 1; }

main().catch(err => { console.error('\n❌', err.message ?? err); process.exit(1); });
