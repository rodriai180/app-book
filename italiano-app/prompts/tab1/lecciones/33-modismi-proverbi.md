# PROMPT: Mantenimiento de Práctica — Modismi e Proverbi (C2)

Usa este prompt para actualizar o expandir la pantalla de práctica de **Modismi e Proverbi**.

**ARCHIVO OBJETIVO:** `app/pratica-modismi-proverbi.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica de **Modismi e Proverbi**.

**REGLAS DE ACTUALIZACIÓN:**
1. **Cultura:** Foco en expresiones idiomáticas que no tienen traducción literal (ej. "In bocca al lupo").
2. **Proverbios:** Completar refranes clásicos de la cultura italiana.
3. **UX:** Incluir el contexto cultural o el origen de la expresión en el `hint`.

**EJEMPLO DE DATOS:**
```typescript
{
    id: 1,
    sentence: [{ text: 'In bocca al ' }, { hasInput: true, text: '', text_input: '' }, { text: '!' }],
    answer: 'lupo',
    translation: '¡Buena suerte! (Lit: En la boca del lobo)',
    hint: 'La respuesta correcta es "Crepi!".'
}
```
