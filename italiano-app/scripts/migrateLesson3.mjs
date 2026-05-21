// Node.js migration script — no react-native dependency
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

const lesson3Contents = [
  {
    id: 'l3_l1',
    lessonId: '3',
    title: 'Art. Det. Singulares',
    explanation: 'Se usan para referirse a algo específico (el, la).',
    subSections: [
      {
        label: 'Masculino',
        items: [
          'IL (+ Consonante): Il libro, il ragazzo.',
          'LO (+ S imp./Z/GN): Lo zaino, lo studente.',
          "L' (+ Vocal): L'amico.",
        ],
      },
      {
        label: 'Femenino',
        items: [
          'LA (+ Consonante): La casa, la ragazza.',
          "L' (+ Vocal): L'amica.",
        ],
      },
    ],
    phrases: [
      { italian: 'Il ragazzo', spanish: 'El chico' },
      { italian: 'Lo zaino', spanish: 'La mochila' },
      { italian: 'La ragazza', spanish: 'La chica' },
      { italian: "L'acqua", spanish: 'El agua' },
    ],
  },
  {
    id: 'l3_l1b',
    lessonId: '3',
    title: 'Art. Det. Plurales',
    explanation: 'Se usan para referirse a algo específico (los, las).',
    subSections: [
      {
        label: 'Masculino',
        items: [
          'I (+ Consonante): I libri, i ragazzi.',
          'GLI (+ S imp./Z/GN/Vocal): Gli studenti, gli amici.',
        ],
      },
      {
        label: 'Femenino',
        items: [
          'LE (todos los casos): Le case, le ragazze.',
        ],
      },
    ],
    phrases: [
      { italian: 'I libri', spanish: 'Los libros' },
      { italian: 'Gli studenti', spanish: 'Los estudiantes' },
      { italian: 'Le case', spanish: 'Las casas' },
    ],
  },
  {
    id: 'l3_l2',
    lessonId: '3',
    title: 'Art. Indet. Singulares',
    explanation: 'Se usan para referirse a algo no específico (un, una). Solo existen en singular.',
    subSections: [
      {
        label: 'Masculino',
        items: [
          'UN (+ Consonante/Vocal): Un libro, un amico.',
          'UNO (+ S imp./Z/GN): Uno zaino, uno studente.',
        ],
      },
      {
        label: 'Femenino',
        items: [
          'UNA (+ Consonante): Una casa.',
          "UN' (+ Vocal): Un'amica, un'arancia.",
        ],
      },
    ],
    phrases: [
      { italian: 'Un caffè', spanish: 'Un café' },
      { italian: "Un'arancia", spanish: 'Una naranja' },
      { italian: 'Uno studente', spanish: 'Un estudiante' },
    ],
  },
  {
    id: 'l3_l2b',
    lessonId: '3',
    title: 'Art. Indet. Plurales',
    explanation: 'El plural de los indeterminativos usa artículos partitivos (DI + artículo det.).',
    subSections: [
      {
        label: 'Masculino',
        items: [
          'DEI (+ Consonante): Dei libri, dei ragazzi.',
          'DEGLI (+ S imp./Z/GN/Vocal): Degli studenti, degli amici.',
        ],
      },
      {
        label: 'Femenino',
        items: [
          'DELLE (todos los casos): Delle case, delle ragazze.',
        ],
      },
    ],
    phrases: [
      { italian: 'Dei libri', spanish: 'Unos libros' },
      { italian: 'Degli amici', spanish: 'Unos amigos' },
      { italian: 'Delle case', spanish: 'Unas casas' },
    ],
  },
];

async function run() {
  // Delete old "Pronunciación especial" documents
  const toDelete = ['l3_l4', 'l4'];
  for (const id of toDelete) {
    try {
      await deleteDoc(doc(db, 'levelContents', id));
      console.log(`  🗑 Deleted ${id}`);
    } catch (err) {
      console.log(`  (skip) ${id}: ${err.message}`);
    }
  }

  console.log('\nMigrating lesson 3 levelContents...\n');
  for (const item of lesson3Contents) {
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
