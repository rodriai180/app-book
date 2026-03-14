PROMPT: Pantalla de Práctica Interactiva + Reto Rápido (Verbos Regulares)

Contexto:
Módulo de "Verbos Regulares (-ARE, -ERE, -IRE)" (Lección 12).

Configuración de Navegación (clase.tsx):
- Botón "Reto Rápido" por cada carta: Navega a `/reto-rapido` con `lessonId=12` y `subtopic=Título de la carta`.
- Botón "Sesión Total": Navega a `app/pratica-coniugazione.tsx`.

Estructura de Datos:
- `lessonId`: "12".
- `subtopic`: Debe coincidir con los títulos: "Verbos en -ARE (1ª Conjugación)", "Verbos en -ERE (2ª Conjugación)", "Verbos en -IRE (3ª Conjugación)".
- `tip`: Explicación en **ESPAÑOL** sobre la desinencia correcta (-o, -i, -a/e, -iamo, -ate/ete/ite, -ano/ono).

Objetivos de la Pantalla:
- Título: "Práctica: Coniugazione".
- Estructura: Diálogos donde el usuario completa el verbo conjugado.
- Audio TTS (`it-IT`) para escuchar la frase completa después de completar.
- Visual: Diseño premium con barra de progreso circular o de línea, iconos de éxito/error.

Lógica de Feedback:
- 100% Italiano en la interacción.
- Mostrar el `tip` en español si el usuario falla o lo solicita.
- Pantalla final con felicitación y opción de repetir o volver.
