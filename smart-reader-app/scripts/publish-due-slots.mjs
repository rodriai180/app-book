#!/usr/bin/env node
// Corre desde GitHub Actions cada hora.
// Busca slots en schedule.json cuya hora ya pasó y los publica en IG.
// Uso: node publish-due-slots.mjs [mlId]  ← mlId opcional fuerza ese slot
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mlIdOverride = process.argv[2];

const { slots } = JSON.parse(readFileSync(join(__dirname, 'schedule.json'), 'utf-8'));
const now = Date.now();
const WINDOW_MS = 65 * 60 * 1000; // ventana de 65 min: cubre retrasos del runner

let due;
if (mlIdOverride) {
  const slot = slots.find(s => s.mlId === mlIdOverride);
  if (!slot) {
    console.error(`❌ No hay slot para ${mlIdOverride} en schedule.json`);
    process.exit(1);
  }
  due = [slot];
} else {
  due = slots.filter(s => {
    if (s.ig) return false; // ya publicado localmente
    const t = new Date(s.scheduledAt).getTime();
    return t <= now && t > now - WINDOW_MS;
  });
}

if (due.length === 0) {
  const upcoming = slots
    .filter(s => !s.ig && new Date(s.scheduledAt).getTime() > now)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const next = upcoming[0];
  if (next) {
    const diffMin = Math.round((new Date(next.scheduledAt).getTime() - now) / 60000);
    const h = Math.floor(diffMin / 60), m = diffMin % 60;
    console.log(`✅ Sin slots en esta ventana. Próximo: "${next.title}" en ${h}h ${m}m.`);
  } else {
    console.log('✅ No hay slots pendientes en schedule.json.');
  }
  process.exit(0);
}

console.log(`\n📋 ${due.length} slot(s) a publicar:`);
for (const s of due) console.log(`   • ${s.mlId}  "${s.title}"`);
console.log();

async function runPublish(mlId) {
  return new Promise(resolve => {
    const child = spawn('node', [join(__dirname, 'publish-ig.mjs'), mlId], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('close', resolve);
  });
}

let exitCode = 0;
for (const slot of due) {
  const code = await runPublish(slot.mlId);
  if (code !== 0) {
    console.error(`\n❌ Error publicando ${slot.mlId} (exit ${code})\n`);
    exitCode = 1;
  }
}

process.exit(exitCode);
