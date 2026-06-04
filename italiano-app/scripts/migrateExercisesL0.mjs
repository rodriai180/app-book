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

const exercises = [
  // ── El Alfabeto Italiano ────────────────────────────────────────────────
  { id:"l0_alf_1", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quante lettere ha l'alfabeto italiano di base?", options:["21","26","23","25"], correctAnswer:"21", tip:"El italiano tiene 21 letras base. Las letras J, K, W, X, Y existen pero solo se usan en palabras de origen extranjero." },
  { id:"l0_alf_2", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quale di queste lettere NON fa parte dell'alfabeto italiano originale?", options:["J","R","S","V"], correctAnswer:"J", tip:"J (i lunga) no es una letra italiana original. Solo aparece en extranjerismos: jeans, jogging." },
  { id:"l0_alf_3", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Come si chiama la lettera 'H' in italiano?", options:["Acca","Hacc","Effe","Enne"], correctAnswer:"Acca", tip:"La H se llama 'acca' y en italiano es SIEMPRE muda. Nunca se pronuncia." },
  { id:"l0_alf_4", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quale lettera straniera si usa nella parola 'kiwi'?", options:["K (kappa)","J (i lunga)","W (vu doppia)","Y (ipsilon)"], correctAnswer:"K (kappa)", tip:"K se llama 'kappa'. Aparece en palabras extranjeras: kiwi, karate, kilogrammo." },
  { id:"l0_alf_5", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Completa: 'A come Ancona, B come ___, C come Como'", options:["Bologna","Bari","Brescia","Bergamo"], correctAnswer:"Bologna", tip:"El alfabeto fonético italiano: B come Bologna. Se usa para deletrear por teléfono." },
  { id:"l0_alf_6", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Come si chiama la lettera 'W' in italiano?", options:["Vu doppia","Doppio u","Vu","Doppia v"], correctAnswer:"Vu doppia", tip:"W se llama 'vu doppia'. Aparece en: web, wafer, weekend. No es una letra italiana original." },
  { id:"l0_alf_7", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quale di queste parole usa una lettera straniera?", options:["Jeans","Casa","Libro","Pane"], correctAnswer:"Jeans", tip:"Jeans usa la J (i lunga), letra de origen extranjero no incluida en el alfabeto italiano base." },
  { id:"l0_alf_8", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Come si chiama la lettera 'Y' in italiano?", options:["Ipsilon","Igrec","Why","Ics"], correctAnswer:"Ipsilon", tip:"Y se llama 'ipsilon'. Aparece en: yogurt, yacht, kayak." },
  { id:"l0_alf_9", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quale lettera italiana non si pronuncia mai?", options:["H (acca)","R (erre)","S (esse)","N (enne)"], correctAnswer:"H (acca)", tip:"La H siempre es muda en italiano: ho, hai, ha, hanno (verbo avere) y palabras como hotel." },
  { id:"l0_alf_10", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quante sono le lettere straniere usate in italiano?", options:["5 (J, K, W, X, Y)","3 (J, K, W)","4 (J, K, W, X)","6"], correctAnswer:"5 (J, K, W, X, Y)", tip:"Las 5 letras extranjeras: J, K, W, X, Y. Existen en italiano pero solo en palabras prestadas." },
  { id:"l0_alf_11", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Completa: 'V come Venezia, Z come ___'", options:["Zara","Zero","Zena","Zurigo"], correctAnswer:"Zara", tip:"Z come Zara. El alfabeto fonético sirve para deletrear: Z come Zara o Zurigo." },
  { id:"l0_alf_12", lessonId:"0", subtopic:"El Alfabeto Italiano", question:"Quale di queste parole NON usa lettere straniere?", options:["Libro","Kiwi","Jeans","Weekend"], correctAnswer:"Libro", tip:"Libro usa solo letras del alfabeto italiano base (L, I, B, R, O). Sin J, K, W, X ni Y." },

  // ── Las Vocales (Le Vocali) ─────────────────────────────────────────────
  { id:"l0_voc_1", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quante vocali ha la lingua italiana?", options:["5 (A, E, I, O, U)","6","4","7"], correctAnswer:"5 (A, E, I, O, U)", tip:"El italiano tiene 5 vocales: A, E, I, O, U. Siempre se pronuncian con claridad, nunca se reducen." },
  { id:"l0_voc_2", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Come si pronuncia 'HO' in 'ho fame' (tengo hambre)?", options:["Come /o/ — la H è muta","Come /ho/ aspirata","Come /hò/ con H aspirata","Non si pronuncia"], correctAnswer:"Come /o/ — la H è muta", tip:"La H italiana es siempre muda. 'Ho' = /o/, 'hai' = /ai/, 'ha' = /a/. La H no suena jamás." },
  { id:"l0_voc_3", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quale di queste parole ha la E aperta (è)?", options:["Caffè","Bene","Verde","Sole"], correctAnswer:"Caffè", tip:"Caffè tiene E abierta (è), indicada con acento grave. Bene/Verde tienen E cerrada." },
  { id:"l0_voc_4", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quale vocale italiana ha DUE varianti (aperta e chiusa)?", options:["E e O","Solo la E","Solo la O","Tutte le vocali"], correctAnswer:"E e O", tip:"Solo E y O tienen variantes abiertas/cerradas según la región. A, I, U tienen un solo sonido claro." },
  { id:"l0_voc_5", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Come si pronuncia la U italiana?", options:["Come la U spagnola","Come 'you' inglese","Come la Ü tedesca","Come 'ou' francese"], correctAnswer:"Come la U spagnola", tip:"La U italiana es idéntica a la española: luna, uno, futuro. Sonido puro, sin diptongo." },
  { id:"l0_voc_6", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Come si pronuncia 'HOTEL' in italiano?", options:["Otel (H muta)","Hotel (H aspirata)","Hòtel","Utel"], correctAnswer:"Otel (H muta)", tip:"Incluso en palabras extranjeras, la H italiana es muda. Hotel = /otel/, hobby = /obbi/." },
  { id:"l0_voc_7", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quale parola ha la E chiusa (cerrada)?", options:["Perché","Caffè","È (verbo essere)","Cioè"], correctAnswer:"Perché", tip:"Perché → E cerrada (é). Al contrario: caffè, è → E abierta. El acento grave = abierta." },
  { id:"l0_voc_8", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quale di queste coppie ha vocali DIVERSE tra loro?", options:["è / é (aperta vs chiusa)","a / à (stessa vocale)","i / ì (stessa vocale)","u / ù (stessa vocale)"], correctAnswer:"è / é (aperta vs chiusa)", tip:"Solo E y O tienen variantes abiertas/cerradas. è (caffè) = abierta. é (perché) = cerrada." },
  { id:"l0_voc_9", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"In 'ITALIA', quante vocali si pronunciano?", options:["4 (I-A-I-A)","3","5","2"], correctAnswer:"4 (I-A-I-A)", tip:"I-ta-li-a: cada vocal se pronuncia por separado. I, A, I, A = 4 vocales. Nunca se reducen." },
  { id:"l0_voc_10", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quale parola ha le vocali finali pronunciate?", options:["Casa (ca-SA)","The (inglese)","Night (inglese)","Eau (francese)"], correctAnswer:"Casa (ca-SA)", tip:"El italiano pronuncia siempre las vocales finales: ca-SA, li-BRO, ma-RE. Nunca se reducen." },
  { id:"l0_voc_11", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Come si pronuncia 'HAI' in italiano (tu hai = tú tienes)?", options:["Come /ai/ — H muta","Come /haj/","Come /hay/ inglese","Come /ei/"], correctAnswer:"Come /ai/ — H muta", tip:"HAI = /ai/. La H es muda siempre. HAI = tu tienes (verbo avere)." },
  { id:"l0_voc_12", lessonId:"0", subtopic:"Las Vocales (Le Vocali)", question:"Quale affermazione sulle vocali italiane è CORRETTA?", options:["Ogni vocale si pronuncia sempre, anche a fine parola","Le vocali finali spesso non si sentono","La E è sempre uguale","La H si pronuncia come vocale"], correctAnswer:"Ogni vocale si pronuncia sempre, anche a fine parola", tip:"Regla fundamental: las vocales italianas SIEMPRE se pronuncian, incluso al final de palabra." },

  // ── C, G, CH y GH ──────────────────────────────────────────────────────
  { id:"l0_cg_1", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Come si pronuncia la C in 'CASA'?", options:["/K/ duro — come in spagnolo","/CH/ dolce","/S/","/TH/ inglese"], correctAnswer:"/K/ duro — come in spagnolo", tip:"C + A/O/U → sonido /K/ duro: CASA, COSA, CUORE." },
  { id:"l0_cg_2", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Quale parola si pronuncia con il suono /K/?", options:["Cuore","Cena","Ciao","Centro"], correctAnswer:"Cuore", tip:"CUORE → C + U = /K/. Cena/Ciao/Centro → C + E/I = sonido suave /tʃ/." },
  { id:"l0_cg_3", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Come si pronuncia 'CIAO'?", options:["/TƩAO/ — suono dolce come 'ch'","/KAO/","/SIAO/","/JIAO/"], correctAnswer:"/TƩAO/ — suono dolce come 'ch'", tip:"C + I/E → sonido suave /tʃ/: CIAO = /tʃao/, CENA = /tʃena/, CENTRO = /tʃentro/." },
  { id:"l0_cg_4", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Quale parola ha il suono dolce /tʃ/ (come 'ch' spagnola)?", options:["Centro","Casa","Cuore","Cravatta"], correctAnswer:"Centro", tip:"CENTRO → C + E = /tʃ/. Casa/Cuore/Cravatta → C + A/U/consonante = /K/ duro." },
  { id:"l0_cg_5", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Come si pronuncia 'CHI' (quien)?", options:["/KI/ — CH davanti a I = /K/","/tʃI/ — come ciao","/ʃI/ — come SH","/HI/"], correctAnswer:"/KI/ — CH davanti a I = /K/", tip:"CH + E/I → /K/ duro: CHI = /ki/, CHE = /ke/, CHIAVE = /kiave/. La H 'endurece' la C." },
  { id:"l0_cg_6", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Quale parola contiene CH con suono /K/?", options:["Chiave","Cena","Ciao","Cuore"], correctAnswer:"Chiave", tip:"CHIAVE → CH + I = /K/. Cena → C + E = /tʃ/ (suono dolce)." },
  { id:"l0_cg_7", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Come si pronuncia la G in 'GATTO'?", options:["/G/ duro — come in spagnolo","/dʒ/ dolce — come 'gelato'","/H/","/GH/"], correctAnswer:"/G/ duro — come in spagnolo", tip:"G + A/O/U → /G/ duro: GATTO, GONNA, GUSTO." },
  { id:"l0_cg_8", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Come si pronuncia 'GELATO'?", options:["/dʒelato/ — G dolce davanti a E","/gelato/ — G duro","/ʒelato/","/helato/"], correctAnswer:"/dʒelato/ — G dolce davanti a E", tip:"G + E/I → sonido suave /dʒ/: GELATO, GIRO, GESTO." },
  { id:"l0_cg_9", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Quale parola ha la G con suono dolce /dʒ/?", options:["Giro","Gatto","Gonna","Gusto"], correctAnswer:"Giro", tip:"GIRO → G + I = /dʒ/ dolce. Gatto/Gonna/Gusto → G + A/O/U = /G/ duro." },
  { id:"l0_cg_10", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Perché 'SPAGHETTI' si scrive con GH?", options:["Per mantenere il suono /G/ duro davanti alla E","Per il suono /GH/ speciale","La H è decorativa","Per marcare l'accento"], correctAnswer:"Per mantenere il suono /G/ duro davanti alla E", tip:"GH + E/I → /G/ duro: SPAGHETTI. Sin H: spagetti se pronunciaría con G suave /dʒ/." },
  { id:"l0_cg_11", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Come si pronuncia 'GHIACCIO' (hielo)?", options:["/GIACCIO/ — G duro (GH+I)","/JIACCIO/ — G dolce","/HIACCIO/","/SCIACCIO/"], correctAnswer:"/GIACCIO/ — G duro (GH+I)", tip:"GHIACCIO → GH + I = /G/ duro. La H 'endurece' la G igual que en CH endurece la C." },
  { id:"l0_cg_12", lessonId:"0", subtopic:"C, G, CH y GH — Sistema Completo", question:"Quale parola NON inizia con il suono /K/?", options:["Cena","Casa","Cuore","Chiave"], correctAnswer:"Cena", tip:"CENA → C + E = /tʃ/ (suono dolce, NON /K/). Casa → /K/, Cuore → /K/, Chiave (CH) → /K/." },

  // ── SC ─────────────────────────────────────────────────────────────────
  { id:"l0_sc_1", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Come si pronuncia SC in 'SCENA'?", options:["/SH/ — come in 'show'","/SK/ — come in 'scala'","/S/ sola","/Z/"], correctAnswer:"/SH/ — come in 'show'", tip:"SC + E/I → /SH/: SCENA, SCIENZA, PESCE, USCITA." },
  { id:"l0_sc_2", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Come si pronuncia SC in 'SCIENZA' (ciencia)?", options:["/SHienza/ — SC+I = /SH/","/SKienza/ — SC+I = /SK/","/Sienza/","/Szienza/"], correctAnswer:"/SHienza/ — SC+I = /SH/", tip:"SC + I → /SH/: SCIENZA = /SHienza/. Ante E e I siempre /SH/." },
  { id:"l0_sc_3", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Quale parola si pronuncia con il suono /SH/?", options:["Pesce","Scuola","Scala","Scarpe"], correctAnswer:"Pesce", tip:"PESCE (pez) → SC + E = /SH/. Scuola/Scala/Scarpe → SC + U/A = /SK/." },
  { id:"l0_sc_4", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Come si pronuncia 'USCITA' (salida)?", options:["/uSHIta/ — SC+I = /SH/","/uSKIta/ — SC+I = /SK/","/uSIta/","/uCIta/"], correctAnswer:"/uSHIta/ — SC+I = /SH/", tip:"USCITA → SC + I = /SH/. La misma regla: SC ante E/I siempre es /SH/." },
  { id:"l0_sc_5", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Come si pronuncia SC in 'SCALA' (escalera)?", options:["/SK/ — SC+A = /SK/","/SH/ — SC+A = /SH/","/S/ sola","/Z/"], correctAnswer:"/SK/ — SC+A = /SK/", tip:"SC + A/O/U → /SK/: SCALA = /SKAla/. Ante A, O, U el sonido es duro /SK/." },
  { id:"l0_sc_6", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Come si pronuncia SC in 'SCUOLA' (escuela)?", options:["/SK/ — SC+U = /SK/","/SH/ — SC+U = /SH/","/SC/ come in spagnolo","/S/"], correctAnswer:"/SK/ — SC+U = /SK/", tip:"SC + U → /SK/: SCUOLA = /SKUOla/. Misma regla que SCALA: SC ante U = /SK/." },
  { id:"l0_sc_7", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Quale parola si pronuncia con il suono /SK/?", options:["Scarpe","Scena","Scienza","Pesce"], correctAnswer:"Scarpe", tip:"SCARPE (zapatos) → SC + A = /SK/. Scena/Scienza/Pesce → SC + E/I = /SH/." },
  { id:"l0_sc_8", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Qual è la differenza tra 'SCENA' e 'SCALA'?", options:["Scena = /SH/, Scala = /SK/","Entrambe /SH/","Entrambe /SK/","Dipende dall'accento"], correctAnswer:"Scena = /SH/, Scala = /SK/", tip:"SC + E → /SH/ (scena). SC + A → /SK/ (scala). La vocal siguiente determina el sonido." },
  { id:"l0_sc_9", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Perché 'SCHERZO' si scrive con SCH?", options:["Per mantenere il suono /SK/ davanti alla E","Per il suono /SH/","La H è decorativa","È un'eccezione"], correctAnswer:"Per mantenere il suono /SK/ davanti alla E", tip:"SCH + E/I → /SK/: SCHERZO = /SKERzo/. La H endurece SC igual que endurece C (CH) y G (GH)." },
  { id:"l0_sc_10", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Come si pronuncia 'SCHIENA' (espalda)?", options:["/SKIena/ — SCH+I = /SK/","/SHIena/ — SCH+I = /SH/","/SIena/","/SCIena/"], correctAnswer:"/SKIena/ — SCH+I = /SK/", tip:"SCHIENA → SCH + I = /SK/. La H hace que SC ante I suene /SK/ en vez de /SH/." },
  { id:"l0_sc_11", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Quale parola ha SC con suono /SK/ davanti a E?", options:["Scherzo","Scena","Scienza","Uscita"], correctAnswer:"Scherzo", tip:"SCHERZO → SCH + E = /SK/. Las demás (Scena, Scienza, Uscita) tienen SC + E/I = /SH/ sin H." },
  { id:"l0_sc_12", lessonId:"0", subtopic:"SC — Dos sonidos (SH y SK)", question:"Completa la regola: SC+E/I = ___, SC+A/O/U = ___", options:["/SH/ e /SK/","/SK/ e /SH/","/S/ e /SK/","/SH/ e /S/"], correctAnswer:"/SH/ e /SK/", tip:"SC ante E/I → /SH/ (scena). SC ante A/O/U → /SK/ (scala). SCH invierte: ante E/I → /SK/ (scherzo)." },

  // ── GLI y GN ────────────────────────────────────────────────────────────
  { id:"l0_gn_1", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Come si pronuncia GN in 'BAGNO' (baño)?", options:["Come la Ñ spagnola","Come G+N separati","Come GN inglese","Come N sola"], correctAnswer:"Come la Ñ spagnola", tip:"GN = Ñ española: BAGNO = baño, SOGNARE = soñar, GNOCCHI = ñoquis." },
  { id:"l0_gn_2", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Quale parola si pronuncia come la Ñ spagnola?", options:["Sognare","Gatto","Scala","Scena"], correctAnswer:"Sognare", tip:"SOGNARE (soñar) → GN = Ñ: so-ÑA-re. Igual que 'soñar' en español." },
  { id:"l0_gn_3", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"In 'GNOCCHI' (ñoquis), come si pronuncia GN?", options:["Non si pronuncia G — GN = /Ñ/","Si pronuncia G+N separati","Come G dura","Come GN inglese"], correctAnswer:"Non si pronuncia G — GN = /Ñ/", tip:"GNOCCHI = /ÑOKKi/. La G no suena por separado — GN es un único sonido Ñ." },
  { id:"l0_gn_4", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Quale di queste parole ha il suono GN (= Ñ)?", options:["Signore","Gatto","Gonna","Gusto"], correctAnswer:"Signore", tip:"SIGNORE (señor) → GN = Ñ: si-ÑO-re. Gatto/Gonna/Gusto tienen G dura normal." },
  { id:"l0_gn_5", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Come si pronuncia 'SOGNARE' (soñar)?", options:["So-ÑA-re (GN = Ñ)","So-GNA-re (G+N)","So-NA-re (N sola)","SHO-ña-re"], correctAnswer:"So-ÑA-re (GN = Ñ)", tip:"SOGNARE → GN = Ñ: /soÑAre/. Exactamente como 'soñar' en español." },
  { id:"l0_gn_6", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Come si pronuncia GLI in 'FIGLIO' (hijo)?", options:["Come LL palatale — suono unico","Come G+L+I separati","Come LI separati","Come Y spagnola"], correctAnswer:"Come LL palatale — suono unico", tip:"GLI es un sonido palatal único, parecido a la LL del español rioplatense: FIGLIO = fi-/ʎ/o." },
  { id:"l0_gn_7", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Quale parola contiene il suono GLI?", options:["Famiglia","Scala","Scena","Gatto"], correctAnswer:"Famiglia", tip:"FAMIGLIA (familia) → GLI palatal. Es uno de los sonidos más difíciles para hispanohablantes." },
  { id:"l0_gn_8", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"In 'AGLIO' (ajo), la I di GLI...", options:["Non si pronuncia come vocale separata","Si pronuncia forte","Forma una sillaba /LI/ separata","È accentata"], correctAnswer:"Non si pronuncia come vocale separata", tip:"AGLIO → GLI es un único sonido. La I no suena como vocal aparte: /AʎO/, no /AGlio/." },
  { id:"l0_gn_9", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Come si pronuncia 'MOGLIE' (esposa)?", options:["MO-/ʎ/e (GLI palatale)","MO-glie (con G separata)","MO-gli-e (3 sillabe)","MO-lie"], correctAnswer:"MO-/ʎ/e (GLI palatale)", tip:"MOGLIE → GLI = sonido palatal único: /MOʎe/. No 3 sílabas separadas, sino 2." },
  { id:"l0_gn_10", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Quale parola ha il suono GLI?", options:["Aglio","Gatto","Scala","Bagno"], correctAnswer:"Aglio", tip:"AGLIO (ajo) → GLI palatal. Bagno → GN = Ñ. Gatto/Scala → sonidos normales." },
  { id:"l0_gn_11", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Quale di questi suoni ha un equivalente DIRETTO in spagnolo?", options:["GN (= Ñ spagnola)","GLI (palatale)","Entrambi","Nessuno dei due"], correctAnswer:"GN (= Ñ spagnola)", tip:"GN = Ñ, existe en español: baño/bagno, señor/signore. GLI no tiene equivalente en español estándar." },
  { id:"l0_gn_12", lessonId:"0", subtopic:"GLI y GN — Sonidos Únicos", question:"Quale coppia usa i suoni GLI e GN rispettivamente?", options:["Figlio / Bagno","Gatto / Scala","Casa / Cena","Scena / Scuola"], correctAnswer:"Figlio / Bagno", tip:"FIGLIO → GLI (palatal). BAGNO → GN (= Ñ). Dos sonidos únicos del italiano." },

  // ── Doppie Consonanti ───────────────────────────────────────────────────
  { id:"l0_dc_1", lessonId:"0", subtopic:"Doppie Consonanti", question:"Cosa succede con le consonanti doppie in italiano?", options:["Si pronunciano più lunghe e tese","Si pronuncia solo una","Cambiano la vocale precedente","Non si pronunciano"], correctAnswer:"Si pronunciano più lunghe e tese", tip:"Las consonantes dobles se pronuncian con más fuerza y duración. No es estético, es fonológico." },
  { id:"l0_dc_2", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale di queste parole significa 'abuelo'?", options:["Nonno","Nono","Noni","Nonni"], correctAnswer:"Nonno", tip:"NONNO (abuelo, NN doble) ≠ NONO (noveno, N simple). La doble cambia el significado." },
  { id:"l0_dc_3", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale parola significa 'pelota'?", options:["Palla","Pala","Pali","Pale"], correctAnswer:"Palla", tip:"PALLA (pelota, LL doble) ≠ PALA (pala, L simple). La doble L suena más larga." },
  { id:"l0_dc_4", lessonId:"0", subtopic:"Doppie Consonanti", question:"'SONNO' significa...", options:["Sueño","Soy / estoy","Suono (sonido)","Sogno (sueño dormido)"], correctAnswer:"Sueño", tip:"SONNO (sueño, NN doble) ≠ SONO (soy/estoy, N simple). La NN alargada cambia el significado." },
  { id:"l0_dc_5", lessonId:"0", subtopic:"Doppie Consonanti", question:"Come si pronuncia la PP in 'CAPPUCCINO'?", options:["Più lunga e tesa della P sola","Come P sola","Non si pronuncia","Come PH inglese"], correctAnswer:"Più lunga e tesa della P sola", tip:"CAPPUCCINO → PP doble: la P se sostiene un momento más. /kap-PUtʃino/." },
  { id:"l0_dc_6", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale parola significa 'sombrero'?", options:["Cappello","Capello","Capelio","Cappelio"], correctAnswer:"Cappello", tip:"CAPPello (sombrero, PP doble) ≠ CAPello (cabello, P simple). Solo la PP los diferencia." },
  { id:"l0_dc_7", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale di queste parole ha una consonante doppia?", options:["Nonna","Luna","Roma","Sera"], correctAnswer:"Nonna", tip:"NONNA (abuela) tiene NN doble: /NON-na/. Luna/Roma/Sera tienen consonantes simples." },
  { id:"l0_dc_8", lessonId:"0", subtopic:"Doppie Consonanti", question:"In 'PIZZA', la ZZ si pronuncia come...", options:["/TS/ allungato — pi-TTSa","/Z/ sola","/DZ/ come 'zero'","/S/"], correctAnswer:"/TS/ allungato — pi-TTSa", tip:"ZZ en pizza = /TS/ prolongado: pi-/TTS/-a. Diferente a la Z de 'zero' (/DZ/)." },
  { id:"l0_dc_9", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale coppia ha significati DIVERSI grazie alla consonante doppia?", options:["Palla / Pala","Rosso / Rossa","Grande / Piccolo","Bello / Brutto"], correctAnswer:"Palla / Pala", tip:"PALLA/PALA son la misma base con significados distintos solo por LL vs L. Par mínimo fonológico." },
  { id:"l0_dc_10", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale parola è scritta correttamente per 'mamá'?", options:["Mamma","Mama","Mam","Mamà"], correctAnswer:"Mamma", tip:"MAMMA (mamá) = MM doble. En italiano las palabras afectivas suelen llevar consonante doble." },
  { id:"l0_dc_11", lessonId:"0", subtopic:"Doppie Consonanti", question:"Come si distingue 'SONO' (soy) da 'SONNO' (sueño) parlando?", options:["La N di 'sonno' dura più a lungo","L'accento è diverso","La O di 'sonno' è aperta","Non c'è differenza nel parlato"], correctAnswer:"La N di 'sonno' dura più a lungo", tip:"SO-no vs SON-no: la doble N dura físicamente más. Es una diferencia real y audible." },
  { id:"l0_dc_12", lessonId:"0", subtopic:"Doppie Consonanti", question:"Quale affermazione sulle doppie consonanti è CORRETTA?", options:["Cambiano il significato della parola","Sono solo un fatto ortografico","Si pronunciano come consonante singola","Si usano solo in parole straniere"], correctAnswer:"Cambiano il significato della parola", tip:"Las consonantes dobles son fonológicas: Nonno/Nono, Palla/Pala, Sono/Sonno. No son solo ortografía." }
];

async function run() {
  // 1. Borrar todos los ejercicios existentes de lessonId "0"
  console.log('Borrando ejercicios existentes de lección 0...');
  const q = query(collection(db, 'exercises'), where('lessonId', '==', '0'));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.log('  (no había ejercicios previos)');
  } else {
    // writeBatch tiene límite de 500 ops — para 72 ejercicios está bien
    const delBatch = writeBatch(db);
    snap.docs.forEach(d => {
      console.log(`  🗑 ${d.id}`);
      delBatch.delete(d.ref);
    });
    await delBatch.commit();
    console.log(`  Eliminados: ${snap.docs.length} ejercicios\n`);
  }

  // 2. Insertar nuevos ejercicios
  console.log('Insertando nuevos ejercicios en italiano...');
  const BATCH_SIZE = 400;
  for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
    const chunk = exercises.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    chunk.forEach(ex => {
      const ref = doc(collection(db, 'exercises'));
      batch.set(ref, ex);
    });
    await batch.commit();
  }

  // Resumen por subtema
  const counts = {};
  exercises.forEach(e => { counts[e.subtopic] = (counts[e.subtopic] || 0) + 1; });
  Object.entries(counts).forEach(([sub, n]) => console.log(`  ✓ ${sub}: ${n} ejercicios`));
  console.log(`\nTotal: ${exercises.length} ejercicios migrados.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
