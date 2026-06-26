#!/usr/bin/env node
// Publica un reel en Instagram usando el video ya subido a Firebase Storage.
// Uso: node publish-ig.mjs <microlearning_id>

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ML_ID = process.argv[2];
if (!ML_ID) {
  console.error('\nUso: node publish-ig.mjs <microlearning_id>\n');
  process.exit(1);
}

const STORAGE_BUCKET  = 'smart-reader-app-3665c.firebasestorage.app';
const STORAGE_PATH    = `reels/${ML_ID}.mp4`;
const SERVICE_ACCOUNT = join(ROOT, 'firebase-service-account.json');

const sa = JSON.parse(readFileSync(SERVICE_ACCOUNT, 'utf-8'));
initializeApp({ credential: cert(sa), storageBucket: STORAGE_BUCKET });

const db     = getFirestore();
const bucket = getStorage().bucket(STORAGE_BUCKET);

// ── Leer datos del ML desde Firestore ────────────────────────────────────────
const snap = await db.collection('microlearnings').doc(ML_ID).get();
if (!snap.exists) {
  console.error(`❌ Microlearning ${ML_ID} no encontrado en Firestore.`);
  process.exit(1);
}
const ml = snap.data();

if (ml.igPostId) {
  console.log(`⏭️  Ya publicado en IG (${ml.igPostId}), nada que hacer.`);
  process.exit(0);
}

if (!ml.igCaption) {
  console.error(`❌ No hay igCaption en Firestore para ${ML_ID}. Corré --publish-yt primero.`);
  process.exit(1);
}

// ── Verificar que el video existe en Storage ──────────────────────────────────
const [exists] = await bucket.file(STORAGE_PATH).exists();
if (!exists) {
  console.error(`❌ No hay video en Firebase Storage: ${STORAGE_PATH}`);
  process.exit(1);
}
const videoUrl = `https://storage.googleapis.com/${STORAGE_BUCKET}/${STORAGE_PATH}`;

// ── Publicar en Instagram ─────────────────────────────────────────────────────
const igUserId = process.env.META_IG_USER_ID;
const token    = process.env.META_PAGE_TOKEN;
if (!igUserId || !token) {
  console.error('❌ Faltan env vars: META_IG_USER_ID, META_PAGE_TOKEN');
  process.exit(1);
}

console.log(`\n📱  Publicando ${ML_ID} en Instagram...`);
console.log(`    Video: ${videoUrl}\n`);

process.stdout.write('📱  Creando contenedor... ');
const createRes = await fetch(`https://graph.facebook.com/v25.0/${igUserId}/media`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    media_type: 'REELS', video_url: videoUrl,
    caption: ml.igCaption, share_to_feed: true, access_token: token,
  }),
});
const createData = await createRes.json();
if (createData.error) {
  throw new Error(`Meta API: ${createData.error.message} (code: ${createData.error.code})`);
}
const containerId = createData.id;
console.log(`✓ (id: ${containerId})`);

process.stdout.write('⏳  Procesando video en Instagram');
let status = 'IN_PROGRESS';
while (status === 'IN_PROGRESS') {
  await new Promise(r => setTimeout(r, 8000));
  const r = await fetch(`https://graph.facebook.com/v25.0/${containerId}?fields=status_code,video_status&access_token=${token}`);
  const d = await r.json();
  status = d.status_code ?? 'IN_PROGRESS';
  process.stdout.write('.');
  if (status === 'ERROR') {
    const detail = d.video_status ? JSON.stringify(d.video_status) : 'sin detalle';
    throw new Error(`Error procesando video en Instagram: ${detail}`);
  }
}
console.log(` ✓ (${status})`);
if (status !== 'FINISHED') throw new Error(`Estado inesperado: ${status}`);

process.stdout.write('🚀  Publicando reel... ');
const pubRes = await fetch(`https://graph.facebook.com/v25.0/${igUserId}/media_publish`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ creation_id: containerId, access_token: token }),
});
const pubData = await pubRes.json();
if (pubData.error) throw new Error(`Meta API: ${pubData.error.message}`);
const igPostId = pubData.id;
console.log('✓');

// ── Guardar igPostId en Firestore ─────────────────────────────────────────────
process.stdout.write('💾  Guardando igPostId en Firestore... ');
await db.collection('microlearnings').doc(ML_ID).update({ igPostId });
console.log('✓');

// ── Borrar video de Firebase Storage ─────────────────────────────────────────
process.stdout.write('🗑️   Borrando video de Storage... ');
await bucket.file(STORAGE_PATH).delete();
console.log('✓');

console.log(`\n✅  Publicado en IG! ID: ${igPostId}\n`);
