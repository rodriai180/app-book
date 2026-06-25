/** Todo **/
// Administrativo

1. Crear y autmatizar reels para social media, la data a la tenes sol ofalta automatizar
2. studiar si la version pro de claude pueda yaudarte con automatizacion, o podes automatizr contenido de alguna forma
3. agregar el resto de los libros qe me dio meli
4. relevar cuales temas quiero apra la app y hacer litado de librois y emepzar a darle y subir entre 1- 3 al dia
   5.tema legales de la app politcas de uso y demas ..

//Funcional

1. fer como va afuncionar la app limiste de resumens y nugget guardadas (si o no ?),
2. subscripcion par ael contenido generado o se lo damos gratis y funciono solo como afilaido

//Tecnico 0. generar la informacion de reels lo mas autmoatizado psillee

_) ya generamos reels con microlerning usando openai y elevenlabs, generar varis y subir
_) podriamso usar elevenlabs y open para ya crear bien el audio y la sincronizacion de lectura de texto ?

1. deploy app en web, ver si puedo gestioanr el hecho de que cuando la abran se vea full schreem en mobile
2. deploy en mi pagian eb
3. deploy e n app nativa androoid o ios, encesito ve tema costos.
4. la app necesita limpearse a nivel de codigo hay cosas quqe ya no usamos como el smart reader

Este error es el mismo de siempre: el scheduling via API (published: false + scheduled_publish_time) requiere whitelist especial de Meta — no está disponible en Development Mode ni para apps nuevas.

La publicación INMEDIATA funciona (--now ✓). El scheduling vía API no.

Solución actual: Scheduler local (scripts/scheduler.bat) — lee schedule.json, espera hasta la hora, publica con --now.

---

// TODO: Mover scheduler a la nube (GitHub Actions + Firebase Storage)

Objetivo: no depender de tener la PC encendida para publicar en IG.

Flujo target:
  1. Generás el video localmente → se sube a Firebase Storage automáticamente al publicar
  2. GitHub Actions corre un workflow con cron a la hora exacta
  3. El workflow descarga credenciales, lee schedule.json, llama IG API con la URL de Firebase Storage
  4. Publica en IG y guarda igPostId en Firestore
  5. (Opcional) Borra el video de Firebase Storage después de confirmar el igPostId
     → Esperar ~2-3 min antes de borrar porque IG sigue procesando internamente

Pasos de implementación:
  1. Confirmar que scheduler.bat local funciona end-to-end (pendiente de prueba)
  2. Separar la lógica de publish en un script liviano (publish-ig.mjs) que:
       - No genera nada, solo publica
       - Lee la URL de Firebase Storage (reels/<mlId>.mp4)
       - Llama IG API y guarda igPostId en Firestore
       - Borra el archivo de Storage al final (opcional)
  3. Crear GitHub Actions workflow (.github/workflows/publish-ig.yml):
       - Trigger: workflow_dispatch + schedule (cron con las horas de cada slot)
       - Env vars como GitHub Secrets (META_PAGE_TOKEN, META_IG_USER_ID, YOUTUBE_*, etc.)
       - Firebase service account como GitHub Secret
       - Corre publish-ig.mjs con el mlId del slot correspondiente
  4. Actualizar schedule.json para incluir también el path de Firebase Storage de cada video
     o leer ese path desde Firestore (el mlId alcanza para armar la ruta: reels/<mlId>.mp4)

Notas:
  - GitHub Actions gratis: 2,000 min/mes para repos privados, ilimitado para públicos
  - Un publish tarda ~2 min → publicando 3/día usás ~180 min/mes (bien dentro del límite)
  - Firebase Storage: los videos se suben solos cuando el scheduler local publica
  - No usar YouTube como fuente del video → YouTube no da URL directa al .mp4 via API
