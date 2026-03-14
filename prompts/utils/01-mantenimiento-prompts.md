# Prompt de Mantenimiento: Sincronización de Prompts (v2 - Self-Updating)

Copia y pega este prompt al final de tu sesión de trabajo para que la IA actualice automáticamente toda la documentación de prompts del proyecto.

---

**PROMPT PARA LA IA:**

Actúa como un Documentalista Técnico y Desarrollador Senior. Tu tarea es sincronizar la carpeta `/prompts` con el estado actual de la aplicación.

**OBJETIVO:**
Asegurar que si borramos todo el código hoy, podamos reconstruir la app exactamente como está ahora usando estos prompts paso a paso.

**PASOS A SEGUIR:**
1. **Analizar el Código Actual:** Revisa la estructura de carpetas (`app/`, `constants/`, `components/`), navegación (`expo-router`), lógica de datos (`mockData.ts`) y el sistema de diseño (`Theme.ts`).
2. **Identificar Cambios de Arquitectura:** 
   - Verifica si se han añadido nuevos niveles (ej. C1/C2) o lecciones (ahora 35 lecciones, de 0 a 34).
   - Detecta si el proyecto ha pasado de usar `mockData` a una Base de Datos real.
   - Revisa si hay nuevas pantallas de práctica (`pratica-*.tsx`).
   - **NUEVO:** Revisa la implementación de Autenticación (`AuthContext`) y el Menú Lateral (`SideMenu`).
3. **Actualizar Prompts de Construcción:**
   - **`00-base-app.md`**: Actualiza si cambió la fundación, Auth o los 5 niveles (A1-C2).
   - **`01-tab1.md`**: Asegúrate de que el Dashboard refleje el botón de menú en el header.
   - **`/prompts/04-auth-and-menu-reconstruction.md`**: Sincroniza la implementación de seguridad y el menú lateral desde cero.
   - **`/prompts/tab1/lecciones/`**: Sincroniza cada uno de los 35 archivos de práctica con el contenido real de `mockData.ts` y las pantallas correspondientes.
   - **`03-text-to-speech.md`** y otros: Actualiza si cambiaron las librerías o la implementación técnica.
   - **`utils/03-migracion-y-consumo-firestore.md`**: Asegúrate de que el flujo de migración y el servicio de Firestore estén al día.
4. **AUTO-ACTUALIZAR ESTE PROMPT:** 
   - Si la estructura de carpetas de prompts cambia o se introducen nuevos estándares de documentación, **actualiza este archivo**.

**FORMATO DE SALIDA:**
Actualiza los archivos directamente de forma silenciosa. Los prompts deben ser siempre una "foto" fiel del código actual. No expliques los cambios a menos que sean críticos para la arquitectura.
---
