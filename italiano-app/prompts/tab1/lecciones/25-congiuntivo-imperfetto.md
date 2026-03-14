# PROMPT: Mantenimiento de Práctica - Congiuntivo Imperfetto

Usa este prompt para actualizar o expandir la pantalla de práctica del Subjuntivo Imperfecto (Hipótesis).

**ARCHIVO OBJETIVO:** `app/pratica-congiuntivo-imperfetto.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica del **Congiuntivo Imperfetto**.

**REGLAS DE ACTUALIZACIÓN:**
1. **Estructura de Ejercicios:**
   - Usa el array `ESERCIZI`.
   - Los segmentos `hasInput: true` deben tener `text: ''`.
   - Foco en "Se..." (Si...) y "Magari..." (Ojalá...).

2. **Lógica:** Consistencia con `handleVerifica` y `Speech`.
3. **UI/UX:** Uso de `Theme.ts`, sombras y bordes dinámicos según el éxito de la respuesta.

**EJEMPLO DE NUEVO EJERCICIO:**
```typescript
{
    id: 5,
    sentence: [{ text: 'Se io ' }, { hasInput: true, text: '', text_input: '' }, { text: ' (vincere) la lotteria, viaggerei sempre.' }],
    answer: 'vincessi',
    translation: 'Si ganara la lotería, viajaría siempre.',
    hint: 'Vincere -> vincessi (io).'
}
```
