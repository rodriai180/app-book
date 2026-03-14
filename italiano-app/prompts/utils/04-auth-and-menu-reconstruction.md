# PROMPT — Reconstrucción de Autenticación y Menú Lateral (Desde 0)

Usa este prompt para reconstruir exactamente el sistema de seguridad y navegación de la app.

## 1. FUNDAMENTOS DE SEGURIDAD (Firebase)
Implementa un `AuthProvider` en `services/authContext.tsx` que:
- Use `onAuthStateChanged` para escuchar la sesión.
- Guarde datos adicionales del usuario (`displayName`) en el perfil de Firebase.
- Exponga las funciones: `login`, `register` (con Nombre/Apellido), y `logout`.
- Implemente redirección automática en `app/_layout.tsx`: si no hay usuario, forzar estancia en `/login`.

## 2. PANTALLA DE REGISTRO (Estética Premium)
Crea `app/register.tsx` con las siguientes características:
- **Diseño**: Fondo suave, tarjetas con bordes redondeados (`borderRadius: 12`), iconos de `lucide-react-native`.
- **Campos**: 
    - Nombre y Apellido (Icono `User`).
    - Email (Icono `Mail`, teclado `email-address`).
    - Contraseña y Confirmar Contraseña (Icono `Lock`, `secureTextEntry`).
- **Validaciones**:
    - Validar formato de email con Regex.
    - Contraseña de mínimo 6 caracteres.
    - Las contraseñas deben coincidir exactamente.
- **Feedback**: Mostrar mensajes de error específicos (ej. "Email ya en uso" o "Contraseñas no coinciden") bajo los inputs.

## 3. PANTALLA DE LOGIN
Crea `app/login.tsx`:
- Título: "Benvenuti!" con fuente negrita y grande.
- Subtítulo suave animando a entrar.
- Campos de Email y Contraseña con el mismo estilo que el registro.
- Botón principal de "Entrar" con sombra y feedback visual al pulsar.
- Enlace a la pantalla de registro si no tiene cuenta.

## 4. MENÚ LATERAL (Custom Drawer)
Crea `components/SideMenu.tsx`:
- **Comportamiento**: Panel que aparece desde la izquierda con animación de `slide` y `fade`.
- **UI**: 
    - Backdrop semi-transparente que cierra el menú al tocarlo.
    - Cabecera con Avatar (Icono `User`), Nombre completo del usuario y su Email.
    - Divisor elegante (`divider`).
    - Sección "Account" con botón de "Profilo".
    - Botón de **"Esci" (Cerrar Sesión)** en la parte inferior con icono `LogOut` y color rojo de acento.
- **Integración**: Los tabs deben tener un icono de `Menu` en la parte superior izquierda del header que active este panel usando un estado global de visibilidad.

## REQUISITOS TÉCNICOS:
- Usar `Colors.ts` para mantener la paleta (Verde Premium, Rojo Italiano).
- Usar `lucide-react-native` para todos los iconos.
- Asegurar que el teclado no tape los campos usando `KeyboardAvoidingView`.
- Navegación gestionada por `expo-router`.
