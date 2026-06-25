#!/usr/bin/env node
// Sube un MP4 local a Firebase Storage en reels/<mlId>.mp4
// Uso: node upload-to-storage.mjs <mlId>
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ML_ID = process.argv[2];
if (!ML_ID) { console.error('Uso: node upload-to-storage.mjs <mlId>'); process.exit(1); }

const STORAGE_BUCKET = 'smart-reader-app-3665c.firebasestorage.app';
const SERVICE_ACCOUNT = join(ROOT, 'firebase-service-account.json');

const sa = JSON.parse(readFileSync(SERVICE_ACCOUNT, 'utf-8'));
initializeApp({ credential: cert(sa), storageBucket: STORAGE_BUCKET });

function findVideoPath(mlId) {
  const outputDir = join(ROOT, 'reel-output');
  const flat = join(outputDir, `${mlId}.mp4`);
  if (existsSync(flat)) return flat;
  const loteFiles = readdirSync(outputDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name.startsWith('lote-'))
    .map(e => join(outputDir, e.name, `${mlId}.mp4`));
  return loteFiles.find(p => existsSync(p)) ?? null;
}

const localPath = findVideoPath(ML_ID);
if (!localPath || !existsSync(localPath)) {
  console.error(`❌ No encontré el MP4 en reel-output/ para ${ML_ID}`);
  process.exit(1);
}

const storagePath = `reels/${ML_ID}.mp4`;
const bucket = getStorage().bucket(STORAGE_BUCKET);

const [alreadyExists] = await bucket.file(storagePath).exists();
if (alreadyExists) {
  console.log(`⏭️  Ya existe en Storage: ${storagePath}`);
  process.exit(0);
}

process.stdout.write(`☁️  Subiendo ${localPath} → ${storagePath} ... `);
await bucket.upload(localPath, {
  destination: storagePath,
  metadata: { contentType: 'video/mp4' },
});
console.log('✓');
console.log(`\n✅ Video subido: https://storage.googleapis.com/${STORAGE_BUCKET}/${storagePath}\n`);
