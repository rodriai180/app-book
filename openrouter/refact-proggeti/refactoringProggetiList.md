Perfecto, con eso armo el plan. Dado que sos solo vos y querés enfocarte primero en la **lista progetti**, te propongo esto:

---

## 🎯 Obiettivo: Lista Progetti — BE + FE

### SPRINT 1 — Backend lista (sin tocar FE)

Tasks en orden, todas independientes y sin riesgo:

| Orden      | Task                      | Effort      |
| ---------- | ------------------------- | ----------- |
| 1          | ST-P1 — Query object      | 0,25 gg     |
| 2          | ST-P2 — N+1 aree extra    | 0,5 gg      |
| 3          | ST-P3 — N+1 date previste | 0,5 gg      |
| 4          | ST-P4 — Batch Forecast    | 0,5 gg      |
| **Totale** |                           | **1,75 gg** |

Estas 4 tasks atacan todos los problemas de performance de `/lista` y no cambian nada para el FE. Podés hacer deploy sin coordinación.

---

### SPRINT 2 — Frontend lista (independiente del BE)

Mientras o después del Sprint 1:

| Orden      | Task                                      | Effort     |
| ---------- | ----------------------------------------- | ---------- |
| 1          | FE-P1 — Subscription management           | 0,5 gg     |
| 2          | FE-P3 — Refactoring calculateCardsPerPage | 1 gg       |
| **Totale** |                                           | **1,5 gg** |

Estas dos no dependen de ningún cambio BE, las podés hacer en paralelo o después.

---

### SPRINT 3 — Cambios coordinados BE+FE (lista)

Solo cuando tengas tiempo para hacer BE y FE juntos:

| Orden      | Task                             | Effort     |
| ---------- | -------------------------------- | ---------- |
| 1          | ST-P14 — Separazione filtri (BE) | 1,5 gg     |
| 2          | FE-P2 — Logica filtri (FE)       | 0,5 gg     |
| 3          | ST-P15 — DTO flat (BE)           | 1 gg       |
| 4          | FE-P4 — Modelli Angular (FE)     | 0,5 gg     |
| **Totale** |                                  | **3,5 gg** |

Estas van en pareja obligatoriamente — primero BE, luego FE.

---

**Total lista progetti: ~6,75 giorni**

¿Querés que te arme también el plan para la scheda progetto o seguimos con este primero?
