import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sa = JSON.parse(readFileSync(join(__dirname, '../..', 'firebase-service-account.json')));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const id = process.argv[2];
await db.collection('microlearnings').doc(id).update({ igPostId: FieldValue.delete() });
console.log(`igPostId eliminado de ${id}`);
process.exit(0);
