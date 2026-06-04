# Refactoring Modulo Immobili — Sottotask 9-17

## Contesto generale

Queste sottotask coprono il refactoring degli endpoint della scheda immobile e delle relative sotto-pagine (costi, dettaglio costi, ore lavorate, consumi utenze). Si aggiungono alle Sottotask 1-8 già definite per la pagina Lista Immobili.

Gli endpoint coinvolti:

| Endpoint                             | Pagina                    |
| ------------------------------------ | ------------------------- |
| `POST schedaImmobile`                | Scheda dettaglio immobile |
| `POST schedaImmobile/costi`          | Tab costi                 |
| `POST schedaImmobile/dettaglioCosti` | Drilldown costi           |
| `POST schedaImmobile/oreLavorate`    | Tab ore lavorate          |
| `POST schedaImmobile/consumiUtenze`  | Tab consumi utenze        |

**Effort stimato complessivo (sottotask 9-17): 12–13 giornate**
**Effort totale modulo (sottotask 1-17): 18–21 giornate**

---

## Sottotask 9 — Eliminazione query ridondanti in `GetSchedaImmobile`

**Obiettivo:** Ridurre drasticamente il numero di round-trip al database nel metodo che costruisce la scheda dettaglio di un immobile.

**Descrizione funzionale:**
Il metodo `GetSchedaImmobile` genera attualmente tra 20 e 40 query al database per una singola richiesta. Molte di queste sono ridondanti o evitabili:

Il calcolo del valore dell'immobile (`GetValoreImmobile`) carica internamente un PatReport che è già disponibile nel contesto del metodo chiamante — i PatReport IS e MP vengono caricati poche righe prima ma non vengono riutilizzati per questa operazione. Va eliminata la chiamata aggiuntiva e riutilizzato il PatReport già in memoria.

Le ore lavorate vengono calcolate due volte (anno corrente e anno precedente) tramite `GetTotaleOreLavorate`, che per ciascuna invocazione carica la lista dei progetti dell'immobile e poi esegue la somma sui timereport. Poche righe sotto, la stessa lista di progetti viene ricaricata per costruire le liste di progetti, attività e cantieri. La lista dei progetti va caricata una sola volta e riutilizzata sia per il calcolo delle ore sia per la costruzione delle liste.

La risoluzione della categoria dell'immobile avviene tramite `GetNodoImmobilizzazione`, un metodo ricorsivo che esegue una query al database per ogni livello dell'albero patrimoniale (mediamente 3-4 query). Va sostituito con una query diretta che risolva il nodo di livello 3 in un singolo accesso.

La catena di PrgReport (corrente + precedente) viene caricata con due chiamate separate e va unificata.

**Impatto frontend:** Nessuno. Il contratto dell'endpoint e la struttura del response restano invariati.

**Effort stimato: 2 giornate**

---

## Sottotask 10 — Eliminazione N+1 nel caricamento progetti dell'immobile

**Obiettivo:** Sostituire le query individuali per le aree extra di ciascun progetto con un'unica query batch e rimuovere i metodi wrapper privi di logica.

**Descrizione funzionale:**
Il metodo `GetProgettiImmobile` viene invocato tre volte nella scheda immobile (per progetti, attività e cantieri). Per ciascun progetto nell'elenco, il metodo esegue `GetAreeExtraProgetto`, che effettua una query individuale al database per recuperare le aree extra associate. Con 20 progetti attivi si generano 20 query aggiuntive.

La soluzione prevede di caricare tutte le aree extra per tutti i progetti dell'immobile in un'unica query prima del ciclo, organizzandole in un dizionario indicizzato per IdProgetto. Il lookup nel ciclo avviene sul dizionario anziché tramite accesso al database.

Inoltre, il metodo utilizza quattro wrapper (`GetDataInizioPrevistaProgetto`, `GetDataFinePrevistaProgetto`, `GetStatoProgetto`, `GetValoreProgetto`) che non contengono logica di business significativa: i primi due restituiscono direttamente una proprietà dell'entità, gli ultimi due contengono logica semplice che non richiede accesso al database. Questi wrapper vanno eliminati e la logica va incorporata direttamente nel punto di utilizzo.

**Impatto frontend:** Nessuno. Il contratto dell'endpoint e la struttura del response restano invariati.

**Effort stimato: 0,5 giornate**

---

## Sottotask 11 — Eliminazione N+1 nel caricamento costi per nodo

**Obiettivo:** Sostituire le query individuali per nodo/anno nella costruzione dell'albero costi con un'unica query batch.

**Descrizione funzionale:**
Nel metodo `GetCostiImmobile`, per ciascun nodo dell'albero costi vengono eseguite fino a 3 query al database (una per ogni anno: corrente, precedente, precedente -2) per recuperare il valore consuntivo. Con un albero di 30 nodi, questo genera potenzialmente 90 query al database per una singola richiesta.

La soluzione prevede di caricare tutti i costi per tutti i nodi e per tutti gli anni rilevanti in un'unica query, costruendo un dizionario indicizzato per la coppia (IdReport, IdNodo). Nel ciclo che elabora i nodi dell'albero, il lookup avviene sul dizionario anziché tramite query individuali.

Questo approccio va applicato a entrambi i rami del metodo: sia per la gestione IS (tabella `RliCostiPerNodo`) sia per la gestione MP (tabella `Costi`), ciascuno con il proprio dizionario.

Per quanto riguarda le 3 chiamate a `_patrimonioService.GetDettaglioMovimentazione` (una per anno) relative agli investimenti, va verificato se il servizio esterno supporta query batch. In caso contrario, le chiamate vengono mantenute ma documentate come punto di attenzione per future ottimizzazioni.

**Impatto frontend:** Nessuno. Il contratto dell'endpoint e la struttura del response (albero costi, grafici, investimenti) restano invariati.

**Effort stimato: 1,5 giornate**

---

## Sottotask 12 — Unificazione branching IS/MP nei metodi costi

**Obiettivo:** Eliminare la duplicazione di codice tra i rami di gestione IS e MP nei metodi `GetCostiImmobile` e `GetDettaglioCostiImmobile`.

**Descrizione funzionale:**
Entrambi i metodi contengono due rami quasi identici che differiscono esclusivamente nelle tabelle sorgente dei dati: `RliDsAlbero` e `RliCostiPerNodo` per la gestione IS (IdGestioneFO 1, 3, 0), `SdvNodoAlbero` e `Costi` per la gestione MP (IdGestioneFO 2). La logica di costruzione dell'albero, il calcolo dei costi per anno, la generazione dei dati per il grafico e la costruzione dei filtri nel dettaglio sono identiche nei due rami.

Questa duplicazione raddoppia il codice da manutenere e crea un rischio concreto: un fix o un miglioramento applicato a un ramo viene facilmente dimenticato nell'altro.

La soluzione prevede di introdurre metodi privati parametrici che astraggano la differenza nella sorgente dati. Un metodo `GetNodiAlberoCosti` seleziona i nodi dalla tabella corretta in base al tipo di gestione. Un metodo `GetCostiPerNodoBatch` carica i valori dalla tabella corretta. La logica del ciclo, dell'albero e del grafico viene scritta una sola volta e opera su un modello interno unificato.

Lo stesso approccio va applicato a `GetDettaglioCostiImmobile` per la costruzione dei dettagli e dei filtri.

**Impatto frontend:** Nessuno. Il contratto degli endpoint e la struttura dei response restano invariati.

**Effort stimato: 2 giornate**

---

## Sottotask 13 — Separazione metadata filtri dagli endpoint ore lavorate e dettaglio costi

**Obiettivo:** Applicare lo stesso pattern della Sottotask 2 (separazione filtri della lista) agli endpoint di ore lavorate e dettaglio costi, creando endpoint dedicati per i metadata dei filtri.

**Descrizione funzionale:**
Gli endpoint `schedaImmobile/oreLavorate` e `schedaImmobile/dettaglioCosti` costruiscono le opzioni dei dropdown (combo) all'interno del response principale, nello stesso modo della lista immobili prima del refactoring. Questo obbliga a ricalcolare i metadata dei filtri ad ogni richiesta filtrata, accoppiando dati e metadati UI nello stesso payload.

Per l'endpoint ore lavorate, le combo coinvolte sono: Utente, Interno/Esterno, Area. Per il dettaglio costi: Competenza, Fornitore, Anno.

Per ciascun endpoint vanno creati:

- Un nuovo endpoint dedicato per i metadata filtri (`POST schedaImmobile/oreLavorate/filtri` e `POST schedaImmobile/dettaglioCosti/filtri`)
- Un modello di metadata filtri dedicato
- Un metodo nel service che costruisca esclusivamente le opzioni delle combo

La logica di costruzione delle combo va estratta dai metodi attuali e spostata nei nuovi metodi. I response principali (`OreUtentiPerImmobileView` e `DettaglioCostiImmobileView`) vengono semplificati eliminando la proprietà `Filtri`.

**Impatto frontend:** Sì. Il frontend dovrà effettuare chiamate separate per i filtri al caricamento di ciascuna tab. È possibile mantenere temporaneamente i vecchi endpoint invariati e introdurre i nuovi in parallelo per consentire una migrazione graduale, come previsto per la lista (Sottotask 2).

**Effort stimato: 1,5 giornate**

---

## Sottotask 14 — Ottimizzazione ore lavorate: projection e filtri server-side

**Obiettivo:** Ridurre il volume di dati caricati in memoria dal metodo `GetOreUtentiPerImmobile` e spostare la logica di filtro a livello SQL.

**Descrizione funzionale:**
Il metodo carica tutti i record di timereport associati ai progetti dell'immobile senza un filtro temporale adeguato — l'unico vincolo è `DataTimereport <= report.DataRiferimento`, che include potenzialmente anni di storico. I dati vengono interamente caricati in memoria, raggruppati e poi filtrati per utente, tipologia interno/esterno e area.

Le ottimizzazioni da applicare:

La query va limitata ai soli 3 anni utilizzati nella visualizzazione (anno corrente, -1, -2), aggiungendo un filtro `DataTimereport.Year >= annoCorrente - 2`.

I filtri per utente, tipologia e area, attualmente applicati in memoria dopo il caricamento completo dei dati, vanno spostati nella clausola Where della query LINQ per farli eseguire a livello SQL. Questo riduce significativamente il volume di dati trasferito dal database.

Va introdotta una projection per selezionare solo i campi necessari al raggruppamento e alla somma (IdUtente, NomeEsteso, FlagEsterno, DsEsterno, IdAreaUtente, DsAreaUtente, Durata, Anno) anziché caricare l'intera entità Timereport.

Va valutato se il raggruppamento e la somma possono essere eseguiti a livello SQL, portando in memoria solo i risultati aggregati.

**Impatto frontend:** Nessuno. Il contratto dell'endpoint e la struttura del response restano invariati.

**Effort stimato: 1 giornata**

---

## Sottotask 15 — Semplificazione consumi utenze

**Obiettivo:** Ottimizzare il metodo `GetConsumiUtenze` e semplificare il pattern ripetitivo nel response model.

**Descrizione funzionale:**
Il metodo carica tutti i consumi dell'immobile e poi filtra in memoria per classe (Elettricità, Acqua, Gas) e per data. L'intervento è di entità minore rispetto agli altri endpoint.

Le ottimizzazioni da applicare:

Il filtro per data va spostato a livello SQL per evitare di caricare dati storici non necessari alla visualizzazione corrente.

Il pattern booleano ripetitivo (caricamento consumo per classe → verifica presenza → impostazione flag di visibilità) viene ripetuto identicamente per ciascuna classe. Va semplificato: la visibilità della tab può essere determinata direttamente dalla presenza o assenza del dato, eliminando i flag booleani espliciti o, se il frontend li richiede, derivandoli automaticamente.

**Impatto frontend:** Potenziale, in base alla scelta di ristrutturazione del response. Se si mantengono le proprietà esistenti per classe con la sola semplificazione interna, l'impatto è nullo. Se si decide di passare a una struttura dinamica (lista di consumi per classe), va coordinato con il frontend.

**Effort stimato: 0,5 giornate**

---

## Sottotask 16 — Centralizzazione del caricamento della catena di report

**Obiettivo:** Creare un metodo condiviso per caricare la catena di report multi-anno (corrente → precedente → precedente -2), evitando la ripetizione in ogni endpoint.

**Descrizione funzionale:**
Almeno tre metodi del service (`GetSchedaImmobile`, `GetCostiImmobile`, `GetDettaglioCostiImmobile`) eseguono lo stesso pattern: caricare un report, poi caricare il report precedente tramite il suo IdReportPrec, poi caricare il report ancora precedente. Ciascun passo è una chiamata individuale a `_generalService.GetRliReport` o `_generalService.GetPrgReport`, totalizzando 3 chiamate sequenziali per catena.

Questo pattern viene ripetuto in modo leggermente diverso in ogni metodo, con logica aggiuntiva per gestire i null e per allineare l'anno del report RLI con l'anno del report PRG.

Va creato un metodo helper nel service che centralizzi la risoluzione della catena, accettando l'ID del report iniziale e restituendo una tupla (Corrente, Meno1, Meno2) con gestione dei null integrata. Lo stesso va fatto per la catena di PrgReport dove applicabile.

Tutti i metodi che attualmente costruiscono la catena manualmente vanno modificati per utilizzare il helper centralizzato.

**Impatto frontend:** Nessuno.

**Effort stimato: 1 giornata**

---

## Sottotask 17 — Modernizzazione modelli: inizializzazioni, naming e pulizia

**Obiettivo:** Applicare le convenzioni C# moderno a tutti i modelli del modulo, standardizzare il naming e rimuovere codice senza valore aggiunto.

**Descrizione funzionale:**
Intervento trasversale su tutti i modelli, filtri e helper del modulo.

**Inizializzazioni:** Tutti i costruttori che si limitano a inizializzare liste vuote vanno sostituiti con collection expressions di C# 12 (`= []`), eliminando il costruttore. Questo coinvolge: `FilterListaImmobili`, `FilterOreUtentePerImmobile`, `FilterDettaglioCostiImmobile`, `ImmaginiImmobiliRequest`, `ImmaginiPrincipaliImmobiliResponse`, `CostiImmobileView`, `ListaImmobiliView`, `OreUtentiPerImmobileView`, `DettaglioCostiImmobileView`, `AlberoCostiImmobile`, `GraficoCostiImmobile`.

**Eliminazione switch hardcoded:** Il metodo `GetCategoria` contiene un switch con 4 ID fissi (5721, 5720, 5723, 7410) associati a stringhe di categoria. Va convertito in un dizionario statico o in una configurazione esternalizzata, eliminando la logica procedurale in favore di un lookup dichiarativo.

**Standardizzazione naming:** Le abbreviazioni legacy vanno gradualmente sostituite con nomi descrittivi nei modelli di response: `Ds` → `Descrizione`, `Vl` → `Valore`, `Fg`/`Flag` → booleani nativi, `Xn` → nome descrittivo. Per mantenere la compatibilità con il frontend durante la transizione, va utilizzato l'attributo `[JsonPropertyName("nomeOriginale")]` sui modelli di response, permettendo di rinominare le proprietà internamente senza modificare il JSON serializzato.

**Impatto frontend:** Sì, ma mitigato dal bridge `[JsonPropertyName]`. Finché gli attributi sono presenti, il JSON prodotto resta identico. La rimozione degli attributi va coordinata con il frontend quando sarà pronto ad adottare i nuovi nomi.

**Effort stimato: 2 giornate**

---

## Riepilogo impatti frontend

| Sottotask | Impatto frontend  | Note                                                       |
| --------- | ----------------- | ---------------------------------------------------------- |
| 9         | Nessuno           | Ottimizzazione interna                                     |
| 10        | Nessuno           | Ottimizzazione interna                                     |
| 11        | Nessuno           | Ottimizzazione interna                                     |
| 12        | Nessuno           | Refactoring strutturale                                    |
| 13        | **Sì**            | Nuove chiamate per i filtri; migrazione graduale possibile |
| 14        | Nessuno           | Ottimizzazione interna                                     |
| 15        | **Potenziale**    | Solo se si ristruttura il response dei consumi             |
| 16        | Nessuno           | Refactoring interno                                        |
| 17        | **Sì (mitigato)** | Bridge [JsonPropertyName] per compatibilità temporanea     |

## Ordine di esecuzione consigliato

**Fase 1 — Quick wins senza impatto frontend (eseguibili subito):**
Sottotask 10 → 16 → 9 → 11 → 14

**Fase 2 — Refactoring strutturali senza impatto frontend:**
Sottotask 12 → 15

**Fase 3 — Con coordinamento frontend:**
Sottotask 13 → 17

---

## Riepilogo generale del modulo (Sottotask 1-17)

| Ambito          | Sottotask | Effort             |
| --------------- | --------- | ------------------ |
| Pagina Lista    | 1–8       | 6–8 giornate       |
| Scheda Immobile | 9–10      | 2,5 giornate       |
| Costi           | 11–12     | 3,5 giornate       |
| Ore lavorate    | 13–14     | 2,5 giornate       |
| Consumi utenze  | 15        | 0,5 giornate       |
| Trasversali     | 16–17     | 3 giornate         |
| **Totale**      | **1–17**  | **18–21 giornate** |
