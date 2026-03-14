PROMPT — Pantalla de Práctica: Fonética y Alfabeto

Crea una pantalla de práctica específica para el nivel de "Fonética y Alfabeto".

**REQUERIMIENTOS:**
1. **Flujo de Ejercicios:** Una serie de 10-15 preguntas interactivas.
2. **Tipos de Ejercicio:**
   - **Escucha y Selecciona:** Reproduce un sonido/palabra usando TTS y el usuario elige la transcripción correcta (ej: Gelato vs Celato).
   - **Regla de Pronunciación:** Preguntas teóricas rápidas (ej: ¿Cómo suena la 'C' antes de 'E' o 'I'?).
3. **Feedback Inmediato:**
   - Si es correcto: Mensaje positivo ("¡Bene!") y sonido de éxito.
   - Si es incorrecto: Mensaje de error, sonido y un "Tip" corto (explicando la regla).
4. **Barra de Progreso:** Indica el avance de la sesión en la parte superior.
5. **Pantalla Final:** Resumen de puntuación y botón para volver a la clase.

**DATOS DE EJEMPLO (en `mockData.ts`):**
- Pregunta: "¿Cómo se pronuncia la 'G' en 'Gelato'?"
- Opciones: ["Como la G en Gato", "Como una Y suave (tipo 'ye')", "Como una J fuerte"]
- Correcta: "Como una Y suave (tipo 'ye')"
- Tip: "La G antes de E o I siempre es suave."
