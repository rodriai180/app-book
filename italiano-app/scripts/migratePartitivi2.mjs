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

const docs = [
  {
    id: 'l3_l5a',
    lessonId: '3',
    title: 'Art. Partitivos Singulares',
    explanation: 'Indican una cantidad indeterminada ("un poco de") en singular. Se forman con DI + artículo determinado.',
    subSections: [
      {
        label: 'Masculino',
        items: [
          'DEL (+ consonante): del pane, del vino',
          'DELLO (+ Z, S+cons., GN, PS): dello zucchero',
          "DELL' (+ vocal): dell'olio, dell'uomo",
        ],
      },
      {
        label: 'Femenino',
        items: [
          'DELLA (+ consonante): della pizza, della birra',
          "DELL' (+ vocal): dell'acqua, dell'arancia",
        ],
      },
    ],
    phrases: [
      { italian: 'Vorrei del pane', spanish: 'Quisiera un poco de pan' },
      { italian: 'Mangio della pizza', spanish: 'Como un poco de pizza' },
      { italian: 'Prendo dello zucchero', spanish: 'Tomo un poco de azúcar' },
      { italian: "Bevo dell'acqua", spanish: 'Bebo un poco de agua' },
    ],
  },
  {
    id: 'l3_l5b',
    lessonId: '3',
    title: 'Art. Partitivos Plurales',
    explanation: 'Indican "algunos / algunas" en plural. Se forman con DI + artículo determinado plural.',
    subSections: [
      {
        label: 'Masculino',
        items: [
          'DEI (+ consonante): dei libri, dei ragazzi',
          'DEGLI (+ Z, S+cons., vocal): degli studenti, degli amici',
        ],
      },
      {
        label: 'Femenino',
        items: [
          'DELLE: delle ragazze, delle donne, delle arance',
        ],
      },
    ],
    phrases: [
      { italian: 'Ho dei libri', spanish: 'Tengo algunos libros' },
      { italian: 'Compro delle mele', spanish: 'Compro algunas manzanas' },
      { italian: 'Vedo degli amici', spanish: 'Veo a unos amigos' },
      { italian: 'Mangio delle olive', spanish: 'Como algunas aceitunas' },
    ],
  },
];

async function run() {
  console.log('Deleting old l3_l5...');
  try {
    await deleteDoc(doc(db, 'levelContents', 'l3_l5'));
    console.log('  🗑 Deleted l3_l5');
  } catch (err) {
    console.log(`  (skip) l3_l5: ${err.message}`);
  }

  console.log('\nMigrating partitivos split...\n');
  for (const item of docs) {
    try {
      await setDoc(doc(db, 'levelContents', item.id), item);
      console.log(`  ✓ ${item.id} — ${item.title}`);
    } catch (err) {
      console.error(`  ✗ ${item.id}:`, err.message);
    }
  }
  console.log('\nDone.');
  process.exit(0);
}

run();
