# PROMPT: Mantenimiento de Práctica - Forma Passiva

Usa este prompt para actualizar o expandir la pantalla de práctica de la Voz Pasiva.

**ARCHIVO OBJETIVO:** `app/pratica-forma-passiva.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica de la **Voz Pasiva**.

**REGLAS DE ACTUALIZACIÓN:**
1. **Variedad:** Incluye pasiva con `Essere` y pasiva con `Venire`.
2. **Estructura:** Asegura que el participio concuerde en género y número con el sujeto.
3. **Componentes:** Usa los iconos de `lucide-react-native` (RefreshCcw).

**EJEMPLO:**
```typescript
{
    id: 4,
    sentence: [{ text: 'La pizza ' }, { hasInput: true, text: '', text_input: '' }, { text: ' (venire) preparata dallo chef.' }],
    answer: 'viene',
    translation: 'La pizza es preparada por el chef.',
    hint: 'Passiva con Venire (Presente).'
}
```
