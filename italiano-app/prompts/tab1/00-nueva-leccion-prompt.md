# PROMPT: Creación de Nueva Lección (Template)

Usa este prompt cuando quieras añadir una lección nueva desde cero siguiendo la arquitectura actual.

**DATOS DE ENTRADA:**
- **Nivel:** [Ej: A1 - Principiante ("El Sobreviviente")]
- **Meta:** [Ej: Sobrevivir a un viaje a Italia]
- **Lección:** [Ej: Números, Horas y Calendario]

---

**PROMPT PARA LA IA:**

Actúa como un Experto Pedagógico en Italiano y Desarrollador Senior de React Native. Tu tarea es implementar la lección mencionada integrándola perfectamente en el código existente.

**PASOS A SEGUIR:**

1. **Actualizar `constants/mockData.ts`:**
   - **`lessons`:** Añade el objeto de la lección con un nuevo ID único. Asigna el nivel (A1, A2 o B1) para que aparezca en la sección correspondiente del Dashboard.
   - **`levelContents`:** Crea el contenido pedagógico. Debe tener entre 3 y 4 "subtemas/niveles" (cards). Cada card debe incluir:
     - Título y Explicación gramatical clara.
     - 5-8 frases de ejemplo con su traducción.
     - (Opcional) Un mini‑diálogo práctico.
   - **`exercises`:** Genera 10-12 ejercicios de opción múltiple específicos para este tema.
   - **`vocabulary`:** Añade 10-15 palabras clave de esta lección a la biblioteca global, con ejemplos y tips de uso.

2. **Actualizar `app/clase.tsx`:**
   - Busca la lógica de `displaySubtitle` y añade el subtítulo correspondiente al nuevo `lessonId`.

3. **Configurar Práctica:**
   - Si la lección requiere una lógica de práctica especial (como la de Fonética), crea un nuevo archivo `app/pratica-[nombre].tsx`.
   - Si usa la práctica estándar, asegúrate de que el botón "Sesión Total" en `clase.tsx` esté correctamente linkeado al componente de práctica.

4. **Diseño Premium:**
   - Asegúrate de que todos los textos, ejemplos y audios (TTS) sigan el estándar de calidad y alineación a la izquierda definido en el proyecto.

**REQUERIMIENTO FINAL:**
Entrega el código listo para copiar y pegar, asegurándote de no romper los tipos de TypeScript definidos en las interfaces.
---

*Este prompt sirve como plantilla base para generar rápidamente todas las lecciones y sus prácticas correspondientes a cada nivel del roadmap.*
