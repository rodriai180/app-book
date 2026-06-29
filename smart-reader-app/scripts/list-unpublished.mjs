#!/usr/bin/env node
// Lista microlearnings sin publicar en YouTube, agrupados por categoría.
// Excluye los IDs ya en schedule.json.
// Uso: node list-unpublished.mjs [--limit N]

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const sa = JSON.parse(readFileSync(join(ROOT, 'firebase-service-account.json'), 'utf-8'));
initializeApp({ credential: cert(sa) });
const db = getFirestore();

const limitArg = process.argv.indexOf('--limit');
const LIMIT = limitArg !== -1 ? parseInt(process.argv[limitArg + 1]) : null;

const { slots } = JSON.parse(readFileSync(join(__dirname, 'schedule.json'), 'utf-8'));
const scheduledIds = new Set(slots.map(s => s.mlId));

const snap = await db.collection('microlearnings')
  .where('audioSlides', '!=', null)
  .get();

const byCategory = {};
for (const doc of snap.docs) {
  const d = doc.data();
  if (d.ytVideoId) continue;         // ya publicado en YT
  if (scheduledIds.has(doc.id)) continue; // ya en schedule.json
  const cat = d.category ?? 'sin categoría';
  (byCategory[cat] = byCategory[cat] ?? []).push({ id: doc.id, title: d.title ?? '' });
}

const categories = Object.keys(byCategory).sort();
let total = 0;

for (const cat of categories) {
  const items = byCategory[cat];
  console.log(`\n📂 ${cat} (${items.length})`);
  for (const { id, title } of items) {
    console.log(`   ${id}  "${title}"`);
    total++;
    if (LIMIT && total >= LIMIT) break;
  }
  if (LIMIT && total >= LIMIT) break;
}

console.log(`\nTotal sin publicar: ${total}\n`);
process.exit(0);
