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

const partitiviDoc = {
  id: 'l3_l5',
  lessonId: '3',
  title: 'Artículos Partitivos',
  explanation: 'Indican una cantidad indeterminada ("un poco de"). Se forman con DI + artículo determinado.',
  groups: [
    {
      label: 'Singular',
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
    },
    {
      label: 'Plural',
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
    },
  ],
  phrases: [
    { italian: 'Vorrei del pane', spanish: 'Quisiera un poco de pan' },
    { italian: 'Mangio della pizza', spanish: 'Como un poco de pizza' },
    { italian: 'Ho dei libri', spanish: 'Tengo algunos libros' },
    { italian: 'Prendo dello zucchero', spanish: 'Tomo un poco de azúcar' },
    { italian: "Bevo dell'acqua", spanish: 'Bebo un poco de agua' },
    { italian: 'Compro delle mele', spanish: 'Compro algunas manzanas' },
  ],
};

async function run() {
  console.log('Migrating Artículos Partitivos (l3_l5)...');
  try {
    await setDoc(doc(db, 'levelContents', 'l3_l5'), partitiviDoc);
    console.log('  Done — l3_l5 updated in Firestore.');
  } catch (err) {
    console.error('  Error:', err.message);
  }
  process.exit(0);
}

run();
