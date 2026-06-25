import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadSchedule() {
  return JSON.parse(readFileSync(join(__dirname, 'schedule.json'), 'utf-8'));
}

function fmtDelay(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function fmtARG(iso) {
  return new Date(iso).toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function runNow(mlId) {
  return new Promise((resolve) => {
    console.log(`\n[${new Date().toISOString()}] ▶  Publicando ${mlId}...`);
    const proc = spawn('node', [join(__dirname, 'generate-reel.mjs'), mlId, '--publish', '--now'], {
      stdio: 'inherit',
      env: process.env,
    });
    proc.on('close', (code) => {
      console.log(`[${mlId}] ${code === 0 ? '✅ OK' : '❌ ERROR (code ' + code + ')'}\n`);
      resolve(code);
    });
  });
}

const { slots } = loadSchedule();
const pending = slots.filter(s => !s.ig);

if (pending.length === 0) {
  console.log('✅ No hay slots pendientes de publicar en IG.');
  process.exit(0);
}

const now = Date.now();
let waiting = 0;
let skipped = 0;

console.log(`\n📅 Scheduler IG — ${pending.length} slot(s) pendiente(s)\n`);

for (const slot of pending) {
  const t = new Date(slot.scheduledAt).getTime();
  const delay = t - now;

  if (delay < -60_000) {
    console.log(`⏭  SKIP     ${slot.scheduledAt}  (${fmtARG(slot.scheduledAt)} ARG)  ${slot.mlId}`);
    skipped++;
  } else if (delay <= 60_000) {
    console.log(`▶  AHORA    ${slot.scheduledAt}  ${slot.mlId}`);
    await runNow(slot.mlId);
  } else {
    console.log(`⏰  ESPERA   ${slot.scheduledAt}  (${fmtARG(slot.scheduledAt)} ARG)  ${slot.mlId}  → en ${fmtDelay(delay)}`);
    setTimeout(() => runNow(slot.mlId), delay);
    waiting++;
  }
}

if (skipped > 0) console.log(`\n${skipped} slot(s) saltado(s) por estar en el pasado.`);
if (waiting > 0) console.log(`\n⏳ ${waiting} slot(s) en espera. Mantené esta terminal abierta.\n`);
if (waiting === 0) process.exit(0);
