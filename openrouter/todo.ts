/*
export class FinanazaImprenditorialeCardComponent { no va mas ? porqeu no se esta usando
 app-riconciliazione-card, non fa a vedere piu el chart ?
checkear arrivare a imobili di patrimoni siempra que no fae bene el loading spining
todos los  "*ngFor without trackBy:" , son de codigo comenteado
AnalisiCostiCardComponent, parece qeu no se usa,
"app-card-kpi",  parece que no se usa mas 
"Modulo Filantropia" ce un saco di componente sensa uso
"export class ModalSupportoComponent" creo qeu no va mas este popup
al abrir y cerrar la sidebar aparece el loading espiner.

RingComposizioneComponent, no se usa mas 
*/

.\scripts\audit-heavy-getters.ps1 -Module patrimonio -Check method
.\scripts\audit-heavy-getters.ps1 -Module immobili -Check method
.\scripts\audit-heavy-getters.ps1 -Module sdv -Check method
.\scripts\audit-heavy-getters.ps1 -Module servizi -Check method
.\scripts\audit-heavy-getters.ps1 -Module filantropia -Check method
.\scripts\audit-heavy-getters.ps1 -Module aircraft-yacht -Check method
.\scripts\audit-heavy-getters.ps1 -Module shared -Check method
.\scripts\audit-heavy-getters.ps1 -Module app -Check method