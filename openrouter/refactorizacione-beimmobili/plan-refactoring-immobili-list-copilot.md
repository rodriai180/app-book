# Plan de refactoring — Página Lista Immobili

## Diagnóstico de performance

Tras analizar el código completo de `GetListaImmobili`, estos son los cuellos de botella concretos:

### Problemas de performance identificados

1. **La query principal trae TODO a memoria** — `.ToList()` sobre `AssetImmobili` carga todas las columnas (30+) de todos los inmuebles que matchean, incluyendo campos que NO se usan en la lista (Descripcion, Vincoli, StatoUso, NoteAggiuntive, etc.)

2. **N+1 implícito en el loop** — Para cada inmueble se llama `GetNodoImmobilizzazione()` y `GetCategoria()`, que muy probablemente hacen queries individuales a la BD

3. **Filtrado post-query** — El filtro por categoría (`IdCategoria`) se aplica DESPUÉS de cargar todos los inmuebles en memoria, porque la categoría se resuelve con `GetNodoImmobilizzazione`. Esto significa: cargo 500 inmuebles, proceso los 500, y después descarto 400

4. **Combos construidas desde los datos filtrados** — Las opciones de los dropdowns se generan agrupando los resultados ya cargados. Esto acopla la carga de metadata UI con la query de datos

5. **Imágenes en endpoint separado pero pesado** — `GetImmaginiPrincipaliImmobili` trae el `FileByte` (base64 completo) de todas las imágenes, hace resize con `Parallel.ForEach`. Cada imagen se decodifica, redimensiona y re-codifica en memoria

6. **Reports cargados siempre** — Se llaman `GetMainReport`, `GetPrgReport`, `GetPatReport` (x2) al inicio, sin importar si el request acabará vacío

---

## Arquitectura propuesta

### Separación de responsabilidades

```
ANTES (todo junto):
  Controller → GetListaImmobili() → ListaImmobiliView { Report, Filtri, Lista }

DESPUÉS (separado):
  Controller → GetListaImmobili()     → ListaImmobiliResponse { Items, TotalCount }
  Controller → GetFiltriImmobili()    → ListaImmobiliFiltersMetadata { combos }
  Controller → GetImmaginiPrincipali() → (sin cambios, pero optimizado)
```

### Nuevos modelos

```
ListaImmobiliQuery          — input puro del frontend (reemplaza los 11 params sueltos)
ListaImmobiliResponse       — solo la lista paginada + total count
ListaImmobiliFiltersMetadata — solo las opciones de los dropdowns
ImmobileLiteDto             — solo los campos que se muestran en la card de la lista
```

---

## Pasos de ejecución

Cada paso tiene su prompt para Copilot al final.


---

### PASO 1 — Crear el query object `ListaImmobiliQuery`

Reemplazar los 11 parámetros sueltos de `GetListaImmobili` por un objeto único.

**Qué hacer:**
- Crear la clase `ListaImmobiliQuery` en `Models/Immobili/`
- Mover ahí todas las propiedades de `ListaImmobiliRequest` (que ya existe y es casi lo mismo)
- Evaluar si `ListaImmobiliRequest` puede reemplazarse directamente

**Código objetivo:**

```csharp
public class ListaImmobiliQuery
{
    public long IdReportPrg { get; set; }
    public long? IdGestioneFo { get; set; }
    public long? IdSocRif { get; set; }
    public long? IdCategoria { get; set; }
    public long? IdArea { get; set; }
    public long? IdImmobile { get; set; }
    public long? IdTipoGestione { get; set; }
    public bool MostraVenduti { get; set; }
    public bool MostraStorico { get; set; }
    public bool MostraAssetInAlbero { get; set; }
}
```

**Prompt para Copilot:**

```
En el proyecto NPTO_Backend, necesito refactorizar el endpoint "lista" de ImmobiliController.

PASO 1: Crear un query object.

1. En Models/Immobili/, crea una clase `ListaImmobiliQuery` con estas propiedades:
   - long IdReportPrg
   - long? IdGestioneFo, IdSocRif, IdCategoria, IdArea, IdImmobile, IdTipoGestione
   - bool MostraVenduti, MostraStorico, MostraAssetInAlbero

2. Luego modifica la firma de `ImmobiliService.GetListaImmobili` para que reciba
   un solo parámetro `ListaImmobiliQuery query` en vez de los 11 parámetros sueltos.
   Dentro del método, reemplaza cada referencia a los parámetros por query.Propiedad.

3. En ImmobiliController.cs, modifica GetListaImmobili para que construya el
   ListaImmobiliQuery desde el ListaImmobiliRequest y lo pase al service.

4. NO cambies la lógica interna todavía, solo la firma y el pasaje de parámetros.

Muéstrame los archivos modificados completos.
```


---

### PASO 2 — Separar la metadata de filtros del response

Sacar las combos de `ListaImmobiliView` y crear un endpoint dedicado.

**Qué hacer:**
- Crear `ListaImmobiliFiltersMetadata` con las listas de ComboItem
- Crear un nuevo endpoint `GET filtri` o `POST filtri` en el controller
- Crear un método `GetFiltriListaImmobili` en el service
- Mover la región `#region Combo Filtri` a este nuevo método

**Prompt para Copilot:**

```
PASO 2: Separar los filtros/combos del endpoint de lista.

Contexto: Actualmente en ImmobiliService.GetListaImmobili, la región
"#region Combo Filtri" construye las opciones de los dropdowns (FiltroIntestatario,
FiltroImmobile, FiltroCategoria, FiltroTipoGestione, FiltroGestioneFo) y las mete
dentro de ListaImmobiliView junto con los datos. Esto obliga a recalcular los combos
en cada búsqueda.

Lo que necesito:

1. Crea una nueva clase `ListaImmobiliFiltersMetadata` en Models/Immobili/:

   public class ListaImmobiliFiltersMetadata
   {
       public List<ComboItem> Intestatari { get; set; } = [];
       public List<ComboItem> Immobili { get; set; } = [];
       public List<ComboItem> Categorie { get; set; } = [];
       public List<ComboItem> TipiGestione { get; set; } = [];
       public List<ComboItem> GestioniFo { get; set; } = [];
   }

2. En ImmobiliService.cs, crea un nuevo método:
   public ListaImmobiliFiltersMetadata GetFiltriListaImmobili(long idReportPrg, long? idGestioneFo)

   Este método debe:
   - Obtener el prgReport igual que lo hace GetListaImmobili
   - Cargar los inmuebles base (sin aplicar filtros de categoría/area/immobile específico)
   - Construir las combos usando la misma lógica que está en "#region Combo Filtri"
   - Retornar ListaImmobiliFiltersMetadata

3. En ImmobiliController.cs, agrega un nuevo endpoint:
   [HttpPost("filtri")]
   public ListaImmobiliFiltersMetadata GetFiltriImmobili(...)

4. Elimina la región "#region Combo Filtri" de GetListaImmobili.

5. Modifica ListaImmobiliView para que ya NO tenga la propiedad Filtri.
   Solo debe tener Report y ListaImmobili.

Muéstrame todos los archivos modificados.
```


---

### PASO 3 — Optimizar la query principal con projection

Dejar de traer todas las columnas y seleccionar solo lo necesario.

**Qué hacer:**
- En vez de `.ToList()` sobre toda la entidad, usar `.Select()` para traer solo los campos que se necesitan
- Crear un DTO intermedio o mapear directamente a `ImmobileLiteModel`

**Prompt para Copilot:**

```
PASO 3: Optimizar la query principal con projection.

Contexto: En GetListaImmobili, la línea:
  var listaImmobili = _context.AssetImmobili.Where(where).ToList();
trae TODAS las columnas de la tabla IMM_ASSET (30+ campos) cuando la lista
solo necesita: IdImmobile, DsImmobile, IdIntestatario, DsIntestatario,
Latitudine, Longitudine, Indirizzo, CAP, IdCitta, DsCitta, IdNazione,
DsNazione, IdTipoGestione, DsTipoGestione, IdGestioneFO, FlagViewContatore.

Lo que necesito:

1. Reemplaza el .ToList() por un .Select() que proyecte solo los campos necesarios.
   Puedes proyectar directamente a ImmobileLiteModel o crear un record intermedio.

2. En el foreach que construye cada ImmobileLite, ajusta las referencias para usar
   los campos del nuevo objeto proyectado en vez de la entidad completa AssetImmobili.

3. El método GetIndirizzoCompleto(immobile) recibe un AssetImmobili.
   Modifícalo para que reciba los campos individuales que necesita
   (probablemente Indirizzo, CAP, DsCitta, DsNazione) o el DTO proyectado.

4. Verifica que el PredicateBuilder sigue funcionando con la projection.
   Si no es compatible, aplica el Where antes del Select.

Muéstrame el método GetListaImmobili completo modificado y cualquier helper que cambies.
```


---

### PASO 4 — Eliminar el N+1 de categorías

Resolver `GetNodoImmobilizzazione` y `GetCategoria` en batch.

**Prompt para Copilot:**

```
PASO 4: Eliminar el N+1 en la resolución de categorías.

Contexto: Dentro del foreach de GetListaImmobili, para CADA inmueble se llama:
  - GetNodoImmobilizzazione(immobile.IdImmobile) — probablemente hace query a BD
  - GetCategoria(nodoImmobil.IdAsset) — probablemente hace otra query a BD
Esto causa N+1 queries: si hay 200 inmuebles, son 400 queries extra.

Lo que necesito:

1. Muéstrame el código completo de GetNodoImmobilizzazione y GetCategoria
   (están en ImmobiliService.cs como métodos privados).

2. Luego refactoriza para hacer la resolución en batch:
   - ANTES del foreach, obtén todos los nodos de inmobilización para todos los
     idImmobili de la lista en UNA SOLA query
   - Construye un Dictionary<int, NodoInfo> con idImmobile como key
   - Dentro del foreach, haz lookup al diccionario en vez de llamar al helper

3. Haz lo mismo con GetCategoria — resuelve todas las categorías en batch.

4. Ya existe la variable `categorieImmobiliNoAlbero` que carga datos para
   inmuebles fuera del árbol. Asegúrate de que el fallback siga funcionando.

Muéstrame el código completo del foreach refactorizado y las queries batch.
```


---

### PASO 5 — Resolver los conteos en la query SQL

Mover cantieri/progetti/attività a una sola query.

**Prompt para Copilot:**

```
PASO 5: Optimizar los conteos de progetti/attività/cantieri.

Contexto: Antes del foreach se llaman 3 métodos que probablemente hacen
3 queries separadas:
  - GetNumCantieriPerImmobile(prgReport.IdReport, listaIdImmobili)
  - GetNumProgettiPerImmobile(prgReport.IdReport, listaIdImmobili)
  - GetNumAttivitaPerImmobile(prgReport.IdReport, listaIdImmobili)

Lo que necesito:

1. Muéstrame el código de estos 3 métodos.

2. Si cada uno hace una query separada, evalúa si se pueden combinar en
   una sola query que retorne los 3 conteos agrupados por IdImmobile.
   Por ejemplo, un método:
   GetConteggioPerImmobile(long idReport, List<int> idImmobili)
   que retorne Dictionary<int, (int Progetti, int Attivita, int Cantieri)>

3. Si no se pueden combinar por diferencias en las tablas/joins,
   al menos confirma que cada uno ya está haciendo la query filtrada
   por la lista de idImmobili y no haciendo queries individuales.

Muéstrame el código actual y la propuesta optimizada.
```


---

### PASO 6 — Optimizar el endpoint de imágenes

Dejar de traer `FileByte` completo en la query y hacer resize más eficiente.

**Prompt para Copilot:**

```
PASO 6: Optimizar GetImmaginiPrincipaliImmobili.

Contexto: El método actual hace:
  1. Query que trae FileByte (base64 completo de la imagen) para todos los inmuebles
  2. Mapper completo de la entidad al DTO (incluyendo el FileByte pesado)
  3. Parallel.ForEach para hacer ResizeImage de cada imagen

Problemas:
  - Trae TODAS las imágenes a memoria con el base64 completo
  - El mapper copia el FileByte antes de que se pueda filtrar
  - Si hay 200 inmuebles con imágenes de 500KB cada una, son 100MB en memoria

Lo que necesito:

1. Modifica la query LINQ para que haga projection:
   - Trae solo: Id, IdImmobile, FileName, FileByte, FlagImgPrincipale, IdReport
   - NO uses _mapper.Map, construye el DTO directamente en el Select

2. Evalúa si el resize se puede hacer en la query o si conviene
   mantener el Parallel.ForEach pero con un grado de paralelismo
   más conservador.

3. IMPORTANTE: hay un bug en la query original por precedencia de operadores:
   .Where(i => idImmobili.Count > 0 ? idImmobili.Contains(i.IdImmobile) : true
       && i.FlagImgPrincipale == 1
       && i.IdReport == idReport)
   El operador ternario tiene menor precedencia que &&, así que cuando
   idImmobili está vacío, evalúa: true && FlagImgPrincipale == 1 && IdReport == idReport
   pero cuando NO está vacío, evalúa SOLO: idImmobili.Contains(i.IdImmobile)
   sin filtrar por FlagImgPrincipale ni IdReport.
   CORRIGE esto con paréntesis explícitos o reescribiendo el Where.

Muéstrame el método completo corregido y optimizado.
```


---

### PASO 7 — Limpiar el response model

Simplificar `ListaImmobiliView` ahora que los filtros están separados.

**Prompt para Copilot:**

```
PASO 7: Simplificar el response model.

Después de los pasos anteriores, ListaImmobiliView ya no necesita Filtri.

1. Renombra ListaImmobiliView a ListaImmobiliResponse (o crea uno nuevo).
   Debe tener solo:
   - List<ImmobileLiteDto> Items
   - int TotalCount
   - PrgReportView Report  (si el frontend aún lo necesita)

2. Crea ImmobileLiteDto como versión limpia de ImmobileLite:

   public class ImmobileLiteDto
   {
       public int IdImmobile { get; set; }
       public string Descrizione { get; set; }      // era DsImmobile
       public string IndirizzoCompleto { get; set; }
       public decimal? Valore { get; set; }
       public int NumProgetti { get; set; }
       public int NumAttivita { get; set; }
       public int NumCantieri { get; set; }
       public CategoriaImmobile Categoria { get; set; }
       public TipoGestioneImmobile TipoGestione { get; set; }
       public int? IdGestioneFo { get; set; }
       public int? IdIntestatario { get; set; }
       public string? Intestatario { get; set; }
       public decimal? Latitudine { get; set; }
       public decimal? Longitudine { get; set; }
   }

   Nota: ya NO tiene ImmobileLiteModel anidado ni ImgImmobileModel.
   Las imágenes vienen del endpoint separado.

3. Ajusta el final de GetListaImmobili para mapear a ImmobileLiteDto
   en vez de ImmobileLite.

4. Actualiza el constructor de la response y el return del service.

Muéstrame todos los archivos modificados.
```


---

### PASO 8 — Lazy loading de reports

No cargar los 4 reports si el request termina vacío.

**Prompt para Copilot:**

```
PASO 8: Diferir la carga de reports.

Contexto: Al inicio de GetListaImmobili se cargan 4 reports:
  - GetMainReport
  - GetPrgReport
  - GetPatReport (IS)
  - GetPatReport (MP)

Pero los PatReport solo se usan para:
  - mappaValoriImmobili (valores de inmuebles)
  - filtraAssetAlbero (filtro de árbol)

Si no hay inmuebles que matcheen, esos reports se cargaron en vano.

Lo que necesito:

1. Mueve la carga de PatReportIS y PatReportMP para DESPUÉS del check
   "if (listaImmobili.Count == 0) return new..."

2. Mantén GetMainReport y GetPrgReport al inicio porque se necesitan
   para construir el Where.

3. Verifica que no haya otras dependencias de PatReport antes del check.

Muéstrame solo la parte del método que cambia (inicio hasta el region de valores).
```


---

## Orden de ejecución recomendado

| Paso | Impacto performance | Riesgo | Esfuerzo |
|------|---------------------|--------|----------|
| 1    | Bajo (preparatorio) | Bajo   | 0.5 día  |
| 2    | Medio               | Medio  | 1-2 días |
| 3    | Alto                | Bajo   | 1 día    |
| 4    | Alto                | Medio  | 1-2 días |
| 5    | Medio               | Bajo   | 0.5 día  |
| 6    | Alto                | Bajo   | 1 día    |
| 7    | Bajo (limpieza)     | Medio  | 1 día    |
| 8    | Bajo                | Bajo   | 0.5 día  |

**Total estimado: 6-8 días** para la página de lista.

## Notas para el frontend

- Después del paso 2, el frontend debe hacer 2 llamadas:
  - `POST /api/immobili/filtri` al cargar la página (una vez)
  - `POST /api/immobili/lista` al buscar/filtrar (cada vez)
- Después del paso 7, el shape del response de lista cambia
- El endpoint `immaginiPrincipali` mantiene su contrato pero se corrige el bug del Where
