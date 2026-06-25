#!/usr/bin/env node
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

initializeApp({ credential: cert(join(ROOT, 'firebase-service-account.json')) });
const db = getFirestore();

const ML_ID = process.argv[2];
if (!ML_ID) { console.error('Usage: node _clear-ig-post.mjs <ml_id>'); process.exit(1); }

await db.collection('microlearnings').doc(ML_ID).update({ igPostId: FieldValue.delete() });
console.log(`✓ igPostId eliminado de ${ML_ID}`);
