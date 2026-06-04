import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmWDkhB3wrQw_Vk8IbE4bKkM1GCoKq1xU",
  authDomain: "italian-app-488ee.firebaseapp.com",
  projectId: "italian-app-488ee",
  storageBucket: "italian-app-488ee.firebasestorage.app",
  messagingSenderId: "923769718572",
  appId: "1:923769718572:web:747c42ade31331f0758e89",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Maps each levelContent doc to the subtopic string used in the exercises collection.
// These titles differ from level.title so clase.tsx needs this mapping for Reto Rápido.
const updates = [
  { id: 'l3_l1',  subtopicKey: 'Artículos Determinativos' },
  { id: 'l3_l1b', subtopicKey: 'Artículos Determinativos' },
  { id: 'l3_l2',  subtopicKey: 'Artículos Indeterminativos' },
  { id: 'l3_l2b', subtopicKey: 'Artículos Indeterminativos' },
  { id: 'l3_l5a', subtopicKey: 'Artículos Partitivos' },
  { id: 'l3_l5b', subtopicKey: 'Artículos Partitivos' },
  { id: 'l3_l6',  subtopicKey: 'Formación del plural' },
];

async function run() {
  console.log('Patching subtopicKey on lesson 3 levelContents...\n');
  for (const { id, subtopicKey } of updates) {
    try {
      await setDoc(doc(db, 'levelContents', id), { subtopicKey }, { merge: true });
      console.log(`  ✓ ${id} → "${subtopicKey}"`);
    } catch (err) {
      console.error(`  ✗ ${id}:`, err.message);
    }
  }
  console.log('\nDone.');
  process.exit(0);
}

run();
