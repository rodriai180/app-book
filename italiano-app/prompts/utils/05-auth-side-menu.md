# PROMPT — Implementar Autenticación y Menú Lateral

Este prompt describe la implementación del sistema de seguridad y navegación personalizada.

**1. SISTEMA DE AUTENTICACIÓN (Firebase):**
- **AuthContext (`services/authContext.tsx`):**
    - Gestiona el estado global: `user`, `loading`.
    - Proporciona funciones: `login(email, password)`, `register(email, password, name, surname)`, `logout()`.
- **Protección de Rutas (`app/_layout.tsx`):**
    - Verifica el estado de autenticación al cargar.
    - Redirige a `/login` si no hay usuario.
    - Envuelve la app en el `AuthProvider`.

**2. PANTALLAS DE ACCESO:**
- **Registro (`app/register.tsx`):**
    - Campos: Nombre, Apellido, Email, Contraseña, Confirmar Contraseña.
    - Validaciones: Email válido (Regex), contraseña >= 6 caracteres, coincidencia de contraseñas.
- **Login (`app/login.tsx`):**
    - Campos: Email y Contraseña.
    - Error handling: Mostrar mensajes claros (ej. "Email en uso").

**3. MENÚ LATERAL (Side Menu):**
- **Componente (`components/SideMenu.tsx`):**
    - Animación suave con `Animated` (slide + fade).
    - Muestra info del usuario: Avatar, Nombre completo y Email.
    - Botón de cierre de sesión con icono `LogOut`.
- **Integración:**
    - Se añade un disparador (`Menu`) en el `headerLeft` del Layout.
    - El estado `isMenuOpen` se gestiona en el layout de las pestañas (`app/(tabs)/_layout.tsx`).

**ESTILO VISUAL:**
- Seguir el esquema de colores de `Colors.ts` y el diseño premium del resto de la app (bordes redondeados, sombras, tipografía Inter/Outfit).
