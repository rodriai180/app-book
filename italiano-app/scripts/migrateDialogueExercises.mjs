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

const LESSONS = [
  // ── LESSON 1: Saluti (dialogue) ──────────────────────────────────────────
  {
    lessonId: '1',
    title: 'Pratica: Saluti',
    exercises: [
      { id: 1, answer: 'Buongiorno', dialogue: [{ person: 'A', text: '', hasInput: true }, { person: 'B', text: 'Buongiorno, come sta?' }, { person: 'A', text: 'Bene, grazie.' }], hint: 'È un saluto formale che si usa la mattina.' },
      { id: 2, answer: 'Ciao', dialogue: [{ person: 'A', text: '', hasInput: true }, { person: 'A', text: ', Marco!' }, { person: 'B', text: 'Ciao, Anna! Come va?' }], hint: 'È il saluto più comune per amici e famiglia.' },
      { id: 3, answer: 'Come stai?', dialogue: [{ person: 'A', text: 'Ciao! ' }, { person: 'A', text: '', hasInput: true }, { person: 'B', text: 'Sto bene, e tu?' }], hint: 'Si usa per chiedere come va a un amico.' },
      { id: 4, answer: 'Come sta?', dialogue: [{ person: 'A', text: 'Buongiorno, professore. ' }, { person: 'A', text: '', hasInput: true }, { person: 'B', text: 'Buongiorno, sto bene. E Lei?' }], hint: 'Si usa per chiedere come va in modo formale.' },
      { id: 5, answer: 'Arrivederci', dialogue: [{ person: 'A', text: 'Arrivederci, signora!' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ', a domani!' }], hint: 'Un saluto formale quando si va via.' },
      { id: 6, answer: 'A presto', dialogue: [{ person: 'A', text: 'Grazie per tutto. Ci vediamo!' }, { person: 'B', text: 'Di niente! ' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: '!' }], hint: 'Si dice quando si pensa di rivedere qualcuno a breve.' },
      { id: 7, answer: 'Buonanotte', dialogue: [{ person: 'A', text: 'Vado a letto, sono stanco.' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ", sogni d'oro!" }], hint: 'Si dice prima di andare a dormire.' },
    ],
  },

  // ── LESSON 2: Sopravvivenza (dialogue) ───────────────────────────────────
  {
    lessonId: '2',
    title: 'Pratica: Sopravvivenza',
    exercises: [
      { id: 1, answer: 'Non capisco', dialogue: [{ person: 'A', text: 'Parli italiano?' }, { person: 'B', text: 'Scusi, ', hasInput: true }, { person: 'B', text: '. Può parlare lentamente?' }], hint: 'Si usa quando non comprendi quello che qualcuno sta dicendo.' },
      { id: 2, answer: 'Non lo so', dialogue: [{ person: 'A', text: 'Sai dove si trova il Colosseo?' }, { person: 'B', text: 'Mi dispiace, ', hasInput: true }, { person: 'B', text: '. Sono un turista.' }], hint: "Si usa quando non hai un'informazione." },
      { id: 3, answer: 'Vorrei un caffè', dialogue: [{ person: 'Barista', text: 'Buongiorno! Cosa desidera?' }, { person: 'Tu', text: '', hasInput: true }, { person: 'Tu', text: ', per favore.' }], hint: 'Un modo gentile per ordinare una bevanda al bar.' },
      { id: 4, answer: 'Quanto costa?', dialogue: [{ person: 'Tu', text: 'Mi scusi, ', hasInput: true }, { person: 'Commesso', text: 'Costa dieci euro.' }], hint: 'Si usa per chiedere il prezzo di un oggetto.' },
      { id: 5, answer: 'Dove si trova il bagno?', dialogue: [{ person: 'Tu', text: 'Scusi, ', hasInput: true }, { person: 'Passante', text: 'È in fondo a destra.' }], hint: 'Si usa per chiedere la posizione di un luogo.' },
      { id: 6, answer: 'Mi può aiutare?', dialogue: [{ person: 'Tu', text: 'Scusi, ho un problema. ', hasInput: true }, { person: 'Passante', text: 'Sì, certo. Di cosa ha bisogno?' }], hint: 'Si usa quando hai bisogno di assistenza da parte di qualcuno.' },
      { id: 7, answer: 'Posso pagare con carta?', dialogue: [{ person: 'Tu', text: 'Grazie per la cena. ', hasInput: true }, { person: 'Cameriere', text: 'Sì, accettiamo tutte le carte.' }], hint: 'Si usa per chiedere se è possibile usare il bancomat o la carta di credito.' },
    ],
  },

  // ── LESSON 4: Verbi Comuni (dialogue) ────────────────────────────────────
  {
    lessonId: '4',
    title: 'Pratica: Verbi Comuni',
    exercises: [
      { id: 1, answer: 'sono', dialogue: [{ person: 'A', text: 'Di dove sei?' }, { person: 'B', text: 'Io ', hasInput: true }, { person: 'B', text: ' italiano.' }], hint: 'Usa il verbo ESSERE.' },
      { id: 2, answer: 'ho', dialogue: [{ person: 'A', text: 'Vuoi mangiare?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' molta fame.' }], hint: 'Usa il verbo AVERE.' },
      { id: 3, answer: 'faccio', dialogue: [{ person: 'A', text: 'Cosa fai nel tempo libero?' }, { person: 'B', text: 'Io ', hasInput: true }, { person: 'B', text: ' sempre sport.' }], hint: 'Usa il verbo FARE.' },
      { id: 4, answer: 'voglio', dialogue: [{ person: 'Barista', text: 'Cosa desidera?' }, { person: 'B', text: 'Io ', hasInput: true }, { person: 'B', text: ' un caffè macchiato.' }], hint: 'Usa il verbo VOLERE.' },
      { id: 5, answer: 'è', dialogue: [{ person: 'A', text: "Di dov'è Marco?" }, { person: 'B', text: 'Lui ', hasInput: true }, { person: 'B', text: ' argentino.' }], hint: 'Usa il verbo ESSERE (terza persona singolare).' },
      { id: 6, answer: 'ha', dialogue: [{ person: 'A', text: 'Anna può leggere?' }, { person: 'B', text: 'Sì, lei ', hasInput: true }, { person: 'B', text: ' un libro molto bello.' }], hint: 'Usa il verbo AVERE (terza persona singolare).' },
      { id: 7, answer: 'va', dialogue: [{ person: 'A', text: 'Ciao, Marco! Come ', hasInput: true }, { person: 'A', text: '?' }, { person: 'B', text: 'Va tutto bene, grazie!' }], hint: 'Usa il verbo ANDARE.' },
    ],
  },

  // ── LESSON 5: Espressioni Utili (dialogue) ───────────────────────────────
  {
    lessonId: '5',
    title: 'Pratica: Espressioni Utili',
    exercises: [
      { id: 1, answer: 'Mi piace', dialogue: [{ person: 'A', text: 'Ti piace questo gelato?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' moltissimo!' }], hint: 'Si usa per esprimere un gusto personale.' },
      { id: 2, answer: 'Ho bisogno di', dialogue: [{ person: 'A', text: 'Posso aiutarti?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' aiuto. Mi sono perso.' }], hint: 'Si usa per esprimere una necessità.' },
      { id: 3, answer: 'Non importa', dialogue: [{ person: 'A', text: 'Scusa per il ritardo!' }, { person: 'B', text: 'Tranquillo, ', hasInput: true }, { person: 'B', text: '. Va bene così.' }], hint: 'Si usa per dire che qualcosa non è grave.' },
      { id: 4, answer: 'Va bene', dialogue: [{ person: 'A', text: 'Andiamo a mangiare una pizza?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: '. Ottima idea!' }], hint: "Un modo comune per dare conferma o essere d'accordo." },
      { id: 5, answer: 'Perfetto', dialogue: [{ person: 'A', text: 'Ho prenotato il tavolo per le otto.' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: '! Ci vediamo dopo.' }], hint: 'Si usa quando tutto va bene o sei molto soddisfatto.' },
      { id: 6, answer: 'Che significa?', dialogue: [{ person: 'A', text: 'Ho comprato un "abbiocco".' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' Non conosco questa parola.' }], hint: 'Si usa per chiedere il significato di una parola.' },
      { id: 7, answer: 'Come si dice', dialogue: [{ person: 'A', text: 'Scusa, ', hasInput: true }, { person: 'A', text: ' "friend" in italiano?' }, { person: 'B', text: 'Si dice "amico".' }], hint: 'Si usa per chiedere la traduzione di una parola.' },
    ],
  },

  // ── LESSON 6: Domande (dialogue) ─────────────────────────────────────────
  {
    lessonId: '6',
    title: 'Pratica: Domande',
    exercises: [
      { id: 1, answer: 'Chi', dialogue: [{ person: 'A', text: '', hasInput: true }, { person: 'A', text: ' è quel signore?' }, { person: 'B', text: 'È il signor Rossi.' }], hint: "Si usa per chiedere l'identità di una persona." },
      { id: 2, answer: 'Cosa', dialogue: [{ person: 'Barista', text: '', hasInput: true }, { person: 'Barista', text: ' desidera?' }, { person: 'Tu', text: 'Un cappuccino, per favore.' }], hint: "Si usa per chiedere informazioni su un oggetto o un'azione." },
      { id: 3, answer: 'Dove', dialogue: [{ person: 'A', text: 'Scusa, ', hasInput: true }, { person: 'A', text: ' vai?' }, { person: 'B', text: 'Vado in centro.' }], hint: 'Si usa per chiedere la posizione o la destinazione.' },
      { id: 4, answer: 'Quando', dialogue: [{ person: 'A', text: '', hasInput: true }, { person: 'A', text: ' parte il treno per Roma?' }, { person: 'B', text: 'Parte alle ore dieci.' }], hint: 'Si usa per chiedere il tempo o il momento.' },
      { id: 5, answer: 'Perché', dialogue: [{ person: 'A', text: '', hasInput: true }, { person: 'A', text: ' studi l\'italiano?' }, { person: 'B', text: 'Perché voglio vivere in Italia.' }], hint: 'Si usa per chiedere il motivo o la ragione.' },
      { id: 6, answer: 'Come', dialogue: [{ person: 'A', text: 'Ciao! ', hasInput: true }, { person: 'A', text: ' ti chiami?' }, { person: 'B', text: 'Mi chiamo Sofia.' }], hint: 'Si usa per chiedere il modo o lo stato.' },
      { id: 7, answer: 'Quanto', dialogue: [{ person: 'Tu', text: 'Mi scusi, ', hasInput: true }, { person: 'Tu', text: ' costa questo libro?' }, { person: 'Commesso', text: 'Costa quindici euro.' }], hint: 'Si usa per chiedere la quantità o il prezzo.' },
    ],
  },

  // ── LESSON 7: Connettori (dialogue) ──────────────────────────────────────
  {
    lessonId: '7',
    title: 'Pratica: Connettori',
    exercises: [
      { id: 1, answer: 'e', dialogue: [{ person: 'A', text: 'Cosa fai nella vita?' }, { person: 'B', text: 'Io studio ', hasInput: true }, { person: 'B', text: ' lavoro in un ristorante.' }], hint: "Si usa per aggiungere un'informazione." },
      { id: 2, answer: 'ma', dialogue: [{ person: 'A', text: 'Ti piace studiare l\'italiano?' }, { person: 'B', text: 'Sì, è difficile ', hasInput: true }, { person: 'B', text: ' molto bello.' }], hint: 'Si usa per esprimere un contrasto.' },
      { id: 3, answer: 'perché', dialogue: [{ person: 'A', text: 'Perché vai in Italia?' }, { person: 'B', text: 'Vado in Italia ', hasInput: true }, { person: 'B', text: ' mi piace la cultura.' }], hint: 'Si usa per spiegare il motivo.' },
      { id: 4, answer: 'quindi', dialogue: [{ person: 'A', text: 'Fuori piove molto.' }, { person: 'B', text: 'Hai ragione, ', hasInput: true }, { person: 'B', text: " prendo l'ombrello." }], hint: 'Si usa per esprimere una conseguenza.' },
      { id: 5, answer: 'anche', dialogue: [{ person: 'A', text: 'Prendo un caffè.' }, { person: 'B', text: 'Io vorrei ', hasInput: true }, { person: 'B', text: ' un cornetto, grazie.' }], hint: 'Si usa per includere qualcosa o qualcuno.' },
      { id: 6, answer: 'poi', dialogue: [{ person: 'A', text: 'Cosa fai stasera?' }, { person: 'B', text: 'Prima mangio la pizza, ', hasInput: true }, { person: 'B', text: ' vado a dormire.' }], hint: 'Si usa per indicare una successione nel tempo.' },
      { id: 7, answer: 'però', dialogue: [{ person: 'A', text: 'Ti piace quel ristorante?' }, { person: 'B', text: 'Il cibo è buono, ', hasInput: true }, { person: 'B', text: " è un po' costoso." }], hint: "Si usa per introdurre un'opposizione (simile a \"ma\")." },
    ],
  },

  // ── LESSON 8: Passato Prossimo (dialogue) ────────────────────────────────
  {
    lessonId: '8',
    title: 'Pratica: Passato Prossimo',
    exercises: [
      { id: 1, answer: 'Ho mangiato', dialogue: [{ person: 'A', text: 'Hai fame?' }, { person: 'B', text: 'No, grazie. ', hasInput: true }, { person: 'B', text: ' una pizza poco fa.' }], hint: 'Usa il passato prossimo del verbo MANGIARE.' },
      { id: 2, answer: 'Ho studiato', dialogue: [{ person: 'A', text: "Sei pronto per l'esame?" }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' tutto il giorno ieri.' }], hint: 'Usa il passato prossimo del verbo STUDIARE.' },
      { id: 3, answer: 'Ho lavorato', dialogue: [{ person: 'A', text: 'Sei stanco?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' fino a tardi in ufficio.' }], hint: 'Usa il passato prossimo del verbo LAVORARE.' },
      { id: 4, answer: 'Sono andato', dialogue: [{ person: 'A', text: "Dov'eri stamattina?" }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' al mercato.' }], hint: 'Usa il passato prossimo del verbo ANDARE (verbo di movimento).' },
      { id: 5, answer: 'Sono arrivato', dialogue: [{ person: 'A', text: 'A che ora sei tornato?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' a casa alle otto.' }], hint: 'Usa il passato prossimo del verbo ARRIVARE.' },
      { id: 6, answer: 'Ho visto', dialogue: [{ person: 'A', text: 'Hai visto il nuovo film?' }, { person: 'B', text: 'Sì, lo ', hasInput: true }, { person: 'B', text: ' ieri sera.' }], hint: 'Usa il participio passato irregolare del verbo VEDERE.' },
      { id: 7, answer: 'Ho fatto', dialogue: [{ person: 'A', text: 'Cosa hai fatto nel weekend?' }, { person: 'B', text: 'Io ', hasInput: true }, { person: 'B', text: ' una gita in montagna.' }], hint: 'Usa il participio passato irregolare del verbo FARE.' },
    ],
  },

  // ── LESSON 12: Coniugazione (dialogue) ───────────────────────────────────
  {
    lessonId: '12',
    title: 'Pratica: Coniugazione',
    exercises: [
      { id: 1, answer: 'parlo', dialogue: [{ person: 'A', text: 'Parli italiano?' }, { person: 'B', text: 'Sì, io ', hasInput: true }, { person: 'B', text: " bene l'italiano." }], hint: 'Verbo PARLARE (Io).' },
      { id: 2, answer: 'prende', dialogue: [{ person: 'A', text: 'Cosa beve Marco?' }, { person: 'B', text: 'Lui ', hasInput: true }, { person: 'B', text: ' un caffè macchiato.' }], hint: 'Verbo PRENDERE (Lui).' },
      { id: 3, answer: 'partiamo', dialogue: [{ person: 'A', text: 'Quando andiamo a Roma?' }, { person: 'B', text: 'Noi ', hasInput: true }, { person: 'B', text: ' domani mattina.' }], hint: 'Verbo PARTIRE (Noi).' },
      { id: 4, answer: 'abitiamo', dialogue: [{ person: 'A', text: 'Dove vivete voi?' }, { person: 'B', text: 'Noi ', hasInput: true }, { person: 'B', text: ' a Firenze.' }], hint: 'Verbo ABITARE (Noi).' },
      { id: 5, answer: 'leggete', dialogue: [{ person: 'A', text: 'Voi cosa ', hasInput: true }, { person: 'A', text: '?' }, { person: 'B', text: 'Leggiamo un libro di storia.' }], hint: 'Verbo LEGGERE (Voi).' },
      { id: 6, answer: 'dormono', dialogue: [{ person: 'A', text: 'I bambini sono svegli?' }, { person: 'B', text: 'No, loro ', hasInput: true }, { person: 'B', text: ' ancora.' }], hint: 'Verbo DORMIRE (Loro).' },
      { id: 7, answer: 'scrive', dialogue: [{ person: 'A', text: 'Cosa fa Giulia?' }, { person: 'B', text: 'Lei ', hasInput: true }, { person: 'B', text: ' una lettera.' }], hint: 'Verbo SCRIVERE (Lei).' },
    ],
  },

  // ── LESSON 13: Riflessivi (dialogue) ─────────────────────────────────────
  {
    lessonId: '13',
    title: 'Pratica: Verbi Riflessivi',
    exercises: [
      { id: 1, answer: 'mi sveglio', dialogue: [{ person: 'A', text: 'A che ora ti svegli?' }, { person: 'B', text: 'Io ', hasInput: true }, { person: 'B', text: ' alle sette di mattina.' }], hint: 'Verbo SVEGLIARSI (Io).' },
      { id: 2, answer: 'ti alzi', dialogue: [{ person: 'A', text: 'Tu a che ora ', hasInput: true }, { person: 'A', text: ' dal letto?' }, { person: 'B', text: 'Mi alzo subito appena suona la sveglia.' }], hint: 'Verbo ALZARSI (Tu).' },
      { id: 3, answer: 'si lava', dialogue: [{ person: 'A', text: 'Cosa fa Marco in bagno?' }, { person: 'B', text: 'Lui ', hasInput: true }, { person: 'B', text: " la faccia con l'acqua fredda." }], hint: 'Verbo LAVARSI (Lui).' },
      { id: 4, answer: 'si veste', dialogue: [{ person: 'A', text: 'Giulia è pronta?' }, { person: 'B', text: 'Sì, lei ', hasInput: true }, { person: 'B', text: ' elegante per la festa.' }], hint: 'Verbo VESTIRSI (Lei).' },
      { id: 5, answer: 'ci prepariamo', dialogue: [{ person: 'A', text: 'Siete pronti per uscire?' }, { person: 'B', text: 'Noi ', hasInput: true }, { person: 'B', text: ' adesso.' }], hint: 'Verbo PREPARARSI (Noi).' },
      { id: 6, answer: 'vi divertite', dialogue: [{ person: 'A', text: 'Voi ', hasInput: true }, { person: 'A', text: ' in vacanza?' }, { person: 'B', text: 'Sì, ci divertiamo moltissimo!' }], hint: 'Verbo DIVERTIRSI (Voi).' },
      { id: 7, answer: 'si addormentano', dialogue: [{ person: 'A', text: 'I bambini sono stanchi?' }, { person: 'B', text: 'Sì, loro ', hasInput: true }, { person: 'B', text: ' sempre presto la sera.' }], hint: 'Verbo ADDORMENTARSI (Loro).' },
      { id: 8, answer: 'mi pettino', dialogue: [{ person: 'A', text: 'Cosa fai davanti allo specchio?' }, { person: 'B', text: 'Io ', hasInput: true }, { person: 'B', text: ' i capelli.' }], hint: 'Verbo PETTINARSI (Io).' },
    ],
  },

  // ── LESSON 14: Preposizioni (dialogue) ───────────────────────────────────
  {
    lessonId: '14',
    title: 'Pratica: Preposizioni',
    exercises: [
      { id: 1, answer: 'al', dialogue: [{ person: 'A', text: 'Dove vai stasera?' }, { person: 'B', text: 'Vado ', hasInput: true }, { person: 'B', text: ' cinema con i miei amici.' }], hint: 'Preposizione A + il (cinema).' },
      { id: 2, answer: 'alla', dialogue: [{ person: 'A', text: "Dov'è Maria?" }, { person: 'B', text: 'È ', hasInput: true }, { person: 'B', text: ' stazione, aspetta il treno.' }], hint: 'Preposizione A + la (stazione).' },
      { id: 3, answer: 'allo', dialogue: [{ person: 'A', text: 'Andate a vedere la partita?' }, { person: 'B', text: 'Sì, andiamo ', hasInput: true }, { person: 'B', text: ' stadio adesso.' }], hint: 'Preposizione A + lo (stadio).' },
      { id: 4, answer: 'nella', dialogue: [{ person: 'A', text: 'Hai visto le mie chiavi?' }, { person: 'B', text: 'Sì, sono ', hasInput: true }, { person: 'B', text: ' borsa rossa in cucina.' }], hint: 'Preposizione IN + la (borsa).' },
      { id: 5, answer: 'nel', dialogue: [{ person: 'A', text: "Dov'è il latte?" }, { person: 'B', text: 'È ', hasInput: true }, { person: 'B', text: ' frigorifero.' }], hint: 'Preposizione IN + il (frigorifero).' },
      { id: 6, answer: 'del', dialogue: [{ person: 'A', text: 'Di chi è questo cane?' }, { person: 'B', text: 'È il cane ', hasInput: true }, { person: 'B', text: ' vicino di casa.' }], hint: 'Preposizione DI + il (vicino).' },
      { id: 7, answer: 'dal', dialogue: [{ person: 'A', text: 'Perché sei in ritardo?' }, { person: 'B', text: 'Vengo ', hasInput: true }, { person: 'B', text: " medico, c'era molta gente." }], hint: 'Preposizione DA + il (medico).' },
      { id: 8, answer: 'alle', dialogue: [{ person: 'A', text: 'A che ora inizia la lezione?' }, { person: 'B', text: 'Inizia ', hasInput: true }, { person: 'B', text: ' nove meno un quarto.' }], hint: 'Preposizione A + le (ore plurali).' },
      { id: 9, answer: 'negli', dialogue: [{ person: 'A', text: 'Dove vive tuo fratello?' }, { person: 'B', text: 'Vive ', hasInput: true }, { person: 'B', text: ' Stati Uniti per lavoro.' }], hint: 'Preposizione IN + gli (Stati Uniti).' },
      { id: 10, answer: 'della', dialogue: [{ person: 'A', text: 'Ti piace questo profumo?' }, { person: 'B', text: 'Sì, è il profumo ', hasInput: true }, { person: 'B', text: ' primavera.' }], hint: 'Preposizione DI + la (primavera).' },
    ],
  },

  // ── LESSON 15: Pronomi Diretti (dialogue) ────────────────────────────────
  {
    lessonId: '15',
    title: 'Pratica: Pronomi Diretti',
    exercises: [
      { id: 1, answer: 'lo', dialogue: [{ person: 'A', text: 'Compri il pane?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' compro.' }], hint: 'Il pane = maschile singolare (lo).' },
      { id: 2, answer: 'la', dialogue: [{ person: 'A', text: 'Vedi Maria?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' vedo.' }], hint: 'Maria = femminile singolare (la).' },
      { id: 3, answer: 'li', dialogue: [{ person: 'A', text: 'Mangi gli spaghetti?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' mangio.' }], hint: 'Gli spaghetti = maschile plurale (li).' },
      { id: 4, answer: 'le', dialogue: [{ person: 'A', text: 'Leggi le riviste?' }, { person: 'B', text: 'Sì, ', hasInput: true }, { person: 'B', text: ' leggo.' }], hint: 'Le riviste = femminile plurale (le).' },
      { id: 5, answer: 'lo', dialogue: [{ person: 'A', text: 'Chi chiama Paolo?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' chiamo io.' }], hint: 'Paolo = maschile singolare (lo).' },
      { id: 6, answer: 'la', dialogue: [{ person: 'A', text: 'Prendi la borsa?' }, { person: 'B', text: 'No, non ', hasInput: true }, { person: 'B', text: ' prendo.' }], hint: 'La borsa = femminile singolare (la).' },
      { id: 7, answer: 'li', dialogue: [{ person: 'A', text: 'Ascolti i dischi?' }, { person: 'B', text: 'Purtroppo non ', hasInput: true }, { person: 'B', text: ' ascolto mai.' }], hint: 'I dischi = maschile plurale (li).' },
      { id: 8, answer: 'le', dialogue: [{ person: 'A', text: 'Conosci le amiche di Sara?' }, { person: 'B', text: 'No, non ', hasInput: true }, { person: 'B', text: ' conosco.' }], hint: 'Le amiche = femminile plurale (le).' },
    ],
  },

  // ── LESSON 16: Ristorante e Compras (dialogue) ───────────────────────────
  {
    lessonId: '16',
    title: 'Pratica: Ristorante e Compras',
    exercises: [
      { id: 1, answer: 'tavolo', dialogue: [{ person: 'Cameriere', text: 'Buongiorno! Avete una prenotazione?' }, { person: 'Cliente', text: 'No, vorrei un ', hasInput: true }, { person: 'Cliente', text: ' per due persone.' }], hint: '"Tavolo" es mesa.' },
      { id: 2, answer: 'menù', dialogue: [{ person: 'Cliente', text: 'Scusi, posso avere il ', hasInput: true }, { person: 'Cliente', text: '?' }, { person: 'Cameriere', text: 'Certamente, arrivo subito.' }], hint: 'Es igual que en español pero con tilde grave (ù).' },
      { id: 3, answer: 'ordinare', dialogue: [{ person: 'Cameriere', text: 'Siete pronti per ', hasInput: true }, { person: 'Cameriere', text: '?' }, { person: 'Cliente', text: 'Sì, vorrei una lasagna.' }], hint: '"Ordinare" es pedir comida.' },
      { id: 4, answer: 'conto', dialogue: [{ person: 'Cliente', text: 'Era tutto buonissimo. Il ', hasInput: true }, { person: 'Cliente', text: ', per favore.' }, { person: 'Cameriere', text: 'Arriva subito.' }], hint: '"Conto" es la cuenta.' },
      { id: 5, answer: 'costa', dialogue: [{ person: 'Cliente', text: 'Buongiorno, quanto ', hasInput: true }, { person: 'Cliente', text: ' questo vestito?' }, { person: 'Commesso', text: 'Costa 50 euro.' }], hint: 'Verbo "costare" en 3ª persona singular.' },
      { id: 6, answer: 'provare', dialogue: [{ person: 'Cliente', text: 'È molto bello. Posso ', hasInput: true }, { person: 'Cliente', text: 'lo?' }, { person: 'Commesso', text: 'Sì, i camerini sono lì.' }], hint: '"Provare" es probarse la ropa.' },
      { id: 7, answer: 'sconto', dialogue: [{ person: 'Cliente', text: "È un po' caro. C'è uno ", hasInput: true }, { person: 'Cliente', text: '?' }, { person: 'Commesso', text: 'Sì, oggi c\'è il 20%.' }], hint: '"Sconto" es descuento.' },
      { id: 8, answer: 'carta', dialogue: [{ person: 'Commesso', text: 'Come desidera pagare?' }, { person: 'Cliente', text: 'Pago con ', hasInput: true }, { person: 'Cliente', text: ' di credito.' }], hint: '"Tarjeta" se dice "carta".' },
    ],
  },

  // ── LESSON 17: Avverbi (sentence) ────────────────────────────────────────
  {
    lessonId: '17',
    title: 'Práctica: Adverbios',
    exercises: [
      { id: 1, answer: 'molto', sentence: [{ text: 'Sono ' }, { text: '', hasInput: true }, { text: ' contento di vederti!' }], translation: '¡Estoy muy contento de verte!', hint: '"Molto" puede significar "mucho" o "muy".' },
      { id: 2, answer: 'sempre', sentence: [{ text: 'Vado ' }, { text: '', hasInput: true }, { text: ' in palestra la mattina.' }], translation: 'Voy siempre al gimnasio por la mañana.', hint: '"Sempre" significa siempre.' },
      { id: 3, answer: 'mai', sentence: [{ text: 'Non vado ' }, { text: '', hasInput: true }, { text: ' al cinema da solo.' }], translation: 'Nunca voy al cine solo.', hint: '"Mai" (nunca) se usa con la negación "non".' },
      { id: 4, answer: 'troppo', sentence: [{ text: 'Mangi ' }, { text: '', hasInput: true }, { text: ' zucchero, non fa bene.' }], translation: 'Comes demasiada azúcar, no es bueno.', hint: '"Troppo" indica exceso (demasiado).' },
      { id: 5, answer: 'spesso', sentence: [{ text: 'Usciamo ' }, { text: '', hasInput: true }, { text: ' con i nostri amici.' }], translation: 'Salimos a menudo con nuestros amigos.', hint: '"Spesso" significa a menudo.' },
      { id: 6, answer: 'poco', sentence: [{ text: 'Ho ' }, { text: '', hasInput: true }, { text: ' tempo oggi, devo correre.' }], translation: 'Tengo poco tiempo hoy, debo correr.', hint: '"Poco" indica una cantidad pequeña.' },
      { id: 7, answer: 'qualche volta', sentence: [{ text: '', hasInput: true }, { text: ' cucino io la cena.' }], translation: 'A veces cocino yo la cena.', hint: '"Qualche volta" significa a veces.' },
      { id: 8, answer: 'abbastanza', sentence: [{ text: 'Ho mangiato ' }, { text: '', hasInput: true }, { text: ', sono sazio.' }], translation: 'He comido suficiente, estoy lleno.', hint: '"Abbastanza" es suficiente o bastante.' },
    ],
  },

  // ── LESSON 18: Imperfetto (sentence) ─────────────────────────────────────
  {
    lessonId: '18',
    title: 'Práctica: Imperfetto',
    exercises: [
      { id: 1, answer: 'giocavo', sentence: [{ text: 'Da bambino ' }, { text: '', hasInput: true }, { text: ' (giocare) sempre al parco.' }], translation: 'De niño jugaba siempre en el parque.', hint: '-ARE -> -avo (io).' },
      { id: 2, answer: 'ero', sentence: [{ text: 'Quando ' }, { text: '', hasInput: true }, { text: ' (essere) piccola, avevo i capelli corti.' }], translation: 'Cuando era pequeña, tenía el pelo corto.', hint: 'Essere (irregular): ero, eri, era...' },
      { id: 3, answer: 'andavamo', sentence: [{ text: 'Noi ' }, { text: '', hasInput: true }, { text: ' (andare) ogni estate in montagna.' }], translation: 'Íbamos cada verano a la montaña.', hint: '-ARE -> -avamo (noi).' },
      { id: 4, answer: 'leggevano', sentence: [{ text: 'Loro ' }, { text: '', hasInput: true }, { text: ' (leggere) molti libri da giovani.' }], translation: 'Ellos leían muchos libros de jóvenes.', hint: '-ERE -> -evano (loro).' },
      { id: 5, answer: 'studiavo', sentence: [{ text: 'Mentre io ' }, { text: '', hasInput: true }, { text: ' (studiare), lui guardava la TV.' }], translation: 'Mientras yo estudiaba, él miraba la TV.', hint: 'Acción continua en el pasado.' },
      { id: 6, answer: 'faceva', sentence: [{ text: 'Ieri ' }, { text: '', hasInput: true }, { text: ' (fare) freddo e tirava vento.' }], translation: 'Ayer hacía frío y soplaba el viento.', hint: 'Descripciones meteorológicas en el pasado.' },
      { id: 7, answer: 'mangiavate', sentence: [{ text: 'Voi ' }, { text: '', hasInput: true }, { text: ' (mangiare) spesso al ristorante?' }], translation: '¿Comíais a menudo en el restaurante?', hint: '-ARE -> -avate (voi).' },
      { id: 8, answer: 'avevi', sentence: [{ text: 'Tu ' }, { text: '', hasInput: true }, { text: ' (avere) paura del buio?' }], translation: '¿Tenías miedo a la oscuridad?', hint: '-ERE -> -evi (tu).' },
    ],
  },

  // ── LESSON 19: Futuro (sentence) ─────────────────────────────────────────
  {
    lessonId: '19',
    title: 'Práctica: Futuro',
    exercises: [
      { id: 1, answer: 'andrò', sentence: [{ text: 'Domani (io) ' }, { text: '', hasInput: true }, { text: ' (andare) al mare.' }], translation: 'Mañana iré al mar.', hint: 'Andare (irreg.): andrò, andrai...' },
      { id: 2, answer: 'compreremo', sentence: [{ text: "L'anno prossimo noi " }, { text: '', hasInput: true }, { text: ' (comprare) una casa.' }], translation: 'El año que viene compraremos una casa.', hint: '-ARE -> -eremo (en futuro se cambia la A por E).' },
      { id: 3, answer: 'pioverà', sentence: [{ text: 'Stasera ' }, { text: '', hasInput: true }, { text: ' (piovere), prendi l\'ombrello.' }], translation: 'Esta noche lloverá, toma el paraguas.', hint: 'Predicción: -ERE -> -erà.' },
      { id: 4, answer: 'finiranno', sentence: [{ text: 'Loro ' }, { text: '', hasInput: true }, { text: ' (finire) il lavoro domani.' }], translation: 'Ellos terminarán el trabajo mañana.', hint: '-IRE -> -iranno (loro).' },
      { id: 5, answer: 'sarai', sentence: [{ text: 'Tu ' }, { text: '', hasInput: true }, { text: ' (essere) felice a Roma.' }], translation: 'Tú serás feliz en Roma.', hint: 'Essere (irreg.): sarò, sarai, sarà...' },
      { id: 6, answer: 'vedrete', sentence: [{ text: 'Voi ' }, { text: '', hasInput: true }, { text: ' (vedere) il Colosseo.' }], translation: 'Vosotros veréis el Coliseo.', hint: 'Vedere (irreg.): vedrò, vedrai, vedrà, vedremo, vedrete.' },
      { id: 7, answer: 'farà', sentence: [{ text: 'Lui ' }, { text: '', hasInput: true }, { text: ' (fare) un viaggio in Asia.' }], translation: 'Él hará un viaje a Asia.', hint: 'Fare (irreg.): farò, farai, farà...' },
      { id: 8, answer: 'partirò', sentence: [{ text: 'Tra due giorni io ' }, { text: '', hasInput: true }, { text: ' (partire) per Milano.' }], translation: 'Dentro de dos días partiré hacia Milán.', hint: '-IRE -> -irò (io).' },
    ],
  },

  // ── LESSON 20: Condizionale (sentence) ───────────────────────────────────
  {
    lessonId: '20',
    title: 'Práctica: Condizionale',
    exercises: [
      { id: 1, answer: 'vorrei', sentence: [{ text: "(Io) " }, { text: '', hasInput: true }, { text: " (volere) un bicchiere d'acqua." }], translation: 'Quisiera un vaso de agua.', hint: 'Vorrei (cortesía).' },
      { id: 2, answer: 'piacerebbe', sentence: [{ text: 'Ti ' }, { text: '', hasInput: true }, { text: ' (piacere) venire al cinema?' }], translation: '¿Te gustaría venir al cine?', hint: 'Piacere -> piacerebbe.' },
      { id: 3, answer: 'mangerebbero', sentence: [{ text: 'Loro ' }, { text: '', hasInput: true }, { text: ' (mangiare) volentieri una pizza.' }], translation: 'Ellos comerían de buena gana una pizza.', hint: '-ARE -> -ebbero (loro).' },
      { id: 4, answer: 'potresti', sentence: [{ text: 'Tu ' }, { text: '', hasInput: true }, { text: ' (potere) aiutarmi?' }], translation: '¿Podrías ayudarme?', hint: 'Potere (irreg.): potrei, potresti...' },
      { id: 5, answer: 'andremmo', sentence: [{ text: 'Noi ' }, { text: '', hasInput: true }, { text: ' (andare) al mare, ma piove.' }], translation: 'Iríamos al mar, pero llueve.', hint: 'Andare (irreg.): andrei, andresti, andrebbe, andremmo.' },
      { id: 6, answer: 'dovreste', sentence: [{ text: 'Voi ' }, { text: '', hasInput: true }, { text: ' (dovere) studiare di più.' }], translation: 'Deberíais estudiar más.', hint: 'Consejo: dovrei, dovresti, dovrebbe, dovremmo, dovreste.' },
      { id: 7, answer: 'parlerei', sentence: [{ text: 'Al tuo posto (io) ' }, { text: '', hasInput: true }, { text: ' (parlare) con Maria.' }], translation: 'En tu lugar hablaría con Maria.', hint: '-ARE -> -erei (io).' },
      { id: 8, answer: 'vivrebbe', sentence: [{ text: 'Lui ' }, { text: '', hasInput: true }, { text: ' (vivere) volentieri a Roma.' }], translation: 'Él viviría con gusto en Roma.', hint: 'Vivere (irreg.): vivrei, vivresti, vivrebbe.' },
    ],
  },

  // ── LESSON 21: Pronomi Indiretti (dialogue) ───────────────────────────────
  {
    lessonId: '21',
    title: 'Pratica: Pronomi Indiretti',
    exercises: [
      { id: 1, answer: 'ti', dialogue: [{ person: 'A', text: 'A te piace la pasta?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' piace molto.' }], hint: 'A te -> Ti.' },
      { id: 2, answer: 'gli', dialogue: [{ person: 'A', text: 'Telefoni a Paolo?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' telefono stasera.' }], hint: 'A lui -> Gli.' },
      { id: 3, answer: 'le', dialogue: [{ person: 'A', text: 'Scrivi a Maria?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' scrivo una lettera.' }], hint: 'A lei -> Le.' },
      { id: 4, answer: 'ci', dialogue: [{ person: 'A', text: 'Porti il caffè a noi?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' porto il caffè subito.' }], hint: 'A noi -> Ci.' },
      { id: 5, answer: 'vi', dialogue: [{ person: 'A', text: 'Vi dico la verità?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' dite la verità.' }], hint: 'A voi -> Vi.' },
      { id: 6, answer: 'le', dialogue: [{ person: 'A', text: 'Regali i fiori a tua madre?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' regalo delle rose.' }], hint: 'A lei -> Le.' },
      { id: 7, answer: 'gli', dialogue: [{ person: 'A', text: 'Dai il libro a Marco?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' do nulla.' }], hint: 'A lui -> Gli.' },
      { id: 8, answer: 'loro', dialogue: [{ person: 'A', text: 'Cosa dici ai tuoi amici?' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' di venire qui.' }], hint: 'A loro -> Loro (va después del verbo).' },
    ],
  },

  // ── LESSON 22: Comparativi (sentence) ────────────────────────────────────
  {
    lessonId: '22',
    title: 'Pratica: Comparativi e Superlativi',
    exercises: [
      { id: 1, answer: 'più', sentence: [{ text: 'Roma è ' }, { text: '', hasInput: true }, { text: ' vecchia di Milano.' }], translation: 'Roma es más vieja que Milán.', hint: 'Más -> Più.' },
      { id: 2, answer: 'di', sentence: [{ text: 'Lui è meno alto ' }, { text: '', hasInput: true }, { text: ' me.' }], translation: 'Él es menos alto que yo.', hint: 'Comparar con pronombres -> di.' },
      { id: 3, answer: 'come', sentence: [{ text: 'Sei bella ' }, { text: '', hasInput: true }, { text: ' tua madre.' }], translation: 'Eres tan bella como tu madre.', hint: 'Igualdad: Come / Quanto.' },
      { id: 4, answer: 'buonissima', sentence: [{ text: 'Questa pizza è ' }, { text: '', hasInput: true }, { text: ' (muy buena).' }], translation: 'Esta pizza está buenísima.', hint: 'Superlativo absoluto: -issima.' },
      { id: 5, answer: 'che', sentence: [{ text: 'Studiare è più facile ' }, { text: '', hasInput: true }, { text: ' lavorare.' }], translation: 'Estudiar es más fácil que trabajar.', hint: 'Comparar dos verbos -> che.' },
      { id: 6, answer: 'migliore', sentence: [{ text: 'Marco è il ' }, { text: '', hasInput: true }, { text: ' (mejor) della classe.' }], translation: 'Marco es el mejor de la clase.', hint: 'Mejor (adjetivo) -> Migliore.' },
      { id: 7, answer: 'che', sentence: [{ text: 'La torta è più dolce ' }, { text: '', hasInput: true }, { text: ' salata.' }], translation: 'La tarta es más dulce que salada.', hint: 'Comparar dos adjetivos -> che.' },
      { id: 8, answer: 'peggiore', sentence: [{ text: "È l'errore " }, { text: '', hasInput: true }, { text: ' (peor) della mia vita.' }], translation: 'Es el peor error de mi vida.', hint: 'Peor (adjetivo) -> Peggiore.' },
    ],
  },

  // ── LESSON 23: CI & NE (sentence) ────────────────────────────────────────
  {
    lessonId: '23',
    title: 'Pratica: CI & NE',
    exercises: [
      { id: 1, answer: 'ci', sentence: [{ text: 'Vai a Roma? Sì, ' }, { text: '', hasInput: true }, { text: ' vado domani.' }], translation: '¿Vas a Roma? Sí, voy allí mañana.', hint: 'CI sustituye lugar (a Roma).' },
      { id: 2, answer: 'ne', sentence: [{ text: 'Quanti caffè prendi? ' }, { text: '', hasInput: true }, { text: ' prendo due.' }], translation: '¿Cuántos cafés tomas? Tomo dos.', hint: 'NE sustituye cantidad.' },
      { id: 3, answer: 'ci', sentence: [{ text: 'Sei in ufficio? No, non ' }, { text: '', hasInput: true }, { text: ' sono.' }], translation: '¿Estás en la oficina? No, no lo estoy (allí).', hint: 'CI = allí.' },
      { id: 4, answer: 'ne', sentence: [{ text: 'Hai delle mele? Sì, ' }, { text: '', hasInput: true }, { text: ' ho tre.' }], translation: '¿Tienes manzanas? Sí, tengo tres.', hint: 'NE para cantidades específicas.' },
      { id: 5, answer: 'ci', sentence: [{ text: 'Pensi al tuo futuro? Sì, ' }, { text: '', hasInput: true }, { text: ' penso spesso.' }], translation: '¿Piensas en tu futuro? Sí, pienso en ello a menudo.', hint: 'Pensare a -> CI.' },
      { id: 6, answer: 'ne', sentence: [{ text: 'Cosa pensi di questo libro? ' }, { text: '', hasInput: true }, { text: ' penso bene.' }], translation: '¿Qué piensas de este libro? Pienso bien de él.', hint: 'Pensare di (opinión) -> NE.' },
      { id: 7, answer: 'ne', sentence: [{ text: 'Vuoi del vino? No, grazie, non ' }, { text: '', hasInput: true }, { text: ' voglio.' }], translation: '¿Quieres vino? No, gracias, no quiero (de ello).', hint: 'NE para cantidades indeterminadas.' },
      { id: 8, answer: 'ci', sentence: [{ text: 'Vivi a Milano? Sì, ' }, { text: '', hasInput: true }, { text: ' vivo da tre anni.' }], translation: '¿Vives en Milán? Sí, vivo allí hace tres años.', hint: 'CI = lugar.' },
    ],
  },

  // ── LESSON 24: Congiuntivo Presente (sentence) ───────────────────────────
  {
    lessonId: '24',
    title: 'Pratica: Congiuntivo Presente',
    exercises: [
      { id: 1, answer: 'sia', sentence: [{ text: 'Credo che lui ' }, { text: '', hasInput: true }, { text: ' (essere) stanco.' }], translation: 'Creo que él está cansado.', hint: 'Congiuntivo de ESSERE (lui): sia.' },
      { id: 2, answer: 'abbia', sentence: [{ text: 'Penso che tu ' }, { text: '', hasInput: true }, { text: ' (avere) ragione.' }], translation: 'Pienso que tienes razón.', hint: 'Congiuntivo de AVERE (tu): abbia.' },
      { id: 3, answer: 'vengano', sentence: [{ text: 'Dubito che loro ' }, { text: '', hasInput: true }, { text: ' (venire) oggi.' }], translation: 'Dudo que vengan hoy.', hint: 'Venire -> vengano (loro).' },
      { id: 4, answer: 'vada', sentence: [{ text: 'Spero che tutto ' }, { text: '', hasInput: true }, { text: ' (andare) bene.' }], translation: 'Espero que todo vaya bien.', hint: 'Andare -> vada (lui).' },
      { id: 5, answer: 'faccia', sentence: [{ text: 'Voglio che tu ' }, { text: '', hasInput: true }, { text: ' (fare) i compiti.' }], translation: 'Quiero que hagas los deberes.', hint: 'Fare -> faccia (tu).' },
    ],
  },

  // ── LESSON 25: Congiuntivo Imperfetto (sentence) ─────────────────────────
  {
    lessonId: '25',
    title: 'Pratica: Congiuntivo Imperfetto',
    exercises: [
      { id: 1, answer: 'avessi', sentence: [{ text: 'Se ' }, { text: '', hasInput: true }, { text: ' (avere) tempo, verrei.' }], translation: 'Si tuviera tiempo, vendría.', hint: 'Se + Congiuntivo Imperfetto (io): avessi.' },
      { id: 2, answer: 'fosse', sentence: [{ text: 'Se lui ' }, { text: '', hasInput: true }, { text: ' (essere) qui, saremmo felici.' }], translation: 'Si él estuviera aquí, seríamos felices.', hint: 'Essere -> fosse.' },
      { id: 3, answer: 'studiassimo', sentence: [{ text: 'Se noi ' }, { text: '', hasInput: true }, { text: ' (studiare) di più, sapremmo tutto.' }], translation: 'Si estudiáramos más, sabríamos todo.', hint: 'Studiare -> studiassimo.' },
      { id: 4, answer: 'potessi', sentence: [{ text: 'Magari ' }, { text: '', hasInput: true }, { text: ' (potere) venire!' }], translation: '¡Ojalá pudiera venir!', hint: 'Deseo irreal: potessi.' },
    ],
  },

  // ── LESSON 26: Condizionale Composto (sentence) ──────────────────────────
  {
    lessonId: '26',
    title: 'Pratica: Condizionale Composto',
    exercises: [
      { id: 1, answer: 'sarei andato', sentence: [{ text: 'Io ' }, { text: '', hasInput: true }, { text: ' (andare) al mare, ma pioveva.' }], translation: 'Habría ido al mar, pero llovía.', hint: 'Condizionale Composto: Sarei + andato.' },
      { id: 2, answer: 'avrebbe potuto', sentence: [{ text: 'Lui ' }, { text: '', hasInput: true }, { text: ' (potere) aiutarmi.' }], translation: 'Él habría podido ayudarme.', hint: 'Avere -> avrebbe + potuto.' },
      { id: 3, answer: 'saremmo venuti', sentence: [{ text: 'Noi ' }, { text: '', hasInput: true }, { text: ' (venire) ieri.' }], translation: 'Habríamos venido ayer.', hint: 'Essere -> saremmo + venuti.' },
      { id: 4, answer: 'avreste dovuto', sentence: [{ text: 'Voi ' }, { text: '', hasInput: true }, { text: ' (dovere) dirmelo.' }], translation: 'Deberíais habérmelo dicho.', hint: 'Avere -> avreste + dovuto.' },
    ],
  },

  // ── LESSON 27: Pronomi Combinati (dialogue) ───────────────────────────────
  {
    lessonId: '27',
    title: 'Pratica: Pronomi Combinati',
    exercises: [
      { id: 1, answer: 'te lo', dialogue: [{ person: 'A', text: 'Mi presti il libro?' }, { person: 'B', text: 'Sì, ' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' presto domani.' }], hint: 'Ti + lo = TE LO.' },
      { id: 2, answer: 'glielo', dialogue: [{ person: 'A', text: 'Dai il regalo a Marco?' }, { person: 'B', text: 'Sì, ' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' do subito.' }], hint: 'Gli + lo = GLIELO.' },
      { id: 3, answer: 'me ne', dialogue: [{ person: 'A', text: 'Quanti caffè bevi?' }, { person: 'B', text: '' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' bevo uno solo.' }], hint: 'Mi + ne = ME NE.' },
      { id: 4, answer: 'ce la', dialogue: [{ person: 'A', text: 'Cucini la pasta?' }, { person: 'B', text: 'Sì, ' }, { person: 'B', text: '', hasInput: true }, { person: 'B', text: ' cucino io.' }], hint: 'Ci + la = CE LA.' },
    ],
  },

  // ── LESSON 28: Trapassato Prossimo (sentence) ─────────────────────────────
  {
    lessonId: '28',
    title: 'Pratica: Trapassato Prossimo',
    exercises: [
      { id: 1, answer: 'avevo mangiato', sentence: [{ text: 'Quando sei arrivato, io ' }, { text: '', hasInput: true }, { text: ' (mangiare).' }], translation: 'Cuando llegaste, yo ya había comido.', hint: 'Trapassato: Avevo + participio.' },
      { id: 2, answer: 'erano partiti', sentence: [{ text: 'Loro ' }, { text: '', hasInput: true }, { text: ' (partire) già prima del tramonto.' }], translation: 'Ellos ya se habían ido antes del atardecer.', hint: 'Verbo de movimiento: Erano + partiti.' },
      { id: 3, answer: 'avevi studiato', sentence: [{ text: 'Non sapevo che tu ' }, { text: '', hasInput: true }, { text: ' (studiare) italiano.' }], translation: 'No sabía que habías estudiado italiano.', hint: 'Avere -> avevi + studiato.' },
    ],
  },

  // ── LESSON 29: Forma Passiva (sentence) ──────────────────────────────────
  {
    lessonId: '29',
    title: 'Pratica: Forma Passiva',
    exercises: [
      { id: 1, answer: 'è', sentence: [{ text: 'La mela ' }, { text: '', hasInput: true }, { text: ' (essere) mangiata da Marco.' }], translation: 'La manzana es comida por Marco.', hint: 'Presente Passivo: Essere + Participio.' },
      { id: 2, answer: 'viene', sentence: [{ text: 'Il libro ' }, { text: '', hasInput: true }, { text: ' (venire) letto da muchos.' }], translation: 'El libro es leído por muchos.', hint: 'Passivo con VENIRE (enfatiza la acción).' },
      { id: 3, answer: 'sono', sentence: [{ text: 'Le chiavi ' }, { text: '', hasInput: true }, { text: ' (essere) state trovate.' }], translation: 'Las llaves han sido encontradas.', hint: 'Passato Prossimo Passivo: Sono state.' },
    ],
  },

  // ── LESSON 30: Discorso Indiretto (sentence) ─────────────────────────────
  {
    lessonId: '30',
    title: 'Pratica: Discorso Indiretto',
    exercises: [
      { id: 1, answer: 'viene', sentence: [{ text: 'Lui dice: "Vengo". -> Lui dice che ' }, { text: '', hasInput: true }, { text: '.' }], translation: 'Él dice que viene.', hint: 'Presente -> Presente (cuando el verbo principal es presente).' },
      { id: 2, answer: 'sarebbe venuto', sentence: [{ text: 'Lui ha detto: "Vengo". -> Lui ha detto che ' }, { text: '', hasInput: true }, { text: '.' }], translation: 'Él dijo que vendría.', hint: 'Presente -> Condizionale Composto (futuro nel passato).' },
      { id: 3, answer: 'stavo', sentence: [{ text: 'Mi ha chiesto: "Come stai?" -> Mi ha chiesto come ' }, { text: '', hasInput: true }, { text: '.' }], translation: 'Me preguntó cómo estaba.', hint: 'Presente -> Imperfetto.' },
    ],
  },

  // ── LESSON 31: Passato Remoto (sentence) ─────────────────────────────────
  {
    lessonId: '31',
    title: 'Pratica: Passato Remoto',
    exercises: [
      { id: 1, answer: 'scrisse', sentence: [{ text: 'Dante ' }, { text: '', hasInput: true }, { text: ' la Divina Commedia. (scrivere)' }], translation: 'Dante escribió la Divina Comedia.', hint: 'Scrivere (passato remoto, 3ª pers. sing.): scrisse.' },
      { id: 2, answer: 'fu', sentence: [{ text: 'Cesare ' }, { text: '', hasInput: true }, { text: ' ucciso in Senato. (essere)' }], translation: 'César fue asesinado en el Senado.', hint: 'Essere (passato remoto, 3ª pers. sing.): fu.' },
      { id: 3, answer: 'andammo', sentence: [{ text: 'Noi ' }, { text: '', hasInput: true }, { text: ' a Roma molti anni fa. (andare)' }], translation: 'Fuimos a Roma hace muchos años.', hint: 'Andare (passato remoto, 1ª pers. plur.): andammo.' },
      { id: 4, answer: 'seppero', sentence: [{ text: 'Loro ' }, { text: '', hasInput: true }, { text: ' tutto il segreto. (sapere)' }], translation: 'Ellos supieron todo el secreto.', hint: 'Sapere (passato remoto, 3ª pers. plur.): seppero.' },
      { id: 5, answer: 'ebbi', sentence: [{ text: 'Io ' }, { text: '', hasInput: true }, { text: ' un grande onore. (avere)' }], translation: 'Tuve un gran honor.', hint: 'Avere (passato remoto, 1ª pers. sing.): ebbi.' },
    ],
  },

  // ── LESSON 32: Periodo Ipotetico Complesso (sentence) ────────────────────
  {
    lessonId: '32',
    title: 'Pratica: Periodo Ipotetico Complesso',
    exercises: [
      { id: 1, answer: 'avessi saputo', sentence: [{ text: 'Se ' }, { text: '', hasInput: true }, { text: ' (io, sapere), sarei venuto.' }], translation: 'Si hubiera sabido, habría venido.', hint: 'Hipótesis en el pasado: Se + Trapassato Congiuntivo (avessi saputo).' },
      { id: 2, answer: 'fossimo partiti', sentence: [{ text: 'Se ' }, { text: '', hasInput: true }, { text: ' (noi, partire) prima, non avremmo perso il treno.' }], translation: 'Si hubiéramos partido antes, no habríamos perdido el tren.', hint: 'Verbo de movimiento: Essere (trapassato congiuntivo) + Participio.' },
      { id: 3, answer: 'avessi studiato', sentence: [{ text: 'Se tu ' }, { text: '', hasInput: true }, { text: " (studiare) di più, avresti passato l'esame." }], translation: 'Si hubieras estudiado más, habrías pasado el examen.', hint: 'Avere (trapassato congiuntivo) + Participio.' },
      { id: 4, answer: 'avesse piovuto', sentence: [{ text: 'Se non ' }, { text: '', hasInput: true }, { text: ' (piovere), saremmo andati al mare.' }], translation: 'Si no hubiera llovido, habríamos ido al mar.', hint: 'Piovere usa Auxiliar Avere en tiempos compuestos (avesse piovuto).' },
      { id: 5, answer: 'avessi ascoltato', sentence: [{ text: 'Se ti ' }, { text: '', hasInput: true }, { text: ' (io, ascoltare), non avrei fatto questo errore.' }], translation: 'Si te hubiera escuchado, no habría cometido este error.', hint: 'Hipótesis sobre una acción concluida.' },
    ],
  },

  // ── LESSON 33: Modismi e Proverbi (sentence) ─────────────────────────────
  {
    lessonId: '33',
    title: 'Pratica: Modismi e Proverbi',
    exercises: [
      { id: 1, answer: 'crepi', sentence: [{ text: 'A: In bocca al lupo! B: ' }, { text: '', hasInput: true }, { text: '!' }], translation: '¡Buena suerte! - ¡Que muera (el lobo)!', hint: 'Respuesta tradicional obligatoria.' },
      { id: 2, answer: 'acqua', sentence: [{ text: 'Quando vuoi che qualcuno stia zitto dici: "' }, { text: '', hasInput: true }, { text: ' in bocca!"' }], translation: '¡Ni una palabra! (Mudo como un pez)', hint: 'Literalmente: agua en la boca.' },
      { id: 3, answer: 'mai', sentence: [{ text: '"Meglio tardi che ' }, { text: '', hasInput: true }, { text: '"' }], translation: 'Más vale tarde que nunca.', hint: 'Proverbio universal.' },
      { id: 4, answer: 'pesci', sentence: [{ text: '"Chi dorme non piglia ' }, { text: '', hasInput: true }, { text: '"' }], translation: 'Camarón que se duerme se lo lleva la corriente.', hint: 'Pigliare (tomar) + el animal que nada.' },
      { id: 5, answer: 'monaco', sentence: [{ text: '"L\'abito non fa il ' }, { text: '', hasInput: true }, { text: '"' }], translation: 'El hábito no hace al monje.', hint: 'No juzgues por las apariencias.' },
    ],
  },

  // ── LESSON 34: Linguaggio Settoriale (sentence) ──────────────────────────
  {
    lessonId: '34',
    title: 'Pratica: Linguaggio Settoriale',
    exercises: [
      { id: 1, answer: 'dimesso', sentence: [{ text: 'Il paziente è stato ' }, { text: '', hasInput: true }, { text: ' stamattina. (alta médica)' }], translation: 'El paciente ha recibido el alta esta mañana.', hint: 'Verbo: Dimettere (participio: dimesso).' },
      { id: 2, answer: 'emesso', sentence: [{ text: 'Il giudice ha ' }, { text: '', hasInput: true }, { text: ' la sentenza. (dictado/emitido)' }], translation: 'El juez ha dictado la sentencia.', hint: 'Verbo: Emettere (participio: emesso).' },
      { id: 3, answer: 'break-even', sentence: [{ text: 'Abbiamo raggiunto il ' }, { text: '', hasInput: true }, { text: ' nel terzo trimestre.' }], translation: 'Hemos alcanzado el punto de equilibrio en el tercer trimestre.', hint: 'Término de negocios estándar.' },
      { id: 4, answer: 'campagna', sentence: [{ text: 'La ' }, { text: '', hasInput: true }, { text: ' pubblicitaria è stata mirata. (campaña)' }], translation: 'La campaña publicitaria fue dirigida.', hint: 'Campagna pubblicitaria.' },
      { id: 5, answer: 'interesse', sentence: [{ text: 'Il tasso di ' }, { text: '', hasInput: true }, { text: ' è salito ancora. (interés)' }], translation: 'La tasa de interés ha subido de nuevo.', hint: 'Economía: Tasso di interesse.' },
    ],
  },
];

async function run() {
  console.log(`Migrating ${LESSONS.length} dialogue exercise sets...\n`);
  for (const lesson of LESSONS) {
    try {
      await setDoc(doc(db, 'dialogueExercises', lesson.lessonId), lesson);
      console.log(`  ✓ ${lesson.lessonId} — ${lesson.title} (${lesson.exercises.length} exercises)`);
    } catch (err) {
      console.error(`  ✗ ${lesson.lessonId}:`, err.message);
    }
  }
  console.log('\nDone.');
  process.exit(0);
}

run();
