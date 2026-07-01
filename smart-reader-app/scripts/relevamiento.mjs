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

const snap = await db.collection('microlearnings').get();

let conVideo = 0;
let conImagenYAudio = 0;
let soloAudio = 0;
let sinNada = 0;
let total = 0;

for (const doc of snap.docs) {
  const d = doc.data();
  total++;
  const tieneAudio  = Array.isArray(d.audioSlides) && d.audioSlides.length > 0;
  const tieneImagen = !!d.microlearningImageUrl;
  const tieneVideo  = !!d.ytVideoId || !!d.igPostId;

  if (tieneVideo)                      conVideo++;
  else if (tieneImagen && tieneAudio)  conImagenYAudio++;
  else if (tieneAudio)                 soloAudio++;
  else                                 sinNada++;
}

console.log(`\n📊 Relevamiento de microlearnings (total: ${total})\n`);
console.log(`  ✅ Con video publicado (YT o IG):      ${conVideo}`);
console.log(`  🎨 Con imagen + audio Labs (listos):   ${conImagenYAudio}`);
console.log(`  🎙️  Solo audio Labs (sin imagen):       ${soloAudio}`);
console.log(`  ⬜ Sin audio ni imagen:                ${sinNada}`);
console.log();
