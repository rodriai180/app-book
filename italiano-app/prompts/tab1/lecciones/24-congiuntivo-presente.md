# PROMPT: Mantenimiento de Práctica - Congiuntivo Presente

Usa este prompt para actualizar o expandir la pantalla de práctica del Subjuntivo Presente.

**ARCHIVO OBJETIVO:** `app/pratica-congiuntivo-presente.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica del **Congiuntivo Presente**.

**REGLAS DE ACTUALIZACIÓN:**
1. **Estructura de Ejercicios:** Cada ejercicio en la constante `ESERCIZI` debe seguir la interfaz:
   - `id`: incremental.
   - `sentence`: Un array de fragmentos. Los que tienen `hasInput: true` deben incluir `text: ''` y `text_input: ''` para evitar errores de TypeScript.
   - `answer`: La respuesta correcta en minúsculas.
   - `translation`: Traducción al español.
   - `hint`: Pista gramatical corta.

2. **Lógica de Verificación:** Mantén la función `handleVerifica` y el uso de `expo-speech` para la pronunciación.
3. **Estética:** Asegura que el diseño siga el sistema de `Theme.ts` y use los colores del `colorScheme`.
4. **Interactividad:** El botón de altavoz debe leer la frase completa reconstruida.

**EJEMPLO DE NUEVO EJERCICIO:**
```typescript
{
    id: 6,
    sentence: [{ text: 'Esigo che lui ' }, { hasInput: true, text: '', text_input: '' }, { text: ' (andare) via.' }],
    answer: 'vada',
    translation: 'Exijo que él se vaya.',
    hint: 'Esigere richiede il congiuntivo.'
}
```
