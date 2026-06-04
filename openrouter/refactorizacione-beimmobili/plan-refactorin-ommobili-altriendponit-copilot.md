# Plan de refactoring — Módulo Immobili (Sottotask 9-17)

## Diagnóstico de performance por endpoint

### `GetSchedaImmobile` — 20-40 queries por request

- 6-7 llamadas a GeneralService para cargar reports
- `GetNodoImmobilizzazione` recursivo (3-4 queries por inmueble)
- `GetValoreImmobile` carga un PatReport que ya estaba disponible
- `GetTotaleCosti` x2 y `GetTotaleOreLavorate` x2 (4-8 queries)
- `GetProgettiImmobile` con N+1 en `GetAreeExtraProgetto` (1 query por proyecto)
- Wrappers sin lógica (`GetDataInizioPrevistaProgetto`, etc.)

### `GetCostiImmobile` — Hasta 90+ queries

- Per ogni nodo dell'albero: 3 queries (una per anno) a RliCostiPerNodo/Costi
- Con 30 nodi = 90 queries solo per i costi
- 3 llamadas a `_patrimonioService.GetDettaglioMovimentazione`
- Branching IS/MP duplicado (mismo código x2, tablas distintas)

### `GetDettaglioCostiImmobile` — Branching duplicado + filtros acoplados

- Mismo branching IS/MP que GetCostiImmobile
- Filtros construidos dentro del response
- Lookup ineficiente en el foreach de mapping

### `GetOreUtentiPerImmobile` — Carga todo en memoria

- Todos los timereport sin límite temporal significativo
- Filtros aplicados post-carga en memoria
- Filtros construidos dentro del response

### `GetConsumiUtenze` — Problemas menores

- Filtrado in-memory por clase
- Pattern booleano repetitivo

---

## Pasos de ejecución

---

### PASO 9 — Optimizar `GetSchedaImmobile`: eliminar queries redundantes

El método hace 20-40 queries. Muchas son redundantes: carga reports que ya tiene, recalcula datos que podría reusar.

**Qué hacer:**

- Reusar el PatReport ya cargado para el valor del inmueble
- Cargar proyectos una sola vez y reusarlos para horas + listas
- Reemplazar `GetNodoImmobilizzazione` recursivo por query directa
- Unificar la carga de PrgReport corrente + precedente

**Prompt para Copilot:**

```
PASO 9: Optimizar GetSchedaImmobile eliminando queries redundantes.

Contexto: El método GetSchedaImmobile en ImmobiliService.cs genera 20-40 queries
al database por cada request. Necesito reducirlo drásticamente.

Cambios necesarios:

1. REUSAR PatReport para el valor del inmueble:
   Actualmente se llama GetValoreImmobile(idReportPat, immobile) que internamente
   carga OTRO PatReport con _generalService.GetPatReport(idReportPat).
   Pero ya tenemos patReportIS y patReportMP cargados unas líneas antes.

   Reemplaza la llamada a GetValoreImmobile por una consulta directa:
   - Busca el inmueble en AssetComposizione usando los IdReport de los PatReport
     ya cargados (listaIdPatReport)
   - Si no está, busca en DatiImmobiliNoAlbero
   - Elimina la necesidad de cargar un PatReport adicional

2. CARGAR PROYECTOS UNA SOLA VEZ:
   Actualmente los proyectos del inmueble se cargan para:
   a) GetTotaleOreLavorate (que internamente carga los IdProgetto)
   b) La query directa que carga los Progetto completos para listaProgetti/Attivita/Cantieri

   Carga la lista de IdProgetto UNA sola vez al principio, y reúsala tanto
   para el cálculo de horas (query sobre Timereport filtrada por esos IDs)
   como para cargar los proyectos completos.

3. REEMPLAZAR GetNodoImmobilizzazione recursivo:
   El método actual hace queries recursivas (1 query por nivel del árbol)
   para encontrar el nodo de nivel 3.

   Muéstrame primero el contenido de la tabla PatNodoAlbero para entender
   si es posible hacer un JOIN o una query con subquery que resuelva
   directamente el nodo de nivel 3 para un IdAsset dado, en una sola query.

   Si no es factible, al menos cachea el resultado en un diccionario local
   del método.

4. UNIFICAR CARGA DE ORE:
   Actualmente se llama GetTotaleOreLavorate dos veces (año corrente + precedente).
   Cada llamada hace 2 queries (proyectos + timereport).

   Crea un método que calcule las horas para ambos períodos en una sola
   operación, reusando la lista de IdProgetto del punto 2.

   Ejemplo:
   var (oreCorrente, orePrecedente) = GetOreLavoratePerPeriodi(
       idProgettiImmobile, report, reportPrecedente);

5. NO cambies el response model ImmobileView ni SchedaImmobile.
   Solo optimiza las queries internas.

Muéstrame el método GetSchedaImmobile completo refactorizado.
```

---

### PASO 10 — Eliminar N+1 en `GetProgettiImmobile`

Cada proyecto genera una query individual para las aree extra. Con 20 proyectos = 20 queries extra.

**Qué hacer:**

- Cargar todas las aree extra en batch antes del ciclo
- Eliminar wrappers sin lógica
- Mapear inline

**Prompt para Copilot:**

```
PASO 10: Eliminar N+1 en GetProgettiImmobile.

Contexto: En ImmobiliService.cs, el método GetProgettiImmobile recibe una lista
de Progetto y para CADA uno llama a GetAreeExtraProgetto(progetto), que ejecuta:
  _context.AreeExtraProgetto.Where(a => a.IdProgetto == progetto.IdProgetto).ToList()
Esto genera N queries (una por proyecto).

Además hay 4 wrappers inútiles:
- GetDataInizioPrevistaProgetto(progetto) → return progetto.DataInizioPrevista
- GetDataFinePrevistaProgetto(progetto) → return progetto.DataFinePrevista
- GetStatoProgetto(progetto) → lógica simple sin acceso a DB
- GetValoreProgetto(progetto) → lógica simple sin acceso a DB

Cambios necesarios:

1. BATCH de aree extra:
   ANTES del ciclo en GetProgettiImmobile (o mejor, antes de las 3 llamadas
   a GetProgettiImmobile en GetSchedaImmobile), carga todas las aree extra
   para todos los proyectos del inmueble en UNA query:

   var todosIdProgetti = progetti.Select(p => p.IdProgetto).ToList();
   var areeExtraDict = _context.AreeExtraProgetto
       .Where(a => todosIdProgetti.Contains(a.IdProgetto))
       .GroupBy(a => a.IdProgetto)
       .ToDictionary(g => g.Key, g => g.ToList());

   Dentro del ciclo:
   AreeExtra = areeExtraDict.GetValueOrDefault(progetto.IdProgetto, new List<AreeExtraProgetto>())

2. ELIMINAR WRAPPERS:
   Reemplaza las llamadas a los 4 wrapper methods por acceso directo:
   - DataInizioPrevista = progetto.DataInizioPrevista
   - DataFinePrevista = progetto.DataFinePrevista
   - Stato = (inline la lógica de GetStatoProgetto)
   - Valore = progetto.IdTipologia == 1 ? progetto.ValoreAttivita : progetto.ValoreProgetto

3. Modifica la firma de GetProgettiImmobile para recibir el diccionario
   de aree extra como parámetro, así no se recalcula en cada llamada.

4. Elimina los 5 métodos privados que ya no se usan:
   GetAreeExtraProgetto, GetDataInizioPrevistaProgetto,
   GetDataFinePrevistaProgetto, GetStatoProgetto, GetValoreProgetto

Muéstrame el código completo del método GetProgettiImmobile refactorizado
y las llamadas en GetSchedaImmobile que lo invocan.
```

---

### PASO 11 — Eliminar N+1 en `GetCostiImmobile`

30 nodos × 3 años = 90 queries individuales para cargar costos.

**Qué hacer:**

- Cargar todos los costos por nodo en batch
- Hacer lookup en diccionario

**Prompt para Copilot:**

```
PASO 11: Eliminar N+1 en GetCostiImmobile.

Contexto: En ImmobiliService.cs, el método GetCostiImmobile tiene dos ramas
(IS y MP). En la rama IS, para cada nodo del albero:

  foreach (var nodo in nodiAlbero)
  {
      costoAnnoAttuale = _context.RliCostiPerNodo
          .Where(p => p.IdReport == RliReportAnnoCorrente.IdReport && p.IdNodo == nodo.IdNodo)
          .Select(s => s.Val_Consuntivo_Sem2).FirstOrDefault();
      // ... misma query para AnnoMeno1 y AnnoMeno2
  }

Con 30 nodos son 90 queries al database.

En la rama MP es igual pero con _context.Costi:
  costoAnnoAttuale = _context.Costi
      .Where(p => p.IdReport == ... && p.IdCompetenza == nodo.IdCompetenza && p.IdCategoria == idImmobile)
      .Select(s => s.ValConsuntivoSem2).FirstOrDefault();

Cambios necesarios:

1. RAMA IS — Cargar todos los costos en batch:

   Recopila todos los IdReport relevantes:
   var idReports = new[] { RliReportAnnoCorrente?.IdReport,
                           RliReportAnnoMeno1?.IdReport,
                           RliReportAnnoMeno2?.IdReport }
                   .Where(id => id.HasValue && id > 0)
                   .Select(id => id.Value)
                   .ToList();

   Carga todos los costos de una vez:
   var todosCostos = _context.RliCostiPerNodo
       .Where(p => idReports.Contains(p.IdReport))
       .Select(s => new { s.IdReport, s.IdNodo, s.Val_Consuntivo_Sem2 })
       .ToList()
       .ToDictionary(x => (x.IdReport, x.IdNodo), x => x.Val_Consuntivo_Sem2);

   En el foreach, reemplaza cada query por:
   costoAnnoAttuale = todosCostos.GetValueOrDefault(
       (RliReportAnnoCorrente.IdReport, nodo.IdNodo), 0);

2. RAMA MP — Mismo approach con _context.Costi:

   var todosCostosMP = _context.Costi
       .Where(p => idReports.Contains(p.IdReport) && p.IdCategoria == idImmobile)
       .Select(s => new { s.IdReport, s.IdCompetenza, s.ValConsuntivoSem2 })
       .ToList()
       .ToDictionary(x => (x.IdReport, x.IdCompetenza), x => x.ValConsuntivoSem2);

3. NO cambies la estructura del response ni del albero.
   Solo optimiza las queries internas.

Muéstrame el método GetCostiImmobile completo refactorizado.
```

---

### PASO 12 — Unificar branching IS/MP

El mismo código está duplicado en `GetCostiImmobile` y `GetDettaglioCostiImmobile`, cambiando solo las tablas.

**Prompt para Copilot:**

```
PASO 12: Unificar el branching IS/MP en GetCostiImmobile y GetDettaglioCostiImmobile.

Contexto: Ambos métodos tienen dos ramas casi idénticas:
  if (idGestioneFo == 1 || idGestioneFo == 3 || idGestioneFo == 0) { /* rama IS */ }
  else if (idGestioneFo == 2) { /* rama MP */ }

La lógica es la misma, cambian las tablas:
  - IS: RliDsAlbero + RliCostiPerNodo
  - MP: SdvNodoAlbero + Costi

Cambios necesarios:

1. Crea dos métodos privados que abstraigan la diferencia:

   private List<NodoAlberoCosti> GetNodiAlberoCosti(int idGestioneFo, long idReport, long idImmobile)
   {
       if (idGestioneFo == 1 || idGestioneFo == 3 || idGestioneFo == 0)
           return _context.RliDsAlbero
               .Where(w => w.IdReport == idReport && w.IdImmobile == idImmobile)
               .OrderBy(o => o.Livello).ThenBy(o => o.Ordinamento ?? 0)
               .Select(n => new NodoAlberoCosti { Id = n.IdNodo, ... })
               .ToList();
       else
           return _context.SdvNodoAlbero
               .Where(p => p.IdReport == idReport)
               .Select(n => new NodoAlberoCosti { Id = n.IdCompetenza, ... })
               .ToList();
   }

   private Dictionary<(long, int), decimal> GetCostiPerNodoBatch(
       int idGestioneFo, List<long> idReports, long? idImmobile)
   {
       if (idGestioneFo == 1 || idGestioneFo == 3 || idGestioneFo == 0)
           return _context.RliCostiPerNodo
               .Where(p => idReports.Contains(p.IdReport))
               .ToDictionary(...);
       else
           return _context.Costi
               .Where(p => idReports.Contains(p.IdReport) && p.IdCategoria == idImmobile)
               .ToDictionary(...);
   }

2. Crea un DTO interno NodoAlberoCosti que unifique los campos comunes:
   private class NodoAlberoCosti
   {
       public int Id { get; set; }
       public string Descrizione { get; set; }
       public int IdPadre { get; set; }
       public int Livello { get; set; }
       public int? IdLiquidita { get; set; }  // solo IS
       public string? FlagMostraNodo { get; set; }  // solo MP
   }

3. Refactoriza GetCostiImmobile para que use estos métodos
   en vez de los dos ramos duplicados. La lógica del foreach,
   construcción del albero y del gráfico se escribe una sola vez.

4. Aplica lo mismo a GetDettaglioCostiImmobile.

Muéstrame ambos métodos refactorizados completos.
```

---

### PASO 13 — Separar filtros de `oreLavorate` y `dettaglioCosti`

Mismo refactoring que hicimos en el paso 2 para la lista, pero para estos dos endpoints.

**Prompt para Copilot:**

```
PASO 13: Separar filtros de GetOreUtentiPerImmobile y GetDettaglioCostiImmobile.

Aplica el mismo pattern que ya aplicamos en el PASO 2 (separación de filtros
de la lista) a estos dos endpoints.

Para GetOreUtentiPerImmobile:

1. Crea FilterOreUtentiMetadata:
   public class FilterOreUtentiMetadata
   {
       public List<ComboItem> Utenti { get; set; } = [];
       public List<ComboItem> InternoEsterno { get; set; } = [];
       public List<ComboItem> Aree { get; set; } = [];
   }

2. Crea un nuevo endpoint POST "schedaImmobile/oreLavorate/filtri"
   que reciba IdImmobile e IdReport y devuelva FilterOreUtentiMetadata.

3. Mueve la lógica de construcción de filtri (filtroUtente, filtroInternoEsterno,
   filtroArea) de GetOreUtentiPerImmobile al nuevo método del service.

4. Elimina Filtri de OreUtentiPerImmobileView.

Para GetDettaglioCostiImmobile:

5. Crea FilterDettaglioCostiMetadata:
   public class FilterDettaglioCostiMetadata
   {
       public List<ComboItem> Competenze { get; set; } = [];
       public List<ComboItem> Fornitori { get; set; } = [];
       public List<ComboItem> Anni { get; set; } = [];
   }

6. Crea un nuevo endpoint POST "schedaImmobile/dettaglioCosti/filtri"
   que reciba IdReport, IdCompetenza, IdImmobile y devuelva
   FilterDettaglioCostiMetadata.

7. Mueve la lógica de filtros de GetDettaglioCostiImmobile al nuevo método.

8. Elimina Filtri de DettaglioCostiImmobileView.

Muéstrame todos los archivos modificados: controller, service, y modelos nuevos.
```

---

### PASO 14 — Optimizar `GetOreUtentiPerImmobile`: projection y filtros SQL

Carga todos los timereport en memoria sin límite. Hay que filtrar en la query.

**Prompt para Copilot:**

```
PASO 14: Optimizar GetOreUtentiPerImmobile con projection y filtros server-side.

Contexto: El método carga TODOS los timereport del inmueble sin límite temporal
significativo, los trae a memoria, y después los filtra por utente/tipo/area
en código C#.

Cambios necesarios:

1. LIMITAR la query temporal:
   Agrega filtro por año en la query LINQ:
   var annoMinimo = annoCorrente - 2;
   .Where(p => idProgetti.Contains(p.IdProgetto)
            && p.DataTimereport <= report.DataRiferimento
            && p.DataTimereport.Year >= annoMinimo)

2. MOVER FILTROS a la query SQL:
   Los parámetros utenti, tipo, aree se aplican actualmente DESPUÉS
   del GroupBy en memoria. Muévelos al Where de la query:

   if (utenti != null && utenti.Count > 0)
       query = query.Where(p => p.IdUtente.HasValue && utenti.Contains(p.IdUtente.Value));
   if (tipo != null)
       query = query.Where(p => tipo == "N" ? p.FlagEsterno == "N" : p.FlagEsterno != "N");
   if (aree != null && aree.Count > 0)
       query = query.Where(p => aree.Contains(p.IdAreaUtente));

3. PROJECTION:
   En vez de cargar toda la entidad Timereport, selecciona solo los campos
   necesarios:
   .Select(t => new {
       t.IdUtente, t.NomeEsteso, t.FlagEsterno, t.DsEsterno,
       t.IdAreaUtente, t.DsAreaUtente, t.Durata,
       Anno = t.DataTimereport.Year
   })

4. AGRUPAR en la query:
   Evalúa si el GroupBy se puede hacer a nivel SQL:
   .GroupBy(t => new { t.IdUtente, t.NomeEsteso, t.DsEsterno, t.DsAreaUtente, t.IdAreaUtente, t.Anno })
   .Select(g => new { g.Key, TotalDurata = g.Sum(x => x.Durata) })

   Esto mueve la agregación al database y trae solo los resultados agrupados.

5. Verifica que TimereportHelper.GetNomiCollaboratori siga funcionando.
   Si hace queries adicionales, evalúa si se puede resolver en la
   projection o eliminarlo.

Muéstrame el método GetOreUtentiPerImmobile completo refactorizado.
```

---

### PASO 15 — Simplificar `GetConsumiUtenze`

Problemas menores pero fáciles de resolver.

**Prompt para Copilot:**

```
PASO 15: Simplificar GetConsumiUtenze.

Contexto: El método carga todos los consumi y luego filtra in-memory
por clase (Elettricità, Acqua, Gas) y data.

Cambios necesarios:

1. FILTRAR en la query:
   Actualmente la query trae todos los consumi del inmueble:
   _context.TotClasseContatori.Where(w => w.IdReport == ... && w.IdImmobile == ...)

   Agrega el filtro por CONTATORE_FISICO directamente en la query
   (ya está, bien). Pero agrega también el filtro por Data:
   && (w.Data == report.DtRiferimento || w.Data == null)
   para no traer datos históricos que no se usan.

2. SIMPLIFICAR el pattern booleano:
   Actualmente el código repite 3 veces:
     var consumiX = consumi.Where(w => w.Classe == X && w.Data == ...).FirstOrDefault();
     if (consumiX != null) { resp.ViewTabX = true; resp.ConsumiX = consumiX; }
     else { resp.ViewTabX = false; }

   Simplifica con:
     resp.ConsumiElettricita = consumi.FirstOrDefault(w => w.Classe == ELETTRICITA && w.Data == report.DtRiferimento);
     resp.ViewTabElettricita = resp.ConsumiElettricita != null;

   O mejor aún, elimina los ViewTab y deja que el frontend determine
   la visibilidad por la presencia/ausencia del dato (ConsumiElettricita != null).

3. NO cambies el ConsumiUtenzeView model por ahora (excepto la simplificación
   del punto 2 si no impacta frontend).

Muéstrame el método completo simplificado.
```

---

### PASO 16 — Centralizar carga de catena report

3+ métodos cargan la misma cadena report corrente → -1 → -2 con llamadas individuales.

**Prompt para Copilot:**

```
PASO 16: Centralizar la carga de cadena de report.

Contexto: Al menos 3 métodos (GetSchedaImmobile, GetCostiImmobile,
GetDettaglioCostiImmobile) cargan la misma cadena de RliReport:
  rliCorrente = _generalService.GetRliReport(idReport)
  rliMeno1 = _generalService.GetRliReport(rliCorrente.IdReportPrec)
  rliMeno2 = _generalService.GetRliReport(rliMeno1.IdReportPrec)
Esto son 3 llamadas secuenciales por cada endpoint.

Cambios necesarios:

1. Crea un método helper en ImmobiliService:

   private (RliReportView Corrente, RliReportView Meno1, RliReportView Meno2)
       GetCatenaRliReport(long idReportRli)
   {
       var corrente = _generalService.GetRliReport(idReportRli);
       if (corrente == null) return (null, null, null);

       var meno1 = corrente.IdReportPrec.HasValue && corrente.IdReportPrec > 0
           ? _generalService.GetRliReport(corrente.IdReportPrec.Value)
           : null;

       var meno2 = meno1?.IdReportPrec.HasValue == true && meno1.IdReportPrec > 0
           ? _generalService.GetRliReport(meno1.IdReportPrec.Value)
           : null;

       return (corrente, meno1, meno2);
   }

2. Crea lo mismo para PrgReport si aplica:
   private (PrgReportView Corrente, PrgReportView Precedente)
       GetCatenaPrgReport(long idReportPrg)

3. Reemplaza en GetCostiImmobile el bloque donde se calcula
   RliReportAnnoCorrente/AnnoMeno1/AnnoMeno2 por:
   var (rliCorrente, rliMeno1, rliMeno2) = GetCatenaRliReport(report.IdReportRli);

4. Haz lo mismo en GetDettaglioCostiImmobile.

5. En GetSchedaImmobile, reemplaza las dos llamadas separadas a
   GetPrgReport (corrente y precedente) por GetCatenaPrgReport.

6. NOTA: actualmente GetCostiImmobile tiene lógica que ajusta qué report
   es "corrente" según el año (if rliReport.Year == prgReport.Year...).
   Mantén esa lógica DENTRO del método GetCatenaRliReport o en el caller,
   pero centraliza la resolución de la cadena.

Muéstrame el helper y los 3 métodos que lo usan, modificados.
```

---

### PASO 17 — Modernizar modelos e inicializaciones

Limpieza general: naming, boilerplate, wrappers.

**Prompt para Copilot:**

```
PASO 17: Modernización de modelos del módulo Immobili.

Este es un paso de limpieza general. Aplica estos cambios a TODOS los modelos
del módulo Immobili:

1. INICIALIZACIONES — Reemplaza los constructores boilerplate por
   collection expressions de C# 12.

   Antes:
   public FilterOreUtentePerImmobile()
   {
       FiltroUtente = new List<ComboItem>();
       FiltroInternoEsterno = new List<ComboItem>();
       FiltroArea = new List<ComboItem>();
   }

   Después:
   public class FilterOreUtentePerImmobile
   {
       public List<ComboItem> FiltroUtente { get; set; } = [];
       public List<ComboItem> FiltroInternoEsterno { get; set; } = [];
       public List<ComboItem> FiltroArea { get; set; } = [];
   }
   (sin constructor)

   Aplica a: FilterListaImmobili, FilterOreUtentePerImmobile,
   FilterDettaglioCostiImmobile, ImmaginiImmobiliRequest,
   ImmaginiPrincipaliImmobiliResponse, CostiImmobileView,
   ListaImmobiliView, OreUtentiPerImmobileView, DettaglioCostiImmobileView,
   AlberoCostiImmobile, GraficoCostiImmobile.

2. ELIMINAR GetCategoria con switch hardcoded:
   El método tiene IDs fijos (5721, 5720, 5723, 7410).
   Reemplaza por un Dictionary<long, string> configurado como campo
   privado del service:

   private static readonly Dictionary<long, string> _categorieImmobili = new()
   {
       { 5721, "Personali" },
       { 5720, "A reddito" },
       { 5723, "Uso Family Office" },
       { 7410, "Non profit" }
   };

   Y el uso: _categorieImmobili.GetValueOrDefault(idAsset, string.Empty);

3. NAMING — Agrega [JsonPropertyName] para mantener compatibilidad
   con el frontend mientras se renombra internamente:

   [JsonPropertyName("DsImmobile")]
   public string Descrizione { get; set; }

   Aplica esto SOLO a las propiedades de los response models
   (no a las entidades EF ni a modelos internos).

   Propiedades a renombrar:
   - DsImmobile → Descrizione
   - DsIntestatario → Intestatario
   - DsNodo → DescrizioneNodo
   - DsCategoria → DescrizioneCategoria
   - DsTipoGestione → DescrizioneTipoGestione
   - DsCliFor → DescrizioneClienteFornitore
   - XnDettMovimento → DescrizioneMovimento
   - VlEuro → ValoreEuro
   - VlVal → ValoreValuta

   NO renombres todo de una vez. Empieza por los modelos de los
   response (ImmobileLite, CostiImmobile, DettaglioCostiImmobile,
   OreUtentePerImmobile) y deja las entidades EF intactas.

Muéstrame cada modelo modificado.
```

---

## Orden de ejecución recomendado

| Paso | Impacto performance   | Riesgo | Impacto FE      | Esfuerzo |
| ---- | --------------------- | ------ | --------------- | -------- |
| 10   | Alto                  | Bajo   | No              | 0,5 día  |
| 16   | Medio                 | Bajo   | No              | 1 día    |
| 9    | Alto                  | Medio  | No              | 2 días   |
| 11   | Alto                  | Medio  | No              | 1,5 días |
| 14   | Medio                 | Bajo   | No              | 1 día    |
| 12   | Bajo (mantenibilidad) | Medio  | No              | 2 días   |
| 15   | Bajo                  | Bajo   | Potencial       | 0,5 día  |
| 13   | Medio                 | Medio  | **Sí**          | 1,5 días |
| 17   | Bajo (calidad)        | Bajo   | **Sí** (bridge) | 2 días   |

**Fase 1 — Sin impacto frontend (ejecutar primero):**
Paso 10 → 16 → 9 → 11 → 14

**Fase 2 — Refactoring estructural:**
Paso 12 → 15

**Fase 3 — Con coordinación frontend:**
Paso 13 → 17

**Total: 12-13 días**
**Total módulo completo (pasos 1-17): 18-21 días**
