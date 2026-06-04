## Contexto de la app

App de aprendizaje de italiano en Expo Router + Firebase Firestore.

**Colecciones relevantes:**

- `levelContents`: { id, lessonId, title, explanation?, subSections?, groups?, phrases[] }
- `exercises`: { id, lessonId, subtopic, question, options[], correctAnswer, tip }
  → `subtopic` debe ser EXACTAMENTE igual a `title` del levelContent
  → question y options en italiano / tip en español

**Reglas de idioma:**

- explanation → siempre en ESPAÑOL
- subSections[].items → italiano con traducción (ej: "Ciao — Hola")
- phrases[].italian / phrases[].spanish → como dice el campo
- Ejercicios: question + options en italiano, tip en español
- Mínimo 2 ejemplos de cada concepto del subtema
- Progresión de dificultad dentro del subtema
- Nunca traducción directa como único ejercicio — siempre comprensión por contexto

**Firebase config:**
apiKey: "AIzaSyAmWDkhB3wrQw_Vk8IbE4bKkM1GCoKq1xU"
authDomain: "italian-app-488ee.firebaseapp.com"
projectId: "italian-app-488ee"
storageBucket: "italian-app-488ee.firebasestorage.app"
messagingSenderId: "923769718572"
appId: "1:923769718572:web:747c42ade31331f0758e89"

**Working directory:** c:\Users\rodri\OneDrive\Desktop\RodrigoAreaDeTrabajo\Apps\italiano-app

## Proceso

El usuario pre-aprobó todo — proceder siempre sin pedir confirmación.

1. Leer levelContents actuales de Firestore para la lección indicada
2. Proponer estructura mejorada brevemente
3. Escribir \_tmp_lX.mjs, ejecutarlo, borrarlo
   - Borra levelContents viejos + inserta nuevos
   - Borra exercises viejos + inserta nuevos (12 por subtema)

## Lista de trabajo

| #   | Lección               | Nivel | Estado    |
| --- | --------------------- | ----- | --------- |
| 0   | Fonética y Alfabeto   | A1    | hecho     |
| 1   | Saludos               | A1    | hecho     |
| 2   | Supervivencia         | A1    | hecho     |
| 3   | Artículos             | A1    | hecho     |
| 4   | Verbos fundamentales  | A1    | hecho     |
| 5   | Números y Horas       | A1    | hecho     |
| 6   | Familia y Posesivos   | A1    | hecho     |
| 7   | Descripción y Colores | A1    | hecho     |
| 8   | Gustos                | A2    | hecho     |
| 9   | Preguntas             | A2    | hecho     |
| 10  | Verbos regulares      | A2    | hecho     |
| 11  | Reflexivos            | A2    | hecho     |
| 12  | Preposiciones         | A2    | hecho     |
| 13  | Pronombres directos   | A2    | hecho     |
| 14  | Restaurante/Compras   | A2    | hecho     |
| 15  | Adverbios             | A2    | hecho     |
| 16  | Conectores            | B1    | hecho     |
| 17  | Passato Prossimo      | B1    | hecho     |
| 18  | Imperfetto            | B1    | hecho     |
| 19  | Futuro                | B1    | hecho     |
| 20  | Condicional           | B1    | hecho     |
| 21  | Pronombres indirectos | B1    | hecho     |
| 22  | Comparativos          | B1    | hecho     |
| 23  | CI y NE               | B1    | hecho     |
| 24  | Congiuntivo Presente  | B2    | hecho     |
| 25  | Congiuntivo Imperf.   | B2    | hecho     |
| 26  | Condizionale Composto | B2    | hecho     |
| 27  | Pronomi Combinati     | B2    | hecho     |
| 28  | Trapassato Prossimo   | B2    | hecho     |
| 29  | Forma Passiva         | B2    | hecho     |
| 30  | Discorso Indiretto    | B2    | hecho     |
| 31  | Passato Remoto        | C1/C2 | hecho     |
| 32  | Periodo Ipotetico     | C1/C2 | hecho     |
| 33  | Modismi e Proverbi    | C1/C2 | hecho     |
| 34  | Linguaggio Settoriale | C1/C2 | hecho     |

## Para retomar

Decirle a Claude: "Leé el archivo prompts/quiz-generate.md y continuá con la lección pendiente."
