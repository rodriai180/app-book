# Pendiente — App de italiano

## 1. Ejercicios de quiz — 3er subtema faltante

Estos 8 subtemas necesitan 12 ejercicios cada uno. Pegar en el QuizEditor del panel.

| Lección | subtopicKey exacto |
|---------|-------------------|
| L21 | `Congiuntivo in proposizioni relative e temporali` |
| L22 | `Congiuntivo imperfetto vs trapassato` |
| L23 | `Trapassato vs passato prossimo` |
| L24 | `Passato remoto irregolari` |
| L28 | `Condizionale composto in contesti comunicativi` |
| L29 | `Esercizi pratici sul periodo ipotetico` |
| L30 | `Costruzioni con infinito e participio` |
| L33 | `Verbi pronominali e idiomatici` |

Formato de cada ejercicio:
```json
{
  "id": "lXX_abc_N",
  "lessonId": "XX",
  "subtopic": "nombre exacto",
  "question": "¿Pregunta en español?",
  "options": ["op1", "op2", "op3", "op4"],
  "correctAnswer": "op correcta",
  "tip": "Explicación en español."
}
```

## 2. LevelContents — Revisar y completar

Para cada lección (0–34), abrir el ContentEditor en el panel y verificar:
- ¿Cada subtema tiene al menos una `phrase` con italiano + traducción?
- ¿Hay `explanation` en cada subtema?
- ¿Los `subSections` tienen al menos 3–5 `items` con ejemplos reales?

Si algún subtema tiene `phrases: []` o está vacío, generar ejemplos y pegar el JSON completo.

## 3. Vocabulario — Verificar categorías

Abrir el VocabularyEditor en el panel para cada categoría y verificar:
- ¿Mínimo 15–20 palabras por categoría?
- ¿Cada palabra tiene `example`, `usageTip` y al menos 2 `extraExamples`?

## 4. Verificar subtopicKeys en Firestore (L7–L34)

Los subtopicKeys usados en los quiz JSON fueron asignados por nombre lógico.
Si los levelContents en Firestore tienen títulos diferentes, los quizzes no se van a
enlazar correctamente con el "Reto Rápido".

Para verificar: abrir el QuizEditor de cualquier lección → el título del bloque debe
coincidir exactamente con el `title` del levelContent correspondiente.
