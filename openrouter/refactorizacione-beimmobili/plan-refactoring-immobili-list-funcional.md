# Refactoring Pagina Lista Immobili — Sottotask

## Contesto generale

La pagina "Lista Immobili" presenta problemi di performance significativi dovuti all'architettura attuale del backend. Gli endpoint coinvolti sono `POST /api/immobili/lista` e `POST /api/immobili/immaginiPrincipali`. L'obiettivo è migliorare i tempi di risposta e allineare il codice agli standard delle sezioni più recenti della PTI, mantenendo la retrocompatibilità dove possibile.

**Effort stimato complessivo: 6–8 giornate**

---

## Sottotask 1 — Introduzione del query object `ListaImmobiliQuery`

**Obiettivo:** Sostituire gli 11 parametri sciolti del metodo `GetListaImmobili` con un unico oggetto strutturato che rappresenti la richiesta di ricerca.

**Descrizione funzionale:**
Attualmente il metodo del service riceve 11 parametri individuali (IdReportPrg, IdGestioneFo, IdSocRif, IdCategoria, IdArea, IdImmobile, IdTipoGestione, mostraVenduti, mostraStorico, filtraAssetAlbero, escludiImmagini). Questa firma è fragile, difficile da estendere e soggetta a errori nell'ordine dei parametri.

Va creato un oggetto `ListaImmobiliQuery` che incapsuli tutti i criteri di ricerca. Il controller costruirà questo oggetto a partire dal `ListaImmobiliRequest` ricevuto dal frontend e lo passerà al service. La logica interna del service non cambia — si modifica solo la firma e il passaggio dei parametri.

**Impatto frontend:** Nessuno. Il contratto dell'endpoint resta invariato.

**Effort stimato: 0,5 giornate**

---

## Sottotask 2 — Separazione dei metadata filtri dall'endpoint di lista

**Obiettivo:** Disaccoppiare il caricamento delle opzioni dei dropdown (combo) dalla ricerca degli immobili, creando un endpoint dedicato per i filtri.

**Descrizione funzionale:**
Oggi l'endpoint `lista` restituisce in un'unica response sia l'elenco degli immobili sia le opzioni di tutti i dropdown (Intestatario, Immobile, Categoria, Tipo Gestione, Gestione FO). Questo significa che ogni volta che l'utente applica un filtro, il backend ricalcola anche tutte le combo — lavoro non necessario perché le opzioni cambiano raramente.

Va creato un nuovo endpoint `POST /api/immobili/filtri` che restituisca esclusivamente i metadata dei filtri (elenco delle opzioni disponibili per ciascun dropdown). La logica attualmente presente nella regione `#region Combo Filtri` del metodo `GetListaImmobili` va estratta in un nuovo metodo del service dedicato.

L'endpoint `lista` non restituirà più le combo: il suo response conterrà solo il report e la lista degli immobili.

**Impatto frontend:** Sì. Il frontend dovrà effettuare due chiamate: una per i filtri (al caricamento iniziale della pagina) e una per la lista (ad ogni ricerca). È possibile mantenere temporaneamente il vecchio endpoint invariato e introdurre il nuovo in parallelo per consentire una migrazione graduale.

**Effort stimato: 1–2 giornate**

---

## Sottotask 3 — Ottimizzazione della query principale con projection

**Obiettivo:** Ridurre il volume di dati estratti dal database selezionando solo le colonne effettivamente necessarie per la lista.

**Descrizione funzionale:**
La query attuale carica tutte le 30+ colonne della tabella `IMM_ASSET` in memoria (inclusi campi come Descrizione, Vincoli, StatoUso, NoteAggiuntive, DestinazioneUso, ecc.) quando la lista ne utilizza solo 16. Su un dataset di centinaia di immobili, questo genera un trasferimento di dati e un consumo di memoria non necessari.

Va introdotta una projection (`.Select()`) nella query LINQ per estrarre esclusivamente i campi richiesti: IdImmobile, DsImmobile, IdIntestatario, DsIntestatario, Latitudine, Longitudine, Indirizzo, CAP, IdCitta, DsCitta, IdNazione, DsNazione, IdTipoGestione, DsTipoGestione, IdGestioneFO, FlagViewContatore.

I metodi helper che attualmente ricevono l'entità completa `AssetImmobili` (come `GetIndirizzoCompleto`) vanno adattati per funzionare con il DTO proiettato.

**Impatto frontend:** Nessuno. Il response dell'endpoint non cambia.

**Effort stimato: 1 giornata**

---

## Sottotask 4 — Eliminazione del problema N+1 nella risoluzione delle categorie

**Obiettivo:** Eliminare le query individuali per la risoluzione della categoria di ciascun immobile, sostituendole con un'unica query batch.

**Descrizione funzionale:**
All'interno del ciclo `foreach` che elabora ogni immobile, vengono invocati i metodi `GetNodoImmobilizzazione()` e `GetCategoria()` per ciascun elemento. Se questi metodi eseguono query al database (come è molto probabile), con 200 immobili si generano circa 400 query aggiuntive — un classico problema N+1.

La soluzione consiste nel risolvere tutte le categorie prima del ciclo, con una singola query che restituisca un dizionario `Dictionary<int, CategoriaImmobile>` indicizzato per `IdImmobile`. All'interno del ciclo, il lookup si effettua sul dizionario anziché tramite chiamate al database.

Il fallback per gli immobili fuori albero (che utilizza `categorieImmobiliNoAlbero`) deve continuare a funzionare integrato nel dizionario.

**Impatto frontend:** Nessuno. Il response dell'endpoint non cambia.

**Effort stimato: 1–2 giornate**

---

## Sottotask 5 — Ottimizzazione dei conteggi progetti, attività e cantieri

**Obiettivo:** Valutare e ottimizzare le tre query separate che calcolano il numero di progetti, attività e cantieri per immobile.

**Descrizione funzionale:**
Attualmente vengono invocati tre metodi distinti prima del ciclo principale: `GetNumCantieriPerImmobile`, `GetNumProgettiPerImmobile` e `GetNumAttivitaPerImmobile`. Ciascuno esegue una query filtrata per la lista di `IdImmobile`.

Va verificato che ciascun metodo lavori effettivamente in batch (una query per tutti gli immobili, non una per ciascuno). Se possibile, le tre query vanno unificate in una sola che restituisca i tre conteggi raggruppati per immobile, riducendo i round-trip al database.

**Impatto frontend:** Nessuno. Il response dell'endpoint non cambia.

**Effort stimato: 0,5 giornate**

---

## Sottotask 6 — Ottimizzazione e correzione bug dell'endpoint immagini

**Obiettivo:** Correggere un bug critico nella query di filtro delle immagini e ottimizzare il consumo di memoria dell'endpoint `immaginiPrincipali`.

**Descrizione funzionale:**
L'endpoint presenta due problemi:

**Bug di precedenza operatori:** La clausola `Where` attuale contiene un errore logico. Quando la lista `idImmobili` contiene elementi, l'operatore ternario restituisce solo `idImmobili.Contains(i.IdImmobile)` senza applicare i filtri `FlagImgPrincipale == 1` e `IdReport == idReport`. Questo significa che vengono potenzialmente restituite immagini non principali e di report diversi. La condizione va riscritta con parentesi esplicite o con una costruzione lineare del predicato.

**Consumo di memoria:** La query carica il campo `FileByte` (base64 completo dell'immagine) di tutte le immagini in memoria prima del resize. Con centinaia di immobili e immagini di diverse centinaia di KB ciascuna, il consumo è significativo. Va introdotta una projection nella query per evitare il passaggio tramite AutoMapper e caricare solo i campi necessari.

**Impatto frontend:** Il contratto dell'endpoint non cambia, ma dopo la correzione del bug il set di immagini restituite potrebbe essere diverso (più corretto) rispetto al comportamento attuale.

**Effort stimato: 1 giornata**

---

## Sottotask 7 — Semplificazione del response model della lista

**Obiettivo:** Ripulire e semplificare i modelli di risposta dell'endpoint lista, eliminando l'annidamento non necessario e standardizzando il naming.

**Descrizione funzionale:**
Dopo la separazione dei filtri (Sottotask 2), il modello `ListaImmobiliView` va semplificato. Attualmente contiene un oggetto `ImmobileLite` che a sua volta annida un `ImmobileLiteModel` con le proprietà anagrafiche — un doppio livello di wrapping non necessario.

Va creato un modello piatto `ImmobileLiteDto` che contenga direttamente tutte le proprietà necessarie per il rendering della card nella lista (id, descrizione, indirizzo completo, valore, conteggi, categoria, tipo gestione, gestione FO, intestatario, coordinate). Le immagini non vanno incluse perché arrivano dall'endpoint separato.

Il response va rinominato in `ListaImmobiliResponse` e deve contenere solo la lista degli `ImmobileLiteDto`, il conteggio totale e il report.

Il naming va standardizzato: `Ds` → `Descrizione`, `Vl` → `Valore`, ecc.

**Impatto frontend:** Sì. La struttura del JSON cambia. Va coordinata la modifica con il team frontend. Si consiglia di implementare questa sottotask insieme all'adeguamento frontend, oppure di mantenere temporaneamente il vecchio modello e introdurre il nuovo in un endpoint versioned.

**Effort stimato: 1 giornata**

---

## Sottotask 8 — Caricamento differito dei report patrimoniali

**Obiettivo:** Evitare il caricamento dei report patrimoniali quando la ricerca non produce risultati.

**Descrizione funzionale:**
All'inizio del metodo `GetListaImmobili` vengono caricati quattro report: `GetMainReport`, `GetPrgReport`, `GetPatReport` (IS) e `GetPatReport` (MP). I report patrimoniali (`PatReport`) servono solo per recuperare i valori degli immobili e per il filtro dell'albero patrimoniale — operazioni che avvengono dopo il check che verifica la presenza di risultati.

Se la query principale non restituisce immobili, i PatReport vengono caricati inutilmente. Lo spostamento della loro inizializzazione a dopo il controllo `if (listaImmobili.Count == 0)` evita due chiamate al database nei casi in cui il risultato è vuoto.

**Impatto frontend:** Nessuno. Il response dell'endpoint non cambia.

**Effort stimato: 0,5 giornate**

---

## Riepilogo impatti frontend

| Sottotask | Impatto frontend | Note                                                          |
| --------- | ---------------- | ------------------------------------------------------------- |
| 1         | Nessuno          | Refactoring interno                                           |
| 2         | **Sì**           | Nuova chiamata per i filtri; migrazione graduale possibile    |
| 3         | Nessuno          | Refactoring interno                                           |
| 4         | Nessuno          | Refactoring interno                                           |
| 5         | Nessuno          | Refactoring interno                                           |
| 6         | **Minimo**       | Possibile variazione nel set di immagini restituite (bug fix) |
| 7         | **Sì**           | Cambio struttura JSON response; coordinamento necessario      |
| 8         | Nessuno          | Refactoring interno                                           |

## Ordine di esecuzione consigliato

**Fase 1 — Senza impatto frontend (eseguibili subito):**
Sottotask 1 → 3 → 4 → 5 → 8

**Fase 2 — Con coordinamento frontend:**
Sottotask 2 → 7

**Fase 3 — Bug fix (da validare):**
Sottotask 6
