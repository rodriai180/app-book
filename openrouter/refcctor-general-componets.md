```
# Context

We are refactoring an Angular app to centralize UI state persistence using a base class called PersistStatePage. The goal is to remember user selections (tabs, switches, filters, search text, etc.) so when they navigate away and come back, everything is as they left it.

## Base class (PersistStatePage)
- Located at src/app/shared/base/persist-state-page.base.ts
- Provides: restoreState(), persistValue(), resetState()
- Uses SessionStorageService.DynamicStates internally
- persistValue is type-safe with keyof this
- Components extend this class and define PERSIST_KEYS mapping property names to storage keys
- Storage keys are defined in STATE_STORAGE_KEYS enum at src/app/models/shared/state-storage-keys.enums.ts

## Rules to follow

1. IDENTIFY what needs persistence: tabs (pti-tab-selector), switches (pti-dynamic-switch), pie chart switches (pti-pie-chart with switchDataVisualization), search bars, selects, multiselects, scroll menus, radio buttons, sort components, or any direct DynamicStates read/write.

2. DETERMINE the parent: persistence logic goes in the page/parent component, never in shared child components. Exception: deeply nested reusable components (3+ levels) can manage their own state with a route-based key.

3. FOR EACH component that needs persistence, provide step by step:

### Step A - Add keys to STATE_STORAGE_KEYS enum
- Use descriptive kebab-case names: "page-name-component-type" (e.g., "composizione-pie-switch")

### Step B - Extend PersistStatePage
- Add: extends PersistStatePage
- Remove local sessionStorageService injection (it comes from the base class)
- Keep all OTHER service injections
- If the component has a constructor that calls services, add super() as first line
- Define protected readonly PERSIST_KEYS mapping property names to enum values

### Step C - Add properties for persisted values
- Each key in PERSIST_KEYS must correspond to an actual property on the component
- Initialize with sensible defaults (false for booleans, 0 for numbers, null for objects, [] for arrays)

### Step D - Call restoreState()
- Call in ngOnInit() BEFORE any data loading or subscriptions
- NEVER call in ngOnChanges (it would run on every input change)
- Exception: if the component only has ngOnChanges (no ngOnInit), add ngOnInit for restoreState

### Step E - Persist on user actions
- In each handler that responds to user interaction, call persistValue('propertyName', value)
- For FormGroup-based filters: persist in valueChanges subscription
- For tabs: create a handler method instead of inline (selectedTabIndexChanged)="prop = $event"

### Step F - Handle special cases

FOR pti-dynamic-switch:
- Change [(model)]="prop" to [initVal]="prop" (modelChange)="handler($event)"
- NEVER use [(model)] and (modelChange) together - they conflict
- The handler calls persistValue

FOR pti-pie-chart with switchDataVisualization:
- Add (switchValueChange)="handler($event)" to the template
- Create a property for the switch value
- Override restoreState() to set initialValue on the switchDataVisualization object:
```

protected override restoreState(): void {
super.restoreState();
if (this.pieSwitchValue !== undefined) {
this.chartSwitchData = { ...this.chartSwitchData, initialValue: this.pieSwitchValue };
}
}

```

FOR multiple pie charts on same page:
- Use Record<string, boolean> as pieSwitchStates with a single key
- Use getSwitchSettings(chartId) method with caching
- Use onPieSwitchChange(chartId, value) handler

FOR FormGroup filters (selects, multiselects, sort):
- Remove [storageKey] from all child components in template
- Create saved* properties for each filter value
- Initialize FormGroup with saved* values
- Persist in valueChanges subscription

FOR components inside @if blocks:
- The component gets destroyed/recreated - initialValue and [initVal] handle restoration

FOR dynamic tabs (generated from API data):
- Add guard after restoreState: if (this.selectedTab >= this.tabs.length) this.selectedTab = 0;

FOR dynamic options (loaded from API):
- Add guard after data loads: validate saved value still exists in options list

FOR components used in multiple contexts (same component, different pages):
- Generate key dynamically using route segments:
```

const segments = this.router.url.split('/').filter(Boolean);
this.PERSIST_KEYS.prop = STATE_STORAGE_KEYS.BASE_KEY + '-' + segments.slice(x, y).join('-');

```
Call this BEFORE restoreState()

### Step G - Clean up
- Remove all [storageKey] bindings from child component templates
- Remove CUSTOM_DYNAMIC_KEY references if no longer used
- Remove manual DynamicStates.states.getByKey/set calls that are now handled by persistValue/restoreState
- Remove old storageKey getter methods (getStorageKey, getAutoStorageKey, etc.)
- Keep any existing business storage writes (PatrimonioRefact, Servizi, etc.) - those are separate

### Step H - Verify data flow
- Ensure restoreState runs BEFORE data loading (not after)
- Ensure applyFilters/initPagination runs AFTER data loads AND after restore
- If onTabSelected was called in ngOnInit before data loaded, remove it - let the data load callback handle initialization using the restored senarioValue
- Check that the component still works without any saved state (first visit)

## Task

Given the component files I provide (TS and HTML), analyze and give me the complete step-by-step changes needed following the rules above. List every file that needs changes and show the exact code modifications. Flag any warnings about dynamic data, conditional rendering, or potential stale values.
```
