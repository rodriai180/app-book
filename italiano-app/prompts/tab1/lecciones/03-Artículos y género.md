PROMPT: Pantalla de Práctica Interactiva PREMIUM (Artículos y Género)

Contexto:
Módulo crítico de "Artículos, Género y Partitivos". Requiere una lógica de navegación robusta.

Bifurcación de Navegación:
1. Botones estándar para Reto Rápido en todas las cartas (Navegar a `/reto-rapido` con params).
2. Botones de Sesión Total:
    - Para las cartas de artículos definidos/indefinidos: Navegar a `app/pratica-articoli.tsx`.
    - PARA LA CARTA DE "Artículos Partitivos": Navegar a una pantalla exclusiva `app/pratica-partitivi.tsx`.

Lógica de Datos (mockData.ts):
- `lessonId`: "3".
- `subtopic`: Debe coincidir con los títulos: "Artículos Determinativos", "Artículos Indeterminativos", "Formación del plural", "Pronunciación especial", "Artículos Partitivos".
- `tip`: Regla gramatical detallada en **ESPAÑOL**.

Requerimientos de la Pantalla "Artículos Partitivos":
- Estética ultra-limpia (estilo Duolingo/Babbel).
- Hueco dinámico en la pregunta que se rellena al elegir la opción.
- Explicaciones de por qué se usa "del", "dello", "dell'", etc.
- Audio TTS obligatorio en cada opción.

Contenido del Módulo:
- Definidos: il, lo, la, l', i, gli, le.
- Indefinidos: un, uno, una, un'.
- Partitivos: del, dello, della, dell', dei, degli, delle.
- Casos especiales: Palabras que empiezan por Z, S+consonante, GN, y vocales.

Interfaz:
- 100% Italiano en textos principales.
- El `tip` (explicación) se muestra al fallar o al presionar un botón de ayuda, y DEBE estar en español para mayor claridad del estudiante.
- Pantalla de éxito final con `Trophy` y resumen de errores.