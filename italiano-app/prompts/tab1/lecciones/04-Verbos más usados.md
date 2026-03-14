PROMPT: Pantalla de Práctica Interactiva + Reto Rápido (Verbos)

Contexto:
Módulo de "Verbos más usados" (Essere, Avere, Fare, etc.).

Configuración de Navegación (clase.tsx):
- Botón "Reto Rápido" por cada carta: Navega a `/reto-rapido` con `lessonId=4` y `subtopic=Título de la carta`.
- Botón "Sesión Total": Navega a `app/pratica-verbi.tsx`.

Estructura de Datos:
- `lessonId`: "4".
- `subtopic`: Debe coincidir con los títulos: "Verbos fundamentales", "Ejemplos prácticos", "Mini conversación".
- `tip`: Explicación de la conjugación o uso en **ESPAÑOL**.

Objetivos de la Pantalla:
- Título: "Práctica: Verbi Comuni".
- Diálogos/Frases con huecos: "Io _______ italiano" (Opciones: sono, ho, faccio).
- Audio TTS (`it-IT`) en cada botón de opción.
- Barra de progreso animada.

Lógica de Feedback:
- 100% Italiano en la interfaz.
- Mostrar el `tip` en español si el usuario lo solicita o al fallar.
- Pantalla final de éxito.