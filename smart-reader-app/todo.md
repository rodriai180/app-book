/** Todo Start **/

// Administrativo 3. agregar el resto de los libros que me dio meli 4. relevar cuales temas quiero para la app y hacer listado de libros y empezar a subir entre 1-3 al dia 5. legales de la app: politicas de uso y demas

// Funcional

1. definir como va a funcionar el limite de resumens y nuggets guardadas (si o no?)
2. subscripcion para el contenido generado o se lo damos gratis y funciona solo como afiliado

// Protocolo de trabajo: generar y publicar videos

1. Generá la cola
   node scripts\utils\generate-queue.mjs --limit 50
   → Crea batch.txt con 50 IDs interleaved por categoría.

2. Generá los videos + publicá en YouTube (combinado, tarda ~5hs)
   scripts\generate-batch.bat --publish-yt
   → Genera imagen + video, sube a YouTube, guarda en Firebase Storage, actualiza schedule.json.

3. Pusheá a git
   git add scripts/schedule.json
   git commit -m "add 50 new yt slots"
   git push
   → GitHub Actions toma el schedule.json y publica en IG en los slots programados.

/** Todo End **/

/** Notas start**/
Notas:

- Si querés generar sin publicar todavía: scripts\generate-batch.bat (sin --publish-yt)
- Si el token de YouTube expiró: scripts\get-token.bat → copiá el YOUTUBE_REFRESH_TOKEN en generate-batch.bat y generate-reel.bat
- Videos quedan en reel-output/ (no van a git)
- Estado actual: node scripts\relevamiento.mjs

// Tecnico

1. deploy app en web (ver full screen en mobile)
2. deploy en pagina web propia
3. deploy nativa Android o iOS (ver costos)
4. limpiar codigo: hay cosas que ya no se usan como el smart reader
   /** Notas End**/
