# PROMPT DE MANTENIMIENTO: Práctica 18 - L'Imperfetto

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener o reconstruir la pantalla de práctica del Imperfetto.

**ESTRUCTURA FILOSÓFICA:**
La pantalla `app/pratica-imperfetto.tsx` debe permitir al usuario practicar descripciones y hábitos en el pasado mediante ejercicios de completar huecos (Fill-in-the-blanks).

**REGLAS TÉCNICAS:**
1. **Datos:** Usa el array `ESERCIZI` con objetos que tengan `sentence` (fragmentos de texto), `answer`, `translation` e `hint`.
2. **Interactividad:**
   - Input dinámico que se valida contra la `answer`.
   - Botón de audio (TTS) que lee la frase completa al presionar o al acertar.
   - Barra de progreso animada.
3. **Feedback:** Color verde (`theme.success`) al acertar, vibración o sonido sutil (opcional).
4. **UI:** Mantener el estilo premium con tarjetas, sombras y tipografía legible.

**CONTENIDO SEMÁNTICO:**
Frases tipo: "Da bambino giocavo...", "Quando ero piccolo...", "Faceva freddo...".
