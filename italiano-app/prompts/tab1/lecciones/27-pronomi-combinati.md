# PROMPT: Mantenimiento de Práctica - Pronomi Combinati

Usa este prompt para actualizar o expandir la pantalla de práctica de Pronombres Combinados.

**ARCHIVO OBJETIVO:** `app/pratica-pronomi-combinati.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica de **Pronombres Combinados** (Glie-lo, Te-ne...).

**REGLAS DE ACTUALIZACIÓN:**
1. **Formato Diálogo:** Esta pantalla usa un formato de diálogo (A y B).
2. **Estructura:**
   - `answer`: Los dos pronombres combinados (ej: 'glielo').
   - `dialogue`: Array de líneas con `person`, `text` y opcionalmente `hasInput`.
3. **Lógica de Pronombres:** Mi/Ti/Si/Ci/Vi cambian a Me/Te/Se/Ce/Ve cuando van seguidos de Lo/La/Li/Le/Ne.

**EJEMPLO:**
```typescript
{
    id: 5,
    answer: 've lo',
    dialogue: [
        { person: 'A', text: 'Vi spedisco il pacco?' },
        { person: 'B', text: 'Sì, ' },
        { person: 'B', text: '', hasInput: true },
        { person: 'B', text: ' spedisca pure.' }
    ],
    hint: 'Vi + lo = VE LO.'
}
```
