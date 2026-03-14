PROMPT: Pantalla de Práctica Interactiva + Reto Rápido (Supervivencia)

Contexto:
Módulo de "Frases de supervivencia" en una app de React Native (Expo).

Configuración de la Lección (clase.tsx):
- Implementar dos botones por cada carta de nivel:
    - "Reto Rápido": Solo practica el subtema de esa carta (navega a `/reto-rapido?lessonId=2&subtopic=Título`).
    - "Sesión Total": Practica todo el módulo (navega a `app/pratica-sopravvivenza.tsx`).

Estructura de Datos (mockData.ts):
- `lessonId`: "2".
- `subtopic`: Debe ser igual al título de la sección (ej: "Frases de emergencia", "¿Cómo pedir ayuda?").
- `tip`: Explicación de la regla o contexto cultural en **ESPAÑOL**.

Objetivos de la Pantalla:
1. Inmersión: Instrucciones en italiano ("Completa la frase di sopravvivenza").
2. Audio: Pronunciación obligatoria para todas las opciones MCQ usando `expo-speech` (`it-IT`).
3. Feedback: Animación de barra de progreso y validación con colores (Verde/Rojo).

Contenido Requerido (Lesson 2):
Incluir ejercicios para:
1. Frases de emergencia (Ayuda, Médico, Policía).
2. Perdido en la ciudad (¿Dónde está...?, Mapa, Estación).
3. Supervivencia básica (No entiendo, Repita por favor).

Diseño Premium:
- Usar iconos de `lucide-react-native` (Info para tips, Trophy para el final).
- Cards redondeadas con sombras suaves coherentes con el Theme de la app.
- El "Reto Rápido" debe manejar el filtrado dinámico del array `exercises` global.