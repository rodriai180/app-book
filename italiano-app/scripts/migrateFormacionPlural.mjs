import { initializeApp } from 'firebase/app';
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';

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

const newDoc = {
  id: 'l3_l6',
  lessonId: '3',
  title: 'Formación del plural',
  explanation: 'En italiano, el plural cambia la vocal final:\n\n• -o → -i (Ragazzo → Ragazzi)\n• -a → -e (Ragazza → Ragazze)\n• -e → -i (Fiore → Fiori)',
  phrases: [
    { italian: 'Il libro → I libri', spanish: 'El libro → Los libros' },
    { italian: 'La casa → Le case', spanish: 'La casa → Las casas' },
    { italian: 'Il mare → I mari', spanish: 'El mar → Los mares' },
  ],
};

async function run() {
  console.log('Deleting old l3_l3...');
  try {
    await deleteDoc(doc(db, 'levelContents', 'l3_l3'));
    console.log('  🗑 Deleted l3_l3');
  } catch (err) {
    console.log(`  (skip) l3_l3: ${err.message}`);
  }

  console.log('\nWriting l3_l6 (Formación del plural al final)...');
  try {
    await setDoc(doc(db, 'levelContents', newDoc.id), newDoc);
    console.log(`  ✓ ${newDoc.id} — ${newDoc.title}`);
  } catch (err) {
    console.error(`  ✗ ${newDoc.id}:`, err.message);
  }

  console.log('\nDone.');
  process.exit(0);
}

run();
