OK. Este componente tiene para persistir:

1. **Filtros**: `idCategoria`, `idSocRif`, `idTipoGestione`, `idImmobile`
2. **Página**: `page`
3. **Vista lista/mapa**: `showList`

Actualmente todo se guarda en `Immobili.listState` como un objeto único. Con el nuevo patrón, cada valor va en `DynamicStates` por separado.

**Paso 1 — En `state-storage-keys.enums.ts`:**

```typescript
export enum STATE_STORAGE_KEYS {
  // ... las existentes
  IMMOBILI_LIST_CATEGORIA = "immobili-list-categoria",
  IMMOBILI_LIST_INTESTATARIO = "immobili-list-intestatario",
  IMMOBILI_LIST_TIPO_GESTIONE = "immobili-list-tipo-gestione",
  IMMOBILI_LIST_IMMOBILE = "immobili-list-immobile",
  IMMOBILI_LIST_PAGE = "immobili-list-page",
  IMMOBILI_LIST_SHOW_LIST = "immobili-list-show-list",
}
```

**Paso 2 — `immobili-list.component.ts`:**

```typescript
import { PersistStatePage } from "src/app/shared/base/persist-state-page.base";
import { STATE_STORAGE_KEYS } from "src/app/models/shared/state-storage-keys.enums";

export class ImmobiliListComponent extends PersistStatePage implements AfterViewInit, OnDestroy {
  // BORRAR: sessionStorageService = inject(SessionStorageService);
  // Mantener serviziService

  protected readonly PERSIST_KEYS = {
    savedCategoria: STATE_STORAGE_KEYS.IMMOBILI_LIST_CATEGORIA,
    savedIntestatario: STATE_STORAGE_KEYS.IMMOBILI_LIST_INTESTATARIO,
    savedTipoGestione: STATE_STORAGE_KEYS.IMMOBILI_LIST_TIPO_GESTIONE,
    savedImmobile: STATE_STORAGE_KEYS.IMMOBILI_LIST_IMMOBILE,
    page: STATE_STORAGE_KEYS.IMMOBILI_LIST_PAGE,
    showList: STATE_STORAGE_KEYS.IMMOBILI_LIST_SHOW_LIST,
  };

  savedCategoria: number | null = null;
  savedIntestatario: number | null = null;
  savedTipoGestione: number | null = null;
  savedImmobile: number | null = null;
  page: number = 1;
  showList: boolean = false;

  private isFirstLoad = true;
```

**Paso 3 — En el constructor, reemplazar la lectura de `Immobili.listState`:**

```typescript
constructor() {
  super();
  this.translateService.use(this.sessionStorageService.User.lang.get());
  this.ptiHeaderService.setShowHeader(false);
  this.orgHeaderService.setShowHeader(false);
  this.sdvHeaderService.setShowHeader(false);

  this.initialLoadTaskId = this.loaderService.startTask("immobili-initial");

  this.restoreState();

  // Aplicar valores restaurados al filtro
  this.filter.idCategoria = this.savedCategoria;
  this.filter.idSocRif = this.savedIntestatario;
  this.filter.idTipoGestione = this.savedTipoGestione;
  this.filter.idImmobile = this.savedImmobile;

  this.getListTrigger$.pipe(debounceTime(100), takeUntil(this.destroy$)).subscribe(() => {
    this.getList();
  });

  this.serviziService
    .getReport()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (report) => {
        this.filter.idReport = report.id;
        this.lastReportSelected = report;
        this.getListTrigger$.next();
      },
      error: (err) => console.error(err),
    });

  this.serviziService
    .getDsArea()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dsArea) => {},
      error: (err) => console.error(err),
    });

  this.idArea = this.serviziService.getIdAreaValue();
  this.observeElementAddition();
}
```

**Paso 4 — En `ngAfterViewInit`, borrar la lectura duplicada de `Immobili.listState`:**

```typescript
ngAfterViewInit(): void {
  setTimeout(() => {
    this.serviziService
      .getIdArea()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (idArea) => {
          this.idArea = idArea;
          this.filter.idArea = idArea;
          if (!this.isFirstLoad) {
            this.getListTrigger$.next();
          }
        },
        error: (err) => console.error(err),
      });

    this.serviziService
      .getReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (report) => {
          this.filter.idReport = report.idReport;
          this.lastReportSelected = report;
          this.getListTrigger$.next();
        },
        error: (err) => console.error(err),
      });

    // BORRAR: const listState = ... y toda la lectura de Immobili.listState
    // BORRAR: this.observeElementAddition(); ya se llama en constructor
  });

  this.calculateCardsPerPage();
}
```

**Paso 5 — En `getList`, marcar `isFirstLoad = false` después de cargar:**

```typescript
next: (data: ImmobiliListaView) => {
  // ... toda la asignación igual

  this.pagination(this.immobiliList);
  this.immobiliListContainerIsReady = true;
  this.isFirstLoad = false; // después de todo

  if (this.initialLoadTaskId) {
    this.loaderService.endTask(this.initialLoadTaskId);
    this.initialLoadTaskId = null;
  }
},
```

**Paso 6 — En `ngDoCheck`, persistir cuando cambian los filtros:**

```typescript
ngDoCheck() {
  const currentFilter = JSON.stringify({
    idCategoria: this.filter.idCategoria,
    idSocRif: this.filter.idSocRif,
    idTipoGestione: this.filter.idTipoGestione,
    idImmobile: this.filter.idImmobile,
  });

  if (!this.firstLoad && this.previousFilter !== currentFilter) {
    this.previousFilter = currentFilter;

    // Persistir cada filtro
    this.persistValue('savedCategoria', this.filter.idCategoria);
    this.persistValue('savedIntestatario', this.filter.idSocRif);
    this.persistValue('savedTipoGestione', this.filter.idTipoGestione);
    this.persistValue('savedImmobile', this.filter.idImmobile);

    this.onFilter();
  } else {
    this.previousFilter = currentFilter;
    this.firstLoad = false;
  }
}
```

**Paso 7 — Actualizar `toggleList`, `goPage`, `onFilter`:**

```typescript
toggleList() {
  this.persistValue('showList', !this.showList);
  this.calculateCardsPerPage();
}

goPage(page: number) {
  this.persistValue('page', page);
  this.pagination(this.immobiliListCopy);
}

onFilter() {
  this.getListTrigger$.next();
  this.options = { center: { lat: 41.9, lng: 12.5 }, zoom: 5 };
  this.persistValue('page', 1);
}
```

**Paso 8 — Borrar `saveSessionData()`** — ya no se necesita, `persistValue` maneja todo.

**Paso 9 — En `goBack`, limpiar con `resetState`:**

```typescript
goBack() {
  this.resetState();
  this.navigationService.back();
}
```

**Paso 10 — En `resetFilters`:**

```typescript
resetFilters() {
  this.filter.idCategoria = null;
  this.filter.idSocRif = null;
  this.filter.idTipoGestione = null;
  this.filter.idImmobile = null;
  this.filter.idArea = null;
  this.filter.mostraAssetInAlbero = null;
  this.filter.idGestioneFo = this.filter.idGestioneFo;
  this.filter.idReport = this.lastReportSelected.id;

  this.persistValue('savedCategoria', null);
  this.persistValue('savedIntestatario', null);
  this.persistValue('savedTipoGestione', null);
  this.persistValue('savedImmobile', null);
  this.persistValue('page', 1);

  this.onFilter();
}
```

**Advertencia:** Las opciones de los selects (`optionCategoria`, etc.) se cargan de API. Si un valor guardado ya no existe en las opciones, el `pti-select` con `[(model)]` simplemente no selecciona nada — comportamiento correcto. Y la guarda en `pagination` para página fuera de rango:

```typescript
pagination(list: Immobile[]) {
  this.nTotPage = Math.ceil(list?.length / this.elementsPerPage);
  if (this.page > this.nTotPage && this.nTotPage > 0) {
    this.page = this.nTotPage;
  }
  if (list.length > this.elementsPerPage) {
    list = list.slice((this.page - 1) * this.elementsPerPage, this.page * this.elementsPerPage);
  }
  this.immobiliList = list;
}
```
