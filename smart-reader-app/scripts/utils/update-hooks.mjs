#!/usr/bin/env node
// Genera hooks virales con GPT-4 y regenera audioSlides con ElevenLabs
// Uso: node update-hooks.mjs [ml_id]   → un ID
//      node update-hooks.mjs            → lee scripts/batch.txt

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }        from 'firebase-admin/firestore';
import { getStorage }          from 'firebase-admin/storage';
import { readFileSync, existsSync } from 'fs';
import { join, dirname }       from 'path';
import { fileURLToPath }       from 'url';
import OpenAI                  from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '../..');

const OPENAI_API_KEY    = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const TTS_VOICE_ID      = 'XrExE9yKIg1WjnnlVkGX'; // Valentina
const TTS_MODEL         = 'eleven_multilingual_v2';
const STORAGE_BUCKET    = 'smart-reader-app-3665c.firebasestorage.app';
const CTA_TEXT          = 'Dejá que el conocimiento te encuentre.';

if (!OPENAI_API_KEY)     { console.error('Falta OPENAI_API_KEY');     process.exit(1); }
if (!ELEVENLABS_API_KEY) { console.error('Falta ELEVENLABS_API_KEY'); process.exit(1); }

const sa = JSON.parse(readFileSync(join(ROOT, 'firebase-service-account.json')));
let _fb = false;
function ensureFirebase() {
  if (!_fb) { initializeApp({ credential: cert(sa), storageBucket: STORAGE_BUCKET }); _fb = true; }
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ─── Slides ───────────────────────────────────────────────────────────────────

function buildSlides(ml, hookText) {
  const slides = [];
  if (hookText?.trim()) slides.push({ type: 'hook', text: hookText.trim() });
  slides.push({ type: 'title', text: `${ml.title}. ${ml.bookTitle}, por ${ml.bookAuthor}` });
  const sentences = (ml.content ?? '').trim().match(/[^.!?]+[.!?]+/g) ?? [(ml.content ?? '').trim()];
  for (const s of sentences.map(s => s.trim()).filter(Boolean)) {
    slides.push({ type: 'content', text: s });
  }
  if (ml.reflectionQuestion?.trim()) {
    slides.push({ type: 'reflection', text: ml.reflectionQuestion.trim() });
  }
  slides.push({ type: 'cta', text: `Nagueto. ${CTA_TEXT}` });
  return slides;
}

// ─── Hook generation ──────────────────────────────────────────────────────────

async function generateBestHook(ml) {
  const system = `Actúa como un copywriter especializado en contenido viral de microlearning para Reels.

NEGATIVO — jamás hagas esto:
- No uses las palabras: "descubre", "aprende", "te enseño", "libro", "lección", "módulo", "contenido"
- No empieces con "Hoy vamos a...", "En este video...", "Bienvenido a..."
- No uses tono de profesor o presentador
- No hagas preguntas retóricas vacías como "¿Sabías que...?"
- No prometas cosas vagas como "cambiar tu vida" o "transformarte"
- No uses superlativos sin respaldo: "increíble", "brutal", "revolucionario"`;

  const user = `Tema: ${ml.title}
Contexto: ${(ml.content ?? '').slice(0, 400)}
Libro: "${ml.bookTitle}" de ${ml.bookAuthor}
Categoría: ${ml.category}

Genera 5 ganchos de apertura (primeros 3 segundos de un Reel) que:
- Usen una de estas estructuras: paradoja, promesa específica, curiosity gap o identidad
- Sean conversacionales, no académicos
- Generen incomodidad o urgencia, no curiosidad pasiva
- Si el contenido menciona números o datos concretos, úsalos; si no, no los inventes
- Máximo 2 oraciones cortas por gancho

Respondé SOLO con JSON válido:
{
  "hooks": [
    { "text": "...", "trigger": "...", "why": "..." },
    { "text": "...", "trigger": "...", "why": "..." },
    { "text": "...", "trigger": "...", "why": "..." },
    { "text": "...", "trigger": "...", "why": "..." },
    { "text": "...", "trigger": "...", "why": "..." }
  ],
  "best": 0
}
"best" = índice (0-4) del gancho más efectivo para detener el scroll.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    response_format: { type: 'json_object' },
    temperature: 0.85,
  });

  const data = JSON.parse(res.choices[0].message.content);
  return { hooks: data.hooks, best: data.hooks[data.best ?? 0] };
}

// ─── ElevenLabs TTS con timestamps ───────────────────────────────────────────

function charAlignToWords(text, chars, startTimes, endTimes) {
  // Mapear posición en texto → tiempo de inicio/fin
  const posMap = new Map();
  let pos = 0;
  for (let i = 0; i < chars.length; i++) {
    posMap.set(pos, { start: startTimes[i] ?? 0, end: endTimes[i] ?? 0 });
    pos += chars[i].length;
  }

  const words = [];
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const wStart = match.index;
    const wLen   = match[0].length;
    const wEnd   = wStart + wLen - 1;
    const tStart = posMap.get(wStart)?.start ?? 0;
    let tEnd = tStart;
    for (let p = wEnd; p >= wStart; p--) {
      if (posMap.has(p)) { tEnd = posMap.get(p).end; break; }
    }
    words.push({ charIndex: wStart, charLength: wLen, time: tStart, endTime: tEnd });
  }
  return words;
}

async function generateAudio(text) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${TTS_VOICE_ID}/with-timestamps`,
    {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: TTS_MODEL,
        voice_settings: { stability: 0.45, similarity_boost: 0.80, style: 0.3 },
      }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const audioBuffer = Buffer.from(data.audio_base64, 'base64');
  const { characters, character_start_times_seconds, character_end_times_seconds } = data.alignment;
  const words = charAlignToWords(text, characters, character_start_times_seconds, character_end_times_seconds);
  return { audioBuffer, words };
}

// ─── Upload ───────────────────────────────────────────────────────────────────

async function uploadAudio(mlId, slideIdx, audioBuffer) {
  const storagePath = `audio/microlearnings/${mlId}/slide_${slideIdx}.mp3`;
  const file = getStorage().bucket(STORAGE_BUCKET).file(storagePath);
  await file.save(audioBuffer, { contentType: 'audio/mpeg', resumable: false });
  return storagePath;
}

// ─── Procesar un ML ───────────────────────────────────────────────────────────

async function processML(mlId, hooksOnly = false, ctaOnly = false, skipExisting = false) {
  ensureFirebase();
  const db  = getFirestore();
  const ref = db.collection('microlearnings').doc(mlId);

  console.log(`\n┌─ [${mlId}]`);

  const snap = await ref.get();
  if (!snap.exists) throw new Error('No encontrado en Firestore');
  const ml = { id: snap.id, ...snap.data() };
  console.log(`│  📖  "${ml.title}" — ${ml.bookTitle}`);

  if (skipExisting && ml.hookText?.trim()) {
    console.log('│  ⏭️   Ya tiene audio, saltando');
    console.log('└─ OK\n');
    return;
  }

  // ── CTA only: solo regenera el slide CTA ─────────────────────────────────
  if (ctaOnly) {
    const existing = ml.audioSlides;
    if (!Array.isArray(existing) || existing.length === 0) {
      throw new Error('No tiene audioSlides — corré sin --cta-only primero');
    }
    const ctaIdx = existing.findIndex(s => s.type === 'cta');
    if (ctaIdx === -1) throw new Error('No se encontró slide CTA en audioSlides');

    const ctaText = `Nagueto. ${CTA_TEXT}`;
    process.stdout.write(`│  🔊  CTA (slide ${ctaIdx + 1}) `);
    const { audioBuffer, words } = await generateAudio(ctaText);
    const audioPath = await uploadAudio(mlId, ctaIdx, audioBuffer);
    existing[ctaIdx] = { type: 'cta', audioPath, words };

    process.stdout.write('│  💾  Guardando en Firestore... ');
    await ref.update({ audioSlides: existing });
    console.log('✓');
    console.log('└─ OK\n');
    return;
  }

  // 1. Hooks
  process.stdout.write('│  🧠  Generando hooks con GPT-4... ');
  const { hooks, best } = await generateBestHook(ml);
  console.log('✓');
  console.log(`│     → "${best.text.slice(0, 70)}"`);
  console.log(`│       Trigger: ${best.trigger}`);

  // 2. Slides
  const slides = buildSlides(ml, best.text);
  console.log(`│  📋  ${slides.length} slides`);

  if (hooksOnly) {
    process.stdout.write('│  💾  Guardando hookText en Firestore... ');
    await ref.update({ hookText: best.text });
    console.log('✓');
    console.log('└─ OK\n');
    return;
  }

  // 3. Audio por slide
  const audioSlides = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    process.stdout.write(`│  🔊  [${i + 1}/${slides.length}] ${slide.type.padEnd(10)} `);
    const { audioBuffer, words } = await generateAudio(slide.text);
    const audioPath = await uploadAudio(mlId, i, audioBuffer);
    audioSlides.push({ type: slide.type, audioPath, words });
    console.log('✓');
  }

  // 4. Guardar en Firestore
  process.stdout.write('│  💾  Guardando en Firestore... ');
  await ref.update({ hookText: best.text, audioSlides });
  console.log('✓');
  console.log('└─ OK\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args         = process.argv.slice(2);
  const hooksOnly    = args.includes('--hooks-only');
  const ctaOnly      = args.includes('--cta-only');
  const skipExisting = args.includes('--skip-existing');
  const allMLs       = args.includes('--all');
  const limitArg  = args.find(a => a.startsWith('--limit=') || a === '--limit');
  const limitIdx  = args.indexOf('--limit');
  const limit     = limitArg?.includes('=')
    ? parseInt(limitArg.split('=')[1])
    : limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : null;
  const singleId  = args.find(a => !a.startsWith('--') && isNaN(Number(a)));
  let ids = [];

  if (allMLs) {
    ensureFirebase();
    console.log('\n📦  Cargando todos los microlearnings de Firestore...');
    const snap = await getFirestore().collection('microlearnings').get();
    ids = snap.docs.map(d => d.id);
    if (limit) ids = ids.slice(0, limit);
  } else if (singleId) {
    ids = [singleId];
  } else {
    const batchFile = join(__dirname, '..', 'batch.txt');
    if (!existsSync(batchFile)) {
      console.error('Sin argumento, sin --all y sin batch.txt');
      process.exit(1);
    }
    ids = readFileSync(batchFile, 'utf8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));
  }

  console.log(`\n🎯  ${ids.length} microlearning(s) a procesar${hooksOnly ? ' (solo hooks, sin audio)' : ''}${limit ? ` (límite: ${limit})` : ''}`);

  let ok = 0, fail = 0;
  for (const id of ids) {
    try {
      await processML(id, hooksOnly, ctaOnly, skipExisting);
      ok++;
    } catch (err) {
      console.error(`\n❌  [${id}] ${err.message}\n`);
      fail++;
    }
  }

  console.log(`✅  Listo: ${ok} OK  /  ${fail} con error\n`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
