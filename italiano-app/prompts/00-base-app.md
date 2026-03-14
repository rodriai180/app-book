Crea una aplicación móvil para aprender italiano con React Native y Expo (SDK más reciente).
La app debe tener un diseño premium: modo oscuro por defecto, tipografía moderna (Inter u Outfit), espaciado generoso, bordes redondeados (lg/xl) y sombras suaves.

Estructura de navegación (Bottom Tabs):
1. **Inicio:** Dashboard principal con lecciones agrupadas por niveles.
2. **Reto Rápido:** Sesiones de 5 ejercicios aleatorios con pantalla de resultados y trofeo al finalizar.
3. **Vocabulario:** Biblioteca de palabras con buscador y filtros por categoría.

Detalles de navegación y pantallas:
- **Autenticación (Firebase Auth):**
    - La app debe estar protegida. Si el usuario no está logueado, redirigir siempre a `/login`.
    - **Pantalla de Registro:** Solicita Nombre, Apellido, Email y Contraseña (con confirmación y validación de formato).
    - **Pantalla de Login:** Acceso con Email y Contraseña. Estética premium.
- **Menú Lateral (Side Menu):**
    - Accesible mediante un icono de "hamburguesa" (Menu) en la parte superior izquierda del header.
    - Contenido: Avatar circular, Nombre del usuario, Email y botón de "Esci" (Cerrar sesión) con icono `LogOut`.
    - Animación lateral desde la izquierda con backdrop semi-transparente.
- **Pantalla de Inicio (Dashboard):**
    - Muestra cinco secciones expandibles (tipo acordeón) con animación suave (LayoutAnimation):
        1. **Principiante (El "Sobreviviente"):** Subtítulo "Sobrevivir a un viaje a Italia" (Nivel A1).
        2. **Elemental (El "Viajero"):** Subtítulo "Hablar de tu vida cotidiana y entorno" (Nivel A2).
        3. **Intermedio (El "Independiente"):** Subtítulo "Contar historias y expresar planes" (Nivel B1).
        4. **Avanzado (El "Fluido"):** Subtítulo "Argumentar y debatir temas abstractos" (Nivel B2).
        5. **Maestría (El "Nativo"):** Subtítulo "Matices, ironía y lenguaje culto" (Nivel C1/C2).
    - La sección A1 debe estar abierta por defecto.
    - Cada encabezado de sección debe incluir el **Badge de nivel** (ej. A1, B2, C1/C2) a la derecha del título.
    - Cada lección dentro de las secciones se muestra como una tarjeta con: Borde color verde principal, Título, Descripción y un icono de ChevronRight.
- **Pantalla de Clase:**
    - Al tocar una lección, abre esta pantalla.
    - Contenido: Título, Subtítulo descriptivo y una lista de "Niveles/Cards" de contenido.
    - Cada card de contenido incluye: Título, Explicación gramatical, Frases de ejemplo (Italiano/Español) y un botón "Sesión Total" que lleva a la práctica específica.
    - **Integración de Audio:** Cada frase en italiano debe tener un icono de altavoz que active el Text-to-Speech (expo-speech).

Requisitos Técnicos:
- Usa `Theme.ts` para centralizar colores, espaciados y sombras.
- **Autenticación (Firebase Auth):** Gestionada globalmente mediante `services/authContext.tsx`.
- **Componentes:** `components/SideMenu.tsx` para el menú lateral personalizado.
- **Base de Datos:** Firebase Firestore para persistencia de datos (Lessons, levelContents, exercises, vocabulary).
- **Servicios:** `services/firestoreService.ts` centraliza todas las consultas a la base de datos.
- **Configuración:** `constants/firebaseConfig.ts` para la inicialización del SDK.
- Implementa un sistema de navegación mediante `expo-router` con lógica de protección de rutas en `app/_layout.tsx`.
- La interfaz debe ser responsiva y visualmente impactante ("Wow factor").

Estructura de Datos (Firestore):
- `lessons`: Documentos con `id`, `title`, `description`, `level`.
- `levelContents`: Documentos con `id`, `lessonId`, `title`, `explanation`, `phrases[]`, `dialogue[]`.
- `exercises`: Documentos con `id`, `lessonId`, `type`, `question`, `options[]`, `correctAnswer`, `tip`.
- `vocabulary`: Documentos con `id`, `word`, `translation`, `category`, `example`, `example_translation`.
