PROMPT: Pantalla de Práctica Interactiva (MCQ + Audio + 100% Inmersión) + Reto Rápido

Contexto:
Actualizar la navegación y crear pantallas de práctica para el módulo de "Saludos esenciales" en una app de React Native (Expo).

Requerimientos de Navegación y Estructura:
1. Botones en cada carta de la lección (clase.tsx):
    - Botón "Reto Rápido" (Secundario): Navegar a `app/reto-rapido.tsx` pasando `lessonId` y `subtopic` (el título de la carta).
    - Botón "Sesión Total" (Primario): Navegar a la pantalla completa del módulo `app/pratica-saluti.tsx`.
2. Registrar las nuevas rutas en `app/_layout.tsx`.

Objetivo de las Pantallas:
- Reto Rápido: Filtrar dinámicamente ejercicios de `mockData.ts` que coincidan con el `subtopic` proporcionado.
- Sesión Total: Mostrar todos los ejercicios del módulo.
- Interfaz: 100% en italiano para el contenido (instrucciones: "Scegli la risposta corretta").

Especificaciones de Datos (mockData.ts):
Cada ejercicio en el array `exercises` debe seguir esta estructura:
- `id`: Único (e1, e2...).
- `lessonId`: "1".
- `subtopic`: Debe coincidir EXACTAMENTE con el título del subtema en `levelContents` (ej: "Diferencia entre formal e informal").
- `question`: Texto en italiano con hueco o diálogo corto.
- `options`: 4 opciones en italiano.
- `correctAnswer`: La opción correcta.
- `tip`: **REGLA EN ESPAÑOL** (ej: "Regla: Buongiorno es formal/neutral").

Contenido Obligatorio (Lesson 1):
Generar ejercicios para los siguientes subtemas (mínimo 3 por subtema):
1. Diferencia entre formal e informal (Ciao vs Buongiorno).
2. Saludos según el momento del día (Buongiorno, Buonasera, Buonanotte).
3. La cortesía en Italia (Per favore, Grazie, Prego).
4. Despedidas comunes (Arrivederci, A presto).

Diseño y Feedback:
- Card de Progreso: Barra animada "Esercizio X di N".
- TTS: Botón con icono `Volume2` en cada opción para escuchar la pronunciación (`it-IT`).
- Lógica: Feedback visual inmediato (verde/rojo). Botón de "Ver explicación" que muestre el `tip` en español.
- Diseño Minimalista: Eliminar obligatoriamente títulos y subtítulos internos dentro de la pantalla para evitar redundancia con el header.
- Header Premium: Asegurar que el título del Header y la flecha de navegación sean blanco puro (#FFFFFF) en modo oscuro.
- Pantalla Final: Trofeo (`Trophy`), resumen de puntos y botón para volver a la clase.

Restricciones:
- No usar español en la interfaz de la práctica (solo en los tips/ayuda).
- Soporte para audio obligatorio en todas las opciones.