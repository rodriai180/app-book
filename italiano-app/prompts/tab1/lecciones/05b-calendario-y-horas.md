PROMPT: Pantalla de Práctica Interactiva + Reto Rápido (Calendario)

Contexto:
Módulo de "Números, Horas y Calendario" (Lección 9).

Configuración de Navegación (clase.tsx):
- Botón "Reto Rápido" por cada carta: Navega a `/reto-rapido` con `lessonId=9` y `subtopic=Título de la carta`.
- Botón "Sesión Total": Navega a `app/pratica-calendario.tsx`.

Estructura de Datos:
- `lessonId`: "9".
- `subtopic`: Debe coincidir con los títulos: "Los Números", "¿Qué hora es?", "Días y Meses".
- `tip`: Explicación clara sobre las reglas horarias (uso de È l'una vs Sono le...) o números en **ESPAÑOL**.

Objetivos de la Pantalla:
- Título: "Práctica: Calendario e Ore".
- Estructura: Diálogos de completar huevos con opciones múltiples o entrada de texto.
- Audio TTS (`it-IT`) en cada frase completa al verificar.
- Visual: Barra de progreso y feedback con colores (Verde acierto, Naranja/Rojo fallo).

Lógica de Feedback:
- Idioma: Italiano en la interacción, Español en las explicaciones/tips.
- Animaciones: Transiciones suaves entre ejercicios.
