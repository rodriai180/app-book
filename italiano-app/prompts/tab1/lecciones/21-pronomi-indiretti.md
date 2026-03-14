# PROMPT DE MANTENIMIENTO: Práctica 21 - Pronombres Indirectos

Actúa como un Desarrollador Senior de React Native. Tu tarea es mantener o reconstruir la pantalla de práctica de Pronombres Indirectos.

**ESTRUCTURA FILOSÓFICA:**
La pantalla `app/pratica-pronomi-indiretti.tsx` utiliza micro-diálogos entre dos personas (A y B) para contextualizar el uso del pronombre (¿A quién?).

**REGLAS TÉCNICAS:**
1. **Renderizado de Diálogo:** Mapear `currentEsercizio.dialogue` y agrupar por locutor.
2. **Input:** Situado estratégicamente dentro de la respuesta del locutor B.
3. **TTS:** Al presionar el icono de audio de una línea, debe leer esa línea específica con el pronombre correcto integrado.

**CONTENIDO SEMÁNTICO:**
Mapeo de pronombres: Mi, Ti, Gli, Le, Ci, Vi, Loro. Ejemplo: "A Maria scrivi? Sì, LE scrivo".
