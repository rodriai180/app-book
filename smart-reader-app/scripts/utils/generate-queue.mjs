#!/usr/bin/env node
// Genera batch.txt con los microlearnings pendientes de publicar,
// intercalados por categoría para máxima variedad en el feed.
// Uso: node generate-queue.mjs [--limit N]

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }        from 'firebase-admin/firestore';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname }       from 'path';
import { fileURLToPath }       from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '../..');
const OUT       = join(__dirname, '..', 'batch.txt');

const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i !== -1 ? parseInt(process.argv[i + 1], 10) : Infinity;
})();

// Intercala arrays round-robin: [A1,A2], [B1], [C1,C2,C3] → A1,B1,C1,A2,C2,C3
function interleave(groups) {
  const result = [];
  const lists  = Object.values(groups).map(g => [...g]);
  let round = 0;
  while (lists.some(l => l.length > round)) {
    for (const list of lists) {
      if (list[round]) result.push(list[round]);
    }
    round++;
  }
  return result;
}

async function main() {
  const sa = JSON.parse(readFileSync(join(ROOT, 'firebase-service-account.json')));
  initializeApp({ credential: cert(sa) });

  const db = getFirestore();

  console.log('\n🔍  Consultando microlearnings pendientes...\n');

  const snap = await db.collection('microlearnings').get();
  const pending = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(ml => !ml.ytVideoId && !ml.igPostId && ml.hookText && ml.audioSlides?.length);

  if (!pending.length) {
    console.log('✅  No hay microlearnings pendientes de publicar.\n');
    process.exit(0);
  }

  // Agrupar por categoría
  const byCategory = {};
  for (const ml of pending) {
    const cat = ml.category ?? 'sin-categoria';
    (byCategory[cat] = byCategory[cat] ?? []).push(ml.id);
  }

  // Mostrar resumen por categoría
  console.log('📊  Pendientes por categoría:');
  for (const [cat, ids] of Object.entries(byCategory)) {
    console.log(`   ${cat.padEnd(22)} ${ids.length} videos`);
  }
  console.log();

  // Intercalar y aplicar límite
  const ordered = interleave(byCategory).slice(0, LIMIT);

  // Escribir batch.txt
  writeFileSync(OUT, ordered.join('\n') + '\n', 'utf8');

  console.log(`📝  batch.txt actualizado — ${ordered.length} microlearnings en orden variado`);
  console.log(`    (~${Math.ceil(ordered.length / 3)} días de contenido a 3 videos/día)\n`);

  // Preview primeros 9
  const preview = ordered.slice(0, 9);
  const days    = Math.ceil(preview.length / 3);
  console.log('👀  Preview (primeros 3 días):');
  for (let d = 0; d < days; d++) {
    const slice = preview.slice(d * 3, d * 3 + 3);
    const mls   = slice.map(id => pending.find(m => m.id === id));
    console.log(`\n   Día ${d + 1}:`);
    for (const ml of mls) {
      if (ml) console.log(`     [${(ml.category ?? '?').padEnd(18)}]  ${ml.title?.slice(0, 45)}`);
    }
  }
  console.log();
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
