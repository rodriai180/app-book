# Migración de Datos y Consumo de Firestore

Usa este prompt cuando ya tengas Firebase configurado (`constants/firebaseConfig.ts`) y quieras migrar tus datos locales de `mockData.ts` a Firestore, además de implementar un servicio centralizado para consumirlos.

---

### Prompt de Aplicación

"Actúa como un Desarrollador Senior de React Native. Mi aplicación está configurada con Firebase Firestore y quiero migrar mi base de datos estática (`mockData.ts`) a la nube y actualizar mis componentes para consumir esos datos en tiempo real.

**Paso 1: Script de Migración**
Crea un script `scripts/migrateData.ts` que:
1. Importe las colecciones `lessons`, `levelContents`, `exercises` y `vocabulary` de `mockData.ts`.
2. Las suba a Firestore manteniendo las siguientes reglas:
   - `lessons`: Mantener los IDs originales.
   - `levelContents`: Deben incluir una propiedad `lessonId` para facilitar las consultas. Los IDs de los documentos deben ser únicos (ej: `l[lessonId]_[itemId]`).
   - `exercises`: Deben incluir una propiedad `lessonId`.
   - `vocabulary`: Subir como una colección plana.

**Paso 2: Centralización del Servicio**
Crea `services/firestoreService.ts` que exporte las siguientes funciones asíncronas optimizadas:
- `getLessons()`: Retorna todas las lecciones.
- `getLevelContentByLessonId(lessonId: string)`: Retorna el contenido pedagógico usando una consulta `where`.
- `getExercisesByLessonId(lessonId: string)`: Retorna los ejercicios filtrados por lección.
- `getVocabulary()`: Retorna toda la biblioteca de palabras.

**Paso 3: Refactorización de Componentes**
Actualiza las pantallas principales para usar el nuevo servicio siguiendo este patrón:
1. Implementar un estado `loading` inicializado en `true`.
2. Usar un `useEffect` para llamar al servicio de Firestore al montar el componente.
3. Mostrar un `ActivityIndicator` (spinner) mientras `loading` sea verdadero.
4. Manejar el caso de 'datos vacíos' para que la app sea resiliente.

Asegúrate de que toda la lógica asíncrona esté dentro de bloques `try/catch` para capturar errores de red o de base de datos de manera silenciosa pero efectiva."
