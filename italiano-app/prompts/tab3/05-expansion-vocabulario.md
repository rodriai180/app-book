# PROMPT: Expansión de Vocabulario Premium (200+ ítems)

## Contexto
Generar una base de datos masiva de vocabulario en formato JSON/TypeScript para una aplicación de aprendizaje de italiano (Expo/React Native).

## Requerimientos Técnicos
Cada elemento debe seguir estrictamente esta interfaz:
```typescript
interface VocabularyItem {
  id: string; // Incremental (v1, v2, v3...)
  word: string; // En italiano
  translation: string; // En español
  example: string; // Oración corta y útil en italiano
  category: string; // Nombre de la categoría
  usageTip: string; // Breve explicación gramatical o cultural en español
  extraExamples: string[]; // 2-3 oraciones adicionales en italiano
}
```

## Categorías y Distribución
Generar entre **15 y 25 ejemplos por categoría** para un total de ~200 palabras:

1.  **Comida** (Cibo e Bevande)
2.  **Transporte** (Città e Trasporti)
3.  **Familia** (Famiglia e Relaciones)
4.  **Tiempo** (Tempo e Meteo)
5.  **Casa** (Casa e Oggetti)
6.  **Salud** (Salute e Corpo)
7.  **Trabajo** (Lavoro e Estudio)
8.  **Emociones** (Emozioni e Sentimenti)
9.  **Viajes** (Viaggi e Vacanze)
10. **Moda** (Abbigliamento e Moda)

## Guía de Calidad
*   **Audio Pro-activo:** Las frases deben ser claras ya que se usarán con TTS (Text-to-Speech).
*   **Nivel de dificultad:** Mezclar palabras básicas (A1) con términos intermedios (A2/B1).
*   **Variedad:** Incluir sustantivos, adjetivos y verbos clave dentro de cada tema.
*   **Inmersión:** Los `extraExamples` deben ser 100% en italiano.

## Ejemplo de Respuesta Esperada (Formato JSON)
```json
{
  "id": "v101",
  "word": "Forchetta",
  "translation": "Tenedor",
  "example": "Ho bisogno di una forchetta per la pasta.",
  "category": "Comida",
  "usageTip": "Es femenina, plural es 'forchette'.",
  "extraExamples": ["La forchetta è d'argento.", "Dove sono le forchette?"]
}
```
