# PROMPT: Mantenimiento de Práctica — Periodo Ipotetico (C1)

Usa este prompt para actualizar o expandir la pantalla de práctica del **Periodo Ipotetico**.

**ARCHIVO OBJETIVO:** `app/pratica-periodo-ipotetico-complesso.tsx`

---

**PROMPT PARA LA IA:**

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener la pantalla de práctica del **Periodo Ipotetico**.

**REGLAS DE ACTUALIZACIÓN:**
1. **Grados de Hipótesis:** Foco en el tercer grado (irrealidad en el pasado): Se + Trapassato Congiuntivo -> Condizionale Composto.
2. **Concordancia:** Asegúrate de que los auxiliares (essere/avere) sean correctos.
3. **UX:** Contextualizar las hipótesis con situaciones de arrepentimiento o posibilidades perdidas.

**EJEMPLO DE DATOS:**
```typescript
{
    id: 1,
    sentence: [{ text: 'Se ' }, { hasInput: true, text: '', text_input: '' }, { text: ' (io, studiare), avrei passato l\'esame.' }],
    answer: 'avessi studiato',
    translation: 'Si hubiera estudiado, habría aprobado el examen.',
    hint: 'Hipótesis irreal en el pasado.'
}
```
