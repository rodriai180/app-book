# PROMPT-1: Implementación de Text-to-Speech (TTS) en Pantallas de Práctica

Actúa como un experto en React Native y Expo. Tu tarea es integrar funcionalidad de audio (Text-to-Speech) en las pantallas de práctica de una aplicación de aprendizaje de idiomas.

### 1. Requisitos de Librería
- Instalar y utilizar `expo-speech`.
- Utilizar `lucide-react-native` para los iconos (específicamente `Volume2`).

### 2. Lógica Funcional
- Implementar una función [speak(text: string)](cci:1://file:///c:/Users/rodri/OneDrive/Desktop/RodrigoAreaDeTrabajo/Apps/italiano-app/app/pratica-connettori.tsx:109:4-112:6) que use `Speech.speak()`.
- **Configuración:** `language: 'it-IT'`, `pitch: 1.0`, `rate: 0.9` (para una dicción clara).
- Añadir un `Speech.stop()` al inicio de la función para evitar solapamiento de audios.

### 3. Interfaz de Usuario (UI)
- Agregar un icono de altavoz (`Volume2`) al lado de cada línea de diálogo.
- El icono debe estar dentro de un `Pressable` con un estilo circular ligero (`backgroundColor: '#f0f9ff'`, `borderRadius: 12`).
- Al presionar el icono, se debe disparar la función [speak](cci:1://file:///c:/Users/rodri/OneDrive/Desktop/RodrigoAreaDeTrabajo/Apps/italiano-app/app/pratica-connettori.tsx:109:4-112:6).

### 4. Audio Dinámico
- El texto enviado a la función [speak](cci:1://file:///c:/Users/rodri/OneDrive/Desktop/RodrigoAreaDeTrabajo/Apps/italiano-app/app/pratica-connettori.tsx:109:4-112:6) debe ser la frase completa del diálogo.
- **Importante:** Si la frase tiene un espacio en blanco (`TextInput`), la lógica debe mapear los segmentos del diálogo y unir el texto estático con el valor actual que el usuario haya escrito en el input, para que el audio lea la oración completa y coherente.

### 5. Estilo y Tipos
- Asegurar que la interfaz se mantenga 100% en el idioma objetivo (Italiano en este caso).
- Definir tipos explícitos para TypeScript en las funciones de mapeo de diálogos para evitar errores de `any`.



# PROMPT-2: Implementación Global de Audio (TTS) para App de Idiomas

Actúa como experto en React Native y Expo. Tu objetivo es añadir soporte de pronunciación nativa en múltiples pantallas de estudio.

### 1. Configuración de Base
- Usar `expo-speech` y los iconos de `lucide-react-native` (`Volume2`).
- Implementar en cada componente una función [speak(text: string)](cci:1://file:///c:/Users/rodri/OneDrive/Desktop/RodrigoAreaDeTrabajo/Apps/italiano-app/app/pratica-sopravvivenza.tsx:106:4-109:6):
  - Debe ejecutar `Speech.stop()` antes de iniciar.
  - Parámetros: `language: 'it-IT'`, `pitch: 1.0`, `rate: 0.9` (velocidad clara para estudiantes).

### 2. Implementación por Tipo de Pantalla

#### A. Detalle de Lección (Explicaciones y Vocabulario)
- Identificar cada palabra o frase en el idioma objetivo.
- Añadir un botón pequeño (`Pressable`) con el icono `Volume2`.
- Estilo: Icono azul claro (`#f0f9ff`) con bordes redondeados.
- El botón debe activar la función [speak](cci:1://file:///c:/Users/rodri/OneDrive/Desktop/RodrigoAreaDeTrabajo/Apps/italiano-app/app/pratica-sopravvivenza.tsx:106:4-109:6) con el contenido exacto de la frase.

#### B. Práctica con Opciones (Multi-choice)
- Añadir el botón de audio dentro de cada contenedor de opción/botón.
- El usuario debe poder escuchar la pronunciación de la opción sin necesidad de seleccionarla (evento independiente).

#### C. Biblioteca de Vocabulario y Detalle de Palabra
- **En la lista:** Añadir un icono de escucha rápida a la derecha de cada palabra.
- **En el detalle:** 
  - Añadir un botón principal "Escuchar pronunciación" debajo de la palabra grande.
  - Añadir iconos de audio al lado de la "Frase de ejemplo principal" y de cada uno de los "Ejemplos extra".

#### D. Feedback de Acierto (Gamificación)
- Al detectar que el usuario ha respondido correctamente (`isCorrect` o similar):
- Ejecutar la función `speak()` enviando un mensaje concatenado: `"Bene! " + respuesta_correcta`.
- En ejercicios de completar frases, la `respuesta_correcta` debe ser la oración íntegra con el hueco rellenado.
- En ejercicios fonéticos o de opción simple, basta con el nombre de la opción (ej: *"Bene! Gnocchi"*).

### 3. Requisitos de Código y UI
- **Alineación:** Asegurar que los iconos no rompan el layout; usar `flexDirection: 'row'` y `alignItems: 'center'`.
- **TypeScript:** Definir tipos para los parámetros de las funciones `map` y `reduce` utilizadas en el renderizado de diálogos.
- **Inmersión:** Todo el feedback visual (tooltips, mensajes) debe permanecer en el idioma objetivo.