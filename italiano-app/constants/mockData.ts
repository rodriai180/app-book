export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string; // e.g., 'A1', 'A2'
}

export interface Phrase {
  italian: string;
  spanish: string;
}

export interface LevelContent {
  id: string;
  title: string;
  phrases: Phrase[];
  explanation?: string;
  dialogue?: {
    personA: string;
    personB: string;
    personA_content: string;
    personB_content: string;
  }[];
}

export interface Exercise {
  id: string;
  lessonId: string;
  subtopic?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  tip: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example: string;
  category: string;
  usageTip: string;
  extraExamples: string[];
}

export const lessons: Lesson[] = [
  {
    id: '0',
    title: 'Fonética y Alfabeto',
    description: 'Domina los sonidos del italiano y el abecedario.',
    level: 'A1',
  },
  {
    id: '1',
    title: 'Saludos y presentaciones',
    description: 'Aprende a saludar y presentarte.',
    level: 'A1',
  },
  {
    id: '2',
    title: 'Frases de supervivencia',
    description: 'Frases esenciales para viajar.',
    level: 'A1',
  },
  {
    id: '3',
    title: 'Artículos y géneros',
    description: 'Módulo crítico de artículos, género y partitivos.',
    level: 'A1',
  },
  {
    id: '4',
    title: 'Verbos fundamentales',
    description: 'Ser, tener, hacer e ir.',
    level: 'A1',
  },
  {
    id: '5',
    title: 'Expresar gustos',
    description: 'Mi piace, mi serve...',
    level: 'A2',
  },
  {
    id: '6',
    title: 'Hacer preguntas',
    description: 'Chi, come, dove...',
    level: 'A2',
  },
  {
    id: '9',
    title: 'Números, Horas y Calendario',
    description: 'Indispensable para citas y trenes.',
    level: 'A1',
  },
  {
    id: '10',
    title: 'La Familia y Posesivos',
    description: '"Mia madre", "Tu sorella"... Domina la familia y la posesión.',
    level: 'A1',
  },
  {
    id: '11',
    title: 'Descripción y Colores',
    description: '"Sono alto", "La camicia rossa"... Describe personas y objetos.',
    level: 'A1',
  },
  {
    id: '12',
    title: 'Verbos Regulares (-ARE, -ERE, -IRE)',
    description: 'El motor del idioma: aprende a conjugar en presente.',
    level: 'A2',
  },
  {
    id: '13',
    title: 'Verbos Reflexivos y Rutina',
    description: '"Me levanto", "Me ducho": Aprende a hablar de tu día a día.',
    level: 'A2',
  },
  {
    id: '14',
    title: 'Preposiciones Articuladas',
    description: '"Al", "Del", "Nel"... Crucial para sonar natural.',
    level: 'A2',
  },
  {
    id: '15',
    title: 'Pronombres Directos',
    description: '"Lo compro", "La veo". Aprende a evitar repeticiones.',
    level: 'A2',
  },
  {
    id: '16',
    title: 'En el Restaurante y Compras',
    description: 'Vocabulario esencial para sobrevivir comiendo y comprando.',
    level: 'A2',
  },
  {
    id: '17',
    title: 'Adverbios de Cantidad y Tiempo',
    description: '"Mucho", "Poco", "Siempre". Da precisión a tus frases.',
    level: 'A2',
  },
  {
    id: '7',
    title: 'Conectores',
    description: 'Une tus ideas.',
    level: 'B1',
  },
  {
    id: '8',
    title: 'Passato Prossimo',
    description: 'El tiempo verbal para hablar de acciones pasadas completas.',
    level: 'B1',
  },
  {
    id: '18',
    title: "L'Imperfetto",
    description: 'Para describir el pasado: "Cuando era niño...".',
    level: 'B1',
  },
  {
    id: '19',
    title: 'Futuro Simple',
    description: 'Proyectos, planes y predicciones sobre el futuro.',
    level: 'B1',
  },
  {
    id: '20',
    title: 'Condicional Simple',
    description: 'Para pedir con cortesía o expresar deseos ("Vorrei").',
    level: 'B1',
  },
  {
    id: '21',
    title: 'Pronombres Indirectos',
    description: '"Le digo", "Me traen". Domina a quién va dirigida la acción.',
    level: 'B1',
  },
  {
    id: '22',
    title: 'Comparativos y Superlativos',
    description: '"Más que", "El mejor". Aprende a comparar todo.',
    level: 'B1',
  },
  {
    id: '23',
    title: 'Particella CI y NE',
    description: 'Los dos grandes misterios del italiano por fin explicados.',
    level: 'B1',
  },
  {
    id: '24',
    title: 'Congiuntivo Presente',
    description: 'Expresa dudas, opiniones y deseos con el subjuntivo.',
    level: 'B2',
  },
  {
    id: '25',
    title: 'Congiuntivo Imperfetto',
    description: 'Domina las hipótesis y deseos irreales.',
    level: 'B2',
  },
  {
    id: '26',
    title: 'Condizionale Composto',
    description: 'Hipótesis en el pasado y acciones no realizadas.',
    level: 'B2',
  },
  {
    id: '27',
    title: 'Pronomi Combinati',
    description: 'Combina fragmentos como "Glie-lo" y "Ce-ne" con fluidez.',
    level: 'B2',
  },
  {
    id: '28',
    title: 'Trapassato Prossimo',
    description: 'El pasado del pasado para narraciones avanzadas.',
    level: 'B2',
  },
  {
    id: '29',
    title: 'Forma Passiva',
    description: 'Cambia el enfoque de tus frases con la voz pasiva.',
    level: 'B2',
  },
  {
    id: '30',
    title: 'Discorso Indiretto',
    description: 'Reporta lo que otros dicen con precisión gramatical.',
    level: 'B2',
  },
  // C1/C2 — Maestría
  {
    id: '31',
    title: 'Passato Remoto',
    description: 'Literatura y pasado lejano',
    level: 'C1/C2',
  },
  {
    id: '32',
    title: 'Periodo Ipotetico',
    description: 'Hipótesis complejas',
    level: 'C1/C2',
  },
  {
    id: '33',
    title: 'Modismi e Proverbi',
    description: 'Habla como un local',
    level: 'C1/C2',
  },
  {
    id: '34',
    title: 'Linguaggio Settoriale',
    description: 'Medicina, Leyes y Negocios',
    level: 'C1/C2',
  },
];

export const levelContents: Record<string, LevelContent[]> = {
  '0': [
    {
      id: 'l0_1',
      title: 'El Alfabeto Italiano',
      explanation: 'El alfabeto italiano tiene 21 letras básicas. Las letras J, K, W, X, Y se usan solo para palabras extranjeras.\n\n• A, B, C, D, E, F, G, H, I, L, M, N, O, P, Q, R, S, T, U, V, Z.',
      phrases: [
        { italian: 'A (a)', spanish: 'A' },
        { italian: 'B (bi)', spanish: 'B' },
        { italian: 'C (ci)', spanish: 'C' },
        { italian: 'D (di)', spanish: 'D' },
        { italian: 'E (e)', spanish: 'E' },
        { italian: 'F (effe)', spanish: 'F' },
        { italian: 'G (gi)', spanish: 'G' },
        { italian: 'H (acca)', spanish: 'H (siempre muda)' },
        { italian: 'I (i)', spanish: 'I' },
        { italian: 'J (i lunga)', spanish: 'J (letra extranjera)' },
        { italian: 'K (kappa)', spanish: 'K (letra extranjera)' },
        { italian: 'L (elle)', spanish: 'L' },
        { italian: 'M (emme)', spanish: 'M' },
        { italian: 'N (enne)', spanish: 'N' },
        { italian: 'O (o)', spanish: 'O' },
        { italian: 'P (pi)', spanish: 'P' },
        { italian: 'Q (cu)', spanish: 'Q' },
        { italian: 'R (erre)', spanish: 'R' },
        { italian: 'S (esse)', spanish: 'S' },
        { italian: 'T (ti)', spanish: 'T' },
        { italian: 'U (u)', spanish: 'U' },
        { italian: 'V (vi / vu)', spanish: 'V' },
        { italian: 'W (doppia vu)', spanish: 'W (letra extranjera)' },
        { italian: 'X (ics)', spanish: 'X (letra extranjera)' },
        { italian: 'Y (ipsilon / i greca)', spanish: 'Y (letra extranjera)' },
        { italian: 'Z (zeta)', spanish: 'Z' },
      ],
    },
    {
      id: 'l0_2',
      title: 'Los sonidos de la "C" y la "G"',
      explanation: 'Es la regla más importante:\n\n• C + e/i = Sonido "CH" (Ciao, Centro).\n• C + a/o/u = Sonido "K" (Casa, Corso).\n• G + e/i = Sonido "Y/J" (Gesto, Giro).\n• G + a/o/u = Sonido "G" suave (Gatto, Guida).',
      phrases: [
        { italian: 'Ciao', spanish: 'Hola' },
        { italian: 'Casa', spanish: 'Casa' },
        { italian: 'Gelato', spanish: 'Helado' },
        { italian: 'Gatto', spanish: 'Gato' },
      ],
    },
    {
      id: 'l0_3',
      title: 'La "GLI" y la "GN"',
      explanation: '• GN se pronuncia como la "Ñ" (Sognare).\n• GLI se pronuncia como la "LL" líquida (Figlio).',
      phrases: [
        { italian: 'Gnocchi', spanish: 'Ñoquis' },
        { italian: 'Famiglia', spanish: 'Familia' },
      ],
    },
    {
      id: 'l0_4',
      title: 'Doppie Consonanti',
      explanation: 'En italiano, las consonantes dobles se pronuncian con más fuerza y duración.\n\n• Pizza (el sonido "ts" se alarga).\n• Mamma (el sonido "m" es más largo).',
      phrases: [
        { italian: 'Pizza', spanish: 'Pizza' },
        { italian: 'Gatto', spanish: 'Gato' },
        { italian: 'Bello', spanish: 'Bello/Hermoso' },
      ],
    },
  ],
  '1': [
    {
      id: 'l1',
      title: 'Diferencia entre formal e informal',
      explanation: 'En italiano, como en español, existe una clara distinción entre el trato formal e informal. El uso correcto depende de a quién te dirijas.\n\n• Ciao es informal.\n• Buongiorno es neutral/formal.\n• Mi scusi es formal.\n• Scusa es informal.',
      phrases: [],
    },
    {
      id: 'l2',
      title: 'Ejemplos prácticos',
      phrases: [
        { italian: 'Buongiorno', spanish: 'Buenos días' },
        { italian: 'Ciao', spanish: 'Hola / Adiós' },
        { italian: 'Come stai?', spanish: '¿Cómo estás? (informal)' },
        { italian: 'Come sta?', spanish: '¿Cómo está? (formal)' },
        { italian: 'Arrivederci', spanish: 'Adiós (formal)' },
        { italian: 'A presto', spanish: 'Hasta pronto' },
        { italian: 'Buonanotte', spanish: 'Buenas noches (al dormir)' },
      ],
    },
    {
      id: 'l3',
      title: 'Presentaciones',
      explanation: 'Para presentarte puedes decir "Mi chiamo..." o "Io sono...".\n\n• Piacere: Mucho gusto.\n• Mi chiamo Marco: Me llamo Marco.\n• Sono spagnolo: Soy español.',
      phrases: [],
    },
    {
      id: 'l4',
      title: 'Mini diálogo',
      phrases: [],
      dialogue: [
        {
          personA: 'A',
          personA_content: 'Ciao, io mi chiamo Luca. E tu?',
          personB: 'B',
          personB_content: 'Piacere, io sono Maria.',
        },
      ],
    },
  ],
  '2': [
    {
      id: 'l1',
      title: 'La cortesía en Italia',
      explanation: 'En italiano se usa mucho la cortesía con estructuras como “Vorrei…” (Quisiera) en lugar de “Voglio…” (Quiero). Estas frases son esenciales para moverte en restaurantes, transporte y tiendas.',
      phrases: [],
    },
    {
      id: 'l2',
      title: 'Frases clave',
      phrases: [
        { italian: 'Non capisco', spanish: 'No entiendo' },
        { italian: 'Non lo so', spanish: 'No lo sé' },
        { italian: 'Vorrei un caffè', spanish: 'Quisiera un café' },
        { italian: 'Quanto costa?', spanish: '¿Cuánto cuesta?' },
        { italian: 'Dove si trova…?', spanish: '¿Dónde se encuentra…?' },
        { italian: 'Mi può aiutare?', spanish: '¿Me puede ayudar?' },
        { italian: 'Posso pagare con carta?', spanish: '¿Puedo pagar con tarjeta?' },
      ],
    },
    {
      id: 'l3',
      title: 'Diálogo útil',
      phrases: [],
      dialogue: [
        {
          personA: 'A',
          personA_content: 'Vorrei un caffè, per favore.',
          personB: 'B',
          personB_content: 'Sono due euro.',
        },
        {
          personA: 'A',
          personA_content: 'Grazie.',
          personB: 'B',
          personB_content: 'Prego.',
        },
      ],
    },
  ],
  '3': [
    {
      id: 'l1',
      title: 'Artículos Determinativos',
      explanation: 'Se usan para referirse a algo específico (el, la, los, las).\n\n• IL (Sg. Masc. + Consonante): Il libro.\n• LA (Sg. Fem. + Consonante): La casa.\n• L\' (Sg. Masc/Fem + Vocal): L\'amico, l\'amica.\n• I (Pl. Masc. + Consonante): I libri.\n• LE (Pl. Fem.): Le case.',
      phrases: [
        { italian: 'Il ragazzo', spanish: 'El chico' },
        { italian: 'La ragazza', spanish: 'La chica' },
        { italian: 'L\'acqua', spanish: 'El agua' },
      ],
    },
    {
      id: 'l2',
      title: 'Artículos Indeterminativos',
      explanation: 'Se usan para referirse a algo no específico (un, una).\n\n• UN (Masc. + Consonante/Vocal): Un libro, un amico.\n• UNO (Masc. + Z/S+Cons/GN): Uno zaino.\n• UNA (Fem. + Consonante): Una casa.\n• UN\' (Fem. + Vocal): Un\'amica.',
      phrases: [
        { italian: 'Un caffè', spanish: 'Un café' },
        { italian: 'Un\'arancia', spanish: 'Una naranja' },
        { italian: 'Uno studente', spanish: 'Un estudiante' },
      ],
    },
    {
      id: 'l3',
      title: 'Formación del plural',
      explanation: 'En italiano, el plural cambia la vocal final:\n\n• -o → -i (Ragazzo → Ragazzi)\n• -a → -e (Ragazza → Ragazze)\n• -e → -i (Fiore → Fiori)',
      phrases: [
        { italian: 'Il libro → I libri', spanish: 'El libro → Los libros' },
        { italian: 'La casa → Le case', spanish: 'La casa → Las casas' },
        { italian: 'Il mare → I mari', spanish: 'El mar → Los mares' },
      ],
    },
    {
      id: 'l4',
      title: 'Pronunciación especial',
      explanation: 'Casos especiales para palabras que empiezan por Z, S+consonante, GN, y vocales.\n\n• LO / GLI se usan para Z o S+consonante: Lo zaino, Gli studenti.',
      phrases: [
        { italian: 'Lo studente', spanish: 'El estudiante' },
        { italian: 'Gli gnomi', spanish: 'Los gnomos' },
        { italian: 'Lo psicologo', spanish: 'El psicólogo' },
      ],
    },
    {
      id: 'l5',
      title: 'Artículos Partitivos',
      explanation: 'Indican una cantidad indeterminada ("un poco de"). Se forman con DI + artículo determinado.\n\n• del, dello, dell\', della (Singular)\n• dei, degli, delle (Plural)',
      phrases: [
        { italian: 'Vorrei del pane', spanish: 'Quisiera un poco de pan' },
        { italian: 'Mangio della pizza', spanish: 'Como un poco de pizza' },
        { italian: 'Ho dei libri', spanish: 'Tengo algunos libros' },
      ],
    },
  ],
  '4': [
    {
      id: 'l1',
      title: 'Verbos fundamentales',
      explanation: 'Estos verbos permiten expresar identidad, necesidad, movimiento y deseo. Son los que generan el 80% de las frases en el día a día.',
      phrases: [
        { italian: 'Essere', spanish: 'ser / estar' },
        { italian: 'Avere', spanish: 'tener' },
        { italian: 'Fare', spanish: 'hacer' },
        { italian: 'Andare', spanish: 'ir' },
        { italian: 'Potere', spanish: 'poder' },
        { italian: 'Volere', spanish: 'querer' },
        { italian: 'Dovere', spanish: 'deber' },
      ],
    },
    {
      id: 'l2',
      title: 'Ejemplos prácticos',
      phrases: [
        { italian: 'Sono argentino.', spanish: 'Soy argentino.' },
        { italian: 'Ho fame.', spanish: 'Tengo hambre.' },
        { italian: 'Voglio un caffè.', spanish: 'Quiero un café.' },
        { italian: 'Posso entrare?', spanish: '¿Puedo entrar?' },
        { italian: 'Devo andare.', spanish: 'Debo irme.' },
        { italian: 'Faccio sport.', spanish: 'Hago deporte.' },
      ],
    },
    {
      id: 'l3',
      title: 'Mini conversación',
      phrases: [],
      dialogue: [
        {
          personA: 'A',
          personA_content: 'Posso entrare?',
          personB: 'B',
          personB_content: 'Sì, certo.',
        },
        {
          personA: 'A',
          personA_content: 'Grazie.',
          personB: 'B',
          personB_content: '', // Empty if not needed but personB is required in interface
        },
      ],
    },
  ],
  '5': [
    {
      id: 'l1',
      title: 'Frases fundamentales',
      explanation: 'Estas frases te permiten comunicarte y expresar tus necesidades básicas sin necesidad de gramática avanzada.',
      phrases: [
        { italian: 'Mi piace', spanish: 'Me gusta' },
        { italian: 'Non mi piace', spanish: 'No me gusta' },
        { italian: 'Ho bisogno di…', spanish: 'Necesito…' },
        { italian: 'Non importa', spanish: 'No importa' },
        { italian: 'Va bene', spanish: 'Está bien' },
        { italian: 'Perfetto', spanish: 'Perfecto' },
        { italian: 'Che significa?', spanish: '¿Qué significa?' },
        { italian: 'Come si dice…?', spanish: '¿Cómo se dice…?' },
      ],
    },
    {
      id: 'l2',
      title: 'Ejemplos de uso',
      phrases: [
        { italian: 'Mi piace la pasta.', spanish: 'Me gusta la pasta.' },
        { italian: 'Ho bisogno di aiuto.', spanish: 'Necesito ayuda.' },
        { italian: 'Non importa.', spanish: 'No importa.' },
      ],
    },
  ],
  '6': [
    {
      id: 'l1',
      title: 'Palabras clave',
      explanation: 'Las palabras que necesitas para empezar a hacer preguntas en italiano.',
      phrases: [
        { italian: 'Chi', spanish: 'Quién' },
        { italian: 'Che / Cosa', spanish: 'Qué' },
        { italian: 'Dove', spanish: 'Dónde' },
        { italian: 'Quando', spanish: 'Cuándo' },
        { italian: 'Perché', spanish: 'Por qué' },
        { italian: 'Come', spanish: 'Cómo' },
        { italian: 'Quanto', spanish: 'Cuánto' },
      ],
    },
    {
      id: 'l2',
      title: 'Ejemplos',
      phrases: [
        { italian: 'Dove vai?', spanish: '¿A dónde vas?' },
        { italian: 'Quanto costa?', spanish: '¿Cuánto cuesta?' },
        { italian: 'Perché studi italiano?', spanish: '¿Por qué estudias italiano?' },
        { italian: 'Come ti chiami?', spanish: '¿Cómo te llamas?' },
      ],
    },
    {
      id: 'l3',
      title: 'Pequeño diálogo',
      phrases: [],
      dialogue: [
        {
          personA: 'A',
          personA_content: 'Come ti chiami?',
          personB: 'B',
          personB_content: 'Mi chiamo Marco.',
        },
      ],
    },
  ],
  '7': [
    {
      id: 'l1',
      title: 'Conectores básicos',
      explanation: 'Estas pequeñas palabras son el "pegamento" de tus frases. Te permiten unir ideas y sonar mucho más natural.',
      phrases: [
        { italian: 'E', spanish: 'y' },
        { italian: 'Ma', spanish: 'pero' },
        { italian: 'Perché', spanish: 'porque' },
        { italian: 'Quindi', spanish: 'entonces' },
        { italian: 'Anche', spanish: 'también' },
        { italian: 'Poi', spanish: 'después' },
        { italian: 'Però', spanish: 'sin embargo' },
      ],
    },
    {
      id: 'l2',
      title: 'Ejemplos en contexto',
      phrases: [
        { italian: 'Voglio andare in Italia perché mi piace.', spanish: 'Quiero ir a Italia porque me gusta.' },
        { italian: 'Sono stanco ma devo lavorare.', spanish: 'Estoy cansado pero debo trabajar.' },
        { italian: 'Studio italiano e lavoro.', spanish: 'Estudio italiano y trabajo.' },
      ],
    },
  ],
  '8': [
    {
      id: 'l8_1',
      title: 'Estructura básica (Avere)',
      explanation: 'El Passato Prossimo se forma con el presente de AVERE o ESSERE + el participio pasado del verbo.\n\n• Formación del participio:\n-ARE → -ATO (Parlare → Parlato)\n-ERE → -UTO (Vendere → Venduto)\n-IRE → -ITO (Partire → Partito)',
      phrases: [
        { italian: 'Ho parlato con Marco.', spanish: 'He hablado con Marco.' },
        { italian: 'Hai mangiato la pizza.', spanish: 'Has comido la pizza.' },
        { italian: 'Abbiamo guardato un film.', spanish: 'Hemos visto una película.' },
      ],
    },
    {
      id: 'l8_2',
      title: 'Uso con Essere (Movimiento)',
      explanation: 'Los verbos de movimiento, estado o cambio usan ESSERE como auxiliar. El participio debe coincidir en género y número con el sujeto.\n\n• Io sono andato (M) / andata (F)\n• Noi siamo andati (M) / andate (F)',
      phrases: [
        { italian: 'Sono andato al cinema.', spanish: 'He ido al cine (MASC).' },
        { italian: 'Lei è partita presto.', spanish: 'Ella ha salido temprano.' },
        { italian: 'Siamo stati a Roma.', spanish: 'Hemos estado en Roma.' },
      ],
    },
    {
      id: 'l8_3',
      title: 'Ejemplos completos',
      phrases: [
        { italian: 'Ieri ho lavorato molto.', spanish: 'Ayer trabajé mucho.' },
        { italian: 'Ho perso le chiavi.', spanish: 'He perdido las llaves.' },
        { italian: 'Siete venuti alla festa?', spanish: '¿Habéis venido a la fiesta?' },
      ],
    },
  ],
  '9': [
    {
      id: 'l9_1',
      title: 'Los Números (0-20)',
      explanation: 'Los números básicos son la base de todo. \n\n0: zero, 1: uno, 2: due, 3: tre, 4: quattro, 5: cinque, 6: sei, 7: sette, 8: otto, 9: nove, 10: dieci.',
      phrases: [
        { italian: 'Undici, Dodici, Tredici', spanish: '11, 12, 13' },
        { italian: 'Quattordici, Quindici', spanish: '14, 15' },
        { italian: 'Sedici, Diciassette', spanish: '16, 17' },
        { italian: 'Diciotto, Diciannove, Venti', spanish: '18, 19, 20' },
      ],
    },
    {
      id: 'l9_2',
      title: 'Decinas y Cientos',
      explanation: 'Después del 20, los números siguen un patrón regular.\n\n• 30: trenta, 40: quaranta, 50: cinquanta, 60: sessanta, 70: settanta, 80: ottanta, 90: novanta, 100: cento.',
      phrases: [
        { italian: 'Ventuno / Ventotto', spanish: '21 / 28 (se quita la vocal final de venti)' },
        { italian: 'Mille', spanish: 'Mil' },
      ],
    },
    {
      id: 'l9_3',
      title: '¿Qué hora es?',
      explanation: 'En italiano tenemos dos formas de preguntar:\n\n• Che ora è? / Che ore sono?\n\nPara responder:\n• È l\'una (Es la una).\n• Sono le due (Son las dos).',
      phrases: [
        { italian: 'È mezzogiorno', spanish: 'Es mediodía' },
        { italian: 'È mezzanotte', spanish: 'Es medianoche' },
        { italian: 'Sono le tre e mezza', spanish: 'Son las tres y media' },
      ],
    },
    {
      id: 'l9_4',
      title: 'Días y Meses',
      explanation: 'Los días de la semana (i giorni della settimana):\nLunedì, Martedì, Mercoledì, Giovedì, Venerdì, Sabato, Domenica.',
      phrases: [
        { italian: 'Gennaio, Febbraio, Marzo', spanish: 'Enero, Febrero, Marzo' },
        { italian: 'Oggi è lunedì', spanish: 'Hoy es lunes' },
      ],
    },
  ],
  '10': [
    {
      id: 'l10_1',
      title: 'Los miembros de la familia',
      explanation: 'Vocabulario esencial para describir a tu familia.\n\n• Padre / Madre\n• Fratello / Sorella\n• Figlio / Figlia\n• Nonno / Nonna\n• Zio / Zia\n• Cugino / Cugina',
      phrases: [
        { italian: 'Mio padre si chiama Marco.', spanish: 'Mi padre se llama Marco.' },
        { italian: 'Mia sorella vive a Roma.', spanish: 'Mi hermana vive en Roma.' },
        { italian: 'Ho due fratelli.', spanish: 'Tengo dos hermanos.' },
      ],
    },
    {
      id: 'l10_2',
      title: 'Los adjetivos posesivos',
      explanation: 'En italiano, los posesivos suelen ir acompañados del artículo (il mio, la tua, etc.).\n\n• (Io) Il mio / La mia\n• (Tu) Il tuo / La tua\n• (Lui/Lei) Il suo / La sua\n• (Noi) Il nostro / La nostra\n• (Voi) Il vostro / La vostra\n• (Loro) Il loro / La loro',
      phrases: [
        { italian: 'Il mio cane è nero.', spanish: 'Mi perro es negro.' },
        { italian: 'La tua casa è bella.', spanish: 'Tu casa es bella.' },
        { italian: 'Il suo libro è sul tavolo.', spanish: 'Su libro está sobre la mesa.' },
      ],
    },
    {
      id: 'l10_3',
      title: 'La Regla de Oro (Nombres de parentesco)',
      explanation: '¡Atención! Con miembros de la familia en SINGULAR NO se usa el artículo.\n\n• Mia madre (CORRECTO)\n• La mia madre (INCORRECTO)\n\nEXCEPCIONES:\n1. Si es plural: "Le mie sorelle" (Usa artículo).\n2. Con "Loro": "Il loro padre" (Usa artículo).\n3. Con apodos o diminutivos: "La mia mamma" (Usa artículo).',
      phrases: [
        { italian: 'Mia sorella è giovane.', spanish: 'Mi hermana es joven (Sin artículo).' },
        { italian: 'Le mie sorelle sono alte.', spanish: 'Mis hermanas son altas (Con artículo, plural).' },
        { italian: 'La mia mamma cucina bene.', spanish: 'Mi mamá cocina bien (Con artículo, apodo).' },
      ],
    },
  ],
  '11': [
    {
      id: 'l11_1',
      title: 'La Descripción Física',
      explanation: 'Adjetivos comunes para describir personas.\n\n• Alto / Basso (Alto / Bajo)\n• Magro / Grasso (Flaco / Gordo)\n• Giovane / Vecchio (Joven / Viejo)\n• Bello / Brutto (Guapo / Feo)\n• Biondo / Moro (Rubio / Moreno)',
      phrases: [
        { italian: 'Io sono alto e magro.', spanish: 'Yo soy alto y flaco.' },
        { italian: 'Lei è molto bella e giovane.', spanish: 'Ella es muy guapa y joven.' },
        { italian: 'Mio nonno è vecchio ma felice.', spanish: 'Mi abuelo es viejo pero feliz.' },
      ],
    },
    {
      id: 'l11_2',
      title: 'Los Colores',
      explanation: 'Los colores en italiano funcionan como adjetivos.\n\n• Rosso (Rojo)\n• Blu (Azul - invariable)\n• Verde (Verde - termina en E)\n• Giallo (Amarillo)\n• Nero (Negro)\n• Bianco (Blanco)',
      phrases: [
        { italian: 'Il libro è rosso.', spanish: 'El libro es rojo.' },
        { italian: 'La macchina è blu.', spanish: 'El coche es azul.' },
        { italian: 'Ho una camicia verde.', spanish: 'Tengo una camisa verde.' },
      ],
    },
    {
      id: 'l11_3',
      title: 'La concordancia (Género y Número)',
      explanation: 'Recuerda que el adjetivo debe coincidir con el sustantivo.\n\n• Maschile: Il ragazzo alto\n• Femminile: La ragazza alta\n• Plurale M: I ragazzi alti\n• Plurale F: Le ragazze alte\n\nLos colores acabados en "e" (verde) solo cambian en plural (verdi), no por género.',
      phrases: [
        { italian: 'Le scarpe sono nere.', spanish: 'Los zapatos son negros.' },
        { italian: 'La casa è gialla.', spanish: 'La casa es amarilla.' },
        { italian: 'I libri sono verdi.', spanish: 'Los libros son verdes.' },
      ],
    },
  ],
  '12': [
    {
      id: 'l12_1',
      title: 'Verbos en -ARE (1ª Conjugación)',
      explanation: 'La mayoría de los verbos italianos terminan en -ARE (ej: Parlare - Hablar).\n\nPara conjugar, quitas -ARE y añades:\n• Io: -o (Parlo)\n• Tu: -i (Parli)\n• Lui/Lei: -a (Parla)\n• Noi: -iamo (Parliamo)\n• Voi: -ate (Parlate)\n• Loro: -ano (Parlano)',
      phrases: [
        { italian: 'Io parlo italiano.', spanish: 'Yo hablo italiano.' },
        { italian: 'Noi abitiamo a Roma.', spanish: 'Nosotros vivimos en Roma.' },
        { italian: 'Voi cantate bene.', spanish: 'Vosotros cantáis bien.' },
        { italian: 'Loro mangiano la pizza.', spanish: 'Ellos comen la pizza.' },
      ],
    },
    {
      id: 'l12_2',
      title: 'Verbos en -ERE (2ª Conjugación)',
      explanation: 'Siguen un patrón similar a -ARE, pero con cambios en la vocal temática (ej: Prendere - Tomar).\n\n• Io: -o (Prendo)\n• Tu: -i (Prendi)\n• Lui/Lei: -e (Prende)\n• Noi: -iamo (Prendiamo)\n• Voi: -ete (Prendete)\n• Loro: -ono (Prendono)',
      phrases: [
        { italian: 'Lui prende un caffè.', spanish: 'Él toma un café.' },
        { italian: 'Noi leggiamo un libro.', spanish: 'Nosotros leemos un libro.' },
        { italian: 'Voi scrivete una mail.', spanish: 'Vosotros escribís un correo.' },
        { italian: 'Io vedo il mare.', spanish: 'Yo veo el mar.' },
      ],
    },
    {
      id: 'l12_3',
      title: 'Verbos en -IRE (3ª Conjugación)',
      explanation: 'Se dividen en dos grupos. El grupo simple (ej: Partire - Partir/Salir):\n\n• Io: -o (Parto)\n• Tu: -i (Parti)\n• Lui/Lei: -e (Parte)\n• Noi: -iamo (Partiamo)\n• Voi: -ite (Partite)\n• Loro: -ono (Partono)\n\n*Nota: Existe otro grupo (ISC) como "Capire" que veremos luego.*',
      phrases: [
        { italian: 'Il treno parte alle otto.', spanish: 'El tren sale a las ocho.' },
        { italian: 'Io dormo molto.', spanish: 'Yo duermo mucho.' },
        { italian: 'Noi serviamo la cena.', spanish: 'Nosotros servimos la cena.' },
        { italian: 'Voi aprite la porta.', spanish: 'Vosotros abrís la puerta.' },
      ],
    },
  ],
  '13': [
    {
      id: 'l13_1',
      title: 'I Verbi Riflessivi',
      explanation: 'Los verbos reflexivos indican que la acción recae sobre el mismo sujeto (ej: alzarsi - levantarse).\n\nSe usan con pronombres reflexivos:\n• Io: mi (Mi alzo)\n• Tu: ti (Ti alzi)\n• Lui/Lei: si (Si alza)\n• Noi: ci (Ci alziamo)\n• Voi: vi (Vi alzate)\n• Loro: si (Si alzano)',
      phrases: [
        { italian: 'Mi sveglio alle sette.', spanish: 'Me despierto a las siete.' },
        { italian: 'Ti lavi i denti.', spanish: 'Te lavas los dientes.' },
        { italian: 'Lui si veste subito.', spanish: 'Él se viste enseguida.' },
        { italian: 'Ci divertiamo molto.', spanish: 'Nos divertimos mucho.' },
      ],
    },
    {
      id: 'l13_2',
      title: 'La Mia Routine',
      explanation: 'Para describir tu día, combinas verbos reflexivos y acciones habituales.\n\n• Mi alzo presto.\n• Faccio colazione alle otto.\n• Mi pettino i capelli.\n• Vado al lavoro.\n• Mi riposo un po\' nel pomeriggio.',
      phrases: [
        { italian: 'Mi faccio la doccia.', spanish: 'Me ducho.' },
        { italian: 'Mi preparo per uscire.', spanish: 'Me preparo para salir.' },
        { italian: 'Mi addormento tardi.', spanish: 'Me duermo tarde.' },
      ],
    },
    {
      id: 'l13_3',
      title: 'Dialogo al Mattino',
      explanation: 'Una conversación típica sobre la rutina de la mañana.',
      phrases: [],
      dialogue: [
        {
          personA: 'Luca',
          personA_content: 'A che ora ti svegli di solito?',
          personB: 'Maria',
          personB_content: 'Mi sveglio alle sei, ma mi alzo alle sei e mezza.',
        },
        {
          personA: 'Luca',
          personA_content: 'Ti fai la doccia subito?',
          personB: 'Maria',
          personB_content: 'No, prima faccio colazione e poi mi preparo.',
        }
      ],
    },
  ],
  '14': [
    {
      id: 'l14_1',
      title: 'A + Articolo (AL, ALLA...)',
      explanation: 'Cuando la preposición "A" (a/en) se encuentra con un artículo determinado, se fusionan.\n\n• A + il = AL (Al cinema)\n• A + lo = ALLO (Allo stadio)\n• A + l\' = ALL\' (All\'aeroporto)\n• A + la = ALLA (Alla stazione)\n• A + i = AI (Ai giardini)\n• A + gli = AGLI (Agli uffici)\n• A + le = ALLE (Alle sette)',
      phrases: [
        { italian: 'Vado al cinema stasera.', spanish: 'Voy al cine esta noche.' },
        { italian: 'Siamo alla stazione.', spanish: 'Estamos en la estación.' },
        { italian: 'Ci vediamo alle otto.', spanish: 'Nos vemos a las ocho.' },
      ],
    },
    {
      id: 'l14_2',
      title: 'DI / DA Articolate',
      explanation: 'Indican posesión, origen o procedencia.\n\nDI (de):\n• DI + il = DEL\n• DI + la = DELLA\n\nDA (de/desde):\n• DA + il = DAL (Vengo dal medico)\n• DA + la = DALLA (Vengo dalla Spagna)',
      phrases: [
        { italian: 'Il libro del professore.', spanish: 'El libro del profesor.' },
        { italian: 'Il profumo della rosa.', spanish: 'El perfume de la rosa.' },
        { italian: 'Vengo dal centro.', spanish: 'Vengo del centro.' },
      ],
    },
    {
      id: 'l14_3',
      title: 'IN + Articolo (NEL, NELLA...)',
      explanation: 'La preposición "IN" cambia radicalmente al unirse al artículo.\n\n• IN + il = NEL (Nel cassetto)\n• IN + lo = NELLO (Nello zaino)\n• IN + l\' = NELL\' (Nell\'ufficio)\n• IN + la = NELLA (Nella borsa)\n• IN + i = NEI (Nei libri)\n• IN + gli = NEGLI (Negli Stati Uniti)\n• IN + le = NELLE (Nelle scatole)',
      phrases: [
        { italian: 'Le chiavi sono nella borsa.', spanish: 'Las llaves están en el bolso.' },
        { italian: 'Il libro è nel cassetto.', spanish: 'El libro está en el cajón.' },
        { italian: 'Abito negli Stati Uniti.', spanish: 'Vivo en los Estados Unidos.' },
      ],
    },
  ],
  '15': [
    {
      id: 'l15_1',
      title: 'Pronombres Directos (Lo, La, Li, Le)',
      explanation: 'Sustituyen al objeto directo para no repetirlo.\n\n• Lo (lo/él): masculine sing.\n• La (la/ella): feminine sing.\n• Li (los): masculine plural.\n• Le (las): feminine plural.',
      phrases: [
        { italian: 'Compri il pane? Sì, lo compro.', spanish: '¿Compras el pan? Sí, lo compro.' },
        { italian: 'Vedi Maria? Sì, la vedo.', spanish: '¿Ves a Maria? Sí, la veo.' },
        { italian: 'Leggi i libri? Sì, li leggo.', spanish: '¿Lees los libros? Sí, los leo.' },
        { italian: 'Mangi le mele? Sì, le mangio.', spanish: '¿Comes las manzanas? Sí, las como.' },
      ],
    },
    {
      id: 'l15_2',
      title: 'Posición del pronombre',
      explanation: 'Normalmente va ANTES del verbo conjugado.\n\nEjemplo: "Lo cerco" (Lo busco).\n\nCon infinitivos, se puede pegar al final: "Voglio comprarlo" (Quiero comprarlo).',
      phrases: [
        { italian: 'Ti chiamo domani.', spanish: 'Te llamo mañana.' },
        { italian: 'Posso aiutarti?', spanish: '¿Puedo ayudarte?' },
        { italian: 'Non lo so.', spanish: 'No lo sé.' },
      ],
    },
  ],
  '16': [
    {
      id: 'l16_1',
      title: 'Al Ristorante',
      explanation: 'Frases clave para pedir comida y beber.\n\n• Vorrei... (Quisiera...)\n• Il conto, per favore. (La cuenta, por favor.)\n• Prenotare un tavolo. (Reservar un mesa.)',
      phrases: [
        { italian: 'Vorrei una pizza margherita.', spanish: 'Quisiera una pizza margarita.' },
        { italian: 'Posso avere il menù?', spanish: '¿Puedo tener el menú?' },
        { italian: 'Siete pronti per ordinare?', spanish: '¿Estáis listos para pedir?' },
      ],
    },
    {
      id: 'l16_2',
      title: 'Quanto costa?',
      explanation: 'Interacciones básicas de compra.\n\n• Quanto costa? (¿Cuánto cuesta?)\n• È troppo caro. (Es demasiado caro.)\n• Posso provare questo? (¿Puedo probarme esto?)',
      phrases: [
        { italian: 'Quanto costano questi scarponi?', spanish: '¿Cuánto cuestan estas botas?' },
        { italian: 'Accettate carte di credito?', spanish: '¿Aceptáis tarjetas de crédito?' },
        { italian: 'C\'è uno sconto?', spanish: '¿Hay un descuento?' },
      ],
    },
  ],
  '17': [
    {
      id: 'l17_1',
      title: 'Molto, Poco, Troppo',
      explanation: 'Adverbios de cantidad.\n\n• Molto (mucho/muy)\n• Poco (poco)\n• Troppo (demasiado)\n• Abbastanza (suficiente)',
      phrases: [
        { italian: 'Sono molto stanco.', spanish: 'Estoy muy cansado.' },
        { italian: 'Mangi troppo zucchero.', spanish: 'Comes demasiada azúcar.' },
        { italian: 'Ho poco tempo.', spanish: 'Tengo poco tiempo.' },
      ],
    },
    {
      id: 'l17_2',
      title: 'Sempre, Spesso, Mai',
      explanation: 'Adverbios de frecuencia.\n\n• Sempre (siempre)\n• Spesso (a menudo)\n• Qualche volta (a veces)\n• Mai (nunca) -> se usa con "non": "Non fumo mai".',
      phrases: [
        { italian: 'Vado sempre in palestra.', spanish: 'Voy siempre al gimnasio.' },
        { italian: 'Non vado mai al cinema.', spanish: 'Nunca voy al cine.' },
        { italian: 'Esco spesso con gli amici.', spanish: 'Salgo a menudo con los amigos.' },
      ],
    },
  ],
  '18': [
    {
      id: 'l18_1',
      title: "L'Imperfetto: Conjugación",
      explanation: 'El imperfecto se usa para hábitos o estados en el pasado. Las terminaciones son regulares:\n\n• -ARE: -avo, -avi, -ava, -avamo, -avate, -avano\n• -ERE: -evo, -evi, -eva, -evamo, -evate, -evano\n• -IRE: -ivo, -ivi, -iva, -ivamo, -ivate, -ivano',
      phrases: [
        { italian: 'Io parlavo sempre.', spanish: 'Yo hablaba siempre.' },
        { italian: 'Tu correvi nel parco.', spanish: 'Tú corrías en el parque.' },
        { italian: 'Noi dormivamo molto.', spanish: 'Nosotros dormíamos mucho.' },
      ],
    },
    {
      id: 'l18_2',
      title: 'Hábitos y Descripciones',
      explanation: 'Se usa para decir "yo solía" o para descripciones físicas/meteorológicas.\n\n• Da bambino leggevo i fumetti. (De niño leía cómics.)\n• C\'era il sole. (Hacía sol.)',
      phrases: [
        { italian: 'Quando ero piccolo...', spanish: 'Cuando era pequeño.' },
        { italian: 'Lui aveva i capelli biondi.', spanish: 'Él tenía el pelo rubio.' },
        { italian: 'Faceva freddo ieri.', spanish: 'Hacía frío ayer.' },
      ],
    },
  ],
  '19': [
    {
      id: 'l19_1',
      title: 'Futuro Simple: Conjugación',
      explanation: 'Para proyectos y predicciones. Las terminaciones son iguales para -ARE y -ERE (cambiando la vocal temática a E):\n\n• -ò, -ai, -à, -emo, -ete, -anno.\n\nEjemplos: parlerò, leggerò, partirò.',
      phrases: [
        { italian: 'Domani andrò al mare.', spanish: 'Mañana iré al mar.' },
        { italian: 'Finiremo il lavoro presto.', spanish: 'Terminaremos el trabajo pronto.' },
        { italian: 'Pioverà stasera.', spanish: 'Lloverá esta noche.' },
      ],
    },
  ],
  '20': [
    {
      id: 'l20_1',
      title: 'Condicional de Cortesía',
      explanation: 'Se usa para pedir cosas amablemente o expresar deseos.\n\n• Vorrei... (Querría/Quisiera)\n• Mi piacerebbe... (Me gustaría)',
      phrases: [
        { italian: 'Vorrei un bicchiere d\'acqua.', spanish: 'Quisiera un vaso de agua.' },
        { italian: 'Mi piacerebbe visitare Roma.', spanish: 'Me gustaría visitar Roma.' },
        { italian: 'Potresti aiutarmi?', spanish: '¿Podrías ayudarme?' },
      ],
    },
  ],
  '21': [
    {
      id: 'l21_1',
      title: 'Pronombres Indirectos',
      explanation: 'Responden a "¿A quién?".\n\n• Mi (a mí)\n• Ti (a ti)\n• Gli (a él)\n• Le (a ella)\n• Ci (a nosotros)\n• Vi (a vosotros)\n• Loro (a ellos)',
      phrases: [
        { italian: 'Ti regalo un libro.', spanish: 'Te regalo un libro.' },
        { italian: 'Le scrivo una mail.', spanish: 'Le escribo un email (a ella).' },
        { italian: 'Gli telefono dopo.', spanish: 'Le telefoneo después (a él).' },
      ],
    },
  ],
  '22': [
    {
      id: 'l22_1',
      title: 'La Comparación',
      explanation: '• Más que: Più... di/che\n• Menos que: Meno... di/che\n• Tan como: Così... come / tanto... quanto',
      phrases: [
        { italian: 'Roma è più vecchia di Milano.', spanish: 'Roma es más vieja que Milán.' },
        { italian: 'Lui è meno alto di me.', spanish: 'Él es menos alto que yo.' },
        { italian: 'Sei bella come tua madre.', spanish: 'Eres tan bella como tu madre.' },
      ],
    },
  ],
  '23': [
    {
      id: 'l23_1',
      title: 'Particella CI (Lugar)',
      explanation: 'Sustituye a un lugar ya mencionado para no repetirlo (allí).\n\n• Vai a Roma? Sì, ci vado.',
      phrases: [
        { italian: 'Vado in banca. Ci vai anche tu?', spanish: 'Voy al banco. ¿Vas tú también?' },
        { italian: 'Non ci sono stato.', spanish: 'No he estado allí.' },
      ],
    },
    {
      id: 'l23_2',
      title: 'Particella NE (Cantidad)',
      explanation: 'Sustituye a una cantidad o parte de algo.\n\n• Quanti caffè prendi? Ne prendo due.',
      phrases: [
        { italian: 'Hai delle mele? Sì, ne ho tre.', spanish: '¿Tienes manzanas? Sí, tengo tres.' },
        { italian: 'Non ne voglio parlare.', spanish: 'No quiero hablar de ello.' },
      ],
    },
  ],
  '24': [
    {
      id: 'l24_1',
      title: 'Il Congiuntivo Presente (Opinión)',
      explanation: 'Se usa para expresar opiniones, dudas, deseos o estados de ánimo después de "che".\n\n• Credo che lui sia stanco.\n• Penso che voi abbiate ragione.',
      phrases: [
        { italian: 'Credo che lui sia a casa.', spanish: 'Creo que él está en casa.' },
        { italian: 'Spero che tu stia bene.', spanish: 'Espero que estés bien.' },
        { italian: 'Penso che sia tardi.', spanish: 'Pienso que es tarde.' },
      ],
    },
    {
      id: 'l24_2',
      title: 'Verbi di Volontà',
      explanation: 'Voglio che, preferisco che, esigo che...\n\n• Voglio che tu sia felice.',
      phrases: [
        { italian: 'Voglio che veniate alla festa.', spanish: 'Quiero que vengáis a la fiesta.' },
        { italian: 'Preferisco che tu rimanga.', spanish: 'Prefiero que te quedes.' },
      ],
    },
  ],
  '25': [
    {
      id: 'l25_1',
      title: 'Congiuntivo Imperfetto',
      explanation: 'Se usa para condiciones hipotéticas o deseos improbables (irrealidad).\n\n• Se avessi tempo, viaggerei.',
      phrases: [
        { italian: 'Se fossi ricco, comprerei una barca.', spanish: 'Si fuera rico, compraría un barco.' },
        { italian: 'Magari piovesse!', spanish: '¡Ojalá lloviera!' },
      ],
    },
  ],
  '26': [
    {
      id: 'l26_1',
      title: 'Condizionale Composto',
      explanation: 'Hipótesis en el pasado: algo que habría ocurrido pero no fue así.\n\n• Sarei andato, ma pioveva.',
      phrases: [
        { italian: 'Avrei mangiato volentieri.', spanish: 'Habría comido con gusto.' },
        { italian: 'Saremmo venuti ieri.', spanish: 'Habríamos venido ayer.' },
      ],
    },
  ],
  '27': [
    {
      id: 'l27_1',
      title: 'Pronomi Combinati',
      explanation: 'Combinación de pronombre indirecto (mi, ti, gli...) + directo (lo, la, li, le, ne).\n\n• Me lo dici? (¿Me lo dices?)\n• Glielo do. (Se lo doy a él/ella).',
      phrases: [
        { italian: 'Te lo porto domani.', spanish: 'Te lo traigo mañana.' },
        { italian: 'Glielo abbiamo detto.', spanish: 'Se lo hemos dicho.' },
        { italian: 'Ce ne sono molti.', spanish: 'Hay muchos de ellos.' },
      ],
    },
  ],
  '28': [
    {
      id: 'l28_1',
      title: 'Trapassato Prossimo',
      explanation: 'Indica una acción pasada ocurrida antes de otra acción también pasada.\n\n• Quando sei arrivato, io avevo già mangiato.',
      phrases: [
        { italian: 'Avevo già finito il lavoro.', spanish: 'Ya había terminado el trabajo.' },
        { italian: 'Eran già partiti.', spanish: 'Ya se habían ido.' },
      ],
    },
  ],
  '29': [
    {
      id: 'l29_1',
      title: 'La Forma Passiva',
      explanation: 'El sujeto recibe la acción. Se forma con ESSERE o VENIRE + Participio Pasado.\n\n• La torta è stata mangiata da Marco.',
      phrases: [
        { italian: 'Il libro è letto da molti.', spanish: 'El libro es leído por muchos.' },
        { italian: 'La casa fu costruita nel 1900.', spanish: 'La casa fue construida en el 1900.' },
      ],
    },
  ],
  '30': [
    {
      id: 'l30_1',
      title: 'Il Discorso Indiretto',
      explanation: 'Para reportar lo que alguien dijo. Implica cambios de tiempos verbales si el verbo principal está en pasado.',
      phrases: [
        { italian: 'Lui ha detto che sarebbe venuto.', spanish: 'Él dijo que vendría.' },
        { italian: 'Mi ha chiesto dove andassi.', spanish: 'Me preguntó a dónde iba.' },
      ],
    },
  ],
  // 31. Passato Remoto
  '31': [
    {
      id: 'l31_1',
      title: 'Passato Remoto',
      explanation: 'Esencial para leer a los clásicos y relatos históricos.',
      phrases: [
        { italian: 'Dante scrisse la Commedia.', spanish: 'Dante escribió la Comedia.' },
        { italian: 'Andai a trovarlo molti anni fa.', spanish: 'Fui a visitarlo hace muchos años.' },
      ],
    },
    {
      id: 'l31_2',
      title: 'Irregolari Comuni',
      explanation: 'Fui, ebbi, feci, dissi.',
      phrases: [
        { italian: 'Fu un grande onore.', spanish: 'Fue un gran honor.' },
        { italian: 'Fece quello che poté.', spanish: 'Hizo lo que pudo.' },
      ],
    },
  ],
  // 32. Periodo Ipotetico
  '32': [
    {
      id: 'l32_1',
      title: 'Periodo Ipotetico',
      explanation: 'Domina las condiciones de tercer grado (impossibilità).',
      phrases: [
        { italian: 'Se avessi studiato, avrei passato l\'esame.', spanish: 'Si hubiera estudiado, habría pasado el examen.' },
        { italian: 'Se fossi nato a Roma, sarei romano.', spanish: 'Si hubiera nacido en Roma, sería romano.' },
      ],
    },
  ],
  // 33. Modismi e Proverbi
  '33': [
    {
      id: 'l33_1',
      title: 'Modismi e Proverbi',
      explanation: 'Expresiones idiomáticas y sabiduría popular.',
      phrases: [
        { italian: 'In bocca al lupo!', spanish: '¡Buena suerte! (lit: en la boca del lobo)' },
        { italian: 'Acqua in bocca!', spanish: '¡Silencio! (lit: agua en la boca)' },
      ],
    },
  ],
  // 34. Linguaggio Settoriale
  '34': [
    {
      id: 'l34_1',
      title: 'Linguaggio Settoriale',
      explanation: 'Vocabulario especializado para profesionales.',
      phrases: [
        { italian: 'Il contratto è stato risolto.', spanish: 'El contrato ha sido rescindido.' },
        { italian: 'Il fatturato è in crescita.', spanish: 'La facturación está en crecimiento.' },
      ],
    },
  ],
};

export const exercises: Exercise[] = [
  // 0. Fonética y Alfabeto
  { id: 'e0_1', lessonId: '0', subtopic: 'Los sonidos de la "C" y la "G"', question: '¿Cómo se pronuncia la palabra "CIAO"?', options: ['Kiao', 'Chao', 'Siao', 'Giao'], correctAnswer: 'Chao', tip: 'C + i suena como "CH".' },
  { id: 'e0_2', lessonId: '0', subtopic: 'La "GLI" y la "GN"', question: '¿Qué sonido tiene "GN" en "GNOCCHI"?', options: ['Como una G', 'Como una Ñ', 'Como una N', 'Como una L'], correctAnswer: 'Como una Ñ', tip: 'GN suena como la Ñ española.' },
  { id: 'e0_3', lessonId: '0', subtopic: 'Los sonidos de la "C" y la "G"', question: '¿Cómo suena la "G" en "GELATO"?', options: ['Como G de Gato', 'Como J/Y suave', 'Como S', 'Es muda'], correctAnswer: 'Como J/Y suave', tip: 'G + e suena suave, parecido a una Y.' },
  { id: 'e0_4', lessonId: '0', subtopic: 'El Alfabeto Italiano', question: '¿Cuántas letras básicas tiene el alfabeto italiano?', options: ['21', '26', '24', '19'], correctAnswer: '21', tip: 'El italiano tiene 21 letras; J, K, W, X, Y son para palabras extranjeras.' },
  { id: 'e0_5', lessonId: '0', subtopic: 'Los sonidos de la "C" y la "G"', question: '¿Cómo suena "CH" en "CHIESA"?', options: ['Como CH de Chocolate', 'Como K', 'Como S', 'Es muda'], correctAnswer: 'Como K', tip: 'CH en italiano siempre suena como K.' },
  { id: 'e0_6', lessonId: '0', subtopic: 'El Alfabeto Italiano', question: '¿Cómo se pronuncia la letra "H" en italiano?', options: ['Como J', 'Es muda', 'Como G suave', 'Como S aspirada'], correctAnswer: 'Es muda', tip: 'La letra H (acca) es siempre muda en italiano.' },
  { id: 'e0_7', lessonId: '0', subtopic: 'La "GLI" y la "GN"', question: '¿Cómo se pronuncia "FAMIGLIA"?', options: ['Fa-mi-glia', 'Fa-mi-lli-a', 'Fa-mi-gi-a', 'Fa-mi-ia'], correctAnswer: 'Fa-mi-lli-a', tip: 'GLI suena como una LL líquida o "lli".' },
  { id: 'e0_8', lessonId: '0', subtopic: 'Los sonidos de la "C" y la "G"', question: '¿Cómo suena "G" antes de "A" (GATTO)?', options: ['Suave (Y)', 'Fuerte (G de Gato)', 'Como J', 'Es muda'], correctAnswer: 'Fuerte (G de Gato)', tip: 'G + a/o/u es un sonido de G pura.' },
  { id: 'e0_9', lessonId: '0', subtopic: 'Los sonidos de la "C" y la "G"', question: '¿Cómo se escribe el sonido "KE" en italiano?', options: ['CE', 'CHE', 'KE', 'QUE'], correctAnswer: 'CHE', tip: 'Para el sonido K seguido de E, usamos CHE.' },
  { id: 'e0_10', lessonId: '0', subtopic: 'Doppie Consonanti', question: 'En italiano, las consonantes dobles (como en "Pizza")...', options: ['Se pronuncian igual', 'Se alargan o enfatizan', 'La segunda es muda', 'Dan un sonido suave'], correctAnswer: 'Se alargan o enfatizan', tip: 'Las dobles consonantes son clave; se deben pronunciar con más fuerza.' },

  // 1. Saluti essenziali (Saludos)
  // Diferencia entre formal e informal
  { id: 'e1', lessonId: '1', subtopic: 'Diferencia entre formal e informal', question: 'A: Buongiorno! B: _______, come stai?', options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Arrivederci'], correctAnswer: 'Buongiorno', tip: 'Regla: Formal/Informal - Buongiorno es neutral/formal.' },
  { id: 'e1_1', lessonId: '1', subtopic: 'Diferencia entre formal e informal', question: '"Ciao" si usa in situazioni _______', options: ['Formali', 'Informali', 'A scuola', 'In banca'], correctAnswer: 'Informali', tip: 'Regla: Formal/Informal - Ciao es informal.' },
  { id: 'e1_2', lessonId: '1', subtopic: 'Diferencia entre formal e informal', question: 'Para saludar formalmente a un profesor dices:', options: ['Ciao!', 'Buongiorno!', 'Ehi!', 'Mandi!'], correctAnswer: 'Buongiorno!', tip: 'Regla: Formal/Informal - Buongiorno se usa en contextos neutros o formales.' },

  // Ejemplos prácticos
  { id: 'e2', lessonId: '1', subtopic: 'Ejemplos prácticos', question: 'A: Ciao Maria! B: ______, come va?', options: ['Salve', 'Ciao', 'Piacere', 'Prego'], correctAnswer: 'Ciao', tip: 'Regla: Saludos - Ciao se usa tanto para hola como para adiós.' },
  { id: 'e2_1', lessonId: '1', subtopic: 'Ejemplos prácticos', question: '¿Cómo se dice "Hasta pronto" en italiano?', options: ['A dopo', 'A presto', 'A domani', 'Arrivederci'], correctAnswer: 'A presto', tip: 'Regla: Despedidas - A presto significa hasta pronto.' },
  { id: 'e2_2', lessonId: '1', subtopic: 'Ejemplos prácticos', question: '¿Cómo saludas antes de ir a dormir?', options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Ciao'], correctAnswer: 'Buonanotte', tip: 'Regla: Saludos - Buonanotte se usa al ir a la cama.' },

  // Mini diálogo
  { id: 'e3', lessonId: '1', subtopic: 'Mini diálogo', question: 'A: Come stai? B: Molto _____, grazie.', options: ['male', 'bene', 'così così', 'prego'], correctAnswer: 'bene', tip: 'Regla: Diálogo - Respuesta estándar de cortesía.' },
  { id: 'e3_1', lessonId: '1', subtopic: 'Mini diálogo', question: 'A: Come ti chiami? B: _______ Marco.', options: ['Sono', 'Ho', 'Faccio', 'Vado'], correctAnswer: 'Sono', tip: 'Regla: Diálogo - "Sono" para presentarse.' },

  // Presentaciones
  { id: 'e1_pr1', lessonId: '1', subtopic: 'Presentaciones', question: '¿Cómo dices "Me llamo Marco"?', options: ['Io sono Marco', 'Mi chiamo Marco', 'Piacere Marco', 'Marco sono'], correctAnswer: 'Mi chiamo Marco', tip: 'Se usa "Mi chiamo" para decir el nombre.' },
  { id: 'e1_pr2', lessonId: '1', subtopic: 'Presentaciones', question: '¿Qué significa "Piacere"?', options: ['Por favor', 'Mucho gusto', 'Gracias', 'Hola'], correctAnswer: 'Mucho gusto', tip: 'Piacere se usa al conocer a alguien.' },
  { id: 'e1_pr3', lessonId: '1', subtopic: 'Presentaciones', question: '¿Cómo dices "Soy español"?', options: ['Io sono spagnolo', 'Io ho spagnolo', 'Mi chiamo spagnolo', 'Piacere spagnolo'], correctAnswer: 'Io sono spagnolo', tip: 'Se usa el verbo essere (sono) para la nacionalidad.' },

  // 2. Frases de supervivencia (Supervivencia)
  // La cortesía en Italia
  { id: 'e13', lessonId: '2', subtopic: 'La cortesía en Italia', question: 'Para pedir algo amablemente dices: "_______ un caffè".', options: ['Voglio', 'Vorrei', 'Prendo', 'Damm'], correctAnswer: 'Vorrei', tip: 'Regla: Cortesía - Vorrei (quisiera) es más educado que voglio (quiero).' },
  { id: 'e13_1', lessonId: '2', subtopic: 'La cortesía en Italia', question: 'A: Mi _______, posso passare? B: Certo, prego.', options: ['Scusa', 'Scusi', 'Grazie', 'Ciao'], correctAnswer: 'Scusi', tip: 'Regla: Cortesía - Scusi es la forma formal de pedir permiso.' },

  // 12. Verbos Regulares (-ARE, -ERE, -IRE)
  { id: 'e12_1', lessonId: '12', subtopic: 'Verbos en -ARE (1ª Conjugación)', question: '¿Cómo se conjuga "PARLARE" para "IO"?', options: ['Parlo', 'Parli', 'Parla', 'Parlate'], correctAnswer: 'Parlo', tip: 'En -ARE, la terminación para "Io" es siempre "-o".' },
  { id: 'e12_2', lessonId: '12', subtopic: 'Verbos en -ARE (1ª Conjugación)', question: 'Noi _______ (abitare) a Milano.', options: ['abitiamo', 'abitano', 'abitate', 'abiti'], correctAnswer: 'abitiamo', tip: 'La terminación para "Noi" es "-iamo" en todas las conjugaciones.' },
  { id: 'e12_3', lessonId: '12', subtopic: 'Verbos en -ARE (1ª Conjugación)', question: 'Voi _______ (cantare) muy bien.', options: ['cantate', 'cantano', 'cantiamo', 'canta'], correctAnswer: 'cantate', tip: 'Para "Voi" en verbos -ARE usamos "-ate".' },
  { id: 'e12_4', lessonId: '12', subtopic: 'Verbos en -ERE (2ª Conjugación)', question: 'Lui _______ (prendere) un treno.', options: ['prende', 'prendo', 'prendi', 'prendiamo'], correctAnswer: 'prende', tip: 'En verbos -ERE, la 3ª persona singular termina en "-e".' },
  { id: 'e12_5', lessonId: '12', subtopic: 'Verbos en -ERE (2ª Conjugación)', question: 'Io _______ (vedere) la TV.', options: ['vedete', 'vedi', 'vedo', 'vedono'], correctAnswer: 'vedo', tip: 'Casi todos los verbos en presente terminan en "-o" para la 1ª persona.' },
  { id: 'e12_6', lessonId: '12', subtopic: 'Verbos en -ERE (2ª Conjugación)', question: 'Loro _______ (leggere) molto.', options: ['leggono', 'leggiamo', 'leggete', 'legge'], correctAnswer: 'leggono', tip: 'Para "Loro" en verbos -ERE usamos "-ono".' },
  { id: 'e12_7', lessonId: '12', subtopic: 'Verbos en -IRE (3ª Conjugación)', question: 'Il treno _______ (partire) adesso.', options: ['parto', 'parte', 'partono', 'parti'], correctAnswer: 'parte', tip: 'Partire es de la 3ª conjugación (-IRE), termina en "-e" para Lui/Lei.' },
  { id: 'e12_8', lessonId: '12', subtopic: 'Verbos en -IRE (3ª Conjugación)', question: 'Io _______ (dormire) otto ore.', options: ['dormi', 'dormo', 'dormite', 'dormono'], correctAnswer: 'dormo', tip: 'La 1ª persona siempre es "-o".' },
  { id: 'e12_9', lessonId: '12', subtopic: 'Verbos en -IRE (3ª Conjugación)', question: 'Voi _______ (aprire) la finestra.', options: ['aprite', 'aprono', 'apri', 'apriamo'], correctAnswer: 'aprite', tip: 'Para "Voi" en verbos -IRE usamos "-ite".' },
  { id: 'e12_10', lessonId: '12', subtopic: 'Verbos en -ARE (1ª Conjugación)', question: 'Loro _______ (mangiare) la pasta.', options: ['mangi', 'mangiate', 'mangiano', 'mangia'], correctAnswer: 'mangiano', tip: 'Para "Loro" en verbos -ARE usamos "-ano".' },
  { id: 'e12_11', lessonId: '12', subtopic: 'Verbos en -ERE (2ª Conjugación)', question: 'Noi _______ (scrivere) una lettera.', options: ['scriviamo', 'scrivete', 'scrivono', 'scrive'], correctAnswer: 'scriviamo', tip: '-iamo es universal para "Noi".' },
  { id: 'e12_12', lessonId: '12', subtopic: 'Verbos en -IRE (3ª Conjugación)', question: 'Tu _______ (partire) domani?', options: ['parto', 'parti', 'parte', 'partiamo'], correctAnswer: 'parti', tip: 'La 2ª persona "Tu" siempre termina en "-i".' },
  { id: 'e14', lessonId: '2', subtopic: 'Frases clave', question: '¿Cómo se pregunta "¿Cuánto cuesta?"?', options: ['Come va?', 'Quanto costa?', 'Dove sei?', 'Che cosa?'], correctAnswer: 'Quanto costa?', tip: 'Regla: Compras - Quanto costa para preguntar el precio.' },
  { id: 'e15', lessonId: '2', subtopic: 'Frases clave', question: 'Si no entiendes algo, dices: "Non _______".', options: ['so', 'capisco', 'voglio', 'parlo'], correctAnswer: 'capisco', tip: 'Regla: Supervivencia - Non capisco significa no entiendo.' },
  { id: 'e16', lessonId: '2', subtopic: 'Frases clave', question: '¿Cómo preguntas dónde está el baño?', options: ['Dove si trova il bagno?', 'Chi è il baño?', 'Perché il bagno?', 'Come il bagno?'], correctAnswer: 'Dove si trova il baño?', tip: 'Regla: Supervivencia - Dove si trova para preguntar ubicación.' },

  // Diálogo útil
  { id: 'e17', lessonId: '2', subtopic: 'Diálogo útil', question: 'A: Posso pagare con carta? B: Sì, _______.', options: ['Certo', 'No', 'Perché', 'Quando'], correctAnswer: 'Certo', tip: 'Regla: Diálogo - Certo (claro) es una respuesta común.' },
  { id: 'e18', lessonId: '2', subtopic: 'Diálogo útil', question: 'A: Grazie. B: _______.', options: ['Prego', 'Scusa', 'Salve', 'Ciao'], correctAnswer: 'Prego', tip: 'Regla: Diálogo - Respuesta estándar a gracias.' },
  { id: 'e19', lessonId: '2', subtopic: 'Diálogo útil', question: 'A: Vorrei un caffè, per favore. B: Subito, sono _______ euro.', options: ['due', 'cinque', 'dieci', 'uno'], correctAnswer: 'due', tip: 'Regla: Diálogo - Números básicos para el pago.' },

  // 3. Artículos y géneros
  { id: 'e25_1', lessonId: '3', subtopic: 'Artículos Determinativos', question: '_______ cane (maschile) dorme sul divano.', options: ['Il', 'Lo', 'La', 'I'], correctAnswer: 'Il', tip: 'Regla: "Cane" es masculino singular que empieza con consonante, usa IL.' },
  { id: 'e25_2', lessonId: '3', subtopic: 'Artículos Indeterminativos', question: 'Vorrei _______ caffè, per favore.', options: ['un', 'uno', 'una', 'un\''], correctAnswer: 'un', tip: 'Regla: "Caffè" es masculino que empieza con consonante, usa UN.' },
  { id: 'e25_3', lessonId: '3', subtopic: 'Formación del plural', question: 'Il libro → I _______', options: ['libri', 'libre', 'libra', 'libria'], correctAnswer: 'libri', tip: 'Regla: Las palabras masculinas en -o cambian a -i en plural.' },
  { id: 'e25_4', lessonId: '3', subtopic: 'Pronunciación especial', question: '_______ zaino è nuovo.', options: ['Il', 'Lo', 'La', 'L\''], correctAnswer: 'Lo', tip: 'Regla: Las palabras masculinas que empiezan con Z usan LO.' },
  { id: 'e25_5', lessonId: '3', subtopic: 'Artículos Partitivos', question: 'Vorrei _______ pane.', options: ['del', 'dello', 'della', 'dei'], correctAnswer: 'del', tip: 'Regla: "Pane" es masculino singular con consonante, usamos DEL (di + il).' },
  { id: 'e25_6', lessonId: '3', subtopic: 'Artículos Determinativos', question: '_______ amica di Maria è simpatica.', options: ['Il', 'Lo', 'La', 'L\''], correctAnswer: 'L\'', tip: 'Regla: Las palabras femeninas que empiezan con vocal usan L\'.' },
  { id: 'e25_7', lessonId: '3', subtopic: 'Artículos Indeterminativos', question: 'Dov’è _______ studente?', options: ['un', 'uno', 'una', 'un\''], correctAnswer: 'uno', tip: 'Regla: "Studente" empieza con S+consonante, usa UNO.' },
  { id: 'e25_8', lessonId: '3', subtopic: 'Formación del plural', question: 'La ragazza → Le _______', options: ['ragazzi', 'ragazze', 'ragazza', 'ragazzo'], correctAnswer: 'ragazze', tip: 'Regla: Las palabras femeninas en -a cambian a -e en plural.' },
  { id: 'e25_9', lessonId: '3', subtopic: 'Pronunciación especial', question: '_______ amici sono simpatici.', options: ['I', 'Gli', 'Le', 'Lo'], correctAnswer: 'Gli', tip: 'Regla: El plural masculino para palabras que empiezan con vocal es GLI.' },
  { id: 'e25_10', lessonId: '3', subtopic: 'Artículos Partitivos', question: 'Prendi _______ zucchero?', options: ['del', 'dello', 'della', 'dell\''], correctAnswer: 'dello', tip: 'Regla: "Zucchero" empieza con Z, usamos DELLO (di + lo).' },

  // 4. Verbi più usati (Verbos)
  { id: 'e37', lessonId: '4', subtopic: 'Verbos fundamentales', question: 'A: Come ti chiami? B: Io _______ Marco.', options: ['ho', 'sono', 'faccio', 'vado'], correctAnswer: 'sono', tip: 'Regla: Verbos - Essere se usa para identidad y nombres.' },
  { id: 'e38', lessonId: '4', subtopic: 'Verbos fundamentales', question: 'A: Quanti anni hai? B: Io _______ venticinque anni.', options: ['sono', 'ho', 'faccio', 'vado'], correctAnswer: 'ho', tip: 'Regla: Verbos - Avere se usa para expresar la edad, no essere.' },
  { id: 'e39', lessonId: '4', subtopic: 'Verbos fundamentales', question: 'A: Dove vai? B: _______ a casa.', options: ['Faccio', 'Vado', 'Sono', 'Ho'], correctAnswer: 'Vado', tip: 'Regla: Verbos - Andare (vado) indica movimiento hacia un lugar.' },
  
  // Ejemplos prácticos
  { id: 'e40', lessonId: '4', subtopic: 'Ejemplos prácticos', question: 'A: Cosa fai stasera? B: _______ la pasta per cena.', options: ['Faccio', 'Ho', 'Vado', 'Sono'], correctAnswer: 'Faccio', tip: 'Regla: Ejemplos - Fare (faccio) se usa para actividades diarias.' },
  { id: 'e41', lessonId: '4', subtopic: 'Ejemplos prácticos', question: 'A: Dove sono i ragazzi? B: Loro _______ al parco.', options: ['hanno', 'fanno', 'sono', 'vanno'], correctAnswer: 'sono', tip: 'Regla: Ejemplos - Sono es el plural de essere.' },
  { id: 'e42', lessonId: '4', subtopic: 'Ejemplos prácticos', question: 'A: Avete fame? B: Sì, noi _______ molta fame.', options: ['siamo', 'facciamo', 'abbiamo', 'andiamo'], correctAnswer: 'abbiamo', tip: 'Regla: Ejemplos - Abbiamo es el plural de avere.' },

  // Mini conversación
  { id: 'e43_1', lessonId: '4', subtopic: 'Mini conversación', question: 'A: Posso entrare? B: Sì, _______!', options: ['Certo', 'No', 'Sempre', 'Dove'], correctAnswer: 'Certo', tip: 'Regla: Diálogo - Certo (claro) para conceder permiso.' },
  { id: 'e43_2', lessonId: '4', subtopic: 'Mini conversación', question: 'A: Devo andare. B: _______, a domani!', options: ['Grazie', 'Ciao', 'Prego', 'Scusa'], correctAnswer: 'Ciao', tip: 'Regla: Diálogo - Ciao como despedida.' },

  // 5. Espressioni utili (Expresiones)
  // Frases fundamentales
  { id: 'e49', lessonId: '5', subtopic: 'Frases fundamentales', question: 'A: Domani ho un esame. B: In _______ al lupo!', options: ['testa', 'bocca', 'pancia', 'mano'], correctAnswer: 'bocca', tip: 'Regla: Modismos - "In bocca al lupo" es desear buena suerte.' },
  { id: 'e50', lessonId: '5', subtopic: 'Frases fundamentales', question: 'A: Grazie per l’aiuto. B: _______, è stato un piacere!', options: ['Figurati', 'Peccato', 'Magari', 'Allora'], correctAnswer: 'Figurati', tip: 'Regla: Modismos - Figurati es una forma amable de decir de nada.' },
  { id: 'e51_1', lessonId: '5', subtopic: 'Frases fundamentales', question: '¿Cómo se dice "Me gusta" en italiano?', options: ['Mi piace', 'Non mi piace', 'Voglio', 'Ho bisogno'], correctAnswer: 'Mi piace', tip: 'Regla: Preferencias - Mi piace para cosas en singular.' },

  // Ejemplos de uso
  { id: 'e52', lessonId: '5', subtopic: 'Ejemplos de uso', question: 'A: Hai vinto la lotteria? B: _______! Purtroppo no.', options: ['Allora', 'Magari', 'Figurati', 'Peccato'], correctAnswer: 'Magari', tip: 'Regla: Expresiones - Magari expresa un fuerte deseo (ojalá).' },
  { id: 'e53', lessonId: '5', subtopic: 'Ejemplos de uso', question: 'A: È finita la vacanza. B: Che _______!', options: ['bello', 'peccato', 'piacere', 'prego'], correctAnswer: 'peccato', tip: 'Regla: Expresiones - Peccato se usa para expresar lástima o disgusto.' },
  { id: 'e54_1', lessonId: '5', subtopic: 'Ejemplos de uso', question: 'A: Ho perso l’autobus. B: _______ male che ne passa un altro presto.', options: ['Meno', 'Più', 'Molto', 'Troppo'], correctAnswer: 'Meno', tip: 'Regla: Expresiones - Meno male significa menos mal.' },

  // 6. Preguntare e rispondere (Preguntas)
  // Palabras clave
  { id: 'e61', lessonId: '6', subtopic: 'Palabras clave', question: '_______ è il tuo cantante preferito?', options: ['Cosa', 'Chi', 'Dove', 'Quando'], correctAnswer: 'Chi', tip: 'Regla: Preguntas - Chi significa quién.' },
  { id: 'e62', lessonId: '6', subtopic: 'Palabras clave', question: '_______ vai in vacanza quest’estate?', options: ['Quando', 'Cosa', 'Dove', 'Chi'], correctAnswer: 'Dove', tip: 'Regla: Preguntas - Dove significa dónde.' },
  { id: 'e63', lessonId: '6', subtopic: 'Palabras clave', question: '_______ costa un biglietto per Roma?', options: ['Quanto', 'Quale', 'Cosa', 'Chi'], correctAnswer: 'Quanto', tip: 'Regla: Preguntas - Quanto para precios y cantidades.' },
  { id: 'e64', lessonId: '6', subtopic: 'Ejemplos', question: '_______ torni a casa stasera?', options: ['Cosa', 'Quando', 'Chi', 'Dove'], correctAnswer: 'Quando', tip: 'Regla: Ejemplos - Quando para preguntar por el tiempo.' },
  { id: 'e65', lessonId: '6', subtopic: 'Ejemplos', question: 'A: _______ non mangi? B: Perché non ho fame.', options: ['Quanto', 'Chi', 'Perché', 'Quale'], correctAnswer: 'Perché', tip: 'Regla: Ejemplos - Perché para preguntar el motivo.' },
  { id: 'e66', lessonId: '6', question: '_______ preferisci, il rosso o il blu?', options: ['Chi', 'Quale', 'Quanto', 'Cosa'], correctAnswer: 'Quale', tip: 'Chiede di fare una scelta.' },
  { id: 'e67', lessonId: '6', question: '_______ mangi per cena stasera?', options: ['Chi', 'Cosa', 'Dove', 'Quando'], correctAnswer: 'Cosa', tip: 'Pregunta sobre objetos o acciones.' },
  { id: 'e68', lessonId: '6', subtopic: 'Pequeño diálogo', question: 'A: _______ ti chiami? B: Mi chiamo Luca.', options: ['Chi', 'Come', 'Cosa', 'Quale'], correctAnswer: 'Come', tip: 'Regla: Diálogo - Come para preguntar el nombre.' },
  { id: 'e68_1', lessonId: '6', subtopic: 'Pequeño diálogo', question: 'A: Di dove sei? B: _______ di Roma.', options: ['Sono', 'Ho', 'Faccio', 'Vado'], correctAnswer: 'Sono', tip: 'Regla: Diálogo - Sono para indicar origen.' },
  { id: 'e69', lessonId: '6', question: '_______ ore mancano all’inizio?', options: ['Quale', 'Quante', 'Chi', 'Quanto'], correctAnswer: 'Quante', tip: 'Plurale femminile per quantità.' },
  { id: 'e70', lessonId: '6', question: '_______ persone ci sono alla festa?', options: ['Quante', 'Quanti', 'Quale', 'Chi'], correctAnswer: 'Quante', tip: 'Quantità plurale.' },
  { id: 'e71', lessonId: '6', question: '_______ film guardiamo stasera?', options: ['Che', 'Chi', 'Quanto', 'Quando'], correctAnswer: 'Che', tip: 'Usato con un sostantivo.' },
  { id: 'e72', lessonId: '6', question: '_______ è la tua città preferita?', options: ['Dove', 'Chi', 'Qual è', 'Come'], correctAnswer: 'Qual è', tip: 'Selezione tra opzioni.' },

  // 7. Connettori (Conectores)
  // Conectores básicos
  { id: 'e73', lessonId: '7', subtopic: 'Conectores básicos', question: 'Voglio mangiare la pizza _______ il gelato.', options: ['ma', 'e', 'o', 'quindi'], correctAnswer: 'e', tip: 'Regla: Conectores - E sirve para unir elementos.' },
  { id: 'e74', lessonId: '7', subtopic: 'Conectores básicos', question: 'Mi piacerebbe uscire, _______ piove troppo.', options: ['e', 'quindi', 'ma', 'anche'], correctAnswer: 'ma', tip: 'Regla: Conectores - Ma indica contraste (pero).' },
  { id: 'e75', lessonId: '7', subtopic: 'Conectores básicos', question: 'Vuoi bere un tè _______ un caffè?', options: ['e', 'o', 'ma', 'perché'], correctAnswer: 'o', tip: 'Regla: Conectores - O indica alternativa.' },
  { id: 'e76', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'Non ho studiato, _______ non so le risposte.', options: ['quindi', 'ma', 'e', 'anche'], correctAnswer: 'quindi', tip: 'Regla: Contexto - Quindi indica consecuencia.' },
  { id: 'e77', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'Vado al supermercato _______ devo comprare il latte.', options: ['quindi', 'perché', 'ma', 'anche'], correctAnswer: 'perché', tip: 'Regla: Contexto - Perché explica el motivo.' },
  { id: 'e78', lessonId: '7', subtopic: 'Conectores básicos', question: 'Studia molto _______ parla bene l’italiano.', options: ['ma', 'anche', 'e', 'o'], correctAnswer: 'e', tip: 'Unisce due frasi positive.' },
  { id: 'e79', lessonId: '7', subtopic: 'Conectores básicos', question: 'Parla l’inglese e _______ l’italiano.', options: ['ma', 'anche', 'o', 'quindi'], correctAnswer: 'anche', tip: 'Significa "también".' },
  { id: 'e80', lessonId: '7', subtopic: 'Conectores básicos', question: 'Prima mangio _______ guardo la TV.', options: ['ma', 'poi', 'perché', 'anche'], correctAnswer: 'poi', tip: 'Indica successione nel tempo.' },
  { id: 'e80_1', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'Prima mangio _______ guardo la TV.', options: ['ma', 'poi', 'perché', 'anche'], correctAnswer: 'poi', tip: 'Regla: Contexto - Poi indica sucesión en el tiempo.' },
  { id: 'e81', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'Non mi piace il mare, _______ preferisco la montaña.', options: ['invece', 'anche', 'perché', 'e'], correctAnswer: 'invece', tip: 'Indica contrasto o preferenza.' },
  { id: 'e82', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'È tardi, _______ devo andare a casa.', options: ['ma', 'anche', 'però', 'quindi'], correctAnswer: 'quindi', tip: 'Conseguenza logica.' },
  { id: 'e83', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'Sei molto bravo, _______ devi fare attenzione.', options: ['ma', 'però', 'e', 'quindi'], correctAnswer: 'però', tip: 'Simile a "ma".' },
  { id: 'e84', lessonId: '7', subtopic: 'Ejemplos en contexto', question: 'Studia l’italiano _______ vuole vivere in Italia.', options: ['perché', 'ma', 'quindi', 'anche'], correctAnswer: 'perché', tip: 'Spiega il motivo.' },

  // 8. Passato funzionale (Pasado)
  // Estructura básica (Avere)
  { id: 'e85', lessonId: '8', subtopic: 'Estructura básica (Avere)', question: 'Ieri sera io _______ una buona pizza.', options: ['sono mangiato', 'ho mangiato', 'faccio mangiato', 'vado mangiato'], correctAnswer: 'ho mangiato', tip: 'Regla: Pasado - La mayoría de verbos usan HO (Participio + Avere).' },
  { id: 'e87', lessonId: '8', subtopic: 'Estructura básica (Avere)', question: 'Hai _______ le chiavi della macchina?', options: ['visto', 'veduto', 'veduto', 'vedo'], correctAnswer: 'visto', tip: 'Regla: Pasado - Visto es el participio irregular de vedere.' },
  { id: 'e92', lessonId: '8', subtopic: 'Estructura básica (Avere)', question: 'Io non _______ capito quello che hai detto.', options: ['sono', 'ho', 'sto', 'faccio'], correctAnswer: 'ho', tip: 'Regla: Pasado - Capire usa el auxiliar avere.' },

  // Uso con Essere (Movimiento)
  { id: 'e86', lessonId: '8', subtopic: 'Uso con Essere (Movimiento)', question: 'Domenica scorsa noi _______ al mare.', options: ['abbiamo andati', 'siamo andati', 'siamo andate', 'hanno andato'], correctAnswer: 'siamo andati', tip: 'Regla: Pasado - Los verbos de movimiento como ANDARE usan ESSERE.' },
  { id: 'e89', lessonId: '8', subtopic: 'Uso con Essere (Movimiento)', question: 'Marco _______ arrivato in ritardo stamattina.', options: ['è', 'ha', 'sta', 'fa'], correctAnswer: 'è', tip: 'Regla: Pasado - Arrivare es un verbo de movimiento, usa È.' },
  { id: 'e95', lessonId: '8', subtopic: 'Uso con Essere (Movimiento)', question: 'I ragazzi _______ usciti alle otto.', options: ['hanno', 'sono', 'vanno', 'fanno'], correctAnswer: 'sono', tip: 'Regla: Pasado - Uscire quiere el auxiliar essere.' },

  // Ejemplos completos
  { id: 'e90', lessonId: '8', subtopic: 'Ejemplos completos', question: 'Abbiamo _______ un film molto bello ieri.', options: ['guardato', 'guardati', 'guarda', 'guardo'], correctAnswer: 'guardato', tip: 'Regla: Ejemplos - Los participios con avere terminan en -o independientemente del sujeto.' },
  { id: 'e91', lessonId: '8', subtopic: 'Ejemplos completos', question: 'Ti _______ piaciuto il regalo?', options: ['è', 'ha', 'sta', 'va'], correctAnswer: 'è', tip: 'Regla: Ejemplos - El verbo piacere siempre usa el auxiliar essere.' },
  { id: 'e93', lessonId: '8', subtopic: 'Ejemplos completos', question: 'Voi _______ stati molto bravi!', options: ['avete', 'siete', 'fate', 'andate'], correctAnswer: 'siete', tip: 'Regla: Ejemplos - Passato prossimo del verbo essere usa essere como auxiliar.' },

  // Altre (Miscelánea)
  { id: 'e97', lessonId: '1', question: 'A: Buon viaggio! B: _______ mille!', options: ['Prego', 'Grazie', 'Ciao', 'Scusa'], correctAnswer: 'Grazie', tip: 'Risposta a un augurio.' },
  { id: 'e98', lessonId: '1', question: 'A: _______ sei nato? B: Sono nato a Madrid.', options: ['Cosa', 'Chi', 'Dove', 'Quando'], correctAnswer: 'Dove', tip: 'Pregunta por lugar de nacimiento.' },
  { id: 'e99', lessonId: '1', question: 'A: _______ ore dormi a notte? B: Circa otto ore.', options: ['Quanto', 'Quante', 'Chi', 'Cosa'], correctAnswer: 'Quante', tip: 'Plurale per cantidad di ore.' },
  { id: 'e100', lessonId: '1', question: 'A: Domani andiamo al cinema? B: _______ di sì, a che ora?', options: ['Magari', 'Penso', 'Peccato', 'Mai'], correctAnswer: 'Penso', tip: 'Esprime un’opinione probabile.' },

  // 9. Números, Horas y Calendario
  { id: 'e9_1', lessonId: '9', subtopic: 'Los Números (0-20)', question: '¿Cómo se dice "15" en italiano?', options: ['Quindici', 'Sedici', 'Cinquanta', 'Dodici'], correctAnswer: 'Quindici', tip: '15 es Quindici.' },
  { id: 'e9_2', lessonId: '9', subtopic: '¿Qué hora es?', question: '¿Cómo preguntas la hora en italiano?', options: ['Chi ore sono?', 'Che ore sono?', 'Quanto ore sono?', 'Dove ora è?'], correctAnswer: 'Che ore sono?', tip: 'Se usa "Che ore sono?" o "Che ora è?".' },
  { id: 'e9_3', lessonId: '9', subtopic: 'Días y Meses', question: '¿Cuál es el primer día de la semana?', options: ['Lunedì', 'Martedì', 'Domenica', 'Sabato'], correctAnswer: 'Lunedì', tip: 'Lunedì es Lunes.' },
  { id: 'e9_4', lessonId: '9', subtopic: 'Los Números (0-20)', question: '¿Cómo se dice "80" en italiano?', options: ['Ottocento', 'Ottanta', 'Ottarda', 'Ottantotto'], correctAnswer: 'Ottanta', tip: '80 es Ottanta.' },
  { id: 'e9_5', lessonId: '9', subtopic: '¿Qué hora es?', question: '¿Cómo dices "Es la una" en italiano?', options: ['Sono le una', 'È l\'una', 'È uno', 'Sono l\'una'], correctAnswer: 'È l\'una', tip: 'Con "una" se usa el singular "È" y el artículo con apóstrofe.' },
  { id: 'e9_6', lessonId: '9', subtopic: 'Días y Meses', question: '¿Cómo se dice "Viernes" en italiano?', options: ['Venerdì', 'Giovedì', 'Sabato', 'Mercoledì'], correctAnswer: 'Venerdì', tip: 'Venerdì es Viernes.' },
  { id: 'e9_7', lessonId: '9', subtopic: 'Los Números (0-20)', question: '¿Cuánto es "Dieci + Cinque"?', options: ['Dodici', 'Quindici', 'Venti', 'Sedici'], correctAnswer: 'Quindici', tip: '10 + 5 = 15.' },
  { id: 'e9_8', lessonId: '9', subtopic: 'Días y Meses', question: '¿En qué mes estamos si es "Enero"?', options: ['Gennaio', 'Giugno', 'Luglio', 'Aprile'], correctAnswer: 'Gennaio', tip: 'Gennaio es Enero.' },
  { id: 'e9_9', lessonId: '9', subtopic: '¿Qué hora es?', question: '¿Cómo dices "Mediodía" en italiano?', options: ['Mezzanotte', 'Mezzogiorno', 'Pranzo', 'Mattina'], correctAnswer: 'Mezzogiorno', tip: 'Mezzogiorno es mediodía.' },
  { id: 'e9_10', lessonId: '9', subtopic: 'Los Números (0-20)', question: '¿Cómo se dice "1000" en italiano?', options: ['Cento', 'Milione', 'Mille', 'Milla'], correctAnswer: 'Mille', tip: 'Mil es Mille.' },
  { id: 'e9_11', lessonId: '9', subtopic: 'Los Números (0-20)', question: '¿Cómo se dice "21" en italiano?', options: ['Ventuno', 'Ventiuno', 'Venti uno', 'Ventotto'], correctAnswer: 'Ventuno', tip: 'En 21 (ventuno) se quita la vocal de "venti".' },
  { id: 'e9_12', lessonId: '9', subtopic: 'Días y Meses', question: '¿Cómo se dice "Mañana" (el día después de hoy) en italiano?', options: ['Ieri', 'Oggi', 'Domani', 'Settimana'], correctAnswer: 'Domani', tip: 'Domani significa mañana.' },

  // Decinas y Cientos
  { id: 'e9_dc1', lessonId: '9', subtopic: 'Decinas y Cientos', question: '¿Cómo se dice "30" en italiano?', options: ['Venti', 'Trenta', 'Quaranta', 'Cinquanta'], correctAnswer: 'Trenta', tip: '30 es Trenta.' },
  { id: 'e9_dc2', lessonId: '9', subtopic: 'Decinas y Cientos', question: '¿Cómo se dice "100" en italiano?', options: ['Mille', 'Cento', 'Dieci', 'Venti'], correctAnswer: 'Cento', tip: '100 es Cento.' },
  { id: 'e9_dc3', lessonId: '9', subtopic: 'Decinas y Cientos', question: '¿Cómo se dice "50" en italiano?', options: ['Cinquanta', 'Sessanta', 'Settanta', 'Ottanta'], correctAnswer: 'Cinquanta', tip: '50 es Cinquanta.' },

  // 10. La Famiglia e Possessivi
  { id: 'e10_1', lessonId: '10', subtopic: 'Los miembros de la familia', question: '¿Cómo se dice "Hermano" en italiano?', options: ['Fratello', 'Sorella', 'Figlio', 'Padre'], correctAnswer: 'Fratello', tip: 'Fratello es hermano, Sorella es hermana.' },
  { id: 'e10_2', lessonId: '10', subtopic: 'Los adjetivos posesivos', question: '¿Cuál es el posesivo para "(Io) ____ libro"?', options: ['Il mio', 'La mia', 'Il tuo', 'Il suo'], correctAnswer: 'Il mio', tip: 'Masc. sing. para "Io" es "Il mio".' },
  { id: 'e10_3', lessonId: '10', subtopic: 'La Regola d\'Oro', question: '¿Cuál es la forma correcta?', options: ['La mia madre', 'Mia madre', 'La madre mia', 'Madre mia'], correctAnswer: 'Mia madre', tip: 'En singular, los miembros de la familia no llevan artículo.' },
  { id: 'e10_4', lessonId: '10', subtopic: 'Los miembros de la familia', question: '¿Qué significa "Nonna"?', options: ['Tía', 'Abuela', 'Madre', 'Hermana'], correctAnswer: 'Abuela', tip: 'Nonno es abuelo, Nonna es abuela.' },
  { id: 'e10_5', lessonId: '10', subtopic: 'Los adjetivos posesivos', question: '¿Cómo se dice "Nuestra casa"?', options: ['Il nostro casa', 'La nostra casa', 'Il vostro casa', 'La vostra casa'], correctAnswer: 'La nostra casa', tip: 'Casa es femenino, requiere "La nostra".' },
  { id: 'e10_6', lessonId: '10', subtopic: 'La Regola d\'Oro', question: '¿Cómo se dice "Mis hermanas"?', options: ['Mie sorelle', 'Le mie sorelle', 'La mia sorelle', 'Le mie sorella'], correctAnswer: 'Le mie sorelle', tip: 'En plural SÍ se usa artículo con la familia.' },
  { id: 'e10_7', lessonId: '10', subtopic: 'Los miembros de la familia', question: '¿Cómo se dice "Hijo" en italiano?', options: ['Figlia', 'Fratello', 'Figlio', 'Zio'], correctAnswer: 'Figlio', tip: 'Figlio (hijo) vs Figlia (hija).' },
  { id: 'e10_8', lessonId: '10', subtopic: 'Los adjetivos posesivos', question: 'Para "Loro" (Ellos), ¿se usa artículo con la familia?', options: ['Sí, "Il loro padre"', 'No, "Loro padre"', 'Solo en plural', 'Nunca'], correctAnswer: 'Sí, "Il loro padre"', tip: 'Con el posesivo "Loro" siempre se usa artículo.' },
  { id: 'e10_9', lessonId: '10', subtopic: 'I miembros de la familia', question: '¿Cómo se dice "Tío"?', options: ['Zia', 'Zio', 'Nipote', 'Cugino'], correctAnswer: 'Zio', tip: 'Zio es tío, Zia es tía.' },
  { id: 'e10_10', lessonId: '10', subtopic: 'La Regola d\'Oro', question: '¿Cuál es correcta con un apodo?', options: ['Mia mamma', 'La mia mamma', 'La mamma mia', 'Mamma mia'], correctAnswer: 'La mia mamma', tip: 'Con apodos como "mamma" o "papà" se usa artículo.' },
  { id: 'e10_11', lessonId: '10', subtopic: 'Los adjetivos posesivos', question: 'Tu perro = ____ cane.', options: ['La tua', 'Il tuo', 'Il suo', 'La sua'], correctAnswer: 'Il tuo', tip: 'Perro (cane) es masculino singular.' },
  { id: 'e10_12', lessonId: '10', subtopic: 'I miembros de la familia', question: '¿Qué significa "Cugino"?', options: ['Sobrino', 'Primo', 'Cuñado', 'Tío'], correctAnswer: 'Primo', tip: 'Cugino es primo.' },
  // 11. Descrizione e Colori
  { id: 'e11_1', lessonId: '11', subtopic: 'La Descripción Física', question: '¿Cómo se dice "Alto" en italiano?', options: ['Basso', 'Alto', 'Magro', 'Grasso'], correctAnswer: 'Alto', tip: 'Alto es igual en español e italiano.' },
  { id: 'e11_2', lessonId: '11', subtopic: 'Los Colores', question: '¿De qué color es el cielo ("il cielo")?', options: ['Rosso', 'Giallo', 'Blu', 'Nero'], correctAnswer: 'Blu', tip: 'Il cielo è blu.' },
  { id: 'e11_3', lessonId: '11', subtopic: 'La concordancia (Género y Número)', question: 'La ragazza è _______ (bello).', options: ['bello', 'bella', 'belli', 'belle'], correctAnswer: 'bella', tip: 'Con sustantivo femenino singular (la ragazza) el adjetivo termina en -a.' },
  { id: 'e11_4', lessonId: '11', subtopic: 'La Descripción Física', question: '¿Qué significa "Giovane"?', options: ['Viejo', 'Joven', 'Guapo', 'Moreno'], correctAnswer: 'Joven', tip: 'Giovane es Joven.' },
  { id: 'e11_5', lessonId: '11', subtopic: 'Los Colores', question: '¿Cómo se dice "Rojo" en italiano?', options: ['Bianco', 'Rosso', 'Verde', 'Giallo'], correctAnswer: 'Rosso', tip: 'Rosso es Rojo.' },
  { id: 'e11_6', lessonId: '11', subtopic: 'La concordancia (Género y Número)', question: 'I libri sono _______ (rosso).', options: ['rosso', 'rossa', 'rossi', 'rosse'], correctAnswer: 'rossi', tip: 'Plural masculino (I libri) -> rossi.' },
  { id: 'e11_7', lessonId: '11', subtopic: 'La Descripción Física', question: '¿Cómo se dice "Flaco"?', options: ['Grasso', 'Bello', 'Magro', 'Moro'], correctAnswer: 'Magro', tip: 'Magro es Flaco (o delgado).' },
  { id: 'e11_8', lessonId: '11', subtopic: 'Los Colores', question: '¿Cuál es el color "Giallo"?', options: ['Verde', 'Azul', 'Blanco', 'Amarillo'], correctAnswer: 'Amarillo', tip: 'Giallo es Amarillo.' },
  { id: 'e11_9', lessonId: '11', subtopic: 'La concordancia (Género y Número)', question: 'La camicia è _______ (verde).', options: ['verde', 'verda', 'verdi', 'verdo'], correctAnswer: 'verde', tip: 'Los adjetivos terminados en "e" no cambian de género en singular.' },
  { id: 'e11_10', lessonId: '11', subtopic: 'La Descripción Física', question: '¿Cómo se dice "Moreno"?', options: ['Biondo', 'Moro', 'Brutto', 'Vecchio'], correctAnswer: 'Moro', tip: 'Moro es Moreno.' },
  { id: 'e11_11', lessonId: '11', subtopic: 'Los Colores', question: '¿Cómo se dice "Blanco"?', options: ['Nero', 'Bianco', 'Giallo', 'Blu'], correctAnswer: 'Bianco', tip: 'Bianco es Blanco.' },
  { id: 'e11_12', lessonId: '11', subtopic: 'La concordancia (Género y Número)', question: 'Le macchine sono _______ (nero).', options: ['nero', 'nera', 'neri', 'nere'], correctAnswer: 'nere', tip: 'Plural femenino (le macchine) -> nere.' },
  { id: 'e13_1', lessonId: '13', subtopic: 'I Verbi Riflessivi', question: '¿Cuál es el pronombre para "Io" en verbos reflexivos?', options: ['mi', 'ti', 'si', 'ci'], correctAnswer: 'mi', tip: 'Io mi..., como "Io mi chiamo".' },
  { id: 'e13_2', lessonId: '13', subtopic: 'I Verbi Riflessivi', question: 'Noi _______ (alzarsi) alle otto.', options: ['mi alzo', 'ci alziamo', 'vi alzate', 'si alzano'], correctAnswer: 'ci alziamo', tip: 'Para "Noi" el pronombre es "ci" y la terminación "-iamo".' },
  { id: 'e13_3', lessonId: '13', subtopic: 'La Mia Routine', question: '¿Cómo se dice "Me despierto" en italiano?', options: ['Mi alzo', 'Mi sveglio', 'Mi vesto', 'Mi lavo'], correctAnswer: 'Mi sveglio', tip: 'Svegliarsi es el acto de despertar.' },
  { id: 'e13_4', lessonId: '13', subtopic: 'I Verbi Riflessivi', question: 'Voi _______ (divertirsi) alla festa.', options: ['ci divertiamo', 'vi divertite', 'si divertono', 'ti diverti'], correctAnswer: 'vi divertite', tip: 'Para "Voi" el pronombre es "vi".' },
  { id: 'e13_5', lessonId: '13', subtopic: 'La Mia Routine', question: 'Dopo la doccia, Marco _______ (vestirsi).', options: ['si veste', 'mi vesto', 'ti vesti', 'ci vestiamo'], correctAnswer: 'si veste', tip: 'Lui (Marco) requiere el pronombre "si".' },
  { id: 'e13_6', lessonId: '13', subtopic: 'I Verbi Riflessivi', question: '¿Cuál es el pronombre para "Loro" (Ellos)?', options: ['ci', 'vi', 'si', 'mi'], correctAnswer: 'si', tip: 'Loro usa "si", igual que Lui/Lei.' },
  { id: 'e13_7', lessonId: '13', subtopic: 'La Mia Routine', question: '¿Cómo dices "Me ducho"?', options: ['Mi faccio la doccia', 'Mi lavo la faccia', 'Mi pettino', 'Mi sveglio'], correctAnswer: 'Mi faccio la doccia', tip: 'Farsi la doccia es ducharse.' },
  { id: 'e13_8', lessonId: '13', subtopic: 'I Verbi Riflessivi', question: 'Tu _______ (pettinarsi) ogni mattina.', options: ['ti pettini', 'mi pettino', 'si pettina', 'ci pettiniamo'], correctAnswer: 'ti pettini', tip: 'Tu requiere "ti".' },
  { id: 'e13_9', lessonId: '13', subtopic: 'La Mia Routine', question: '¿Qué significa "Mi addormento"?', options: ['Me despierto', 'Me duermo', 'Me levanto', 'Me visto'], correctAnswer: 'Me duermo', tip: 'Addormentarsi es dormirse.' },
  { id: 'e13_10', lessonId: '13', subtopic: 'I Verbi Riflessivi', question: 'Loro _______ (lavarsi) le mani.', options: ['si lavano', 'ci laviamo', 'vi lavate', 'ti lavi'], correctAnswer: 'si lavano', tip: 'Loro + si + terminación -ano.' },
  { id: 'e13_11', lessonId: '13', subtopic: 'La Mia Routine', question: '¿Cómo se dice "Me preparo"?', options: ['Mi preparo', 'Ti prepari', 'Si prepara', 'Ci prepariamo'], correctAnswer: 'Mi preparo', tip: 'Io mi preparo.' },
  { id: 'e13_12', lessonId: '13', subtopic: 'La Mia Routine', question: 'A: A che ora ti svegli? B: _______ alle siete.', options: ['Ti svegli', 'Mi sveglio', 'Si sveglia', 'Ci svegliamo'], correctAnswer: 'Mi sveglio', tip: 'Respondes en 1ª persona (Io).' },
  { id: 'e13_13', lessonId: '13', subtopic: 'Dialogo al Mattino', question: 'A: A che ora ti svegli? B: Mi sveglio alle sei, _______ mi alzo alle sei e mezza.', options: ['e', 'ma', 'perché', 'quindi'], correctAnswer: 'ma', tip: 'Indica contraste.' },
  // 14. Preposiciones Articuladas
  { id: 'e14_1', lessonId: '14', subtopic: 'A + Articolo (AL, ALLA...)', question: 'Vado _______ (a + il) cinema.', options: ['al', 'alla', 'allo', 'ai'], correctAnswer: 'al', tip: 'A + il = AL.' },
  { id: 'e14_2', lessonId: '14', subtopic: 'A + Articolo (AL, ALLA...)', question: 'Siamo _______ (a + la) stazione.', options: ['al', 'alla', 'all\'', 'alle'], correctAnswer: 'alla', tip: 'A + la = ALLA.' },
  { id: 'e14_3', lessonId: '14', subtopic: 'A + Articolo (AL, ALLA...)', question: 'Ci vediamo _______ (a + le) otto.', options: ['ai', 'agli', 'alle', 'alla'], correctAnswer: 'alle', tip: 'A + le = ALLE (para las horas).' },
  { id: 'e14_4', lessonId: '14', subtopic: 'DI / DA Articolate', question: 'Il libro _______ (di + il) professore.', options: ['del', 'della', 'dei', 'dal'], correctAnswer: 'del', tip: 'DI + il = DEL.' },
  { id: 'e14_5', lessonId: '14', subtopic: 'DI / DA Articolate', question: 'Vengo _______ (da + il) centro.', options: ['del', 'dal', 'da', 'dallo'], correctAnswer: 'dal', tip: 'DA + il = DAL.' },
  { id: 'e14_6', lessonId: '14', subtopic: 'IN + Articolo (NEL, NELLA...)', question: 'Le chiavi sono _______ (in + la) borsa.', options: ['nel', 'nella', 'nele', 'in'], correctAnswer: 'nella', tip: 'IN + la = NELLA.' },
  { id: 'e14_7', lessonId: '14', subtopic: 'IN + Articolo (NEL, NELLA...)', question: 'Il libro è _______ (in + il) cassetto.', options: ['nel', 'nello', 'nella', 'nei'], correctAnswer: 'nel', tip: 'IN + il = NEL.' },
  { id: 'e14_8', lessonId: '14', subtopic: 'IN + Articolo (NEL, NELLA...)', question: 'Abito _______ (in + gli) Stati Uniti.', options: ['nei', 'negli', 'nelle', 'nello'], correctAnswer: 'negli', tip: 'IN + gli = NEGLI.' },
  { id: 'e14_9', lessonId: '14', subtopic: 'A + Articolo (AL, ALLA...)', question: 'Andiamo _______ (a + lo) stadio.', options: ['al', 'allo', 'alla', 'agli'], correctAnswer: 'allo', tip: 'A + lo = ALLO.' },
  { id: 'e14_10', lessonId: '14', subtopic: 'DI / DA Articolate', question: 'La casa _______ (di + la) mia amica.', options: ['del', 'della', 'dalle', 'alla'], correctAnswer: 'della', tip: 'DI + la = DELLA.' },
  { id: 'e14_11', lessonId: '14', subtopic: 'DI / DA Articolate', question: 'Vengo _______ (da + la) Spagna.', options: ['del', 'dalla', 'alla', 'dallo'], correctAnswer: 'dalla', tip: 'DA + la = DALLA.' },
  { id: 'e14_12', lessonId: '14', subtopic: 'IN + Articolo (NEL, NELLA...)', question: 'I vestiti sono _______ (in + lo) zaino.', options: ['nel', 'nello', 'nella', 'negli'], correctAnswer: 'nello', tip: 'IN + lo = NELLO.' },
  // 15. Pronombres Directos
  { id: 'e15_1', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: 'Vedi il film? Sì, ___ vedo.', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'lo', tip: 'Film es masculino singular.' },
  { id: 'e15_2', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: 'Mangi la pizza? Sì, ___ mangio.', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'la', tip: 'Pizza es femenino singular.' },
  { id: 'e15_3', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: 'Compri i libri? Sì, ___ compro.', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'li', tip: 'Libri es masculino plural.' },
  { id: 'e15_4', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: 'Ascolti le canzoni? Sì, ___ ascolto.', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'le', tip: 'Canzoni es femenino plural.' },
  { id: 'e15_5', lessonId: '15', subtopic: 'Posición del pronombre', question: '¿Dónde va el pronombre normalmente?', options: ['Antes del verbo', 'Después del verbo', 'Al final de la frase', 'No importa'], correctAnswer: 'Antes del verbo', tip: 'Ejemplo: "Lo compro".' },
  { id: 'e15_6', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: '¿Cuál es el pronombre para "Maria" (ella)?', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'la', tip: 'Maria es femenino singular.' },
  { id: 'e15_7', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: 'Prendi il caffè? No, non ___ prendo.', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'lo', tip: 'Caffè es masculino singular.' },
  { id: 'e15_8', lessonId: '15', subtopic: 'Posición del pronombre', question: '¿Cómo se dice "Quiero comprarlo"?', options: ['Lo voglio comprare', 'Voglio comprarlo', 'Ambas son correctas', 'Ninguna'], correctAnswer: 'Ambas son correctas', tip: 'Con infinitivos puede ir antes o pegado al final.' },
  { id: 'e15_9', lessonId: '15', subtopic: 'Pronombres Directos (Lo, La, Li, Le)', question: '¿Cuál es el pronombre para "i ragazzi" (ellos)?', options: ['lo', 'la', 'li', 'le'], correctAnswer: 'li', tip: 'I ragazzi es masculino plural.' },
  { id: 'e15_10', lessonId: '15', subtopic: 'Posición del pronombre', question: 'Chi chiama Paolo? ___ chiamo io.', options: ['Lo', 'La', 'Li', 'Le'], correctAnswer: 'Lo', tip: 'Paolo es masculino singular.' },
  // 16. En el Restaurante y Compras
  { id: 'e16_1', lessonId: '16', subtopic: 'Al Ristorante', question: 'Vorrei un tavolo ___ due persone.', options: ['per', 'di', 'a', 'da'], correctAnswer: 'per', tip: 'En italiano se dice "un tavolo per...".' },
  { id: 'e16_2', lessonId: '16', subtopic: 'Al Ristorante', question: 'Il ___, per favore.', options: ['menù', 'conto', 'pane', 'vino'], correctAnswer: 'conto', tip: 'Conto es la cuenta.' },
  { id: 'e16_3', lessonId: '16', subtopic: 'Al Ristorante', question: 'Cosa ___ da bere?', options: ['prendete', 'mangiate', 'andate', 'fate'], correctAnswer: 'prendete', tip: 'Prendere se usa para pedir comida o bebida.' },
  { id: 'e16_4', lessonId: '16', subtopic: 'Quanto costa?', question: 'Quanto ___ queste scarpe?', options: ['costa', 'costano', 'è', 'sono'], correctAnswer: 'costano', tip: 'Scarpe es plural.' },
  { id: 'e16_5', lessonId: '16', subtopic: 'Quanto costa?', question: 'Posso ___ questo vestito?', options: ['mangiare', 'provare', 'vedere', 'comprare'], correctAnswer: 'provare', tip: 'Provare es probarse ropa.' },
  { id: 'e16_6', lessonId: '16', subtopic: 'Quanto costa?', question: '¿Cómo dices "Es demasiado caro"?', options: ['È molto economico', 'È troppo caro', 'È bello', 'Costa poco'], correctAnswer: 'È troppo caro', tip: 'Troppo significa demasiado.' },
  { id: 'e16_7', lessonId: '16', subtopic: 'Al Ristorante', question: '¿Cómo pides el menú?', options: ['Il conto, per favore', 'Posso avere il menù?', 'Buongiorno', 'Grazie'], correctAnswer: 'Posso avere il menù?', tip: 'Menù es igual en italiano.' },
  { id: 'e16_8', lessonId: '16', subtopic: 'Al Ristorante', question: '¿Cómo dices "Tengo una reserva"?', options: ['Ho una camera', 'Ho una prenotazione', 'Ho fame', 'Ho sete'], correctAnswer: 'Ho una prenotazione', tip: 'Prenotazione es reserva.' },
  { id: 'e16_9', lessonId: '16', subtopic: 'Quanto costa?', question: '¿Aceptáis tarjetas de crédito?', options: ['Accettate contanti?', 'Accettate carte di credito?', 'Quanto costa?', 'Dov\'è il bancomat?'], correctAnswer: 'Accettate carte di credito?', tip: 'Tarjeta de crédito = carta di credito.' },
  { id: 'e16_10', lessonId: '16', subtopic: 'Al Ristorante', question: '¿Cómo pides un vaso de agua?', options: ['Un bicchiere d\'acqua', 'Una bottiglia di vino', 'Un caffè', 'Un gelato'], correctAnswer: 'Un bicchiere d\'acqua', tip: 'Bicchiere es vaso.' },
  // 17. Adverbios de Cantidad y Tiempo
  { id: 'e17_1', lessonId: '17', subtopic: 'Molto, Poco, Troppo', question: 'Sei stanco? Sì, ___.', options: ['poco', 'molto', 'troppo', 'mai'], correctAnswer: 'molto', tip: 'Molto significa mucho o muy.' },
  { id: 'e17_2', lessonId: '17', subtopic: 'Sempre, Spesso, Mai', question: 'Mangi carne? No, non la mangio ___.', options: ['sempre', 'spesso', 'mai', 'troppo'], correctAnswer: 'mai', tip: 'Mai (nunca) requiere la negación "non".' },
  { id: 'e17_3', lessonId: '17', subtopic: 'Sempre, Spesso, Mai', question: 'Vai al cinema? Sì, ___.', options: ['mai', 'spesso', 'poco', 'troppo'], correctAnswer: 'spesso', tip: 'Spesso significa a menudo.' },
  { id: 'e17_4', lessonId: '17', subtopic: 'Molto, Poco, Troppo', question: 'Ho ___ soldi.', options: ['molto', 'poco', 'troppo', 'mai'], correctAnswer: 'poco', tip: 'Poco significa poca cantidad.' },
  { id: 'e17_5', lessonId: '17', subtopic: 'Molto, Poco, Troppo', question: 'Mangi ___ zucchero, fa male.', options: ['troppo', 'poco', 'abbastanza', 'mai'], correctAnswer: 'troppo', tip: 'Troppo es demasiado.' },
  { id: 'e17_6', lessonId: '17', subtopic: 'Sempre, Spesso, Mai', question: '¿Qué significa "Sempre"?', options: ['Nunca', 'A veces', 'Siempre', 'A menudo'], correctAnswer: 'Siempre', tip: 'Sempre es lo opuesto a Mai.' },
  { id: 'e17_7', lessonId: '17', subtopic: 'Molto, Poco, Troppo', question: '¿Qué significa "Abbastanza"?', options: ['Mucho', 'Poco', 'Suficiente/Bastante', 'Demasiado'], correctAnswer: 'Suficiente/Bastante', tip: 'Abbastanza indica una cantidad adecuada.' },
  { id: 'e17_8', lessonId: '17', subtopic: 'Sempre, Spesso, Mai', question: '¿Cómo se dice "A veces"?', options: ['Sempre', 'Mai', 'Qualche volta', 'Spesso'], correctAnswer: 'Qualche volta', tip: 'Qualche volta indica frecuencia media.' },
  { id: 'e17_9', lessonId: '17', subtopic: 'Sempre, Spesso, Mai', question: '¿Cómo dices "Casi nunca"?', options: ['Quasi mai', 'Sempre mai', 'Spesso mai', 'Mai mai'], correctAnswer: 'Quasi mai', tip: 'Quasi significa casi.' },
  { id: 'e17_10', lessonId: '17', subtopic: 'Sempre, Spesso, Mai', question: '¿Qué significa "Subito"?', options: ['Después', 'Nunca', 'Inmediatamente/Ahora mismo', 'Ayer'], correctAnswer: 'Inmediatamente/Ahora mismo', tip: 'Subito indica urgencia.' },
  // 18. L'Imperfetto
  { id: 'e18_1', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: 'Da bambino (io) _______ (giocare) sempre.', options: ['giocavo', 'giocavo', 'giocava', 'giocavamo'], correctAnswer: 'giocavo', tip: '-ARE -> -avo.' },
  { id: 'e18_2', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: 'Noi _______ (essere) molto amici.', options: ['ero', 'eri', 'era', 'eravamo'], correctAnswer: 'eravamo', tip: 'Essere es irregular en imperfecto: ero, eri, era, eravamo...' },
  { id: 'e18_3', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: 'Voi _______ (andare) al mare ogni estate?', options: ['andavi', 'andava', 'andavate', 'andavano'], correctAnswer: 'andavate', tip: '-ATE es la terminación para VOI.' },
  { id: 'e18_4', lessonId: '18', subtopic: 'Hábitos y Descripciones', question: '¿Cuál se usa para descripciones?', options: ['Passato Prossimo', 'Imperfetto', 'Presente', 'Futuro'], correctAnswer: 'Imperfetto', tip: 'Ej: "La casa era grande".' },
  { id: 'e18_5', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: 'Loro _______ (prendere) il bus.', options: ['prendevo', 'prendeva', 'prendevano', 'prendevamo'], correctAnswer: 'prendevano', tip: '-ano es para LORO.' },
  { id: 'e18_6', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: 'Tu _______ (leggere) molto da piccolo?', options: ['leggevi', 'leggeva', 'leggevamo', 'leggevate'], correctAnswer: 'leggevi', tip: '-evi para TU en verbos -ERE.' },
  { id: 'e18_7', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: '¿Cómo es el imperfecto de FARE para "io"?', options: ['favo', 'facevo', 'fecavo', 'favo'], correctAnswer: 'facevo', tip: 'Fare mantiene la raíz latina fac-.' },
  { id: 'e18_8', lessonId: '18', subtopic: 'Hábitos y Descripciones', question: 'Mentre io cucinavo, lui _______ (dormire).', options: ['dormiva', 'dormito', 'dorme', 'dormenti'], correctAnswer: 'dormiva', tip: 'Dos acciones simultáneas en el pasado.' },
  { id: 'e18_9', lessonId: '18', subtopic: 'L\'Imperfetto: Conjugación', question: 'Lei _______ (avere) i capelli lunghi.', options: ['avevo', 'avevi', 'aveva', 'avevamo'], correctAnswer: 'aveva', tip: '-eva para LEI.' },
  { id: 'e18_10', lessonId: '18', subtopic: 'Hábitos y Descripciones', question: '¿Cómo se dice "Yo solía comer"?', options: ['Mangiavo', 'Ho mangiato', 'Mangerò', 'Mangio'], correctAnswer: 'Mangiavo', tip: 'El imperfecto indica hábito.' },
  // 19. Futuro Simple
  { id: 'e19_1', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Domani (io) _______ (comprare) una bici.', options: ['comprerò', 'comprerò', 'comprerà', 'comprerai'], correctAnswer: 'comprerò', tip: '-ARE cambia a -erò.' },
  { id: 'e19_2', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Noi _______ (andare) in Italia.', options: ['andremo', 'andremo', 'andrà', 'andranno'], correctAnswer: 'andremo', tip: 'Andare es irregular (and-r-).' },
  { id: 'e19_3', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: '¿Cómo es el futuro de ESSERE para "lui"?', options: ['sarà', 'sarò', 'sarai', 'saremo'], correctAnswer: 'sarà', tip: 'Essere -> sar-.' },
  { id: 'e19_4', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Loro _______ (finire) il progetto.', options: ['finirà', 'finiranno', 'finiremo', 'finirete'], correctAnswer: 'finiranno', tip: '-anno para LORO.' },
  { id: 'e19_5', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Tu _______ (mangiare) con noi?', options: ['mangerai', 'mangerò', 'mangerà', 'mangeranno'], correctAnswer: 'mangerai', tip: '-ai para TU.' },
  { id: 'e19_6', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Futuro de FARE para "io":', options: ['farò', 'facerò', 'farai', 'farà'], correctAnswer: 'farò', tip: 'Fare -> far-.' },
  { id: 'e19_7', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Secondo me _______ (piovere).', options: ['pioverò', 'pioverà', 'pioveranno', 'pioveremo'], correctAnswer: 'pioverà', tip: 'Predicción en tiempo futuro.' },
  { id: 'e19_8', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Tra due anni _______ (laurearsi).', options: ['mi laureerò', 'ti laureerai', 'si laureerà', 'ci laureeremo'], correctAnswer: 'mi laureerò', tip: 'Futuro reflexivo.' },
  { id: 'e19_9', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Noi _______ (vedere) il film.', options: ['vedrò', 'vedremo', 'vedrete', 'vedranno'], correctAnswer: 'vedremo', tip: 'Vedere -> vedr-.' },
  { id: 'e19_10', lessonId: '19', subtopic: 'Futuro Simple: Conjugación', question: 'Voi _______ (potere) venire?', options: ['potrò', 'potrai', 'potrete', 'potranno'], correctAnswer: 'potrete', tip: 'Potere -> potr-.' },
  // 20. Condicional Simple
  { id: 'e20_1', lessonId: '20', subtopic: 'Condicional de Cortesía', question: '(Io) _______ (volere) un caffè.', options: ['vorrei', 'vorrei', 'vorrai', 'vorrà'], correctAnswer: 'vorrei', tip: 'Vorrei es la forma de cortesía.' },
  { id: 'e20_2', lessonId: '20', subtopic: 'Condicional de Cortesía', question: '_______ (Potere) aiutarmi?', options: ['Potresti', 'Potrò', 'Potevi', 'Potrai'], correctAnswer: 'Potresti', tip: 'Condicional para pedir favor.' },
  { id: 'e20_3', lessonId: '20', subtopic: 'Condicional de Cortesía', question: 'Mi _______ (piacere) viaggiare.', options: ['piacerebbe', 'piacerà', 'piace', 'piaceva'], correctAnswer: 'piacerebbe', tip: 'Piacere en condicional.' },
  { id: 'e20_4', lessonId: '20', subtopic: 'Condicional de Cortesía', question: '¿Cómo termina el condicional para "noi"?', options: ['-emmo', '-emo', '-anno', '-ate'], correctAnswer: '-emmo', tip: 'Atención con la doble M: -emmo.' },
  { id: 'e20_5', lessonId: '20', subtopic: 'Condicional de Cortesía', question: 'Al tuo posto (io) _______ (parlare) con lui.', options: ['parlerei', 'parlerò', 'parlavo', 'parlo'], correctAnswer: 'parlerei', tip: 'Dar consejos.' },
  { id: 'e20_6', lessonId: '20', subtopic: 'Condicional de Cortesía', question: 'Voi _______ (dovere) studiare di più.', options: ['dovreste', 'dovrete', 'dovevate', 'dovete'], correctAnswer: 'dovreste', tip: '-este para VOI.' },
  { id: 'e20_7', lessonId: '20', subtopic: 'Condicional de Cortesía', question: 'Condicional de ESSERE para "lui":', options: ['sarebbe', 'sarà', 'era', 'sarei'], correctAnswer: 'sarebbe', tip: 'Essere -> sare-.' },
  { id: 'e20_8', lessonId: '20', subtopic: 'Condicional de Cortesía', question: 'Tu _______ (andare) a Londra?', options: ['andresti', 'andrai', 'andavi', 'andresti'], correctAnswer: 'andresti', tip: '-esti para TU.' },
  { id: 'e20_9', lessonId: '20', subtopic: 'Condicional de Cortesía', question: 'Loro _______ (mangiare) tutto.', options: ['mangerebbero', 'mangeranno', 'mangiavano', 'mangiano'], correctAnswer: 'mangerebbero', tip: '-ebbero para LORO.' },
  { id: 'e20_10', lessonId: '20', subtopic: 'Condicional de Cortesía', question: '¿Cómo pides permiso amablemente?', options: ['Posso?', 'Potrei?', 'Voglio?', 'Devo?'], correctAnswer: 'Potrei?', tip: 'Potrei es más cortés.' },
  // 21. Pronombres Indirectos
  { id: 'e21_1', lessonId: '21', subtopic: 'Pronombres Indirectos', question: 'A te piace? Sì, ___ piace.', options: ['ti', 'mi', 'gli', 'le'], correctAnswer: 'ti', tip: 'A te -> Ti.' },
  { id: 'e21_2', lessonId: '21', subtopic: 'Pronombres Indirectos', question: 'A Paolo regalo un libro. ___ regalo un libro.', options: ['Gli', 'Le', 'Li', 'Lo'], correctAnswer: 'Gli', tip: 'A Paolo (él) -> Gli.' },
  { id: 'e21_3', lessonId: '21', subtopic: 'Pronombres Indirectos', question: 'A Maria scrivo. ___ scrivo.', options: ['Le', 'Gli', 'La', 'Lo'], correctAnswer: 'Le', tip: 'A Maria (ella) -> Le.' },
  { id: 'e21_4', lessonId: '21', subtopic: 'Pronombres Indirectos', question: 'A noi dicono tutto. ___ dicono tutto.', options: ['Ci', 'Vi', 'Ci', 'Li'], correctAnswer: 'Ci', tip: 'A nosotros -> Ci.' },
  { id: 'e21_5', lessonId: '21', subtopic: 'Pronombres Indirectos', question: 'A voi porto il caffè. ___ porto il caffè.', options: ['Vi', 'Ci', 'Vi', 'Li'], correctAnswer: 'Vi', tip: 'A vosotros -> Vi.' },
  { id: 'e21_6', lessonId: '21', subtopic: 'Pronombres Indirectos', question: '¿Cuál es el pronombre para "a ellos"?', options: ['Loro', 'Li', 'Gli', 'Le'], correctAnswer: 'Loro', tip: 'También puede usarse GLI en lenguaje hablado.' },
  { id: 'e21_7', lessonId: '21', subtopic: 'Pronombres Indirectos', question: '___ piacciono i fiori?', options: ['Ti', 'Lo', 'La', 'Li'], correctAnswer: 'Ti', tip: 'Piacere se conjuga según lo que gusta.' },
  { id: 'e21_8', lessonId: '21', subtopic: 'Pronombres Indirectos', question: '¿Dónde va el pronombre normalmente?', options: ['Antes del verbo', 'Después del verbo', 'Al final', 'No importa'], correctAnswer: 'Antes del verbo', tip: 'Ej: "Mi piace".' },
  { id: 'e21_9', lessonId: '21', subtopic: 'Pronombres Indirectos', question: '___ telefono stasera (a mi hermano).', options: ['Gli', 'Lo', 'Le', 'La'], correctAnswer: 'Gli', tip: 'A él -> Gli.' },
  { id: 'e21_10', lessonId: '21', subtopic: 'Pronombres Indirectos', question: '¿Cómo dices "Me dices"?', options: ['Mi dici', 'Ti dico', 'Le dico', 'Ci dice'], correctAnswer: 'Mi dici', tip: 'Mi = a mí.' },
  // 22. Comparativos y Superlativos
  { id: 'e22_1', lessonId: '22', subtopic: 'La Comparación', question: 'Milano è ___ fredda di Napoli.', options: ['più', 'meno', 'così', 'tanto'], correctAnswer: 'più', tip: 'Milán es más fría.' },
  { id: 'e22_2', lessonId: '22', subtopic: 'La Comparación', question: 'Il treno è ___ veloce della bici.', options: ['più', 'meno', 'così', 'tanto'], correctAnswer: 'più', tip: 'Más rápido.' },
  { id: 'e22_3', lessonId: '22', subtopic: 'La Comparación', question: 'Sei bella ___ un sole.', options: ['come', 'di', 'che', 'più'], correctAnswer: 'come', tip: 'Così... come.' },
  { id: 'e22_4', lessonId: '22', subtopic: 'La Comparación', question: '¿Cómo se dice "Muy bello"?', options: ['Bellissimo', 'Più bello', 'Meno bello', 'Bello'], correctAnswer: 'Bellissimo', tip: 'Terminación -issimo.' },
  { id: 'e22_5', lessonId: '22', subtopic: 'La Comparación', question: '¿Cuándo se usa "che" en vez de "di"?', options: ['Entre dos nombres', 'Entre dos adjetivos o verbos', 'Siempre', 'Nunca'], correctAnswer: 'Entre dos adjetivos o verbos', tip: 'Ej: "Più rosso che giallo".' },
  { id: 'e22_6', lessonId: '22', subtopic: 'La Comparación', question: '¿Cuál es el mejor de "buono"?', options: ['Migliore', 'Più buono', 'Peggiore', 'Ottimo'], correctAnswer: 'Migliore', tip: 'Buono -> Migliore.' },
  { id: 'e22_7', lessonId: '22', subtopic: 'La Comparación', question: '¿Cuál es el peor de "cattivo"?', options: ['Peggiore', 'Migliore', 'Cattivissimo', 'Pessimo'], correctAnswer: 'Peggiore', tip: 'Cattivo -> Peggiore.' },
  { id: 'e22_8', lessonId: '22', subtopic: 'La Comparación', question: 'È ___ più alto della classe.', options: ['il', 'di', 'che', 'molto'], correctAnswer: 'il', tip: 'El más alto.' },
  { id: 'e22_9', lessonId: '22', subtopic: 'La Comparación', question: 'Studiare è più facile ___ lavorare.', options: ['che', 'di', 'come', 'tanto'], correctAnswer: 'che', tip: 'Comparación entre verbos -> che.' },
  { id: 'e22_10', lessonId: '22', subtopic: 'La Comparación', question: '¿Cómo se dice "Muy rico" (persona)?', options: ['Ricchissimo', 'Rico', 'Più rico', 'Ottimo'], correctAnswer: 'Ricchissimo', tip: '"Ricchissimo" mantiene el sonido k.' },
  // 23. Particella CI y NE
  { id: 'e23_1', lessonId: '23', subtopic: 'Particella CI (Lugar)', question: 'Vai a scuola? Sì, ___ vado.', options: ['ci', 'ne', 'lo', 'la'], correctAnswer: 'ci', tip: 'CI sustituye a "a scuola".' },
  { id: 'e23_2', lessonId: '23', subtopic: 'Particella NE (Cantidad)', question: 'Quanti fratelli hai? ___ ho due.', options: ['ne', 'ci', 'lo', 'li'], correctAnswer: 'ne', tip: 'NE sustituye a la cantidad.' },
  { id: 'e23_3', lessonId: '23', subtopic: 'Particella CI (Lugar)', question: 'Parli con Paolo? Sì, ___ parlo.', options: ['ci', 'ne', 'gli', 'lo'], correctAnswer: 'ci', tip: 'CI también sustituye "con él/ellos".' },
  { id: 'e23_4', lessonId: '23', subtopic: 'Particella NE (Cantidad)', question: 'Vuoi del pane? No, non ___ voglio.', options: ['ne', 'lo', 'la', 'ci'], correctAnswer: 'ne', tip: 'NE se usa con cantidades indeterminadas.' },
  { id: 'e23_5', lessonId: '23', subtopic: 'Particella CI (Lugar)', question: '¿Cómo dices "Yo he estado allí"?', options: ['Ci sono stato', 'Ne sono stato', 'Ho stato', 'Sono stato'], correctAnswer: 'Ci sono stato', tip: 'CI = allí.' },
  { id: 'e23_6', lessonId: '23', subtopic: 'Particella NE (Cantidad)', question: 'Mangi molte mele? No, ___ mangio solo una.', options: ['ne', 'le', 'ci', 'lo'], correctAnswer: 'ne', tip: 'Uso de NE con números.' },
  { id: 'e23_7', lessonId: '23', subtopic: 'Particella CI (Lugar)', question: '¿Cómo se dice "Pienso en ello"?', options: ['Ci penso', 'Lo penso', 'Ne penso', 'Mi penso'], correctAnswer: 'Ci penso', tip: 'Pensare + a -> CI.' },
  { id: 'e23_8', lessonId: '23', subtopic: 'Particella NE (Cantidad)', question: '¿Qué opinas? Cosa ___ pensi?', options: ['ne', 'ci', 'lo', 'la'], correctAnswer: 'ne', tip: 'Pensare + di (opinión) -> NE.' },
  { id: 'e23_9', lessonId: '23', subtopic: 'Particella CI (Lugar)', question: 'Siamo in ufficio? Sì, ___ siamo.', options: ['ci', 'ne', 'lo', 'la'], correctAnswer: 'ci', tip: 'CI indica permanencia en lugar.' },
  { id: 'e23_10', lessonId: '23', subtopic: 'Particella NE (Cantidad)', question: '¿Cómo dices "No quiero (de ello)"?', options: ['Non lo voglio', 'Non ne voglio', 'Non ci voglio', 'Non voglio'], correctAnswer: 'Non ne voglio', tip: 'NE para cantidades indeterminadas.' },
  // 24. Congiuntivo Presente
  { id: 'e24_1', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Credo che lui _______ (essere) stanco.', options: ['è', 'sia', 'siamo', 'siano'], correctAnswer: 'sia', tip: 'Congiuntivo de ESSERE (io/tu/lui/lei sia).' },
  { id: 'e24_2', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Penso che tu _______ (avere) ragione.', options: ['hai', 'abbia', 'abbiamo', 'abbiate'], correctAnswer: 'abbia', tip: 'Congiuntivo de AVERE (io/tu/lui/lei abbia).' },
  { id: 'e24_3', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Dubito che loro _______ (venire) oggi.', options: ['vengono', 'vengano', 'venite', 'venga'], correctAnswer: 'vengano', tip: 'Loro vengano (Congiuntivo).' },
  { id: 'e24_4', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Spero che tutto _______ (andare) bene.', options: ['va', 'vada', 'andiamo', 'vanno'], correctAnswer: 'vada', tip: 'Andare (subjuntivo): vada.' },
  { id: 'e24_5', lessonId: '24', subtopic: 'Verbi di Volontà', question: 'Voglio che tu _______ (fare) i compiti.', options: ['fai', 'faccia', 'facciamo', 'facciano'], correctAnswer: 'faccia', tip: 'Fare (subjuntivo): faccia.' },
  { id: 'e24_6', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'È importante che noi _______ (studiare) di più.', options: ['studiamo', 'studiamo', 'studiate', 'studino'], correctAnswer: 'studiamo', tip: 'Noi studiamo (Congiuntivo).' },
  { id: 'e24_7', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Non credo che lei _______ (capire) la situazione.', options: ['capisce', 'capisca', 'capiamo', 'capiscano'], correctAnswer: 'capisca', tip: 'Lei capisca (Congiuntivo).' },
  { id: 'e24_8', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Desidero che voi _______ (essere) felici.', options: ['siete', 'siate', 'siano', 'siamo'], correctAnswer: 'siate', tip: 'Voi siate (Congiuntivo).' },
  { id: 'e24_9', lessonId: '24', subtopic: 'Verbi di Volontà', question: 'Preferisco che tu non _______ (parlare) adesso.', options: ['parli', 'parla', 'parliamo', 'parlino'], correctAnswer: 'parli', tip: 'Tu parli (Congiuntivo).' },
  { id: 'e24_10', lessonId: '24', subtopic: 'Il Congiuntivo Presente (Opinión)', question: 'Mi sembra che loro _______ (dire) la verità.', options: ['dicono', 'dicano', 'diciamo', 'dite'], correctAnswer: 'dicano', tip: 'Loro dicano (Congiuntivo).' },
  // 25. Congiuntivo Imperfetto
  { id: 'e25_1', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Se (io) _______ (avere) tempo, verrei.', options: ['avevo', 'avessi', 'abbia', 'avrei'], correctAnswer: 'avessi', tip: 'Se + Congiuntivo Imperfetto.' },
  { id: 'e25_2', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Se lui _______ (essere) qui, saremmo felici.', options: ['fosse', 'era', 'sia', 'sarebbe'], correctAnswer: 'fosse', tip: 'Essere (imperfecto subj.): fosse.' },
  { id: 'e25_3', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Avrei voluto che tu _______ (venire) con noi.', options: ['venivi', 'venissi', 'vieni', 'verresti'], correctAnswer: 'venissi', tip: 'Congiuntivo Imperfetto per desideri passati.' },
  { id: 'e25_4', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Non credevo che loro _______ (sapere) la risposta.', options: ['sapevano', 'sapessero', 'sappiano', 'sapranno'], correctAnswer: 'sapessero', tip: 'Loro sapessero (Congiuntivo Imperfetto).' },
  { id: 'e25_5', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Se voi _______ (studiare) di più, avreste passato l\'esame.', options: ['studiavate', 'studiaste', 'studiereste', 'studierete'], correctAnswer: 'studiaste', tip: 'Voi studiaste (Congiuntivo Imperfetto).' },
  { id: 'e25_6', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Dubitavo che lei _______ (dire) la verità.', options: ['diceva', 'dicesse', 'dirà', 'abbia detto'], correctAnswer: 'dicesse', tip: 'Lei dicesse (Congiuntivo Imperfetto).' },
  { id: 'e25_7', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Magari _______ (io, potere) volare!', options: ['potevo', 'potessi', 'possa', 'potrei'], correctAnswer: 'potessi', tip: 'Magari + Congiuntivo Imperfetto.' },
  { id: 'e25_8', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Era strano che lui non _______ (essere) presente.', options: ['era', 'fosse', 'sia', 'sarebbe'], correctAnswer: 'fosse', tip: 'Lui fosse (Congiuntivo Imperfetto).' },
  { id: 'e25_9', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Se tu _______ (fare) silenzio, avremmo sentito.', options: ['facevi', 'facessi', 'faresti', 'faccia'], correctAnswer: 'facessi', tip: 'Tu facessi (Congiuntivo Imperfetto).' },
  { id: 'e25_10', lessonId: '25', subtopic: 'Congiuntivo Imperfetto', question: 'Non ero sicuro che noi _______ (arrivare) in tempo.', options: ['arrivavamo', 'arrivassimo', 'arriviamo', 'arriveremo'], correctAnswer: 'arrivassimo', tip: 'Noi arrivassimo (Congiuntivo Imperfetto).' },
  // 26. Condizionale Composto
  { id: 'e26_1', lessonId: '26', subtopic: 'Condizionale Composto', question: '(Io) _______ (andare) al mare, ma pioveva.', options: ['andrei', 'sarei andato', 'ero andato', 'sia andato'], correctAnswer: 'sarei andato', tip: 'Condizionale Composto: Sarei/Avrei + Participio.' },
  { id: 'e26_2', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Avrei _______ (studiare) di più per l\'esame.', options: ['studiato', 'studiare', 'studio', 'studiavo'], correctAnswer: 'studiato', tip: 'Avrei + Participio Passato.' },
  { id: 'e26_3', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Lui _______ (potere) aiutarci, ma non l\'ha fatto.', options: ['potrebbe', 'avrebbe potuto', 'poteva', 'potrà'], correctAnswer: 'avrebbe potuto', tip: 'Avrebbe + Participio Passato.' },
  { id: 'e26_4', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Secondo le voci, il presidente _______ (dimettersi).', options: ['si dimette', 'si dimetterebbe', 'si è dimesso', 'si dimetterà'], correctAnswer: 'si dimetterebbe', tip: 'Condizionale Composto per notizie incerte.' },
  { id: 'e26_5', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Mi _______ (piacere) venire alla festa, ma ero malato.', options: ['piacerebbe', 'sarebbe piaciuto', 'piaceva', 'piacerà'], correctAnswer: 'sarebbe piaciuto', tip: 'Sarebbe piaciuto (verbo piacere con essere).' },
  { id: 'e26_6', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Voi _______ (dovere) avvisarci prima.', options: ['dovreste', 'avreste dovuto', 'dovevate', 'dovrete'], correctAnswer: 'avreste dovuto', tip: 'Avreste + Participio Passato.' },
  { id: 'e26_7', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Se avessi avuto tempo, _______ (io, leggere) quel libro.', options: ['leggerei', 'avrei letto', 'leggevo', 'leggerò'], correctAnswer: 'avrei letto', tip: 'Avrei + Participio Passato.' },
  { id: 'e26_8', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Lei _______ (volere) dirti la verità, ma non ha avuto il coraggio.', options: ['vorrebbe', 'avrebbe voluto', 'voleva', 'vorrà'], correctAnswer: 'avrebbe voluto', tip: 'Avrebbe + Participio Passato.' },
  { id: 'e26_9', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Noi _______ (fare) un viaggio, ma non avevamo soldi.', options: ['faremmo', 'avremmo fatto', 'facevamo', 'faremo'], correctAnswer: 'avremmo fatto', tip: 'Avremmo + Participio Passato.' },
  { id: 'e26_10', lessonId: '26', subtopic: 'Condizionale Composto', question: 'Si dice che loro _______ (sposarsi) l\'anno scorso.', options: ['si sono sposati', 'si sarebbero sposati', 'si sposano', 'si sposeranno'], correctAnswer: 'si sarebbero sposati', tip: 'Condizionale Composto per notizie incerte.' },
  // 27. Pronomi Combinati
  { id: 'e27_1', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Te lo digo"?', options: ['Te lo dico', 'Ti lo dico', 'Me lo dici', 'Lo te dico'], correctAnswer: 'Te lo dico', tip: 'Ti cambia a TE antes de LO.' },
  { id: 'e27_2', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Se lo doy (a él)"?', options: ['Gli lo do', 'Glielo do', 'Le lo do', 'Te lo do'], correctAnswer: 'Glielo do', tip: 'Gli + lo = GLIELO (todo junto).' },
  { id: 'e27_3', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Me la dai?" (la penna)?', options: ['Me la dai', 'Mi la dai', 'La mi dai', 'Me dai la'], correctAnswer: 'Me la dai', tip: 'Mi cambia a ME antes de LA.' },
  { id: 'e27_4', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Nos los traen" (i libri)?', options: ['Ci li portano', 'Ce li portano', 'Li ci portano', 'Ce portano li'], correctAnswer: 'Ce li portano', tip: 'Ci cambia a CE antes de LI.' },
  { id: 'e27_5', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Se las compro" (a lei, le scarpe)?', options: ['Le le compro', 'Glielo compro', 'Glieli compro', 'Gliele compro'], correctAnswer: 'Gliele compro', tip: 'Le + le = GLIELE.' },
  { id: 'e27_6', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Os lo spiego" (il problema)?', options: ['Vi lo spiego', 'Ve lo spiego', 'Lo vi spiego', 'Ve spiego lo'], correctAnswer: 'Ve lo spiego', tip: 'Vi cambia a VE antes de LO.' },
  { id: 'e27_7', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Me ne vado"?', options: ['Mi ne vado', 'Me ne vado', 'Ne mi vado', 'Vado me ne'], correctAnswer: 'Me ne vado', tip: 'Mi cambia a ME antes de NE.' },
  { id: 'e27_8', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Glielo chiedo" (a loro, il favore)?', options: ['Gli lo chiedo', 'Glielo chiedo', 'Le lo chiedo', 'Li lo chiedo'], correctAnswer: 'Glielo chiedo', tip: 'Gli (a loro) + lo = GLIELO.' },
  { id: 'e27_9', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Ce la fai?" (la torta)?', options: ['Ci la fai', 'Ce la fai', 'La ci fai', 'Fai ce la'], correctAnswer: 'Ce la fai', tip: 'Ci cambia a CE antes de LA.' },
  { id: 'e27_10', lessonId: '27', subtopic: 'Pronomi Combinati', question: '¿Cómo dices "Te li porto" (i fiori)?', options: ['Ti li porto', 'Te li porto', 'Li ti porto', 'Porto te li'], correctAnswer: 'Te li porto', tip: 'Ti cambia a TE antes de LI.' },
  // 28. Trapassato Prossimo
  { id: 'e28_1', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Quando sei arrivato, io _______ (mangiare).', options: ['ho mangiato', 'avevo mangiato', 'mangiavo', 'mangerò'], correctAnswer: 'avevo mangiato', tip: 'Acción anterior a otra acción pasada.' },
  { id: 'e28_2', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Non sapevo che tu _______ (partire) già.', options: ['sei partito', 'eri partito', 'partivi', 'partirai'], correctAnswer: 'eri partito', tip: 'Essere + Participio para verbos de movimiento.' },
  { id: 'e28_3', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Quando l\'ho incontrato, lui _______ (finire) il lavoro.', options: ['ha finito', 'aveva finito', 'finiva', 'finirà'], correctAnswer: 'aveva finito', tip: 'Avere + Participio para verbos transitivos.' },
  { id: 'e28_4', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Avevo _______ (vedere) quel film molte volte.', options: ['visto', 'veduto', 'vedo', 'vedevo'], correctAnswer: 'visto', tip: 'Participio passato di "vedere".' },
  { id: 'e28_5', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Dopo che noi _______ (cenare), siamo andati a dormire.', options: ['abbiamo cenato', 'avevamo cenato', 'cenavamo', 'ceneremo'], correctAnswer: 'avevamo cenato', tip: 'Avere + Participio.' },
  { id: 'e28_6', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Lei mi ha detto che _______ (essere) malata.', options: ['è stata', 'era stata', 'era', 'sarà'], correctAnswer: 'era stata', tip: 'Essere + Participio.' },
  { id: 'e28_7', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Non mi ricordavo dove _______ (io, mettere) le chiavi.', options: ['ho messo', 'avevo messo', 'mettevo', 'metterò'], correctAnswer: 'avevo messo', tip: 'Avere + Participio.' },
  { id: 'e28_8', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Quando sono arrivati, la festa _______ (già, iniziare).', options: ['è già iniziata', 'era già iniziata', 'iniziava', 'inizierà'], correctAnswer: 'era già iniziata', tip: 'Essere + Participio per verbi intransitivi.' },
  { id: 'e28_9', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Avevo _______ (comprare) il biglietto prima.', options: ['comprato', 'compravo', 'compro', 'comprerò'], correctAnswer: 'comprato', tip: 'Participio passato di "comprare".' },
  { id: 'e28_10', lessonId: '28', subtopic: 'Trapassato Prossimo', question: 'Ci siamo accorti che loro _______ (mentire).', options: ['hanno mentito', 'avevano mentito', 'mentivano', 'mentiranno'], correctAnswer: 'avevano mentito', tip: 'Avere + Participio.' },
  // 29. Forma Passiva
  { id: 'e29_1', lessonId: '29', subtopic: 'La Forma Passiva', question: 'La torta _______ (essere) mangiata da Marco.', options: ['è', 'viene', 'estata', 'es stata'], correctAnswer: 'è', tip: 'Passiva: Essere + Participio.' },
  { id: 'e29_2', lessonId: '29', subtopic: 'La Forma Passiva', question: 'Il libro è stato scritto _______ un famoso autore.', options: ['da', 'di', 'a', 'con'], correctAnswer: 'da', tip: 'L\'agente è introdotto da "da".' },
  { id: 'e29_3', lessonId: '29', subtopic: 'La Forma Passiva', question: 'La casa _______ (costruire) adesso.', options: ['è costruita', 'viene costruita', 'costruisce', 'sarà costruita'], correctAnswer: 'viene costruita', tip: 'Essere o Venire + Participio.' },
  { id: 'e29_4', lessonId: '29', subtopic: 'La Forma Passiva', question: 'Le lettere _______ (spedire) ieri.', options: ['sono spedite', 'erano spedite', 'sono state spedite', 'saranno spedite'], correctAnswer: 'sono state spedite', tip: 'Passato Prossimo Passivo.' },
  { id: 'e29_5', lessonId: '29', subtopic: 'La Forma Passiva', question: 'Le finestre _______ (aprire) dal vento.', options: ['è aperta', 'sono aperte', 'è aperto', 'sono aperti'], correctAnswer: 'sono aperte', tip: 'Concorda con il soggetto passivo (fem. pl.).' },
  { id: 'e29_6', lessonId: '29', subtopic: 'La Forma Passiva', question: 'Il progetto _______ (finire) la prossima settimana.', options: ['è finito', 'sarà finito', 'finisce', 'verrà finito'], correctAnswer: 'sarà finito', tip: 'Futuro Semplice Passivo.' },
  { id: 'e29_7', lessonId: '29', subtopic: 'La Forma Passiva', question: 'Questo problema _______ (dovere) risolvere subito.', options: ['deve essere risolto', 'è risolto', 'risolve', 'dovrà risolvere'], correctAnswer: 'deve essere risolto', tip: 'Dovere + essere + Participio.' },
  { id: 'e29_8', lessonId: '29', subtopic: 'La Forma Passiva', question: 'In Italia _______ (mangiare) molta pasta.', options: ['si mangia', 'è mangiata', 'viene mangiata', 'mangiano'], correctAnswer: 'si mangia', tip: 'Forma passiva impersonale con "si".' },
  { id: 'e29_9', lessonId: '29', subtopic: 'La Forma Passiva', question: 'La porta _______ (aprire) quando sono arrivato.', options: ['era aperta', 'era stata aperta', 'apriva', 'è aperta'], correctAnswer: 'era aperta', tip: 'Imperfetto Passivo.' },
  { id: 'e29_10', lessonId: '29', subtopic: 'La Forma Passiva', question: 'Il quadro è stato dipinto _______ Leonardo.', options: ['da', 'di', 'a', 'con'], correctAnswer: 'da', tip: 'L\'agente è introdotto da "da".' },
  // 30. Discorso Indiretto
  { id: 'e30_1', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Lui ha detto che _______ (venire) più tardi.', options: ['viene', 'sarebbe venuto', 'venga', 'venissi'], correctAnswer: 'sarebbe venuto', tip: 'Futuro nel passato: Condizionale Composto.' },
  { id: 'e30_2', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Mi ha chiesto se _______ (io, stare) bene.', options: ['sto', 'stavo', 'stessi', 'sarei stato'], correctAnswer: 'stavo', tip: 'Presente -> Imperfetto.' },
  { id: 'e30_3', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Ha detto che _______ (lei, andare) al mare il giorno dopo.', options: ['va', 'andava', 'sarebbe andata', 'andrà'], correctAnswer: 'sarebbe andata', tip: 'Futuro -> Condizionale Composto.' },
  { id: 'e30_4', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Ci ha informato che _______ (loro, finire) il lavoro.', options: ['hanno finito', 'avevano finito', 'finivano', 'finiranno'], correctAnswer: 'avevano finito', tip: 'Passato Prossimo -> Trapassato Prossimo.' },
  { id: 'e30_5', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Mi ha promesso che _______ (aiutare) domani.', options: ['aiuta', 'aiutava', 'avrebbe aiutato', 'aiuterà'], correctAnswer: 'avrebbe aiutato', tip: 'Futuro -> Condizionale Composto.' },
  { id: 'e30_6', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Ha chiesto: "Dove _______ (tu, andare)?"', options: ['vai', 'andavi', 'saresti andato', 'andrai'], correctAnswer: 'andavi', tip: 'Presente -> Imperfetto.' },
  { id: 'e30_7', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Mi ha detto: "Non _______ (io, potere) venire".', options: ['posso', 'potevo', 'potrei', 'avrei potuto'], correctAnswer: 'potevo', tip: 'Presente -> Imperfetto.' },
  { id: 'e30_8', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Ha detto che _______ (essere) una bella giornata.', options: ['è', 'era', 'sarebbe', 'sia'], correctAnswer: 'era', tip: 'Presente -> Imperfetto.' },
  { id: 'e30_9', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Ci ha chiesto se _______ (noi, volere) un caffè.', options: ['vogliamo', 'volevamo', 'volessimo', 'avremmo voluto'], correctAnswer: 'volevamo', tip: 'Presente -> Imperfetto.' },
  { id: 'e30_10', lessonId: '30', subtopic: 'Il Discorso Indiretto', question: 'Ha detto che _______ (lui, fare) i compiti.', options: ['fa', 'faceva', 'farebbe', 'ha fatto'], correctAnswer: 'faceva', tip: 'Presente -> Imperfetto.' },

  // 31. Passato Remoto
  { id: 'e31_1', lessonId: '31', subtopic: 'Passato Remoto', question: 'Dante _______ (scrivere) la Divina Commedia.', options: ['scrisse', 'ha scritto', 'scriveva', 'scriverà'], correctAnswer: 'scrisse', tip: 'Passato remoto: Acción concluida en el pasado lejano.' },
  { id: 'e31_2', lessonId: '31', subtopic: 'Passato Remoto', question: 'Cesare _______ (essere) ucciso in Senato.', options: ['fu', 'è stato', 'era', 'sarebbe'], correctAnswer: 'fu', tip: 'Essere (passato remoto): fu.' },
  { id: 'e31_3', lessonId: '31', subtopic: 'Passato Remoto', question: 'Colombo _______ (scoprire) l\'America nel 1492.', options: ['scoprì', 'ha scoperto', 'scopriva', 'scoprirà'], correctAnswer: 'scoprì', tip: 'Scoprire -> scoprì.' },
  { id: 'e31_4', lessonId: '31', subtopic: 'Passato Remoto', question: 'Manzoni _______ (comporre) "I Promessi Sposi".', options: ['compose', 'ha composto', 'componeva', 'comporrà'], correctAnswer: 'compose', tip: 'Comporre -> compose.' },
  { id: 'e31_5', lessonId: '31', subtopic: 'Passato Remoto', question: 'Garibaldi _______ (combattere) per l\'unità d\'Italia.', options: ['combatté', 'ha combattuto', 'combatteva', 'combatterà'], correctAnswer: 'combatté', tip: 'Combattere -> combatté.' },
  { id: 'e31_6', lessonId: '31', subtopic: 'Passato Remoto', question: 'Michelangelo _______ (scolpire) il David.', options: ['scolpì', 'ha scolpito', 'scolpiva', 'scolpirà'], correctAnswer: 'scolpì', tip: 'Scolpire -> scolpì.' },
  { id: 'e31_7', lessonId: '31', subtopic: 'Passato Remoto', question: 'Leonardo _______ (dipingere) l\'Ultima Cena.', options: ['dipinse', 'ha dipinto', 'dipingeva', 'dipingerà'], correctAnswer: 'dipinse', tip: 'Dipingere -> dipinse.' },
  { id: 'e31_8', lessonId: '31', subtopic: 'Passato Remoto', question: 'Galvani _______ (osservare) la contrazione delle rane.', options: ['osservò', 'ha osservato', 'osservava', 'osservò'], correctAnswer: 'osservò', tip: 'Osservare -> osservò.' },
  { id: 'e31_9', lessonId: '31', subtopic: 'Passato Remoto', question: 'Verdi _______ (presentare) l\'Aida al Cairo.', options: ['presentò', 'ha presentato', 'presentava', 'presenterà'], correctAnswer: 'presentò', tip: 'Presentare -> presentò.' },
  { id: 'e31_10', lessonId: '31', subtopic: 'Irregolari Comuni', question: 'Io _______ (avere) molta paura.', options: ['ebbi', 'ho avuto', 'avevo', 'avrò'], correctAnswer: 'ebbi', tip: 'Avere (passato remoto): ebbi.' },

  // 32. Periodo Ipotetico Complejo
  { id: 'e32_1', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se _______ (io, sapere), sarei venuto.', options: ['sapessi', 'avessi saputo', 'sapevo', 'avrei saputo'], correctAnswer: 'avessi saputo', tip: 'Hipótesis en el pasado: Se + Trapassato Congiuntivo.' },
  { id: 'e32_2', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se _______ (noi, partire) prima, non avremmo perso il treno.', options: ['fossimo partiti', 'eravamo partiti', 'partissimo', 'saremmo partiti'], correctAnswer: 'fossimo partiti', tip: 'Essere (trapassato congiuntivo): fossimo partiti.' },
  { id: 'e32_3', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se tu _______ (mangiare), ora non avresti fame.', options: ['avessi mangiato', 'mangiassi', 'mangi', 'avessi mangiato'], correctAnswer: 'avessi mangiato', tip: 'Se + Trapassato (hipótesis pasada) -> Condizionale (consecuencia presente).' },
  { id: 'e32_4', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se lei _______ (chiamare), io avrei risposto.', options: ['avesse chiamato', 'chiamasse', 'chiama', 'avesse chiamato'], correctAnswer: 'avesse chiamato', tip: 'Hipótesis del 3er grado.' },
  { id: 'e32_5', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se _______ (essere) nato in America, parlerei inglese.', options: ['fossi', 'sia', 'sarei', 'ero'], correctAnswer: 'fossi', tip: 'Hipótesis sobre el propio estado: Se + Congiuntivo Imperfetto.' },
  { id: 'e32_6', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se noi _______ (avere) tempo, avremmo visitato il museo.', options: ['avessimo avuto', 'avevamo avuto', 'avremmo avuto', 'avessimo'], correctAnswer: 'avessimo avuto', tip: 'Imposibilidad en el pasado.' },
  { id: 'e32_7', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se non _______ (piovere), saremmo andati al parco.', options: ['avesse piovuto', 'piovesse', 'pioveva', 'fosse piovuto'], correctAnswer: 'avesse piovuto', tip: 'Participio de piovere con avere.' },
  { id: 'e32_8', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se ti _______ (ascoltare), non avrei sbagliato.', options: ['avessi ascoltato', 'ascoltassi', 'ascoltavo', 'avessi ascoltato'], correctAnswer: 'avessi ascoltato', tip: 'Hipótesis sobre una acción concluida.' },
  { id: 'e32_9', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se noi _______ (studiare) di più, avremmo preso 30.', options: ['avessimo studiato', 'studiassimo', 'avevamo studiato', 'avessimo studiato'], correctAnswer: 'avessimo studiato', tip: 'Trapassato congiuntivo.' },
  { id: 'e32_10', lessonId: '32', subtopic: 'Periodo Ipotetico', question: 'Se _______ (vincere) la lotteria, sarei ricco.', options: ['avessi vinto', 'vincessi', 'vinco', 'avessi vinto'], correctAnswer: 'avessi vinto', tip: 'Avere (trapassato congiuntivo): avessi vinto.' },

  // 33. Modismi e Proverbi
  { id: 'e33_1', lessonId: '33', subtopic: 'Modismi e Proverbi', question: 'A: In bocca al lupo! B: _______!', options: ['Crepi', 'Grazie', 'Ciao', 'Piacere'], correctAnswer: 'Crepi', tip: 'Respuesta tradicional a "In bocca al lupo".' },
  { id: 'e33_2', lessonId: '33', subtopic: 'Modismi e Proverbi', question: 'Quando non devi dire un segreto: "_______ in bocca!"', options: ['Sale', 'Acqua', 'Vento', 'Pane'], correctAnswer: 'Acqua', tip: 'Acqua in bocca = ¡Silencio!.' },
  { id: 'e33_3', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"Meglio tardi che _______"', options: ['mai', 'presto', 'sempre', 'domani'], correctAnswer: 'mai', tip: 'Más vale tarde que nunca.' },
  { id: 'e33_4', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"L\'abito non fa il _______"', options: ['monaco', 'prete', 'vestito', 'santo'], correctAnswer: 'monaco', tip: 'El hábito no hace al monje.' },
  { id: 'e33_5', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"Chi dorme non piglia _______"', options: ['pesci', 'uccelli', 'soldi', 'sonno'], correctAnswer: 'pesci', tip: 'Camarón que se duerme...' },
  { id: 'e33_6', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"Tra il dire e il fare c\'è di mezzo il _______"', options: ['mare', 'monte', 'sole', 'fiume'], correctAnswer: 'mare', tip: 'Del dicho al hecho hay un gran trecho.' },
  { id: 'e33_7', lessonId: '33', subtopic: 'Modismi e Proverbi', question: 'Se piove di sera: "Rosso di sera, _______ tempo si spera"', options: ['bel', 'brutto', 'cattivo', 'pioggia'], correctAnswer: 'bel', tip: 'Atardecer rojo, buen tiempo se espera.' },
  { id: 'e33_8', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"Menare il can per l\'_______" (Perder tiempo)', options: ['aia', 'orto', 'canile', 'prato'], correctAnswer: 'aia', tip: 'Marear la perdiz.' },
  { id: 'e33_9', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"Piove sempre sul _______"', options: ['bagnato', 'asciutto', 'terreno', 'prato'], correctAnswer: 'bagnato', tip: 'Llueve sobre mojado.' },
  { id: 'e33_10', lessonId: '33', subtopic: 'Modismi e Proverbi', question: '"Un colpo al cerchio e uno alla _______"', options: ['botte', 'palla', 'testa', 'porta'], correctAnswer: 'botte', tip: 'Una de cal y otra de arena.' },

  // 34. Linguaggio Settoriale
  { id: 'e34_1', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'Il paziente è stato _______ (liberato/mandato a casa).', options: ['dimesso', 'licenziato', 'partito', 'uscito'], correctAnswer: 'dimesso', tip: 'Dimettere = dar el alta médica.' },
  { id: 'e34_2', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'Il giudice ha _______ la sentenza.', options: ['emesso', 'fatto', 'detto', 'scritto'], correctAnswer: 'emesso', tip: 'Emettere una sentenza.' },
  { id: 'e34_3', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'Abbiamo raggiunto il _______ (punto de equilibrio).', options: ['break-even', 'successo', 'fine', 'guadagno'], correctAnswer: 'break-even', tip: 'Terminología internacional en negocios.' },
  { id: 'e34_4', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'La _______ pubblicitaria è stata un successo.', options: ['campagna', 'guerra', 'corsa', 'storia'], correctAnswer: 'campagna', tip: 'Campagna pubblicitaria.' },
  { id: 'e34_5', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'Bisogna aggiornare il _______ del router.', options: ['firmware', 'software', 'hardware', 'code'], correctAnswer: 'firmware', tip: 'Software embebido.' },
  { id: 'e34_6', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'Il tasso di _______ è aumentato.', options: ['interesse', 'banca', 'soldi', 'conto'], correctAnswer: 'interesse', tip: 'Tasso di interesse.' },
  { id: 'e34_7', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'L\'esperimento è stato condotto in _______ cieco.', options: ['doppio', 'singolo', 'triplo', 'pieno'], correctAnswer: 'doppio', tip: 'Doppio cieco (double blind).' },
  { id: 'e34_8', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'Controlla la _______ del primo piano.', options: ['planimetria', 'mappa', 'foto', 'parete'], correctAnswer: 'planimetria', tip: 'Plano horizontal.' },
  { id: 'e34_9', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'L\'editoriale è un articolo di _______.', options: ['fondo', 'base', 'testa', 'centro'], correctAnswer: 'fondo', tip: 'Articolo di fondo.' },
  { id: 'e34_10', lessonId: '34', subtopic: 'Linguaggio Settoriale', question: 'È necessario l\'_______ termico per il pesce crudo.', options: ['abbattimento', 'freddo', 'congelamento', 'cambio'], correctAnswer: 'abbattimento', tip: 'Abbattimento termico.' },
];

export const vocabulary: VocabularyItem[] = [
  // 1. Cibo e Bevande (Comida y bebida)
  { id: 'v1', word: 'Acqua', translation: 'Agua', example: 'Vorrei un bicchiere d’acqua.', category: 'Comida', usageTip: 'Sustantivo femenino, el plural es "acque".', extraExamples: ['L’acqua è fresca.', 'Bevo molta acqua ogni giorno.'] },
  { id: 'v2', word: 'Pane', translation: 'Pan', example: 'Compriamo del pane fresco.', category: 'Comida', usageTip: 'Sustantivo masculino.', extraExamples: ['Il pane è sulla tavola.', 'Mi piace il pane con il burro.'] },
  { id: 'v3', word: 'Vino', translation: 'Vino', example: 'Un bicchiere di vino rosso, per favore.', category: 'Comida', usageTip: 'Masculino, plural "vini".', extraExamples: ['Il vino italiano è famoso.', 'Preferisco il vino bianco.'] },
  { id: 'v4', word: 'Colazione', translation: 'Desayuno', example: 'Faccio colazione alle sette.', category: 'Comida', usageTip: 'Femenino, "fare colazione" es desayunar.', extraExamples: ['Cosa mangi a colazione?', 'La colazione è il pasto più importante.'] },
  { id: 'v5', word: 'Cena', translation: 'Cena', example: 'La cena è pronta tra mezz’ora.', category: 'Comida', usageTip: 'Femenino.', extraExamples: ['Cosa cuciniamo per cena?', 'A cena mangiamo verdure.'] },
  { id: 'v6', word: 'Cucinare', translation: 'Cocinar', example: 'Mi piace cucinare per i miei amici.', category: 'Comida', usageTip: 'Verbo de la primera conjugación.', extraExamples: ['Oggi cucina mio fratello.', 'Sai cucinare le lasagne?'] },
  { id: 'v7', word: 'Zucchero', translation: 'Azúcar', example: 'Prendo il caffè senza zucchero.', category: 'Comida', usageTip: 'Masculino, usa el artículo "lo" (lo zucchero).', extraExamples: ['C’è troppo zucchero nel dolce.', 'Passami lo zucchero, per favore.'] },
  { id: 'v8', word: 'Sale', translation: 'Sal', example: 'Manca un po’ di sale nella zuppa.', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['Non usare troppo sale.', 'Il sale è nel mobile in cucina.'] },
  { id: 'v9', word: 'Latte', translation: 'Leche', example: 'Bevo un bicchiere di latte caldo.', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['Il latte è in frigo.', 'Vuoi un po’ di latte nel tè?'] },
  { id: 'v10', word: 'Formaggio', translation: 'Queso', example: 'Il formaggio italiano è buonissimo.', category: 'Comida', usageTip: 'Masculino, plural "formaggi".', extraExamples: ['Mi piace il formaggio sulla pasta.', 'Compriamo diversi tipi di formaggio.'] },
  { id: 'v11', word: 'Frutta', translation: 'Fruta', example: 'Mangio sempre la frutta dopo pranzo.', category: 'Comida', usageTip: 'Femenino, suele usarse en singular como colectivo.', extraExamples: ['La frutta fa bene alla salud.', 'C’è molta frutta fresca oggi.'] },
  { id: 'v12', word: 'Verdura', translation: 'Verdura', example: 'Dobbiamo mangiare più verdura.', category: 'Comida', usageTip: 'Femenino.', extraExamples: ['La verdura è nel cassetto del frigo.', 'Cucino la verdura al vapore.'] },
  { id: 'v13', word: 'Carne', translation: 'Carne', example: 'Non mangio carne, sono vegetariano.', category: 'Comida', usageTip: 'Femenino.', extraExamples: ['La carne è ben cotta.', 'Ti piace la carne alla griglia?'] },
  { id: 'v14', word: 'Pesce', translation: 'Pescado', example: 'Il pesce è fresco di giornata.', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['Mangiamo pesce ogni venerdì.', 'Il pesce è ricco di omega-3.'] },
  { id: 'v15', word: 'Dolce', translation: 'Postre / Dulce', example: 'Qual è il dolce della casa?', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['Il dolce è delizioso.', 'Dopo cena prendiamo un dolce.'] },
  { id: 'v16', word: 'Birra', translation: 'Cerveza', example: 'Prendiamo una birra gelata.', category: 'Comida', usageTip: 'Femenino.', extraExamples: ['La birra artigianale è ottima.', 'Due birre medie, per favore.'] },
  { id: 'v17', word: 'Caffè', translation: 'Café', example: 'Prendo un caffè ristretto.', category: 'Comida', usageTip: 'Masculino, invariable en plural.', extraExamples: ['Il caffè italiano è il migliore.', 'Prendiamo un caffè insieme?'] },
  { id: 'v18', word: 'Tè', translation: 'Té', example: 'Preferisco il tè verde al mattino.', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['Il tè è pronto.', 'Vuoi un po’ di limone nel tè?'] },
  { id: 'v19', word: 'Succo', translation: 'Zumo / Jugo', example: 'Vorrei un succo d’arancia.', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['Il succo è senza zuccheri aggiunti.', 'Bevo un succo di frutta a merenda.'] },
  { id: 'v20', word: 'Biscotto', translation: 'Galleta', example: 'Mangio due biscotti con il latte.', category: 'Comida', usageTip: 'Masculino.', extraExamples: ['I biscotti sono nella scatola.', 'Questi biscotti sono fatti in casa.'] },
  
  // 0. Fonetica (Nuevos)
  { id: 'vf1', word: 'Alfabeto', translation: 'Alfabeto', example: 'L\'alfabeto italiano ha 21 lettere.', category: 'Fonetica', usageTip: 'Solo tiene 21 letras nativas.', extraExamples: ['Impariamo l\'alfabeto.', 'Qual è la prima lettera?'] },
  { id: 'vf2', word: 'Pronuncia', translation: 'Pronunciación', example: 'La tua pronuncia è ottima.', category: 'Fonetica', usageTip: 'Femenino, cuidado con la C inicial.', extraExamples: ['Studio la pronuncia.', 'Come si dice?'] },
  { id: 'vf3', word: 'Parola', translation: 'Palabra', example: 'Questa parola è difficile.', category: 'Fonetica', usageTip: 'Femenino, plural "parole".', extraExamples: ['Qual è il significato di questa parola?', 'Scrivi una parola in italiano.'] },
  { id: 'vf4', word: 'Lettera', translation: 'Letra', example: 'La lettera H è muta.', category: 'Fonetica', usageTip: 'Femenino, plural "lettere".', extraExamples: ['Quante lettere ci sono?', 'Questa lettera è rara.'] },
  { id: 'vf5', word: 'Suono', translation: 'Sonido', example: 'Il suono della "C" cambia.', category: 'Fonetica', usageTip: 'Masculino.', extraExamples: ['Ascolta il suono.', 'Un suono dolce.'] },

  // 9. Tiempo y Calendario (Nuevos)
  { id: 'v9_1', word: 'Settimana', translation: 'Semana', example: 'La settimana ha sette giorni.', category: 'Calendario', usageTip: 'Femenino.', extraExamples: ['Buona settimana!', 'Questa settimana lavoro molto.'] },
  { id: 'v9_2', word: 'Domani', translation: 'Mañana', example: 'Ci vediamo domani.', category: 'Calendario', usageTip: 'Adverbio de tiempo.', extraExamples: ['A domani!', 'Domani è festa.'] },
  { id: 'v9_3', word: 'Ieri', translation: 'Ayer', example: 'Ieri era domenica.', category: 'Calendario', usageTip: 'Adverbio de tiempo.', extraExamples: ['Ieri ho mangiato pasta.', 'Dov\'eri ieri?'] },
  { id: 'v9_4', word: 'Mese', translation: 'Mes', example: 'Il mese di aprile è bello.', category: 'Calendario', usageTip: 'Masculino.', extraExamples: ['Dodici mesi.', 'Il prossimo mese.'] },
  { id: 'v9_5', word: 'Appuntamento', translation: 'Cita / Encuentro', example: 'Ho un appuntamento alle tre.', category: 'Calendario', usageTip: 'Masculino.', extraExamples: ['Ho perso l\'appuntamento.', 'A che ora è l\'appuntamento?'] },

  // 2. Città e Trasporti (Ciudad y transporte)
  { id: 'v21', word: 'Strada', translation: 'Calle / Carretera', example: 'Questa strada porta in centro.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['La strada è stretta.', 'Attraversa la strada con attenzione.'] },
  { id: 'v22', word: 'Stazione', translation: 'Estación', example: 'Ci vediamo alla stazione alle sei.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['La stazione è vicina al porto.', 'Dov’è la stazione dei treni?'] },
  { id: 'v23', word: 'Autobus', translation: 'Autobús', example: 'Prendo l’autobus per andare al lavoro.', category: 'Transporte', usageTip: 'Masculino, invariable.', extraExamples: ['L’autobus è in ritardo.', 'Il biglietto dell’autobus costa poco.'] },
  { id: 'v24', word: 'Macchina', translation: 'Coche / Auto', example: 'La mia macchina è parcheggiata lì.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['Guido la macchina di mio padre.', 'La macchina è nuova.'] },
  { id: 'v25', word: 'Treno', translation: 'Tren', example: 'Il treno parte dal binario tre.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Viaggio spesso in treno.', 'Il treno è veloce.'] },
  { id: 'v26', word: 'Bicicletta', translation: 'Bicicleta', example: 'Vado in centro in bicicletta.', category: 'Transporte', usageTip: 'Femenino, abreviatura común: "bici".', extraExamples: ['La mia bicicletta è blu.', 'Uso la bicicletta per fare sport.'] },
  { id: 'v27', word: 'Aereo', translation: 'Avión', example: 'L’aereo decolla tra poco.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Viaggiare in aereo è comodo.', 'Il biglietto aereo è costoso.'] },
  { id: 'v28', word: 'Piazza', translation: 'Plaza', example: 'La piazza principale è bellissima.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['Ci incontriamo in piazza.', 'La piazza è piena di gente.'] },
  { id: 'v29', word: 'Palazzo', translation: 'Edificio / Palacio', example: 'Vivo in un antico palazzo veneziano.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Il palazzo ha cinque piani.', 'Dall’ultimo piano la vista è ottima.'] },
  { id: 'v30', word: 'Negozio', translation: 'Tienda', example: 'Il negozio apre alle nove.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Questo negozio vende scarpe.', 'Vado in centro per fare acquisti nei negozi.'] },
  { id: 'v31', word: 'Ristorante', translation: 'Restaurante', example: 'Conosco un ottimo ristorante in questa zona.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Il ristorante è sempre pieno.', 'Andiamo al ristorante stasera?'] },
  { id: 'v32', word: 'Cinema', translation: 'Cine', example: 'Andiamo al cinema a vedere un film.', category: 'Transporte', usageTip: 'Masculino, invariable.', extraExamples: ['Il cinema è nel centro commerciale.', 'C’è un bel film al cinema.'] },
  { id: 'v33', word: 'Ospedale', translation: 'Hospital', example: 'L’ospedale è aperto ventiquattr’ore su ventiquattro.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Mio zio lavora in ospedale.', 'Dov’è l’ospedale più vicino?'] },
  { id: 'v34', word: 'Scuola', translation: 'Escuela', example: 'I bambini vanno a scuola alle otto.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['La scuola è chiusa il sabato.', 'Insegno in una scuola superiore.'] },
  { id: 'v35', word: 'Ufficio', translation: 'Oficina', example: 'Sento il capo in ufficio.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Il mio ufficio è al terzo piano.', 'Lavoro in un ufficio moderno.'] },
  { id: 'v36', word: 'Ponte', translation: 'Puente', example: 'Attraversiamo il ponte sopra il fiume.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Il ponte è molto lungo.', 'C’è molto traffico sul ponte oggi.'] },
  { id: 'v37', word: 'Parco', translation: 'Parque', example: 'Andiamo al parco a fare una passeggiata.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Il parco è pieno di alberi.', 'Bambini giocano nel parco.'] },
  { id: 'v38', word: 'Chiesa', translation: 'Iglesia', example: 'La chiesa del paese è molto antica.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['Visitiamo la chiesa domani.', 'La chiesa ha un campanile alto.'] },
  { id: 'v39', word: 'Biglietto', translation: 'Billete / Ticket', example: 'Devo comprare il biglietto prima di salire.', category: 'Transporte', usageTip: 'Masculino.', extraExamples: ['Hai il biglietto?', 'Il biglietto costa cinque euro.'] },
  { id: 'v40', word: 'Fermata', translation: 'Parada', example: 'La fermata del bus è proprio qui.', category: 'Transporte', usageTip: 'Femenino.', extraExamples: ['Scendo alla prossima fermata.', 'Aspetto alla fermata.'] },

  // 3. Famiglia e Relazioni (Familia y relaciones)
  { id: 'v41', word: 'Padre', translation: 'Padre', example: 'Mio padre lavora in banca.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Mio padre è molto sportivo.', 'Voglio bene a mio padre.'] },
  { id: 'v42', word: 'Madre', translation: 'Madre', example: 'Sua madre è un’insegnante de yoga.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Mia madre cucina benissimo.', 'Chiamo mia madre ogni giorno.'] },
  { id: 'v43', word: 'Fratello', translation: 'Hermano', example: 'Ho un fratello maggiore e una sorella minore.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Mio fratello vive a Roma.', 'Gioco a calcio con mio fratello.'] },
  { id: 'v44', word: 'Sorella', translation: 'Hermana', example: 'Mia sorella studia medicina a Milano.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Mia sorella è molto simpatica.', 'Esco con mia sorella stasera.'] },
  { id: 'v45', word: 'Figlio', translation: 'Hijo', example: 'Loro hanno un figlio di tre anni.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Mio figlio va alla scuola materna.', 'Il loro figlio è molto vivace.'] },
  { id: 'v46', word: 'Figlia', translation: 'Hija', example: 'Sua figlia suona il pianoforte.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Mia figlia è bravissima a scuola.', 'La figlia del vicino è partita.'] },
  { id: 'v47', word: 'Nonno', translation: 'Abuelo', example: 'Mio nonno racconta molte storie.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Il nonno è in giardino.', 'Vado a trovare mio nonno domenica.'] },
  { id: 'v48', word: 'Nonna', translation: 'Abuela', example: 'La nonna prepara sempre il pranzo della domenica.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Mia nonna è molto dolce.', 'Le ricette della nonna sono le migliori.'] },
  { id: 'v49', word: 'Zio', translation: 'Tío', example: 'Mio zio mi regala sempre libri.', category: 'Familia', usageTip: 'Masculino, usa "lo" (lo zio).', extraExamples: ['Mio zio vive a Parigi.', 'Esco con lo zio stasera.'] },
  { id: 'v50', word: 'Zia', translation: 'Tía', example: 'Mia zia è molto brava a dipingere.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['La zia ci invita a cena.', 'Mia zia abita vicino a noi.'] },
  { id: 'v51', word: 'Cugino', translation: 'Primo', example: 'Mio cugino viene a trovarci a Natale.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Mio cugino studia a Londra.', 'Siamo cresciuti insieme con mio cugino.'] },
  { id: 'v52', word: 'Cugina', translation: 'Prima', example: 'Mia cugina è appena diventata mamma.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Parlo spesso con mia cugina.', 'Mia cugina è molto intelligente.'] },
  { id: 'v53', word: 'Marito', translation: 'Marido', example: 'Suo marito è un architetto famoso.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Mio marito lavora molto.', 'Ho conosciuto suo marito ieri.'] },
  { id: 'v54', word: 'Moglie', translation: 'Mujer (esposa)', example: 'Mia moglie ama viaggiare.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Sua moglie è una donna fantastica.', 'Compro un regalo per mia moglie.'] },
  { id: 'v55', word: 'Amico', translation: 'Amigo', example: 'Lui è il mio migliore amico.', category: 'Familia', usageTip: 'Masculino, plural "amici".', extraExamples: ['Ho molti amici a scuola.', 'Il mio migliore amico è molto leale.'] },
  { id: 'v56', word: 'Amica', translation: 'Amiga', example: 'Lei è una mia cara amica.', category: 'Familia', usageTip: 'Femenino, plural "amiche".', extraExamples: ['Esco con le mie amiche.', 'La mia amica mi aiuta sempre.'] },
  { id: 'v57', word: 'Fidanzato', translation: 'Novio (prometido)', example: 'Il mio fidanzato mi ha chiesto di sposarlo.', category: 'Familia', usageTip: 'Masculino.', extraExamples: ['Mio fidanzato è gentilissimo.', 'Conosci il mio fidanzato?'] },
  { id: 'v58', word: 'Fidanzata', translation: 'Novia (prometida)', example: 'La sua fidanzata è una modella.', category: 'Familia', usageTip: 'Femenino.', extraExamples: ['Voglio presentarti la mia fidanzata.', 'La sua fidanzata è molto bella.'] },
  { id: 'v59', word: 'Genitori', translation: 'Padres', example: 'I miei genitori sono in vacanza.', category: 'Familia', usageTip: 'Masculino plurale.', extraExamples: ['Obbedisco ai miei genitori.', 'I genitori di Luca sono molto simpatici.'] },
  { id: 'v60', word: 'Parenti', translation: 'Parientes', example: 'Tutti i miei parenti vivono in Sicilia.', category: 'Familia', usageTip: 'Masculino plurale.', extraExamples: ['Abbiamo molti parenti stretti.', 'I parenti si riuniscono per le feste.'] },

  // 4. Tempo e Meteo (Tiempo y Clima)
  { id: 'v61', word: 'Sole', translation: 'Sol', example: 'Oggi c’è un bel sole.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Il sole scalda molto oggi.', 'Guardo il sole tramontare.'] },
  { id: 'v62', word: 'Pioggia', translation: 'Lluvia', example: 'La pioggia continua a cadere.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['Manca la pioggia quest’estate.', 'Sento il rumore della pioggia.'] },
  { id: 'v63', word: 'Neve', translation: 'Nieve', example: 'In montagna c’è molta neve.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['La neve copre tutto il paesaggio.', 'Mi piace giocare con la neve.'] },
  { id: 'v64', word: 'Vento', translation: 'Viento', example: 'C’è un forte vento de tramontana.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Il vento soffia tra gli alberi.', 'Sento il vento fresco sul viso.'] },
  { id: 'v65', word: 'Nuvola', translation: 'Nube', example: 'C’è solo una piccola nuvola in cielo.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['Le nuvole oscurano il sole.', 'Il cielo è pieno de nuvole bianche.'] },
  { id: 'v66', word: 'Freddo', translation: 'Frío', example: 'Oggi fa molto freddo.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Ho freddo alle mani.', 'Mettiti il cappotto perché fa freddo.'] },
  { id: 'v67', word: 'Caldo', translation: 'Calor', example: 'D’estate fa un caldo terribile.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Ho molto caldo quest’oggi.', 'Bevo acqua fresca per combattere il caldo.'] },
  { id: 'v68', word: 'Temporale', translation: 'Tormenta', example: 'È in arrivo un forte temporale.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Il temporale ha rinfrescato l’aria.', 'C’è stato un temporale ieri notte.'] },
  { id: 'v69', word: 'Previsioni', translation: 'Previsiones / Pronóstico', example: 'Le previsioni dicono che domani pioverà.', category: 'Tiempo', usageTip: 'Femenino plurale.', extraExamples: ['Controllo le previsioni del tempo.', 'Le previsioni meteo sono affidabili.'] },
  { id: 'v70', word: 'Temperatura', translation: 'Temperatura', example: 'La temperatura è scesa di dieci gradi.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['Qual è la temperatura esterna?', 'La temperatura è perfetta per una passeggiata.'] },
  { id: 'v71', word: 'Stagione', translation: 'Estación (del año)', example: 'La primavera è la mia stagione preferita.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['In ogni stagione il paesaggio cambia.', 'Quale stagione preferisci?'] },
  { id: 'v72', word: 'Primavera', translation: 'Primavera', example: 'In primavera sbocciano i fiori.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['La primavera porta giornate più lunghe.', 'In primavera vado spesso in campagna.'] },
  { id: 'v73', word: 'Estate', translation: 'Verano', example: 'D’estate andiamo sempre al mare.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['L’estate è molto calda qui.', 'Passo tutta l’estate in viaggio.'] },
  { id: 'v74', word: 'Autunno', translation: 'Otoño', example: 'In autunno le foglie cadono.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['L’autunno ha colori meravigliosi.', 'Vado nel bosco a cercare funghi in autunno.'] },
  { id: 'v75', word: 'Inverno', translation: 'Invierno', example: 'L’inverno è la stagione dello sci.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['L’inverno scorso è stato molto rigido.', 'Indosso vestiti pesanti in inverno.'] },
  { id: 'v76', word: 'Giorno', translation: 'Día', example: 'Oggi è un giorno speciale.', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Buon giorno a tutti!', 'Ho lavorato tutto il giorno.'] },
  { id: 'v77', word: 'Notte', translation: 'Noche', example: 'Auguro a tutti una buona notte.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['La notte è silenziosa.', 'Guardo le stelle durante la notte.'] },
  { id: 'v78', word: 'Mattina', translation: 'Mañana', example: 'Mi sveglio presto ogni mattina.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['Oggi la mattina è nebbiosa.', 'Bevo il caffè ogni mattina.'] },
  { id: 'v79', word: 'Pomeriggio', translation: 'Tarde', example: 'Cosa fai questo pomeriggio?', category: 'Tiempo', usageTip: 'Masculino.', extraExamples: ['Passo il pomeriggio a leggere.', 'Ci vediamo alle quattro del pomeriggio.'] },
  { id: 'v80', word: 'Sera', translation: 'Tarde / Noche (inicio)', example: 'Andiamo a cena fuori questa sera.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['La sera mi riposo sul divano.', 'Buona sera, signora Bianchi.'] },

  // 5. Casa e Oggetti (Casa y Objetos)
  { id: 'v81', word: 'Casa', translation: 'Casa', example: 'La mia casa è piccola ma accogliente.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['Vado a casa subito.', 'La casa ha un bel giardino.'] },
  { id: 'v82', word: 'Porta', translation: 'Puerta', example: 'Chiudi la porta, per favore.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['Qualcuno ha bussato alla porta.', 'La porta è aperta.'] },
  { id: 'v83', word: 'Finestra', translation: 'Ventana', example: 'Apro la finestra per far entrare aria.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['Guardo fuori dalla finestra.', 'Finestra con vista mare.'] },
  { id: 'v84', word: 'Letto', translation: 'Cama', example: 'Vado a letto presto stasera.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Il letto è rifatto.', 'Mi riposo sopra il letto.'] },
  { id: 'v85', word: 'Tavolo', translation: 'Mesa', example: 'Mettiamo i piatti sul tavolo.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Il tavolo è libero.', 'Apparecchio il tavolo.'] },
  { id: 'v86', word: 'Sedia', translation: 'Silla', example: 'Siediti su questa sedia comoda.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['La sedia è vicino alla scrivania.', 'Quattro sedie intorno al tavolo.'] },
  { id: 'v87', word: 'Cucina', translation: 'Cocina', example: 'Passo molto tempo in cucina.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['La cucina è moderna.', 'Prepararo tutto in cucina.'] },
  { id: 'v88', word: 'Bagno', translation: 'Baño', example: 'Dov’è il secondo bagno?', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Faccio una doccia in bagno.', 'Il bagno è pulito.'] },
  { id: 'v89', word: 'Soggiorno', translation: 'Salón', example: 'Guardo la TV in soggiorno.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Il soggiorno è luminoso.', 'Ci rilassiamo in soggiorno.'] },
  { id: 'v90', word: 'Camera', translation: 'Habitación / Dormitorio', example: 'La mia camera è al secondo piano.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['Entro nella mia camera.', 'La camera è spaziosa.'] },
  { id: 'v91', word: 'Lampada', translation: 'Lámpara', example: 'Accendo la lampada sul comodino.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['La lampada illumina la stanza.', 'Compro una nuova lampada.'] },
  { id: 'v92', word: 'Specchio', translation: 'Espejo', example: 'Mi guardo allo specchio.', category: 'Casa', usageTip: 'Masculino, usa "lo" (lo specchio).', extraExamples: ['Lo specchio è dorato.', 'C’è uno specchio in bagno.'] },
  { id: 'v93', word: 'Armadio', translation: 'Armario', example: 'Metto i vestiti nell’armadio.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['L’armadio è pieno.', 'Dov’è l’armadio a muro?'] },
  { id: 'v94', word: 'Divano', translation: 'Sofá', example: 'Mi siedo sul divano a guardare un film.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Il divano è in pelle.', 'Un divano a tre posti.'] },
  { id: 'v95', word: 'Telefono', translation: 'Teléfono', example: 'Rispondo al telefono.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Dov’è il mio telefono?', 'Il telefono squilla.'] },
  { id: 'v96', word: 'Chiave', translation: 'Llave', example: 'Non trovo le chiavi di casa.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['Gira la chiave nella serratura.', 'Ho perso le chiavi.'] },
  { id: 'v97', word: 'Orologio', translation: 'Reloj', example: 'Guardo l’orologio per vedere che ora è.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Il mio orologio è preciso.', 'Indosso un orologio da polso.'] },
  { id: 'v98', word: 'Quadro', translation: 'Cuadro', example: 'Appendo un quadro sulla parete.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['È un quadro d’autore.', 'Guardo i quadri nella galleria d’arte.'] },
  { id: 'v99', word: 'Libro', translation: 'Libro', example: 'Leggo un libro a letto.', category: 'Casa', usageTip: 'Masculino.', extraExamples: ['Il libro è interessante.', 'Compro un libro in libreria.'] },
  { id: 'v100', word: 'Borsa', translation: 'Bolsa / Bolso', example: 'Tengo tutto nella mia borsa.', category: 'Casa', usageTip: 'Femenino.', extraExamples: ['Svuoto la borsa.', 'La borsa è de cuoio.'] },

  // 6. Salute e Corpo (Salud y Cuerpo)
  { id: 'v101', word: 'Testa', translation: 'Cabeza', example: 'Mi fa male la testa.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Giro la testa.', 'Hai una bella testa.'] },
  { id: 'v102', word: 'Mano', translation: 'Mano', example: 'Mi sono lavato le mani.', category: 'Salud', usageTip: 'Femenino, eccepción (la mano, le mani).', extraExamples: ['Ti do la mano.', 'Ho le mani fredde.'] },
  { id: 'v103', word: 'Braccio', translation: 'Brazo', example: 'Ho un dolore al braccio destro.', category: 'Salud', usageTip: 'Masculino, plural irregular "le braccia".', extraExamples: ['Alzo le braccia.', 'Ho le braccia forti.'] },
  { id: 'v104', word: 'Gamba', translation: 'Pierna', example: 'Sono stanco nelle gambe.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Corro con le gambe.', 'Ho una gamba ferita.'] },
  { id: 'v105', word: 'Cuore', translation: 'Corazón', example: 'Il cuore batte forte.', category: 'Salud', usageTip: 'Masculino.', extraExamples: ['Ascolto il battito del cuore.', 'Parlo con il cuore in mano.'] },
  { id: 'v106', word: 'Occhio', translation: 'Ojo', example: 'Hai dei bellissimi occhi azzurri.', category: 'Salud', usageTip: 'Masculino, plural "occhi".', extraExamples: ['Apro gli occhi.', 'Guarda qui negli occhi.'] },
  { id: 'v107', word: 'Bocca', translation: 'Boca', example: 'Apri la bocca.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Rido a bocca aperta.', 'La bocca è asciutta.'] },
  { id: 'v108', word: 'Naso', translation: 'Nariz', example: 'Ho il naso chiuso.', category: 'Salud', usageTip: 'Masculino.', extraExamples: ['Sento il profumo con il naso.', 'Hai un naso alla francese.'] },
  { id: 'v109', word: 'Orecchio', translation: 'Oreja / Oído', example: 'Mi fa male l’orecchio sinistro.', category: 'Salud', usageTip: 'Masculino, plural irregular "le orecchie".', extraExamples: ['Tappati le orecchie.', 'Sento un rumore nell’orecchio.'] },
  { id: 'v110', word: 'Dente', translation: 'Diente', example: 'Devo andare dal dentista perché ho male a un dente.', category: 'Salud', usageTip: 'Masculino.', extraExamples: ['Lavo i denti tre volte al giorno.', 'Un dente è cariato.'] },
  { id: 'v111', word: 'Salute', translation: 'Salud', example: 'La salute è la cosa più importante.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Brindiamo alla nostra salute.', 'Oggi mi sento bene di salute.'] },
  { id: 'v112', word: 'Malattia', translation: 'Enfermedad', example: 'L’influenza è una malattia fastidiosa.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Cerchiamo una cura per questa malattia.', 'Lotto contro la malattia.'] },
  { id: 'v113', word: 'Dottore', translation: 'Doctor', example: 'Il dottore mi ha prescritto una cura.', category: 'Salud', usageTip: 'Masculino, femenino "dottoressa".', extraExamples: ['Chiamo il dottore subito.', 'Il dottore è molto esperto.'] },
  { id: 'v114', word: 'Medicina', translation: 'Medicina / Medicamento', example: 'Devo prendere questa medicina tre volte al giorno.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Studio medicina all’università.', 'La medicina è amara.'] },
  { id: 'v115', word: 'Dolore', translation: 'Dolor', example: 'Ho un forte dolore alla schiena.', category: 'Salud', usageTip: 'Masculino.', extraExamples: ['Sento un dolore acuto.', 'Il dolore sta passando.'] },
  { id: 'v116', word: 'Stanchi', translation: 'Cansados', example: 'Siamo molto stanchi dopo la corsa.', category: 'Salud', usageTip: 'Masculino plural, singular "stanco".', extraExamples: ['Mi sento stanco.', 'Loro sono stanche morte.'] },
  { id: 'v117', word: 'Febbre', translation: 'Fiebre', example: 'Ha la febbre alta.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Misura la febbre con il termometro.', 'La febbre sta scendendo.'] },
  { id: 'v118', word: 'Tosse', translation: 'Tos', example: 'C’è qualcuno che ha una brutta tosse.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Bevo uno sciroppo per la tosse.', 'Ho una tosse secca.'] },
  { id: 'v119', word: 'Corpo', translation: 'Cuerpo', example: 'Dobbiamo prenderci cura del nostro corpo.', category: 'Salud', usageTip: 'Masculino.', extraExamples: ['Faccio esercizio per mantenere il corpo sano.', 'Il corpo umano è complesso.'] },
  { id: 'v120', word: 'Pelle', translation: 'Piel', example: 'Ho la pelle molto chiara.', category: 'Salud', usageTip: 'Femenino.', extraExamples: ['Metto la crema sulla pelle.', 'Sento il sole sulla pelle.'] },

  // 7. Lavoro e Studio (Trabajo y Estudio)
  { id: 'v121', word: 'Lavoro', translation: 'Trabajo', example: 'Cerco un lavoro stimolante.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['Sono soddisfatto del mio lavoro.', 'Vado al lavoro ogni giorno.'] },
  { id: 'v122', word: 'Insegnante', translation: 'Profesor / Maestro', example: 'Il mio insegnante de storia è fantastico.', category: 'Trabajo', usageTip: 'Ambos géneros.', extraExamples: ['L’insegnante spiega la lezione.', 'Diventerò un insegnante.'] },
  { id: 'v123', word: 'Studente', translation: 'Estudiante', example: 'Sono uno studente universitario.', category: 'Trabajo', usageTip: 'Masculino, femenino "studentessa".', extraExamples: ['Lo studente studia molto.', 'Siamo studenti diligenti.'] },
  { id: 'v124', word: 'Ufficio', translation: 'Oficina', example: 'Lavoro in un moderno ufficio in centro.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['Il mio ufficio è silenzioso.', 'Ci vediamo in ufficio?'] },
  { id: 'v125', word: 'Libro', translation: 'Libro', example: 'Studio su questo libro de testo.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['Ho letto tutto il libro.', 'I libri sono in libreria.'] },
  { id: 'v126', word: 'Lezione', translation: 'Lección / Clase', example: 'Oggi ho una lezione importante.', category: 'Trabajo', usageTip: 'Femenino.', extraExamples: ['La lezione inizia alle nove.', 'Ho capito bene la lezione.'] },
  { id: 'v127', word: 'Esame', translation: 'Examen', example: 'Devo superare questo esame difficile.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['L’esame dura tre ore.', 'Mi sento pronto per l’esame.'] },
  { id: 'v128', word: 'Computer', translation: 'Ordenador / Computadora', example: 'Lavoro tutto il giorno al computer.', category: 'Trabajo', usageTip: 'Masculino, invariable.', extraExamples: ['Il mio computer è nuovo.', 'Accendo il computer.'] },
  { id: 'v129', word: 'Azienda', translation: 'Empresa', example: 'Lavoro per una grande azienda de software.', category: 'Trabajo', usageTip: 'Femenino.', extraExamples: ['L’azienda esporta in tutto il mondo.', 'Fondo un’azienda mia.'] },
  { id: 'v130', word: 'Collega', translation: 'Colega / Compañero', example: 'Ho dei colleghi molto simpatici.', category: 'Trabajo', usageTip: 'Ambos géneros.', extraExamples: ['Pranzo con i miei colleghi.', 'La mia collega mi ha aiutato molto.'] },
  { id: 'v131', word: 'Stipendio', translation: 'Sueldo / Salario', example: 'Ricevo lo stipendio ogni fine mese.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['Lo stipendio è buono.', 'Voglio un aumento de stipendio.'] },
  { id: 'v132', word: 'Ferie', translation: 'Vacaciones (trabajo)', example: 'Vado in ferie la prossima settimana.', category: 'Trabajo', usageTip: 'Femenino plurale.', extraExamples: ['Abbiamo due settimane de ferie.', 'Tutto l’ufficio è in ferie.'] },
  { id: 'v133', word: 'Riunione', translation: 'Reunión', example: 'Abbiamo una riunione alle dieci.', category: 'Trabajo', usageTip: 'Femenino.', extraExamples: ['La riunione è stata produttiva.', 'Partecipi alla riunione?'] },
  { id: 'v134', word: 'Progetto', translation: 'Proyecto', example: 'Lavoro a un progetto internazionale.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['Il progetto sta andando bene.', 'Finisco il progetto oggi.'] },
  { id: 'v135', word: 'Imparare', translation: 'Aprender', example: 'Voglio imparare l’italiano bene.', category: 'Trabajo', usageTip: 'Verbo de la primera conjugación.', extraExamples: ['Imparo qualcosa de nuovo ogni giorno.', 'Hai imparato la lezione?'] },
  { id: 'v136', word: 'Insegnare', translation: 'Enseñar', example: 'Mi piace insegnare ai bambini.', category: 'Trabajo', usageTip: 'Verbo de la primera conjugación.', extraExamples: ['Insegno matematica a scuola.', 'Cosa insegni tu?'] },
  { id: 'v137', word: 'Compiti', translation: 'Deberes / Tarea', example: 'I bambini devono fare i compiti.', category: 'Trabajo', usageTip: 'Masculino plurale.', extraExamples: ['Fai i tuoi compiti!', 'I compiti per domani sono tanti.'] },
  { id: 'v138', word: 'Quaderno', translation: 'Cuaderno', example: 'Scrivo i miei appunti sul quaderno.', category: 'Trabajo', usageTip: 'Masculino.', extraExamples: ['Il mio quaderno è finiro.', 'Compro un quaderno nuovo.'] },
  { id: 'v139', word: 'Penna', translation: 'Bolígrafo', example: 'Hai una penna per favore?', category: 'Trabajo', usageTip: 'Femenino.', extraExamples: ['La penna scrive in nero.', 'Ho perso la mia penna preferita.'] },
  { id: 'v140', word: 'Matematica', translation: 'Matemáticas', example: 'Studio spesso la matematica.', category: 'Trabajo', usageTip: 'Femenino.', extraExamples: ['Amo la matematica.', 'I libri de matematica sono difficili.'] },

  // 8. Emozioni e Sentimenti (Emociones y Sentimientos)
  { id: 'v141', word: 'Felice', translation: 'Feliz', example: 'Sono molto felice oggi.', category: 'Emociones', usageTip: 'Adjetivo invariable en género.', extraExamples: ['Rende felici le persone.', 'Siamo felici insieme.'] },
  { id: 'v142', word: 'Triste', translation: 'Triste', example: 'Perché sei triste oggi?', category: 'Emociones', usageTip: 'Adjetivo invariable en género.', extraExamples: ['Il film era triste.', 'Siamo tutti un po’ tristi.'] },
  { id: 'v143', word: 'Arrabbiato', translation: 'Enfadado / Enojado', example: 'Lui è arrabbiato con me.', category: 'Emociones', usageTip: 'Adjetivo, cambia género (o/a).', extraExamples: ['Non essere arrabbiata.', 'Siamo molto arrabbiati.'] },
  { id: 'v144', word: 'Paura', translation: 'Miedo', example: 'Ho paura del buio.', category: 'Emociones', usageTip: 'Femenino.', extraExamples: ['Non aver paura!', 'La paura è passata.'] },
  { id: 'v145', word: 'Sorpreso', translation: 'Sorprendido', example: 'Siamo rimasti sorpresi dalla notizia.', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['Sono sorpreso de vederti qui.', 'Loro sembravano sorpresi.'] },
  { id: 'v146', word: 'Amore', translation: 'Amor', example: 'L’amore è il sentimento più forte.', category: 'Emociones', usageTip: 'Masculino.', extraExamples: ['Provo molto amore per lei.', 'L’amore vince sempre tutto.'] },
  { id: 'v147', word: 'Odio', translation: 'Odio', example: 'L’odio non porta a nulla de buono.', category: 'Emociones', usageTip: 'Masculino.', extraExamples: ['Non odio nessuno.', 'Sento odio in quelle parole.'] },
  { id: 'v148', word: 'Speranza', translation: 'Esperanza', example: 'La speranza è l’ultima a morire.', category: 'Emociones', usageTip: 'Femenino.', extraExamples: ['Ho molta speranza per il futuro.', 'Mantengo la speranza viva.'] },
  { id: 'v149', word: 'Gioia', translation: 'Alegría', example: 'Che gioia vederti finalmente!', category: 'Emociones', usageTip: 'Femenino.', extraExamples: ['Salto per la gioia.', 'Esprimo molta gioia oggi.'] },
  { id: 'v150', word: 'Preoccupato', translation: 'Preocupado', example: 'Loro sono molto preoccupati per l’esame.', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['Non sono preoccupato.', 'Sua madre era molto preoccupata.'] },
  { id: 'v151', word: 'Curioso', translation: 'Curioso', example: 'Sono curioso de sapere cosa succede.', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['Lo studente è molto curioso.', 'Le persone curiose imparano molto.'] },
  { id: 'v152', word: 'Nervoso', translation: 'Nervioso', example: 'Prima dell’intervista ero molto nervoso.', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['Non essere così nervoso.', 'Mi sento nervoso oggi.'] },
  { id: 'v153', word: 'Calmo', translation: 'Calmado / Tranquilo', example: 'Manteniamo tutti la calma.', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['Il mare è calmo oggi.', 'Sii calmo, per favore.'] },
  { id: 'v154', word: 'Orgoglioso', translation: 'Orgulloso', example: 'Sono orgoglioso de te!', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['Loro sembrano orgogliosi dei loro risultati.', 'Mio padre è orgoglioso del mio lavoro.'] },
  { id: 'v155', word: 'Emozione', translation: 'Emoción', example: 'Sento una grande emozione in questo momento.', category: 'Emociones', usageTip: 'Femenino.', extraExamples: ['Tratteniamo l’emozione.', 'Quell’evento ha causato molte emozioni forti.'] },
  { id: 'v156', word: 'Noia', translation: 'Aburrimiento', example: 'Sento molta noia stasera.', category: 'Emociones', usageTip: 'Femenino.', extraExamples: ['La noia mi uccide.', 'Sconfiggiamo la noia insieme.'] },
  { id: 'v157', word: 'Piacere', translation: 'Placer / Gusto', example: 'È stato un piacere conoscerti.', category: 'Emociones', usageTip: 'Masculino.', extraExamples: ['Faccio questo lavoro con piacere.', 'Qual è il tuo piacere preferito?'] },
  { id: 'v158', word: 'Simpatico', translation: 'Simpático', example: 'Luca è un ragazzo molto simpatico.', category: 'Emociones', usageTip: 'Adjetivo.', extraExamples: ['La tua amica è molto simpatica.', 'Loro sono persone simpatiche.'] },
  { id: 'v159', word: 'Antipatico', translation: 'Antipático', example: 'Quell’uomo è proprio antipatico.', category: 'Emociones', usageTip: 'Adjetivo, opuesto a simpatico.', extraExamples: ['Non essere così antipatico.', 'Lo trovo molto antipatico.'] },
  { id: 'v160', word: 'Gentile', translation: 'Gentil', example: 'Lei è stata molto gentile con noi.', category: 'Emociones', usageTip: 'Adjetivo invariable en género.', extraExamples: ['Le persone gentili piacciono a tutti.', 'Un gesto gentile.'] },

  // 11. Descrizione e Colori
  { id: 'v11_1', word: 'Alto', translation: 'Alto', example: 'Mio fratello è molto alto.', category: 'Descripción', usageTip: 'Adjetivo.', extraExamples: ['Sei più alto di me.', 'Un edificio alto.'] },
  { id: 'v11_2', word: 'Basso', translation: 'Bajo', example: 'Lui è un po\' basso.', category: 'Descripción', usageTip: 'Adjetivo.', extraExamples: ['Una sedia bassa.', 'Siamo bassi.'] },
  { id: 'v11_3', word: 'Magro', translation: 'Flaco', example: 'Sei dimagrito, sei molto magro.', category: 'Descripción', usageTip: 'Adjetivo.', extraExamples: ['Un cane magro.', 'Siete magre.'] },
  { id: 'v11_4', word: 'Grasso', translation: 'Gordo', example: 'Il mio gatto è un po\' grasso.', category: 'Descripción', usageTip: 'Adjetivo.', extraExamples: ['Un uomo grasso.', 'Cibo grasso.'] },
  { id: 'v11_5', word: 'Rosso', translation: 'Rojo', example: 'Mi piace il vino rosso.', category: 'Colores', usageTip: 'Adjetivo.', extraExamples: ['Una mela rossa.', 'Capelli rossi.'] },
  { id: 'v11_6', word: 'Blu', translation: 'Azul', example: 'Ho gli occhi blu.', category: 'Colores', usageTip: 'Invariable en género y número.', extraExamples: ['Una borsa blu.', 'Vestiti blu.'] },
  { id: 'v11_7', word: 'Verde', translation: 'Verde', example: 'La speranza è verde.', category: 'Colores', usageTip: 'Termina en E (invariable en género).', extraExamples: ['Un prato verde.', 'Mele verdi.'] },
  { id: 'v11_8', word: 'Giallo', translation: 'Amarillo', example: 'Il sole è giallo.', category: 'Colores', usageTip: 'Adjetivo.', extraExamples: ['Fiori gialli.', 'Una maglia gialla.'] },
  { id: 'v11_9', word: 'Nero', translation: 'Negro', example: 'Indosso sempre il nero.', category: 'Colores', usageTip: 'Adjetivo.', extraExamples: ['Un gatto nero.', 'Scarpe nere.'] },
  { id: 'v11_10', word: 'Bianco', translation: 'Blanco', example: 'Il latte es blanco.', category: 'Colores', usageTip: 'Adjetivo.', extraExamples: ['Una casa bianca.', 'Fogli bianchi.'] },
  { id: 'v11_11', word: 'Bello', translation: 'Guapo / Hermoso', example: 'Che bel posto!', category: 'Descripción', usageTip: 'Adjetivo.', extraExamples: ['Una bella giornata.', 'Siete bellissimi.'] },
  { id: 'v11_12', word: 'Giovane', translation: 'Joven', example: 'Siamo ancora giovani.', category: 'Descripción', usageTip: 'Termina en E (invariable en género).', extraExamples: ['Un uomo giovane.', 'Donne giovani.'] },
  
  // 12. Verbos Regulares
  { id: 'v12_1', word: 'Parlare', translation: 'Hablar', example: 'Io parlo molto.', category: 'Verbos', usageTip: '1ª conjugación (-ARE).', extraExamples: ['Parli italiano?', 'Loro parlano bene.'] },
  { id: 'v12_2', word: 'Abitare', translation: 'Vivir', example: 'Abito a Roma.', category: 'Verbos', usageTip: 'Indica residencia.', extraExamples: ['Dove abiti?', 'Abitiamo qui.'] },
  { id: 'v12_3', word: 'Mangiare', translation: 'Comer', example: 'Mangio pizza.', category: 'Verbos', usageTip: 'Cuidado con la "g" suave.', extraExamples: ['Cosa mangi?', 'Mangiamo fuori.'] },
  { id: 'v12_4', word: 'Prendere', translation: 'Tomar', example: 'Prendo il bus.', category: 'Verbos', usageTip: '2ª conjugación (-ERE).', extraExamples: ['Cosa prendi?', 'Prendiamo un caffè.'] },
  { id: 'v12_5', word: 'Leggere', translation: 'Leer', example: 'Leggo un libro.', category: 'Verbos', usageTip: 'G fuerte ante G.', extraExamples: ['Leggi mucho?', 'Leggiamo i giornali.'] },
  { id: 'v12_6', word: 'Scrivere', translation: 'Escribir', example: 'Scrivo mail.', category: 'Verbos', usageTip: 'Regular en -ERE.', extraExamples: ['Scrivi tu?', 'Loro scrivono molto.'] },
  { id: 'v12_7', word: 'Vedere', translation: 'Ver', example: 'Vedo bene.', category: 'Verbos', usageTip: 'Regular en -ERE.', extraExamples: ['Ci vediamo!', 'Vedi quel cane?'] },
  { id: 'v12_8', word: 'Partire', translation: 'Salir / Partir', example: 'Parto ora.', category: 'Verbos', usageTip: '3ª conjugación (-IRE).', extraExamples: ['Quando parti?', 'Il bus parte ora.'] },
  { id: 'v12_9', word: 'Dormire', translation: 'Dormir', example: 'Dormo bene.', category: 'Verbos', usageTip: '3ª conjugación simple.', extraExamples: ['Dormite ancora?', 'Dormono poco.'] },
  { id: 'v12_10', word: 'Aprire', translation: 'Abrir', example: 'Apro la porta.', category: 'Verbos', usageTip: 'Regular en -IRE.', extraExamples: ['Apri tu?', 'Apriamo subito.'] },
  { id: 'v12_11', word: 'Sentire', translation: 'Sentir / Oír', example: 'Sento musica.', category: 'Verbos', usageTip: 'Regular en -IRE.', extraExamples: ['Mi senti?', 'Sentiamo rumori.'] },
  { id: 'v12_12', word: 'Vivere', translation: 'Vivir', example: 'Vivo felice.', category: 'Verbos', usageTip: 'Regular en -ERE.', extraExamples: ['Dove vivi?', 'Viviamo in Italia.'] },
  // 13. Verbos Reflexivos y Rutina
  { id: 'v13_1', word: 'Svegliarsi', translation: 'Despertarse', example: 'Mi sveglio alle sei.', category: 'Rutina', usageTip: 'Verbo reflexivo en -ARE.', extraExamples: ['A che ora ti svegli?', 'Lui si sveglia tardi.'] },
  { id: 'v13_2', word: 'Alzarsi', translation: 'Levantarse', example: 'Mi alzo subito.', category: 'Rutina', usageTip: 'Verbo reflexivo en -ARE.', extraExamples: ['Non mi voglio alzare.', 'Ci alziamo presto.'] },
  { id: 'v13_3', word: 'Lavarsi', translation: 'Lavarse / Asearse', example: 'Mi lavo la faccia.', category: 'Rutina', usageTip: 'Verbo reflexivo en -ARE.', extraExamples: ['Ti lavi le mani?', 'Si lavano ogni giorno.'] },
  { id: 'v13_4', word: 'Vestirsi', translation: 'Vestirse', example: 'Mi vesto in cinco minuti.', category: 'Rutina', usageTip: 'Verbo reflexivo en -IRE.', extraExamples: ['Ti vesti elegante?', 'Lei si vestono bene.'] },
  { id: 'v13_5', word: 'Pettinarsi', translation: 'Peinarse', example: 'Mi pettino davanti allo specchio.', category: 'Rutina', usageTip: 'Verbo reflexivo en -ARE.', extraExamples: ['Non ti pettini mai?', 'Si pettina i capelli.'] },
  { id: 'v13_6', word: 'Farsi la doccia', translation: 'Ducharse', example: 'Mi faccio la doccia ogni mattina.', category: 'Rutina', usageTip: 'Expresión con verbo reflexivo farsi.', extraExamples: ['Ti fai la doccia?', 'Si fanno la doccia dopo lo sport.'] },
  { id: 'v13_7', word: 'Fare colazione', translation: 'Desayunar', example: 'Faccio colazione al bar.', category: 'Rutina', usageTip: 'No es reflexivo pero es parte de la rutina.', extraExamples: ['Cosa fai a colazione?', 'Facciamo colazione insieme.'] },
  { id: 'v13_8', word: 'Andare al lavoro', translation: 'Ir al trabajo', example: 'Vado al lavoro in treno.', category: 'Rutina', usageTip: 'Frase común de rutina.', extraExamples: ['A che ora vai al lavoro?', 'Vanno al lavoro presto.'] },
  { id: 'v13_9', word: 'Pranzare', translation: 'Almorzar / Comer', example: 'Pranzo alle una.', category: 'Rutina', usageTip: 'Verbo de la 1ª conjugación.', extraExamples: ['Dove pranzi oggi?', 'Pranziamo in ufficio.'] },
  { id: 'v13_10', word: 'Riposarsi', translation: 'Descansar', example: 'Mi riposo un po\'.', category: 'Rutina', usageTip: 'Verbo reflexivo en -ARE.', extraExamples: ['Ti riposi nel pomeriggio?', 'Si riposano sul divano.'] },
  { id: 'v13_11', word: 'Cucinare', translation: 'Cocinar', example: 'Cucino la cena per tutti.', category: 'Rutina', usageTip: 'Verbo de la 1ª conjugación.', extraExamples: ['Cosa cucini?', 'Cuciniamo insieme.'] },
  { id: 'v13_12', word: 'Cenare', translation: 'Cenar', example: 'Ceniamo alle otto.', category: 'Rutina', usageTip: 'Verbo de la 1ª conjugación.', extraExamples: ['A che ora ceni?', 'Cenano tardi.'] },
  { id: 'v13_13', word: 'Guardare la TV', translation: 'Ver la tele', example: 'Guardo la TV la sera.', category: 'Rutina', usageTip: 'Actividad de ocio común.', extraExamples: ['Cosa guardi in TV?', 'Guardiamo un film.'] },
  { id: 'v13_14', word: 'Addormentarsi', translation: 'Dormirse', example: 'Mi addormento subito.', category: 'Rutina', usageTip: 'Verbo reflexivo en -ARE.', extraExamples: ['A che ora ti addormenti?', 'Si addormenta leggendo.'] },
  { id: 'v13_15', word: 'Dormire', translation: 'Dormir', example: 'Dormo otto ore.', category: 'Rutina', usageTip: 'Verbo de la 3ª conjugación.', extraExamples: ['Dormi bene?', 'Dormiamo molto il sabato.'] },
  // 14. Preposiciones Articuladas
  { id: 'v14_1', word: 'Al', translation: 'Al (a + el)', example: 'Vado al bar.', category: 'Preposiciones', usageTip: 'A + il.', extraExamples: ['Al cinema', 'Al lavoro'] },
  { id: 'v14_2', word: 'Alla', translation: 'A la', example: 'Vado alla stazione.', category: 'Preposiciones', usageTip: 'A + la.', extraExamples: ['Alla posta', 'Alla festa'] },
  { id: 'v14_3', word: 'Allo', translation: 'Al (a + el)', example: 'Andiamo allo stadio.', category: 'Preposiciones', usageTip: 'A + lo.', extraExamples: ['Allo zoo', 'Allo specchio'] },
  { id: 'v14_4', word: 'Del', translation: 'Del (de + el)', example: 'Il libro del ragazzo.', category: 'Preposiciones', usageTip: 'DI + il.', extraExamples: ['Del sole', 'Del tempo'] },
  { id: 'v14_5', word: 'Della', translation: 'De la', example: 'La borsa della mamma.', category: 'Preposiciones', usageTip: 'DI + la.', extraExamples: ['Della casa', 'Della scuola'] },
  { id: 'v14_6', word: 'Dal', translation: 'Del / Desde el', example: 'Vengo dal medico.', category: 'Preposiciones', usageTip: 'DA + il.', extraExamples: ['Dal parrucchiere', 'Dal dentista'] },
  { id: 'v14_7', word: 'Dalla', translation: 'De la / Desde la', example: 'Vengo dalla Spagna.', category: 'Preposiciones', usageTip: 'DA + la.', extraExamples: ['Dalla finestra', 'Dalla zia'] },
  { id: 'v14_8', word: 'Nel', translation: 'En el', example: 'Il libro è nel zaino.', category: 'Preposiciones', usageTip: 'IN + il.', extraExamples: ['Nel cassetto', 'Nel frigo'] },
  { id: 'v14_9', word: 'Nella', translation: 'En la', example: 'Le chiavi sono nella borsa.', category: 'Preposiciones', usageTip: 'IN + la.', extraExamples: ['Nella stanza', 'Nella scatola'] },
  { id: 'v14_10', word: 'Nello', translation: 'En el', example: 'Nello zaino c’è una penna.', category: 'Preposiciones', usageTip: 'IN + lo.', extraExamples: ['Nello specchio', 'Nello scaffale'] },
  { id: 'v14_11', word: 'Ai', translation: 'A los', example: 'Do da mangiare ai gatti.', category: 'Preposiciones', usageTip: 'A + i.', extraExamples: ['Ai bambini', 'Ai miei amici'] },
  { id: 'v14_12', word: 'Dei', translation: 'De los', example: 'I colori dei fiori.', category: 'Preposiciones', usageTip: 'DI + i.', extraExamples: ['Dei ragazzi', 'Dei libri'] },
  { id: 'v14_13', word: 'Dai', translation: 'De los / Desde los', example: 'Vengo dai nonni.', category: 'Preposiciones', usageTip: 'DA + i.', extraExamples: ['Dai campi', 'Dai monti'] },
  { id: 'v14_14', word: 'Nei', translation: 'En los', example: 'È scritto nei libri.', category: 'Preposiciones', usageTip: 'IN + i.', extraExamples: ['Nei cassetti', 'Nei tuoi occhi'] },
  { id: 'v14_15', word: 'Sui', translation: 'Sobre los / En los', example: 'I libri sono sui banchi.', category: 'Preposiciones', usageTip: 'SU + i.', extraExamples: ['Sui tetti', 'Sui giornali'] },
  // 15. Pronombres Directos
  { id: 'v15_1', word: 'Lo', translation: 'Lo (él)', example: 'Lo compro subito.', category: 'Pronombres', usageTip: 'Pronombre directo masculino singular.', extraExamples: ['Lo vedo.', 'Lo cerco.'] },
  { id: 'v15_2', word: 'La', translation: 'La (ella)', example: 'La chiamo stasera.', category: 'Pronombres', usageTip: 'Pronombre directo femenino singular.', extraExamples: ['La mangio.', 'La trovo.'] },
  { id: 'v15_3', word: 'Li', translation: 'Los', example: 'Li leggo spesso.', category: 'Pronombres', usageTip: 'Pronombre directo masculino plural.', extraExamples: ['Li compro.', 'Li vedo.'] },
  { id: 'v15_4', word: 'Le', translation: 'Las', example: 'Le prendo tutte.', category: 'Pronombres', usageTip: 'Pronombre directo femenino plural.', extraExamples: ['Le chiamo.', 'Le cerco.'] },
  { id: 'v15_5', word: 'Mi', translation: 'Me', example: 'Mi vedi?', category: 'Pronombres', usageTip: 'Pronombre directo primera persona.', extraExamples: ['Mi chiami?', 'Mi aiuti?'] },
  { id: 'v15_6', word: 'Ti', translation: 'Te', example: 'Ti sento bene.', category: 'Pronombres', usageTip: 'Pronombre directo segunda persona.', extraExamples: ['Ti cerco.', 'Ti vedo.'] },
  { id: 'v15_7', word: 'Ci', translation: 'Nos', example: 'Ci chiamano loro.', category: 'Pronombres', usageTip: 'Pronombre directo primera persona plural.', extraExamples: ['Ci vedono.', 'Ci aiutano.'] },
  { id: 'v15_8', word: 'Vi', translation: 'Os', example: 'Vi aspetto qui.', category: 'Pronombres', usageTip: 'Pronombre directo segunda persona plural.', extraExamples: ['Vi sento.', 'Vi vedo.'] },
  { id: 'v15_9', word: 'Cercare', translation: 'Buscar', example: 'Cerco le chiavi.', category: 'Verbos', usageTip: 'Cuidado con el sonido "k" (cerco).', extraExamples: ['Cosa cerchi?', 'Cerchiamo un hotel.'] },
  { id: 'v15_10', word: 'Trovare', translation: 'Encontrar', example: 'Non trovo il libro.', category: 'Verbos', usageTip: 'Contrario de "cercare".', extraExamples: ['Lo trovi?', 'Troviamo una solución.'] },
  // 16. En el Restaurante y Compras
  { id: 'v16_1', word: 'Cameriere', translation: 'Camarero', example: 'Il cameriere è gentile.', category: 'Restaurante', usageTip: 'Masculino.', extraExamples: ['Chiamiamo il cameriere.', 'Il cameriere porta il menù.'] },
  { id: 'v16_2', word: 'Menù', translation: 'Menú', example: 'Posso avere il menù?', category: 'Restaurante', usageTip: 'Masculino.', extraExamples: ['Cosa c’è nel menù?', 'Il menù del giorno.'] },
  { id: 'v16_3', word: 'Conto', translation: 'Cuenta', example: 'Il conto, per favore.', category: 'Restaurante', usageTip: 'Masculino.', extraExamples: ['Paghiamo il conto.', 'Chiedi il conto.'] },
  { id: 'v16_4', word: 'Tavolo', translation: 'Mesa', example: 'Un tavolo per due.', category: 'Restaurante', usageTip: 'Masculino.', extraExamples: ['Il tavolo è vicino alla finestra.', 'Prenotiamo un tavolo.'] },
  { id: 'v16_5', word: 'Ordinare', translation: 'Pedir / Ordenar', example: 'Siamo pronti per ordinare.', category: 'Restaurante', usageTip: 'Verbo.', extraExamples: ['Cosa ordinate?', 'Ordino una pasta.'] },
  { id: 'v16_6', word: 'Prenotazione', translation: 'Reserva', example: 'Ho una prenotazione.', category: 'Restaurante', usageTip: 'Femenino.', extraExamples: ['Fare una prenotazione.', 'La mia prenotazione.'] },
  { id: 'v16_7', word: 'Bicchiere', translation: 'Vaso', example: 'Un bicchiere d’acqua.', category: 'Restaurante', usageTip: 'Masculino.', extraExamples: ['Un bicchiere di vino.', 'Due bicchieri, grazie.'] },
  { id: 'v16_8', word: 'Piatto', translation: 'Plato', example: 'Il piatto è caldo.', category: 'Restaurante', usageTip: 'Masculino.', extraExamples: ['Un piatto di pasta.', 'Piatti tipici.'] },
  { id: 'v16_9', word: 'Mercato', translation: 'Mercado', example: 'Vado al mercato sabato.', category: 'Compras', usageTip: 'Masculino.', extraExamples: ['Frutta fresca al mercato.', 'Mercato rionale.'] },
  { id: 'v16_10', word: 'Prezzo', translation: 'Precio', example: 'Qual è il prezzo?', category: 'Compras', usageTip: 'Masculino.', extraExamples: ['Prezzo basso.', 'Il prezzo è buono.'] },
  { id: 'v16_11', word: 'Sconto', translation: 'Descuento', example: 'C’è uno sconto del 20%.', category: 'Compras', usageTip: 'Masculino.', extraExamples: ['Voglio uno sconto.', 'Sconti estivi.'] },
  { id: 'v16_12', word: 'Provare', translation: 'Probar / Intentar', example: 'Posso provare questo?', category: 'Compras', usageTip: 'Verbo.', extraExamples: ['Provare un vestito.', 'Provare a parlare.'] },
  { id: 'v16_13', word: 'Comprare', translation: 'Comprar', example: 'Compro un regalo.', category: 'Compras', usageTip: 'Verbo.', extraExamples: ['Cosa compri?', 'Compriamo il pane.'] },
  { id: 'v16_14', word: 'Negozio', translation: 'Tienda', example: 'Un negozio di scarpe.', category: 'Compras', usageTip: 'Masculino.', extraExamples: ['Il negozio è chiuso.', 'Andiamo nei negozi.'] },
  { id: 'v16_15', word: 'Spesa', translation: 'Compra (comida)', example: 'Faccio la spesa al supermercato.', category: 'Compras', usageTip: 'Femenino.', extraExamples: ['Comprare la spesa.', 'La lista della spesa.'] },
  // 17. Adverbios de Cantidad y Tiempo
  { id: 'v17_1', word: 'Molto', translation: 'Mucho / Muy', example: 'Sono molto felice.', category: 'Adverbios', usageTip: 'Invariable como adverbio.', extraExamples: ['Mangi molto.', 'Molto vicino.'] },
  { id: 'v17_2', word: 'Poco', translation: 'Poco', example: 'Dormo poco.', category: 'Adverbios', usageTip: 'Invariable como adverbio.', extraExamples: ['Poco tempo.', 'Un poco di pane.'] },
  { id: 'v17_3', word: 'Troppo', translation: 'Demasiado', example: 'È troppo tardi.', category: 'Adverbios', usageTip: 'Indica exceso.', extraExamples: ['Troppo zucchero.', 'Corri troppo.'] },
  { id: 'v17_4', word: 'Sempre', translation: 'Siempre', example: 'Ti amerò sempre.', category: 'Adverbios', usageTip: 'Frecuencia absoluta.', extraExamples: ['Sempre insieme.', 'Sempre lo stesso.'] },
  { id: 'v17_5', word: 'Spesso', translation: 'A menudo', example: 'Ci vediamo spesso.', category: 'Adverbios', usageTip: 'Frecuencia alta.', extraExamples: ['Viaggio spesso.', 'Leggo spesso.'] },
  { id: 'v17_6', word: 'Mai', translation: 'Nunca', example: 'Non fumo mai.', category: 'Adverbios', usageTip: 'Frecuencia nula.', extraExamples: ['Mai dire mai.', 'Quasi mai.'] },
  { id: 'v17_7', word: 'Qualche volta', translation: 'A veces', example: 'Cucino qualche volta.', category: 'Adverbios', usageTip: 'Frecuencia media.', extraExamples: ['Qualche volta vado al mare.', 'Qualche volta bevo tè.'] },
  { id: 'v17_8', word: 'Abbastanza', translation: 'Bastante / Suficiente', example: 'Ho mangiato abbastanza.', category: 'Adverbios', usageTip: 'Cantidad suficiente.', extraExamples: ['Siamo abbastanza vicini.', 'Abbastanza bene.'] },
  { id: 'v17_9', word: 'Quasi', translation: 'Casi', example: 'È quasi pronto.', category: 'Adverbios', usageTip: 'Aproximación.', extraExamples: ['Quasi finito.', 'Quasi tutti.'] },
  { id: 'v17_10', word: 'Subito', translation: 'Enseguida / Ahora mismo', example: 'Arrivo subito.', category: 'Adverbios', usageTip: 'Inmediatez.', extraExamples: ['Fallo subito!', 'Subito dopo.'] },
  // 18. L'Imperfetto
  { id: 'v18_1', word: 'Bambino', translation: 'Niño', example: 'Da bambino giocavo molto.', category: 'Personas', usageTip: 'Masculino.', extraExamples: ['Un bravo bambino.', 'I bambini corrono.'] },
  { id: 'v18_2', word: 'Piccolo', translation: 'Pequeño', example: 'Quando ero piccolo...', category: 'Adjetivos', usageTip: 'Refiere a edad o tamaño.', extraExamples: ['Un cane piccolo.', 'I più piccoli.'] },
  { id: 'v18_3', word: 'Giocare', translation: 'Jugar', example: 'Giocavo a calcio ogni giorno.', category: 'Verbos', usageTip: 'Sonido "g" suave (giocare).', extraExamples: ['Giochiamo a carte.', 'Mi piace giocare.'] },
  { id: 'v18_4', word: 'Sempre', translation: 'Siempre', example: 'Lui parlava sempre.', category: 'Tiempo', usageTip: 'Frecuencia.', extraExamples: ['Sempre così.', 'Per sempre.'] },
  { id: 'v18_5', word: 'Spesso', translation: 'A menudo', example: 'Andavamo spesso al cinema.', category: 'Tiempo', usageTip: 'Frecuencia.', extraExamples: ['Molto spesso.', 'Spesso succede.'] },
  { id: 'v18_6', word: 'Estate', translation: 'Verano', example: 'Ogni estate andavo al mare.', category: 'Tiempo', usageTip: 'Femenino.', extraExamples: ['L\'estate è calda.', 'In estate.'] },
  { id: 'v18_7', word: 'Scuola', translation: 'Escuela', example: 'Andavo a scuola a piedi.', category: 'Lugares', usageTip: 'Femenino.', extraExamples: ['La scuola è chiusa.', 'Dopo scuola.'] },
  { id: 'v18_8', word: 'Amico', translation: 'Amigo', example: 'Eravamo molto amici.', category: 'Personas', usageTip: 'Plural: Amici.', extraExamples: ['Un mio amico.', 'Amici per la pelle.'] },
  { id: 'v18_9', word: 'Tempo', translation: 'Tiempo', example: 'C\'era bel tempo.', category: 'Tiempo', usageTip: 'Clima o cronología.', extraExamples: ['Il tempo vola.', 'Che tempo fa?'] },
  { id: 'v18_10', word: 'Sole', translation: 'Sol', example: 'C\'era sempre il sole.', category: 'Naturaleza', usageTip: 'Masculino.', extraExamples: ['Il sole splende.', 'Occhiali da sole.'] },
  // 19. Futuro Simple
  { id: 'v19_1', word: 'Domani', translation: 'Mañana', example: 'Domani partirò.', category: 'Tiempo', usageTip: 'Futuro próximo.', extraExamples: ['Domani mattina.', 'A domani!'] },
  { id: 'v19_2', word: 'Prossimo', translation: 'Próximo / Siguiente', example: 'L\'anno prossimo andrò in Italia.', category: 'Tiempo', usageTip: 'Adjetivo.', extraExamples: ['La prossima volta.', 'Il mese prossimo.'] },
  { id: 'v19_3', word: 'Viaggio', translation: 'Viaje', example: 'Farò un lungo viaggio.', category: 'Turismo', usageTip: 'Masculino.', extraExamples: ['Buon viaggio!', 'Il viaggio è stancante.'] },
  { id: 'v19_4', word: 'Lavoro', translation: 'Trabajo', example: 'Troverò un nuovo lavoro.', category: 'Profesiones', usageTip: 'Masculino.', extraExamples: ['Cerco lavoro.', 'Il mio lavoro.'] },
  { id: 'v19_5', word: 'Piovere', translation: 'Llover', example: 'Domani pioverà.', category: 'Naturaleza', usageTip: 'Verbo impersonal.', extraExamples: ['Sta piovendo.', 'Se piove, non esco.'] },
  { id: 'v19_6', word: 'Vedere', translation: 'Ver', example: 'Vedremo cosa succede.', category: 'Verbos', usageTip: 'Futuro: vedrò.', extraExamples: ['Ci vediamo.', 'Vedo tutto.'] },
  { id: 'v19_7', word: 'Andare', translation: 'Ir', example: 'Andrò a Roma in treno.', category: 'Verbos', usageTip: 'Futuro: andrò.', extraExamples: ['Andiamo via.', 'Va bene.'] },
  { id: 'v19_8', word: 'Comprare', translation: 'Comprar', example: 'Comprerò una casa.', category: 'Verbos', usageTip: 'Futuro: comprerò.', extraExamples: ['Lo compro.', 'Cosa compri?'] },
  { id: 'v19_9', word: 'Progetto', translation: 'Proyecto', example: 'Abbiamo un grande progetto.', category: 'Ideas', usageTip: 'Masculino.', extraExamples: ['Il progetto finale.', 'Progetti per il futuro.'] },
  { id: 'v19_10', word: 'Speranza', translation: 'Esperanza', example: 'La speranza è l\'ultima a morire.', category: 'Ideas', usageTip: 'Femenino.', extraExamples: ['Ho speranza.', 'Senza speranza.'] },
  // 20. Condicional Simple
  { id: 'v20_1', word: 'Vorrei', translation: 'Quisiera / Querría', example: 'Vorrei un caffè, grazie.', category: 'Cortesía', usageTip: 'Condicional de "volere".', extraExamples: ['Vorrei sapere...', 'Vorrei andare.'] },
  { id: 'v20_2', word: 'Potrei', translation: 'Podría', example: 'Potrei avere il conto?', category: 'Cortesía', usageTip: 'Condicional de "potere".', extraExamples: ['Potrei entrare?', 'Non potrei farlo.'] },
  { id: 'v20_3', word: 'Dovrei', translation: 'Debería', example: 'Dovrei studiare di più.', category: 'Verbos', usageTip: 'Condicional de "dovere".', extraExamples: ['Dovrei andare.', 'Cosa dovrei fare?'] },
  { id: 'v20_4', word: 'Sarei', translation: 'Sería / Estaría', example: 'Sarei felice di aiutarti.', category: 'Verbos', usageTip: 'Condicional de "essere".', extraExamples: ['Sarei pronto.', 'Dove sarei?'] },
  { id: 'v20_5', word: 'Avrei', translation: 'Tendría', example: 'Avrei bisogno di un consiglio.', category: 'Verbos', usageTip: 'Condicional de "avere".', extraExamples: ['Avrei voluto.', 'Quanti ne avrei?'] },
  { id: 'v20_6', word: 'Piacerebbe', translation: 'Gustaría', example: 'Mi piacerebbe molto.', category: 'Verbos', usageTip: 'Condicional de "piacere".', extraExamples: ['Ti piacerebbe?', 'Ci piacerebbe venire.'] },
  { id: 'v20_7', word: 'Gentile', translation: 'Gentil / Amable', example: 'Saresti così gentile?', category: 'Adjetivos', usageTip: 'Para ambos géneros.', extraExamples: ['Una persona gentile.', 'Molto gentile.'] },
  { id: 'v20_8', word: 'Favore', translation: 'Favor', example: 'Per favore, aiutami.', category: 'Cortesía', usageTip: 'Masculino.', extraExamples: ['Un grande favore.', 'Fammi un favore.'] },
  { id: 'v20_9', word: 'Sogno', translation: 'Sueño', example: 'Il mio sogno sarebbe viaggiare.', category: 'Ideas', usageTip: 'Masculino.', extraExamples: ['Sogni d\'oro.', 'Un brutto sogno.'] },
  { id: 'v20_10', word: 'Consiglio', translation: 'Consejo', example: 'Ti darei un consiglio.', category: 'Ideas', usageTip: 'Masculino.', extraExamples: ['Segui il consiglio.', 'Un buon consiglio.'] },
  // 21. Pronombres Indirectos
  { id: 'v21_1', word: 'Mi', translation: 'Me (a mí)', example: 'Mi piace molto.', category: 'Pronombres', usageTip: 'Indirecto.', extraExamples: ['Mi dici?', 'Mi porti?'] },
  { id: 'v21_2', word: 'Ti', translation: 'Te (a ti)', example: 'Ti regalo questo.', category: 'Pronombres', usageTip: 'Indirecto.', extraExamples: ['Ti scrivo.', 'Ti telefono.'] },
  { id: 'v21_3', word: 'Gli', translation: 'Le (a él)', example: 'Gli parlo domani.', category: 'Pronombres', usageTip: 'Indirecto.', extraExamples: ['Gli dico tutto.', 'Gli do il libro.'] },
  { id: 'v21_4', word: 'Le', translation: 'Le (a ella)', example: 'Le ho scritto una lettera.', category: 'Pronombres', usageTip: 'Indirecto.', extraExamples: ['Le chiedo.', 'Le porto i fiori.'] },
  { id: 'v21_5', word: 'Ci', translation: 'Nos (a nosotros)', example: 'Ci dicono la verità.', category: 'Pronombres', usageTip: 'Indirecto.', extraExamples: ['Ci portano il menù.', 'Ci scrivono spesso.'] },
  { id: 'v21_6', word: 'Vi', translation: 'Os (a vosotros)', example: 'Vi mando un messaggio.', category: 'Pronombres', usageTip: 'Indirecto.', extraExamples: ['Vi aspetto.', 'Vi do le chiavi.'] },
  { id: 'v21_7', word: 'Loro', translation: 'Les (a ellos)', example: 'Dico loro tutto.', category: 'Pronombres', usageTip: 'Va después del verbo.', extraExamples: ['Parlo loro.', 'Do loro i soldi.'] },
  { id: 'v21_8', word: 'Regalare', translation: 'Regalar', example: 'Ti regalo un libro.', category: 'Verbos', usageTip: 'Usa pronombre indirecto.', extraExamples: ['Cosa regali?', 'Un regalo per te.'] },
  { id: 'v21_9', word: 'Scrivere', translation: 'Escribir', example: 'Le scrivo spesso.', category: 'Verbos', usageTip: 'Usa pronombre indirecto (a alguien).', extraExamples: ['Scrivo una mail.', 'Mi scrivi?'] },
  { id: 'v21_10', word: 'Dire', translation: 'Decir', example: 'Gli dico la verità.', category: 'Verbos', usageTip: 'Usa pronombre indirecto.',    extraExamples: ['Vorrei parlarne subito.', 'Cosa ne dici?'],
  },
  // 24. Congiuntivo Presente
  {
    id: 'v24_1',
    word: 'Speranza',
    translation: 'Esperanza',
    example: 'Spero che tu sia felice.',
    category: 'Congiuntivo',
    usageTip: 'Sperare requiere subjuntivo.',
    extraExamples: ['La speranza è l\'ultima a morire.'],
  },
  {
    id: 'v24_2',
    word: 'Dubbio',
    translation: 'Duda',
    example: 'Dubito che vengano.',
    category: 'Congiuntivo',
    usageTip: 'Dubitare requiere subjuntivo.',
    extraExamples: ['Ho qualche dubbio.'],
  },
  // 25. Congiuntivo Imperfetto
  {
    id: 'v25_1',
    word: 'Magari',
    translation: 'Ojalá / Tal vez',
    example: 'Magari potessi venire!',
    category: 'Hipótesis',
    usageTip: 'Con subjuntivo imperfecto expresa deseos improbables.',
    extraExamples: ['Magari ci vediamo domani.'],
  },
  // 27. Pronomi Combinati
  {
    id: 'v27_1',
    word: 'Glielo',
    translation: 'Se lo (a él/ella/ellos)',
    example: 'Glielo do io.',
    category: 'Pronombres',
    usageTip: 'Combinación de Gli/Le + Lo.',
    extraExamples: ['Glielo dico domani.'],
  },
  {
    id: 'v27_2',
    word: 'Te ne',
    translation: 'Te ... de ello',
    example: 'Te ne pentirai.',
    category: 'Pronombres',
    usageTip: 'Ti cambia a TE antes de NE.',
    extraExamples: ['Non te ne andare.'],
  },
  // 29. Forma Passiva
  {
    id: 'v29_1',
    word: 'Subire',
    translation: 'Sufrir / Recibir',
    example: 'Ha subito un furto.',
    category: 'Verbos',
    usageTip: 'Común en contextos pasivos.',
    extraExamples: ['Non voglio subire pressioni.'],
  },
  // 22. Comparativos y Superlativos
  { id: 'v22_1', word: 'Più', translation: 'Más', example: 'È più alto di me.', category: 'Adverbios', usageTip: 'Comparativo.', extraExamples: ['Più tardi.', 'Ancora de più.'] },
  { id: 'v22_2', word: 'Meno', translation: 'Menos', example: 'È meno caro di quello.', category: 'Adverbios', usageTip: 'Comparativo.', extraExamples: ['Meno male!', 'Sempre meno.'] },
  { id: 'v22_3', word: 'Meglio', translation: 'Mejor (adverbio)', example: 'Sto meglio oggi.', category: 'Adverbios', usageTip: 'Invariable.', extraExamples: ['È meglio così.', 'Sempre meglio.'] },
  { id: 'v22_4', word: 'Peggio', translation: 'Peor (adverbio)', example: 'Va sempre peggio.', category: 'Adverbios', usageTip: 'Invariable.', extraExamples: ['Di male in peggio.', 'È peggio per te.'] },
  { id: 'v22_5', word: 'Migliore', translation: 'Mejor (adjetivo)', example: 'È il migliore amico.', category: 'Adjetivos', usageTip: 'Concuerda en número.', extraExamples: ['La migliore pizza.', 'I migliori anni.'] },
  { id: 'v22_6', word: 'Peggiore', translation: 'Peor (adjetivo)', example: 'È il peggiore errore.', category: 'Adjetivos', usageTip: 'Concuerda en número.', extraExamples: ['L\'esperienza peggiore.', 'Le peggiori strade.'] },
  { id: 'v22_7', word: 'Uguale', translation: 'Igual', example: 'Sono uguali.', category: 'Adjetivos', usageTip: 'Comparativo de igualdad.', extraExamples: ['È uguale per me.', 'Tutto uguale.'] },
  { id: 'v22_8', word: 'Simile', translation: 'Similar', example: 'È simile al mio.', category: 'Adjetivos', usageTip: 'Concuerda en número.', extraExamples: ['Casi simili.', 'Una cosa simile.'] },
  { id: 'v22_9', word: 'Massimo', translation: 'Máximo', example: 'Il punteggio massimo.', category: 'Adjetivos', usageTip: 'Relacionado con superlativo.', extraExamples: ['Al massimo.', 'Massimo impegno.'] },
  { id: 'v22_10', word: 'Ottimo', translation: 'Óptimo / Excelente', example: 'Un ottimo lavoro.', category: 'Adjetivos', usageTip: 'Superlativo de buono.', extraExamples: ['Ottima pizza.', 'Ottimi risultati.'] },
  // 23. Particella CI y NE
  { id: 'v23_1', word: 'Ci', translation: 'Allí', example: 'Ci vado subito.', category: 'Partículas', usageTip: 'Sustituye lugar.', extraExamples: ['Ci sei?', 'Non ci sono.'] },
  { id: 'v23_2', word: 'Ne', translation: 'De ello / Cantidad', example: 'Ne prendo due.', category: 'Partículas', usageTip: 'Sustituye cantidad.', extraExamples: ['Cosa ne pensi?', 'Ne voglio ancora.'] },
  { id: 'v23_3', word: 'Pensare', translation: 'Pensar', example: 'Ci penso io.', category: 'Verbos', usageTip: 'Pensare a -> CI; Pensare di -> NE.', extraExamples: ['Cosa pensi?', 'Pensiamo a te.'] },
  { id: 'v23_4', word: 'Vederci', translation: 'Ver (allí/nos)', example: 'Non ci vedo bene.', category: 'Verbos', usageTip: 'Uso de CI con verbos.', extraExamples: ['Ci vediamo presto.', 'Non ci vedo.'] },
  { id: 'v23_5', word: 'Sentirci', translation: 'Oír (allí)', example: 'Ci senti?', category: 'Verbos', usageTip: 'Uso de CI.', extraExamples: ['Non ci sento.', 'Ci sentiamo dopo.'] },
  { id: 'v23_6', word: 'Nessuno', translation: 'Ninguno', example: 'Non ne ho nessuno.', category: 'Pronombres', usageTip: 'Usa NE con cantidades.', extraExamples: ['Nessun problema.', 'Nessuna idea.'] },
  { id: 'v23_7', word: 'Parecchi', translation: 'Varios', example: 'Ne ho parecchi.', category: 'Pronombres', usageTip: 'Cantidad indefinida.', extraExamples: ['Parecchie persone.', 'Parecchio tempo.'] },
  { id: 'v23_8', word: 'Alcuni', translation: 'Algunos', example: 'Ne ho alcuni.', category: 'Pronombres', usageTip: 'Cantidad plural.', extraExamples: ['Alcuni amici.', 'Alcune cose.'] },
  { id: 'v23_9', word: 'Importare', translation: 'Importar', example: 'Non me ne importa.', category: 'Verbos', usageTip: 'Expresión idiomática con NE.', extraExamples: ['Ti importa?', 'Cosa importa?'] },
  { id: 'v23_10', word: 'Andarsene', translation: 'Irse', example: 'Me ne vado.', category: 'Verbos', usageTip: 'Verbo pronominal con NE.', extraExamples: ['Vattene!', 'Se ne sono andati.'] },

  // C1/C2 — Maestría
  { id: 'v31_1', word: 'Scorgere', translation: 'Divisar / Ver de lejos', example: 'Scorsi una luce in lontananza.', category: 'Letteratura', usageTip: 'Passato remoto de scorgere.', extraExamples: ['Non riesco a scorgerlo.'] },
  { id: 'v31_2', word: 'Siffatto', translation: 'Tal / De tal clase', example: 'Un siffatto comportamento è inaccettabile.', category: 'Letteratura', usageTip: 'Lenguaje culto.', extraExamples: ['Siffatte cose.'] },
  { id: 'v32_1', word: 'Qualora', translation: 'En caso de que', example: 'Qualora venissi, avvisami.', category: 'Grammatica', usageTip: 'Richiede il congiuntivo.', extraExamples: ['Qualora servisse.'] },
  { id: 'v33_1', word: 'Gattamorta', translation: 'Mosquita muerta', example: 'Non fidarti, è una gattamorta.', category: 'Idiomi', usageTip: 'Personas que fingen ser inofensivas.', extraExamples: ['Fare la gattamorta.'] },
  { id: 'v33_2', word: 'Peli sullo stomaco', translation: 'Tener estómago (sangre fría)', example: 'Lui non ha peli sullo stomaco.', category: 'Idiomi', usageTip: 'Para personas sin escrúpulos.', extraExamples: ['Cinico e senza peli sullo stomaco.'] },
  { id: 'v34_1', word: 'Fatturato', translation: 'Facturación (volumen de negocio)', example: 'Il fatturato annuo è raddoppiato.', category: 'Business', usageTip: 'Término económico.', extraExamples: ['Fatturato record.'] },
  { id: 'v34_2', word: 'Istanza', translation: 'Instancia / Petición formal', example: 'Presentare un\'istanza al tribunale.', category: 'Legale', usageTip: 'Contexto jurídico.', extraExamples: ['Accogliere un\'istanza.'] },
];
