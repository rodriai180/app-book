# PROMPT: Mantenimiento de Práctica - Discorso Indiretto

Usa este prompt para actualizar o expandir la pantalla de práctica del Discurso Indirecto.

**ARCHIVO OBJETIVO:** `app/pratica-discorso-indiretto.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica del **Discorso Indiretto**.

**REGLAS DE ACTUALIZACIÓN:**
1. **Cambios de Tiempo:** Foco en la relación entre el verbo que introduce (dice vs ha detto) y el verbo reportado.
2. **Estructura:** Transformación de frases directas a indirectas.
3. **UX:** Mismas reglas de `text: ''` en inputs para TypeScript.

**EJEMPLO:**
```typescript
{
    id: 4,
    sentence: [{ text: 'Lui ha chiesto: "Verrai?". -> Lui ha chiesto se ' }, { hasInput: true, text: '', text_input: '' }, { text: '.' }],
    answer: 'sarei venuto',
    translation: 'Él preguntó si vendría.',
    hint: 'Futuro -> Condizionale Composto.'
}
```
