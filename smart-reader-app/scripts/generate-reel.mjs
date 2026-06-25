#!/usr/bin/env node
// Usage: OPENAI_API_KEY=sk-... node generate-reel.mjs <microlearning_id>
// Run from inside the scripts/ directory after: npm install
// Requires: firebase-service-account.json in the project root

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import OpenAI from 'openai';
import { ElevenLabsClient } from 'elevenlabs';
import puppeteer from 'puppeteer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

ffmpeg.setFfmpegPath(ffmpegPath);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');


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

function findVideoPath(mlId) {
  const flat = join(OUTPUT_DIR, `${mlId}.mp4`);
  if (existsSync(flat)) return flat;
  const loteFiles = readdirSync(OUTPUT_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name.startsWith('lote-'))
    .map(e => join(OUTPUT_DIR, e.name, `${mlId}.mp4`));
  return loteFiles.find(p => existsSync(p)) ?? flat;
}

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
// Segundos de pausa al final del hook (tiempo para que el gancho "pegue")
const HOOK_SLIDE_END_PAUSE = 3.5;
// Segundos de pausa al final del resto de slides
const SLIDE_END_PAUSE = 1.5;
// Segundos de pausa al final del CTA (tiempo para que se lea)
const CTA_SLIDE_END_PAUSE = 2.5;

// Texto fijo del CTA (debe coincidir con la app)
const CTA_TEXT = 'Dejá que el conocimiento te encuentre.';

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

function buildSlides(ml, hookText) {
  const slides = [];
  if (hookText) slides.push({ type: 'hook', text: hookText });
  slides.push({ type: 'title' });
  const content = (ml.content ?? '').trim();
  if (content) {
    const sentences = (content.match(/[^.!?]+[.!?]+/g) ?? [content])
      .map(s => s.trim()).filter(Boolean);
    for (const sentence of sentences) {
      slides.push({ type: 'content', text: sentence });
    }
  }
  if (ml.reflectionQuestion?.trim()) {
    slides.push({ type: 'reflection', text: ml.reflectionQuestion.trim() });
  }
  slides.push({ type: 'cta' });
  return slides;
}

// Texto que se habla (para TTS)
function slideSpokenText(ml, slide) {
  if (slide.type === 'title') return ml.title;
  if (slide.type === 'cta') return `Nuggeto. ${CTA_TEXT}`;
  return slide.text;
}

// Texto que se muestra en pantalla (para highlighting)
function slideDisplayText(ml, slide) {
  if (slide.type === 'title') return ml.title;
  if (slide.type === 'cta') return CTA_TEXT;
  return slide.text;
}


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

function titleSlideHtml(ml, gradient, start, length, seed, imageUrl) {
  const [c1, c2] = gradient;
  const bgCss = imageUrl
    ? `linear-gradient(135deg,${c1}99,${c2}99),url('${imageUrl}') center/cover no-repeat`
    : `linear-gradient(135deg,${c1},${c2})`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:${W}px;height:${H}px;overflow:hidden;
  background:${bgCss};
  font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 70px;
}
${DECO_CSS}
.wrap{display:flex;flex-direction:column;align-items:center;gap:50px;width:100%;text-align:center}
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
  <div class="title">${hlHtml(ml.title, start, length)}</div>
  <div class="divider"></div>
  <div class="book">${esc(ml.bookTitle)}</div>
  <div class="author">por ${esc(ml.bookAuthor)}</div>
</div>
<div class="brand">Nuggeto</div>
</body></html>`;
}

function contentSlideHtml(text, gradient, start, length, isReflection, isHook, seed, imageUrl) {
  const [c1, c2] = gradient;
  const bgCss = imageUrl
    ? `linear-gradient(135deg,${c1}99,${c2}99),url('${imageUrl}') center/cover no-repeat`
    : `linear-gradient(135deg,${c1},${c2})`;
  const fontSize = isReflection ? 44 : isHook ? 54 : 48;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:${W}px;height:${H}px;overflow:hidden;
  background:${bgCss};
  font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:100px 80px;
}
${DECO_CSS}
.wrap{display:flex;flex-direction:column;align-items:center;gap:44px;width:100%;text-align:center}
.emoji{font-size:160px;line-height:1}
.txt{
  font-size:${fontSize}px;
  font-weight:${isReflection ? 500 : 700};
  font-style:${isReflection ? 'italic' : 'normal'};
  color:#fff;line-height:1.45;letter-spacing:-0.3px;
  text-shadow:0 2px 16px rgba(0,0,0,0.55),0 1px 4px rgba(0,0,0,0.4);
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
<div class="brand">Nuggeto</div>
</body></html>`;
}

function ctaSlideHtml(gradient, start, length, seed, imageUrl) {
  const [c1, c2] = gradient;
  const bgCss = imageUrl
    ? `linear-gradient(135deg,${c1}cc,${c2}cc),url('${imageUrl}') center/cover no-repeat`
    : `linear-gradient(135deg,${c1},${c2})`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:${W}px;height:${H}px;overflow:hidden;
  background:${bgCss};
  font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:100px 80px;gap:60px;text-align:center;
}
${DECO_CSS}
.brand{font-size:100px;font-weight:800;color:#FF9500;letter-spacing:-3px}
.txt{font-size:44px;font-weight:500;color:rgba(255,255,255,0.92);line-height:1.4;
  text-shadow:0 2px 16px rgba(0,0,0,0.55),0 1px 4px rgba(0,0,0,0.4)}
mark{background:rgba(255,255,255,0.35);border-radius:8px;padding:0 6px;color:#fff}
.pill{border:2.5px solid rgba(255,255,255,0.5);border-radius:80px;
  padding:28px 70px;font-size:36px;font-weight:700;color:#fff;
  text-shadow:0 2px 8px rgba(0,0,0,0.4);background:rgba(255,255,255,0.14)}
.orange{color:#FF6E00}
</style></head><body>
${BASE_DECOS_HTML}
${microDecoHtml(seed)}
<div class="brand">Nuggeto</div>
<div class="txt">${hlHtml(CTA_TEXT, start, length)}</div>
<div class="pill">link en bio</div>
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

const STORAGE_BUCKET = 'smart-reader-app-3665c.firebasestorage.app';

function initFirebase() {
  const sa = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  initializeApp({ credential: cert(sa), storageBucket: STORAGE_BUCKET });
}

async function fetchML(id) {
  const db = getFirestore();
  const doc = await db.collection('microlearnings').doc(id).get();
  if (!doc.exists) throw new Error(`Microlearning no encontrado: ${id}`);
  return { id: doc.id, ...doc.data() };
}

async function uploadAudio(localPath, storagePath) {
  const bucket = getStorage().bucket(STORAGE_BUCKET);
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { contentType: 'audio/mpeg' },
  });
  // Guardamos el path (no URL) — la app lo resuelve con getDownloadURL
  return storagePath;
}

async function saveToFirestore(mlId, updates) {
  await getFirestore().collection('microlearnings').doc(mlId).update(updates);
}

// ─── Image generation ─────────────────────────────────────────────────────────

function buildImagePrompt(ml, gradient) {
  const [c1, c2] = gradient;
  const firstSentence = (ml.content ?? '').split(/[.!?]/)[0].trim();
  const concept = firstSentence || ml.title;
  return (
    `Minimalist digital illustration, full-screen background for a mobile app. ` +
    `Visual concept inspired by: "${concept}". ` +
    `Color palette: tones of ${c1} transitioning to ${c2}. ` +
    `Style: abstract, soft geometric shapes, symbolic imagery, clean modern design. ` +
    `CRITICAL REQUIREMENTS: ` +
    `(1) Full bleed — colors and shapes extend completely to every edge of the canvas, no empty space at any border. ` +
    `(2) No rounded corners, no card frame, no mockup, no device frame, no drop shadow, no vignette border. ` +
    `(3) No white or light background showing through at edges. ` +
    `(4) The illustration IS the background — it fills 100% of the image area. ` +
    `No text, no letters, no words anywhere. ` +
    `Mood: inspiring, thoughtful, calm. ` +
    `Portrait orientation 2:3, high quality.`
  );
}

async function generateAndUploadImage(ml, gradient) {
  const prompt = buildImagePrompt(ml, gradient);

  process.stdout.write('🎨  gpt-image-2... ');
  const response = await ai.images.generate({
    model: 'gpt-image-2',
    prompt,
    n: 1,
    size: '1024x1536',
    quality: 'medium',
  });
  console.log('✓');

  const b64 = response.data[0].b64_json;
  const localPath = join(TEMP_DIR, 'cover.png');
  process.stdout.write('    💾 Guardando imagen... ');
  writeFileSync(localPath, Buffer.from(b64, 'base64'));
  console.log('✓');

  const storagePath = `images/microlearnings/${ML_ID}.png`;
  const bucket = getStorage().bucket(STORAGE_BUCKET);
  process.stdout.write('    ☁️  Subiendo... ');
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { contentType: 'image/png' },
  });
  await bucket.file(storagePath).makePublic();
  console.log('✓');

  return `https://storage.googleapis.com/${STORAGE_BUCKET}/${storagePath}`;
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

function imageToDataUrl(imagePath) {
  if (!imagePath || !existsSync(imagePath)) return null;
  const ext = imagePath.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${readFileSync(imagePath).toString('base64')}`;
}

async function renderFrames(browser, ml, slide, slideIdx, wordMap, gradient, imageUrl) {
  const displayText  = slideDisplayText(ml, slide);
  const isTitle      = slide.type === 'title';
  const isReflection = slide.type === 'reflection';
  const isHook       = slide.type === 'hook';
  const isCta        = slide.type === 'cta';
  const seed         = getVisualSeed(ml.tags, ml.title);

  // Primer keyframe sin highlight, luego uno por palabra
  const keyframes = [{ start: -1, length: 0, time: 0 }, ...wordMap];
  const frames    = [];
  const page      = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  for (let i = 0; i < keyframes.length; i++) {
    const kf = keyframes[i];
    const html = isTitle
      ? titleSlideHtml(ml, gradient, kf.start, kf.length, seed, imageUrl)
      : isCta
      ? ctaSlideHtml(gradient, kf.start, kf.length, seed, imageUrl)
      : contentSlideHtml(displayText, gradient, kf.start, kf.length, isReflection, isHook, seed, imageUrl);

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const framePath = join(TEMP_DIR, `s${slideIdx}_f${String(i).padStart(3, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });

    const nextTime = i + 1 < keyframes.length ? keyframes[i + 1].time : null;
    const lastEnd  = wordMap.length > 0 ? (wordMap.at(-1).endTime + 0.4) : 3;
    const isLast   = i === keyframes.length - 1;
    const endPause = isTitle ? TITLE_SLIDE_END_PAUSE : isHook ? HOOK_SLIDE_END_PAUSE : isCta ? CTA_SLIDE_END_PAUSE : SLIDE_END_PAUSE;
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

// ─── YouTube publishing ───────────────────────────────────────────────────────

async function getYouTubeAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`YouTube token error: ${data.error_description}`);
  return data.access_token;
}

async function publishToYouTube(localPath, title, description, tags = [], scheduledAt = null) {
  const accessToken = await getYouTubeAccessToken();
  const fileBuffer  = readFileSync(localPath);
  const fileSize    = fileBuffer.length;

  // Step 1: iniciar upload resumable
  process.stdout.write('▶️  Iniciando upload a YouTube... ');
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': String(fileSize),
      },
      body: JSON.stringify({
        snippet: {
          title: `${title} #Shorts`,
          description: `${description}\n\n#Shorts`,
          categoryId: '27', // Education
          tags,
          defaultLanguage: 'es',
          defaultAudioLanguage: 'es',
        },
        status: {
          privacyStatus: scheduledAt ? 'private' : 'public',
          ...(scheduledAt ? { publishAt: scheduledAt.toISOString() } : {}),
          selfDeclaredMadeForKids: false,
        },
      }),
    }
  );
  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) {
    const body = await initRes.text().catch(() => '(sin body)');
    throw new Error(`YouTube no devolvió URL de upload (HTTP ${initRes.status}): ${body}`);
  }
  console.log('✓');

  // Step 2: subir el archivo
  process.stdout.write('⬆️  Subiendo video a YouTube... ');
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(fileSize),
    },
    body: fileBuffer,
  });
  const uploadData = await uploadRes.json();
  if (uploadData.error) throw new Error(`YouTube API: ${uploadData.error.message}`);
  console.log('✓');

  // Step 3: setear thumbnail con el hook (primer frame del video)
  const thumbPath = join(TEMP_DIR, '_thumb.jpg');
  await new Promise((resolve, reject) => {
    ffmpeg(localPath)
      .seekInput(0.5)
      .frames(1)
      .output(thumbPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
  process.stdout.write('🖼️  Seteando thumbnail en YouTube... ');
  const thumbBuffer = readFileSync(thumbPath);
  const thumbRes = await fetch(
    `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${uploadData.id}&uploadType=media`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'image/jpeg' },
      body: thumbBuffer,
    }
  );
  const thumbData = await thumbRes.json();
  if (thumbData.error) console.log(`⚠️  Thumbnail falló: ${thumbData.error.message}`);
  else console.log('✓');

  return uploadData.id;
}

// ─── Instagram publishing ─────────────────────────────────────────────────────

async function uploadVideoToStorage(localPath) {
  const storagePath = `reels/${ML_ID}.mp4`;
  const bucket = getStorage().bucket(STORAGE_BUCKET);
  process.stdout.write('    ☁️  Subiendo video a Firebase... ');
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: { contentType: 'video/mp4' },
  });
  await bucket.file(storagePath).makePublic();
  console.log('✓');
  return `https://storage.googleapis.com/${STORAGE_BUCKET}/${storagePath}`;
}

async function publishToInstagram(videoUrl, caption, scheduledAt = null) {
  const igUserId = process.env.META_IG_USER_ID;
  const token    = process.env.META_PAGE_TOKEN;

  process.stdout.write('📱  Creando contenedor en Instagram... ');
  const createRes  = await fetch(`https://graph.facebook.com/v25.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS', video_url: videoUrl, caption, share_to_feed: true, access_token: token,
      ...(scheduledAt ? { published: false, scheduled_publish_time: Math.floor(scheduledAt.getTime() / 1000) } : {}),
    }),
  });
  const createData = await createRes.json();
  if (createData.error) throw new Error(`Meta API: ${createData.error.message} (code: ${createData.error.code}, subcode: ${createData.error.error_subcode}, type: ${createData.error.type})\nFull: ${JSON.stringify(createData.error)}`);
  const containerId = createData.id;
  console.log(`✓ (id: ${containerId})`);

  process.stdout.write('⏳  Procesando video en Instagram');
  let status = 'IN_PROGRESS';
  while (status === 'IN_PROGRESS') {
    await new Promise(r => setTimeout(r, 8000));
    const r = await fetch(`https://graph.facebook.com/v25.0/${containerId}?fields=status_code&access_token=${token}`);
    const d = await r.json();
    status = d.status_code ?? 'IN_PROGRESS';
    process.stdout.write('.');
    if (status === 'ERROR') throw new Error('Error procesando video en Instagram');
  }
  console.log(` ✓ (${status})`);
  if (status !== 'FINISHED') throw new Error(`Estado inesperado del contenedor: ${status}`);

  process.stdout.write('🚀  Publicando reel... ');
  const pubRes  = await fetch(`https://graph.facebook.com/v25.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerId, access_token: token }),
  });
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(`Meta API: ${pubData.error.message}`);
  console.log('✓');
  return pubData.id;
}

// ─── Hook generation ──────────────────────────────────────────────────────────

async function generateHook(ml) {
  const firstSentence = (ml.content ?? '').split(/[.!?]/)[0].trim();
  const res = await ai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content:
        `Generá un gancho de 1 línea para un reel de Instagram sobre este tema.\n` +
        `Título: ${ml.title}\n` +
        `Primera idea: ${firstSentence}\n\n` +
        `Requisitos:\n` +
        `- Máximo 10 palabras\n` +
        `- Una pregunta intrigante O una afirmación audaz que genere curiosidad\n` +
        `- NO menciones el libro ni el autor\n` +
        `- Escribí en español (Argentina)\n` +
        `- Devolvé SOLO el texto del gancho, sin comillas ni explicaciones`,
    }],
    max_tokens: 60,
  });
  return res.choices[0].message.content.trim();
}

// ─── Instagram caption ────────────────────────────────────────────────────────

async function generateCaption(ml) {
  const res = await ai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content:
        `Sos un experto en marketing de redes sociales para apps de lectura y desarrollo personal.\n` +
        `Generá una descripción para un reel de Instagram basado en este microlearning:\n\n` +
        `Título: ${ml.title}\n` +
        `Libro: ${ml.bookTitle}\n` +
        `Autor: ${ml.bookAuthor}\n` +
        `Contenido: ${(ml.content ?? '').slice(0, 400)}\n` +
        `Pregunta de reflexión: ${ml.reflectionQuestion ?? ''}\n\n` +
        `Contexto de la app: Nuggeto es una app para dejar de scrollear sin sentido y empezar a consumir ` +
        `"nuggets de conocimiento" — ideas poderosas de los mejores libros, en formato breve y digerible. ` +
        `La idea es que en el tiempo que scrolleás, podés aprender algo que cambia cómo pensás.\n\n` +
        `Requisitos:\n` +
        `- Escribí en español, tono inspirador pero cercano\n` +
        `- Empezá con un gancho corto que genere curiosidad (1-2 líneas)\n` +
        `- Hacé referencia natural a los nuggets de conocimiento o a la idea de aprender mientras scrolleás\n` +
        `- Terminá con una llamada a la acción mencionando "🔗 link en bio" para descargar Nuggeto\n` +
        `- Terminá con 10 a 15 hashtags relevantes en minúscula: mezcla de hashtags amplios (#desarrollopersonal #lectura #libros #habitos) y específicos del tema del libro y el autor\n` +
        `- Máximo 180 palabras en total (sin contar hashtags), máximo 3 emojis\n` +
        `- Devolvé SOLO la descripción, sin explicaciones adicionales`,
    }],
    max_tokens: 400,
  });
  return res.choices[0].message.content.trim();
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

// 09:09, 13:13, 22:22 hora Argentina (UTC-3)
const SLOT_SLOTS_UTC = [
  { h:  1, m: 22 }, // 22:22 ARG → 01:22 UTC
  { h: 12, m:  9 }, // 09:09 ARG → 12:09 UTC
  { h: 16, m: 13 }, // 13:13 ARG → 16:13 UTC
];

function loadSchedule() {
  try { return JSON.parse(readFileSync(new URL('./schedule.json', import.meta.url))); }
  catch { return { slots: [] }; }
}

function saveSchedule(s) {
  writeFileSync(new URL('./schedule.json', import.meta.url), JSON.stringify(s, null, 2), 'utf8');
}

function nextAvailableSlot(schedule) {
  const taken  = new Set(schedule.slots.map(s => s.scheduledAt));
  const minTime = new Date(Date.now() + 15 * 60 * 1000); // al menos 15 min en el futuro
  const now    = new Date();
  for (let day = 0; day <= 30; day++) {
    for (const { h, m } of SLOT_SLOTS_UTC) {
      const slot = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + day, h, m, 0));
      if (slot > minTime && !taken.has(slot.toISOString())) return slot;
    }
  }
  throw new Error('No hay slots libres en los próximos 30 días');
}

function printCalendar(schedule) {
  if (!schedule.slots.length) return;
  const arOpts = { timeZone: 'America/Argentina/Buenos_Aires' };
  const dayKey = d => new Date(d).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit', ...arOpts });
  const timeStr = d => new Date(d).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', ...arOpts });
  const byDay = {};
  for (const s of schedule.slots) {
    const k = dayKey(s.scheduledAt);
    (byDay[k] = byDay[k] ?? []).push(s);
  }
  console.log('\n📅  Calendario de publicación');
  console.log('─'.repeat(58));
  for (const [day, slots] of Object.entries(byDay)) {
    console.log(` ${day}`);
    for (const s of slots) {
      const plat  = [s.yt && 'YT', s.ig && 'IG'].filter(Boolean).join('+') || '?';
      const title = (s.title ?? s.mlId ?? '').slice(0, 36);
      console.log(`   ✅  ${timeStr(s.scheduledAt)}  [${plat}]  ${title}`);
    }
  }
  console.log('─'.repeat(58) + '\n');
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

  const gradient = getGradient(ml.category);
  const firestoreUpdates = {};

  let hookText;
  if (ml.hookText?.trim()) {
    hookText = ml.hookText.trim();
    console.log(`💡  Gancho existente: "${hookText}"\n`);
  } else {
    process.stdout.write('💡  Generando gancho... ');
    hookText = await generateHook(ml);
    console.log(`✓  "${hookText}"\n`);
    firestoreUpdates.hookText = hookText;
  }

  const slides = buildSlides(ml, hookText);

  const hasAudio = Array.isArray(ml.audioSlides) && ml.audioSlides.length === slides.length;

  // ── Flags ─────────────────────────────────────────────────────────────────────
  const forceAll   = process.argv.includes('--force');
  const forceVideo = forceAll || process.argv.includes('--force-video');
  const forceImage = forceAll || process.argv.includes('--force-image');

  // ── Imagen ────────────────────────────────────────────────────────────────────
  let effectiveImageUrl = ml.microlearningImageUrl ?? null;
  if (effectiveImageUrl && !forceImage) {
    console.log(`🖼️  Imagen ya existe, omitiendo generación.\n`);
  } else {
    console.log('🎨  Generando imagen de portada...');
    effectiveImageUrl = await generateAndUploadImage(ml, gradient);
    firestoreUpdates.microlearningImageUrl = effectiveImageUrl;
    console.log();
  }

  // ── Reel + Audio ──────────────────────────────────────────────────────────────
  const outPath    = findVideoPath(ML_ID);
  if (forceVideo && existsSync(outPath)) {
    const { unlinkSync } = await import('fs');
    unlinkSync(outPath);
  }
  const videoExists = existsSync(outPath);

  if (hasAudio && videoExists) {
    console.log('⏭️  Audio y video ya existen, omitiendo generación.\n');
  } else {
    console.log(`📋  ${slides.length} slides (${slides.map(s => s.type).join(', ')})\n`);
    console.log('🌐  Iniciando browser...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

    const parts       = [];
    const audioSlides = [];

    for (let i = 0; i < slides.length; i++) {
      const slide      = slides[i];
      const display    = slideDisplayText(ml, slide);
      const audioPath  = join(TEMP_DIR, `s${i}.mp3`);
      const concatPath = join(TEMP_DIR, `s${i}.concat`);
      const partPath   = join(TEMP_DIR, `s${i}.mp4`);

      console.log(`━━  Slide ${i + 1}/${slides.length}  [${slide.type}]`);

      let wordMap;

      if (hasAudio) {
        // Siempre descargar desde Firebase — el cache local puede ser de una corrida
        // anterior sin hook, causando que cada slide muestre el audio del siguiente.
        process.stdout.write('    ⬇️  Descargando audio... ');
        const storagePath = ml.audioSlides[i].audioPath;
        await getStorage().bucket(STORAGE_BUCKET).file(storagePath).download({ destination: audioPath });
        console.log('✓');
        // update-hooks.mjs genera audio con texto diferente al display text:
        //   title → "Título. Libro, por Autor"  (display: solo "Título")
        //   cta   → "Nagueto. Dejá que..."      (display: "Dejá que...")
        // El offset corrige los charIndex del CTA para que el karaoke sea correcto.
        const ctaOffset = slide.type === 'cta' ? 'Nagueto. '.length : 0;
        wordMap = (ml.audioSlides[i].words ?? []).map(w => ({
          start: w.charIndex - ctaOffset, length: w.charLength, time: w.time, endTime: w.endTime,
        }));
      } else {
        // Generar TTS + timestamps desde cero
        process.stdout.write('    🔊 TTS... ');
        await generateTTS(slideSpokenText(ml, slide), audioPath);
        console.log('✓');

        process.stdout.write('    📝 Whisper... ');
        const allWords = await getTimestamps(audioPath);
        console.log(`✓  (${allWords.length} palabras)`);

        const titleWordCount = ml.title.split(/\s+/).length;
        const wordsToMap = slide.type === 'title' ? allWords.slice(0, titleWordCount) : allWords;
        wordMap = mapWords(display, wordsToMap);

        process.stdout.write('    ☁️  Subiendo audio... ');
        const storagePath = await uploadAudio(audioPath, `audio/microlearnings/${ML_ID}/slide_${i}.mp3`);
        console.log('✓');

        audioSlides.push({
          type: slide.type,
          audioPath: storagePath,
          words: wordMap.map(w => ({ charIndex: w.start, charLength: w.length, time: w.time, endTime: w.endTime })),
        });
      }

      process.stdout.write(`    🖼️  ${keyframeCount(wordMap)} frames... `);
      const localImagePath = join(TEMP_DIR, 'cover.png');
      const imageDataUrl = imageToDataUrl(localImagePath) ?? effectiveImageUrl;
      const frames = await renderFrames(browser, ml, slide, i, wordMap, gradient, imageDataUrl);
      console.log('✓');

      writeConcatFile(frames, concatPath);

      process.stdout.write('    🎞️  Ensamblando slide... ');
      await buildSlideVideo(concatPath, audioPath, partPath);
      console.log('✓\n');

      parts.push(partPath);
    }

    await browser.close();

    process.stdout.write('🔗  Uniendo slides... ');
    await joinVideos(parts, outPath);
    console.log('✓');

    if (audioSlides.length > 0) firestoreUpdates.audioSlides = audioSlides;
    console.log(`\n📹  Reel → ${outPath}\n`);
  }

  // ── Guardar en Firestore ──────────────────────────────────────────────────────
  if (Object.keys(firestoreUpdates).length > 0) {
    process.stdout.write('💾  Guardando en Firestore... ');
    await saveToFirestore(ML_ID, firestoreUpdates);
    console.log('✓');
  }

  // ── Descripción para Instagram ──────────────────────────────────────────────
  const captionPath = join(OUTPUT_DIR, `${ML_ID}.txt`);
  if (existsSync(captionPath)) {
    console.log('📝  Descripción ya existe:');
    console.log('\n' + readFileSync(captionPath, 'utf8') + '\n');
  } else {
    process.stdout.write('📝  Generando descripción para Instagram... ');
    const caption = await generateCaption(ml);
    writeFileSync(captionPath, caption, 'utf8');
    console.log('✓\n');
    console.log('── Descripción ──────────────────────────────────────────────');
    console.log(caption);
    console.log('─────────────────────────────────────────────────────────────\n');
  }

  // ── Publicar ─────────────────────────────────────────────────────────────────
  const shouldPublish   = process.argv.includes('--publish');
  const shouldPublishYT = process.argv.includes('--publish-yt');
  const publishNow      = process.argv.includes('--now');

  if (shouldPublish || shouldPublishYT) {
    const schedule = loadSchedule();
    const slot     = publishNow ? null : nextAvailableSlot(schedule);

    if (slot) {
      const slotAR = slot.toLocaleString('es-AR', {
        weekday: 'short', day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires',
      });
      console.log(`\n📅  Programando para ${slotAR} (AR)\n`);
    }

    let igId = null, ytId = null;

    if (shouldPublish) {
      if (ml.igPostId && !publishNow) {
        console.log(`⏭️  IG ya publicado (${ml.igPostId}), omitiendo.\n`);
      } else if (!process.env.META_PAGE_TOKEN || !process.env.META_IG_USER_ID) {
        console.log('⚠️  META_PAGE_TOKEN o META_IG_USER_ID no configurados, omitiendo.\n');
      } else if (!existsSync(outPath)) {
        console.log('⚠️  No hay video para publicar en IG.\n');
      } else {
        const caption        = existsSync(captionPath) ? readFileSync(captionPath, 'utf8') : '';
        const videoPublicUrl = await uploadVideoToStorage(outPath);
        igId = await publishToInstagram(videoPublicUrl, caption, slot);
        console.log(`\n📱  ${slot ? 'Programado en IG' : 'Publicado en IG'}! ID: ${igId}\n`);
      }
    }

    if (shouldPublishYT) {
      if (ml.ytVideoId && !publishNow) {
        console.log(`⏭️  YT ya publicado (${ml.ytVideoId}), omitiendo.\n`);
      } else if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_REFRESH_TOKEN) {
        console.log('⚠️  YOUTUBE_CLIENT_ID / YOUTUBE_REFRESH_TOKEN no configurados, omitiendo.\n');
      } else if (!existsSync(outPath)) {
        console.log('⚠️  No hay video para publicar en YT.\n');
      } else {
        const caption = existsSync(captionPath) ? readFileSync(captionPath, 'utf8') : '';
        const mlTags  = [
          ...(Array.isArray(ml.tags) ? ml.tags : []),
          ml.bookTitle, ml.bookAuthor,
          'Shorts', 'resumen', 'lectura', 'habitos', 'desarrollo personal',
        ].filter(Boolean);
        ytId = await publishToYouTube(outPath, ml.title, caption, mlTags, slot);
        console.log(`\n▶️   ${slot ? 'Programado en YT' : 'Publicado en YT'}! ID: ${ytId}`);
        if (!slot) console.log(`    https://youtube.com/shorts/${ytId}`);
        console.log();
        await uploadVideoToStorage(outPath);
      }
    }

    if (igId || ytId) {
      const publishUpdates = {};
      if (ytId)  publishUpdates.ytVideoId    = ytId;
      if (igId)  publishUpdates.igPostId     = igId;
      if (slot)  publishUpdates.scheduledAt  = slot.toISOString();
      if (ytId && existsSync(captionPath)) publishUpdates.igCaption = readFileSync(captionPath, 'utf8');
      process.stdout.write('💾  Guardando publicación en Firestore... ');
      await saveToFirestore(ML_ID, publishUpdates);
      console.log('✓');
    }

    if ((igId || ytId) && slot) {
      schedule.slots.push({
        scheduledAt: slot.toISOString(),
        mlId: ML_ID,
        title: ml.title,
        ...(ytId ? { yt: ytId } : {}),
        ...(igId ? { ig: igId } : {}),
      });
      schedule.slots.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
      saveSchedule(schedule);
    }

    printCalendar(schedule);
  }

  console.log('\n✅  Listo\n');
}

function keyframeCount(wordMap) { return wordMap.length + 1; }

main().catch(err => { console.error('\n❌', err.message ?? err); process.exit(1); });
