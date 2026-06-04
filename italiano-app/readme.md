## Colecciones de ejercicios

### exercises

- Un documento por ejercicio (múltiple choice)
- Campos: lessonId, subtopic, question, options, correctAnswer, tip
- Consultada con: where('lessonId', '==', id)

### dialogueExercises

- Un documento por lección (el doc ID es el lessonId)
- Contiene un array `exercises` con diálogos para completar
- Consultada con: getDoc(doc(db, 'dialogueExercises', lessonId))

---

## Dónde se usa cada colección

| Punto de entrada      | Colección         | Detalle                                     |
| --------------------- | ----------------- | ------------------------------------------- |
| Tab "Práctica Rápida" | exercises         | Quiz aleatorio de toda la app (5 preguntas) |
| Botón "Reto Rápido"   | exercises         | Quiz filtrado por lección + subtema         |
| Botón "Sesión Total"  | dialogueExercises | Completar diálogos de la lección completa   |

Los dos primeros puntos de entrada son quiz de opción múltiple.
El tercero es práctica de escritura/completar frases en diálogo.
