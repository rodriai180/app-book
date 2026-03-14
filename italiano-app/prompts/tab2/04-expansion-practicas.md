# PROMPT: Expansión de Prácticas Rápidas y Aleatoriedad

Actúa como un experto en contenido educativo de idiomas y desarrollador senior de React Native. Tu tarea es expandir la base de ejercicios de "Práctica Rápida" y añadir lógica de aleatoriedad.

### 1. Generación de Contenido (Data)
Genera un array de objetos llamado `exercises` que siga la interfaz `Exercise` (id, question, options, correctAnswer, tip). Debes crear entre **12 y 15 ejercicios por cada uno de los siguientes 10 temas**, resultando en un total de aproximadamente 120 ejercicios:

1. **Fonética y Alfabeto:** (Sonidos C, G, GLI, GN, abecedario...)
2. **Saludos y presentaciones:** (Ciao, Buongiorno, A presto...)
3. **Frases de supervivencia:** (Dov'è..., Aiuto, Quanto costa...)
4. **Artículos y géneros:** (Il, Lo, La, I, Gli, Le, Partitivos...)
5. **Números, Horas y Calendario:** (1 al 100, días de la semana, horas...)
6. **Verbos fundamentales:** (Essere, Avere, Fare, Andare...)
7. **Expresar gustos:** (Mi piace, mi serve...)
8. **Hacer preguntas:** (Chi?, Che cosa?, Dove?, Quando?...)
9. **Conectores:** (E, ma, perché, quindi, anche...)
10. **Pasado Próximo:** (Ho mangiato, Sono andato, Ho fatto...)
11. **La Familia y Posesivos:** (Padre, madre, il mio, la mia...)
12. **Descripción y Colores:** (Alto, bajo, rosso, blu...)

**Formato de salida:** JSON válido listo para copiar en `constants/mockData.ts`. Asegúrate de que los IDs sean únicos (`e1`, `e2`, ..., `e100`).

---

### 2. Lógica de Sesiones (Código)
Modifica el componente `PracticaRapidaScreen` en `app/(tabs)/practica.tsx` para que implemente una sesión de ejercicios:

1.  **Constante de Sesión:** `const SESSION_LENGTH = 5;`
2.  **Estado de la Sesión:**
    - `sessionExercises`: Array de ejercicios elegidos al azar al iniciar.
    - `currentIndex`: Índice actual (0 a 4).
    - `score`: Contador de aciertos.
    - `isFinished`: Booleano para mostrar la pantalla de resultados.
3.  **Barra de Progreso:** Animada con `Animated.timing` basada en `(currentIndex / SESSION_LENGTH)`.
4.  **Pantalla de Resultados:** Al terminar los 5 ejercicios, muestra un `Trophy`, el porcentaje de aciertos y un botón para "Nueva Sesión".
5.  **Navegación entre preguntas:** Solo permite avanzar al presionar "Siguiente" después de haber respondido y recibido feedback.

```typescript
const startNewSession = () => {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    setSessionExercises(shuffled.slice(0, SESSION_LENGTH));
    setCurrentIndex(0);
    // ... reset otros estados
};
```

### 3. Audio y Feedback (Integración TTS)
- Asegúrate de que cada opción generada en los nuevos ejercicios sea compatible con la función `speak(option)` que ya tenemos implementada.
- **Lógica de Acierto:** Implementar en el manejador de verificación (`handleVerifica` o similar) el feedback auditivo: `speak('Bene! ' + expectedAnswer)`. 
- Si el ejercicio es de diálogo/completar, el audio debe leer `"Bene! "` seguido de la oración completa reconstruida.
