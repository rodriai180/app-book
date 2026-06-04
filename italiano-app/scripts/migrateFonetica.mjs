import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, query, where, writeBatch } from 'firebase/firestore';

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

const newContents = [
  {
    id: 'l0_s1',
    lessonId: '0',
    title: 'El Alfabeto Italiano',
    explanation: 'El italiano tiene 21 letras básicas. Las letras J, K, W, X, Y existen pero se usan solo en palabras de origen extranjero.',
    subSections: [
      {
        label: 'Letras italianas (21)',
        items: [
          'A, B, C, D, E, F, G, H, I, L, M, N, O, P, Q, R, S, T, U, V, Z',
        ],
      },
      {
        label: 'Letras extranjeras (5)',
        items: [
          'J (i lunga) — Jeans, Jungle',
          'K (kappa) — Kiwi, Karate',
          'W (vu doppia) — Wafer, Web',
          'X (ics) — Extra, Taxi',
          'Y (ipsilon) — Yogurt, Yacht',
        ],
      },
    ],
    phrases: [
      { italian: 'A come Ancona', spanish: 'A de Ancona' },
      { italian: 'B come Bologna', spanish: 'B de Bolonia' },
      { italian: 'C come Como', spanish: 'C de Como' },
      { italian: 'D come Domodossola', spanish: 'D de Domodossola' },
      { italian: 'E come Empoli', spanish: 'E de Empoli' },
      { italian: 'F come Firenze', spanish: 'F de Florencia' },
      { italian: 'G come Genova', spanish: 'G de Génova' },
      { italian: 'H come Hotel', spanish: 'H de Hotel (siempre muda)' },
      { italian: 'I come Imola', spanish: 'I de Imola' },
      { italian: 'L come Livorno', spanish: 'L de Livorno' },
      { italian: 'M come Milano', spanish: 'M de Milán' },
      { italian: 'N come Napoli', spanish: 'N de Nápoles' },
      { italian: 'O come Otranto', spanish: 'O de Otranto' },
      { italian: 'P come Palermo', spanish: 'P de Palermo' },
      { italian: 'Q come Quarto', spanish: 'Q de Quarto' },
      { italian: 'R come Roma', spanish: 'R de Roma' },
      { italian: 'S come Savona', spanish: 'S de Savona' },
      { italian: 'T come Torino', spanish: 'T de Turín' },
      { italian: 'U come Udine', spanish: 'U de Udine' },
      { italian: 'V come Venezia', spanish: 'V de Venecia' },
      { italian: 'Z come Zara', spanish: 'Z de Zara' },
    ],
  },
  {
    id: 'l0_s2',
    lessonId: '0',
    title: 'Las Vocales (Le Vocali)',
    explanation: 'El italiano tiene 5 vocales (A, E, I, O, U). Siempre se pronuncian con claridad, nunca se reducen. La E y la O tienen variantes abiertas y cerradas. La H es siempre muda.',
    subSections: [
      {
        label: 'Reglas clave',
        items: [
          'Cada vocal siempre suena, incluso al final de palabra.',
          'E abierta (è): caffè, è, perché → boca más abierta.',
          'E cerrada: verde, bene → más cerrada, como la "e" española.',
          'O abierta: cosa, uomo → boca más abierta.',
          'O cerrada: come, nome → más cerrada.',
          'H → siempre muda: ho (tengo), hai (tienes), ha (tiene).',
        ],
      },
    ],
    phrases: [
      { italian: 'A — Casa', spanish: 'A — Casa (igual al español)' },
      { italian: 'E aperta — Caffè', spanish: 'E abierta — Café' },
      { italian: 'E chiusa — Bene', spanish: 'E cerrada — Bien' },
      { italian: 'I — Vino', spanish: 'I — Vino (igual al español)' },
      { italian: 'O aperta — Cosa', spanish: 'O abierta — Cosa' },
      { italian: 'O chiusa — Nome', spanish: 'O cerrada — Nombre' },
      { italian: 'U — Luna', spanish: 'U — Luna (igual al español)' },
      { italian: 'Ho fame', spanish: 'Tengo hambre (H muda)' },
      { italian: 'Hai ragione', spanish: 'Tienes razón (H muda)' },
      { italian: "L'hotel è bello", spanish: 'El hotel es bello (H muda)' },
    ],
  },
  {
    id: 'l0_s3',
    lessonId: '0',
    title: 'C, G, CH y GH — Sistema Completo',
    explanation: 'La C y la G cambian de sonido ante E e I. La H "endurece" la consonante ante E/I para recuperar el sonido original. Esta H no se pronuncia.',
    subSections: [
      {
        label: 'C — Sonidos',
        items: [
          'C + A/O/U → "K" duro: Casa, Cosa, Cuore.',
          'C + E/I → "CH" suave: Cena, Ciao, Centro.',
          'CH + E/I → "K" duro: Che, Chi, Chiave, Pochi.',
        ],
      },
      {
        label: 'G — Sonidos',
        items: [
          'G + A/O/U → "G" suave: Gatto, Gonna, Gusto.',
          'G + E/I → "Y/J" suave: Gesto, Giro, Gelato.',
          'GH + E/I → "G" duro: Spaghetti, Ghiaccio, Laghi.',
        ],
      },
    ],
    phrases: [
      { italian: 'Ciao', spanish: 'Hola (C suave ante I → "CH")' },
      { italian: 'Centro', spanish: 'Centro (C suave ante E → "CH")' },
      { italian: 'Casa', spanish: 'Casa (C dura ante A → "K")' },
      { italian: 'Che cosa?', spanish: '¿Qué cosa? (CH + E → "K")' },
      { italian: 'Chi sei?', spanish: '¿Quién eres? (CH + I → "K")' },
      { italian: 'Chiave', spanish: 'Llave (CH → "K")' },
      { italian: 'Gelato', spanish: 'Helado (G suave ante E → "J")' },
      { italian: 'Giro', spanish: 'Vuelta (G suave ante I → "J")' },
      { italian: 'Gatto', spanish: 'Gato (G duro ante A)' },
      { italian: 'Spaghetti', spanish: 'Espagueti (GH + E → "G" duro)' },
      { italian: 'Ghiaccio', spanish: 'Hielo (GH + I → "G" duro)' },
      { italian: 'Pochi', spanish: 'Pocos (CH + I → "K")' },
    ],
  },
  {
    id: 'l0_s4',
    lessonId: '0',
    title: 'SC — Dos sonidos (SH y SK)',
    explanation: 'SC cambia de sonido según la vocal siguiente. Ante E/I suena como "SH" (show). Ante A/O/U suena como "SK" (escala). Añadiendo H se recupera el sonido duro ante E/I.',
    subSections: [
      {
        label: 'Regla SC',
        items: [
          'SC + E/I → "SH" (como en "show"): Scena, Scienza, Pesce, Uscita.',
          'SC + A/O/U → "SK" (como en "escala"): Scala, Scuola, Scarpe.',
          'SCH + E/I → "SK" (H endurece): Scherzo, Schiena, Fischi.',
        ],
      },
    ],
    phrases: [
      { italian: 'Scena', spanish: 'Escena ("SH")' },
      { italian: 'Scienza', spanish: 'Ciencia ("SH")' },
      { italian: 'Pesce', spanish: 'Pez ("SH")' },
      { italian: 'Uscita', spanish: 'Salida ("SH")' },
      { italian: 'Lasciare', spanish: 'Dejar ("SH")' },
      { italian: 'Scala', spanish: 'Escalera ("SK")' },
      { italian: 'Scuola', spanish: 'Escuela ("SK")' },
      { italian: 'Scarpe', spanish: 'Zapatos ("SK")' },
      { italian: 'Scherzo', spanish: 'Broma ("SK" — SCH)' },
      { italian: 'Schiena', spanish: 'Espalda ("SK" — SCH)' },
    ],
  },
  {
    id: 'l0_s5',
    lessonId: '0',
    title: 'GLI y GN — Sonidos Únicos',
    explanation: 'Son dos sonidos del italiano sin equivalente exacto en español. GN suena como la "Ñ" española. GLI es un sonido palatal líquido, similar a la "LL" rioplatense.',
    subSections: [
      {
        label: 'Pronunciación',
        items: [
          'GN → como la "Ñ" española: Bagno (baño), Signore (señor), Sognare (soñar).',
          'GLI → palatal líquida: Figlio (hijo), Aglio (ajo), Moglie (esposa).',
          'La I en GLI no se pronuncia como vocal separada.',
        ],
      },
    ],
    phrases: [
      { italian: 'Gnocchi', spanish: 'Ñoquis (GN = Ñ)' },
      { italian: 'Sognare', spanish: 'Soñar (GN = Ñ)' },
      { italian: 'Bagno', spanish: 'Baño (GN = Ñ)' },
      { italian: 'Signore', spanish: 'Señor (GN = Ñ)' },
      { italian: 'Famiglia', spanish: 'Familia (GLI)' },
      { italian: 'Figlio', spanish: 'Hijo (GLI)' },
      { italian: 'Aglio', spanish: 'Ajo (GLI)' },
      { italian: 'Moglie', spanish: 'Esposa (GLI)' },
    ],
  },
  {
    id: 'l0_s6',
    lessonId: '0',
    title: 'Doppie Consonanti',
    explanation: 'Las consonantes dobles se pronuncian con más fuerza y duración. No son un detalle estético: cambian el significado de la palabra.',
    subSections: [
      {
        label: 'Pares que cambian de significado',
        items: [
          'Nono (noveno) ≠ Nonno (abuelo)',
          'Pala (pala) ≠ Palla (pelota)',
          'Sono (soy/estoy) ≠ Sonno (sueño)',
          'Capello (cabello) ≠ Cappello (sombrero)',
        ],
      },
    ],
    phrases: [
      { italian: 'Pizza', spanish: 'Pizza (ZZ alargada)' },
      { italian: 'Mamma', spanish: 'Mamá (MM alargada)' },
      { italian: 'Bello', spanish: 'Bello (LL alargada)' },
      { italian: 'Nonna', spanish: 'Abuela (NN alargada)' },
      { italian: 'Cappuccino', spanish: 'Capuchino (PP alargada)' },
      { italian: 'Nonno', spanish: 'Abuelo (≠ Nono = noveno)' },
      { italian: 'Palla', spanish: 'Pelota (≠ Pala = pala)' },
      { italian: 'Cappello', spanish: 'Sombrero (≠ Capello = cabello)' },
    ],
  },
];

async function run() {
  console.log('Eliminando levelContents actuales de lección 0...');
  const q = query(collection(db, 'levelContents'), where('lessonId', '==', '0'));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => {
    console.log(`  🗑 Eliminando: ${d.id}`);
    batch.delete(d.ref);
  });
  await batch.commit();

  console.log('\nInsertando nuevos subtemas...');
  const batch2 = writeBatch(db);
  for (const item of newContents) {
    const ref = doc(db, 'levelContents', item.id);
    batch2.set(ref, item);
    console.log(`  ✓ ${item.id} — ${item.title}`);
  }
  await batch2.commit();

  console.log('\nDone. 6 subtemas migrados para Fonética y Alfabeto.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
