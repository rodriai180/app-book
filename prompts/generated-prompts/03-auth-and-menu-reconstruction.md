# PROMPT — Sistema de Autenticación, Seguridad y Navegación (Pro Edition)

Usa este prompt para reconstruir el núcleo de seguridad y navegación de la app con estándares de producción.

## 1. INFRAESTRUCTURA DE SEGURIDAD (Firebase + Context)
Implementa un `AuthProvider` en `services/authContext.tsx` que gestione el ciclo de vida del usuario:
- **Estado de Carga**: Incluir un estado `isLoading` (boolean). Mientras sea `true`, el `app/_layout.tsx` debe mostrar un `ActivityIndicator` de pantalla completa para evitar parpadeos de UI.
- **Escucha de Sesión**: Usar `onAuthStateChanged` para persistir la sesión.
- **Perfil de Usuario**: Al registrar, usar `updateProfile` para guardar el `displayName`.
- **Funciones Expuestas**: `login(email, pass)`, `register(email, pass, name)`, `logout()`, y `resetPassword(email)`.
- **Redirección Inteligente**: En `app/_layout.tsx`, implementar un `useEffect` que use `router.replace` para forzar `/login` si no hay usuario, o `/tabs` (home) si el usuario ya está autenticado.

## 2. PANTALLA DE REGISTRO (UX Avanzada)
Crea `app/register.tsx` con estética Premium:
- **Campos con Iconos (`lucide-react-native`)**: 
    - Nombre Completo (User), Email (Mail), Contraseña (Lock), Confirmar Contraseña (Lock).
- **Términos y Condiciones**: 
    - Incluir un `Checkbox` (o `Pressable` con icono de verificación) con el texto: *"Acepto los Términos de Servicio y la Política de Privacidad"*.
    - El botón de "Registrar" debe estar deshabilitado hasta que se marque el checkbox.
- **Validaciones en Tiempo Real**: 
    - Email válido (Regex), contraseña >= 6 caracteres, y coincidencia de contraseñas.
- **Feedback de Carga**: El botón debe mostrar un loader y evitar clics duplicados durante la petición a Firebase.

## 3. PANTALLA DE LOGIN Y RECUPERACIÓN
Crea `app/login.tsx` y su flujo de recuperación:
- **UI**: Título "Benvenuti!" en negrita, campos estilizados con `Colors.ts` y sombras suaves.
- **Recuperación de Pass**: Añadir enlace "¿Olvidaste tu contraseña?" que abra un `Modal` o una sección simple para ingresar el email y ejecutar `sendPasswordResetEmail`. 
- **Manejo de Errores Humano**: No mostrar códigos como `auth/user-not-found`. Mapear los errores a mensajes amigables:
    - `auth/wrong-password` -> "La contraseña es incorrecta".
    - `auth/user-not-found` -> "No existe una cuenta con este email".
    - `auth/invalid-email` -> "El formato del correo no es válido".

## 4. MENÚ LATERAL (Custom Drawer Premium)
Crea `components/SideMenu.tsx` (usando un Modal animado o Drawer de Expo):
- **Header**: Avatar circular (Icono `User`), Nombre completo del usuario y Email (extraídos del `AuthContext`).
- **Navegación**:
    - Sección "Account": Botón "Mio Profilo" (Icono `UserCircle`).
    - Sección "App": Botón "Impostazioni" (Icono `Settings`).
- **Footer**: Botón "Esci" (Cerrar Sesión) con icono `LogOut`, color rojo de acento de la paleta italiana, y una confirmación mediante `Alert`.
- **Trigger**: El icono de menú en el Header de los tabs debe activar este componente.

## REQUISITOS TÉCNICOS Y ESTÉTICOS:
- **Responsive**: Usar `KeyboardAvoidingView` con `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}` para que el teclado no tape los inputs.
- **UI Kit**: Usar `borderRadius: 12` para inputs y botones, y `gap: 15` para espaciado consistente.
- **Colores**: Aplicar estrictamente `Colors.ts` (Verde para botones principales, Rojo para acciones críticas, Gris suave para fondos).
- **Consistencia**: Todos los iconos deben ser de `lucide-react-native`.
