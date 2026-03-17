# Configuración de Firebase (Database & Auth)

Este prompt se utiliza para configurar rápidamente Firebase en el proyecto utilizando el JS SDK, asegurando compatibilidad con Expo Go y Web.

---

### Prompt de Configuración

"Tengo un proyecto de **Expo (React Native)** y quiero integrar **Firebase** usando el **JS SDK** (para que sea compatible con Expo Go y Web sin configuraciones nativas).

Por favor, realiza lo siguiente:
1. Instala la dependencia `firebase`.
2. Crea un archivo en `constants/firebaseConfig.ts` que inicialice la app.
3. Exporta las instancias de `db` (Firestore) y `auth` (Authentication) para usarlas en el resto del proyecto.

Aquí tienes mis credenciales:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAmWDkhB3wrQw_Vk8IbE4bKkM1GCoKq1xU",
  authDomain: "italian-app-488ee.firebaseapp.com",
  projectId: "italian-app-488ee",
  storageBucket: "italian-app-488ee.firebasestorage.app",
  messagingSenderId: "923769718572",
  appId: "1:923769718572:web:747c42ade31331f0758e89",
  measurementId: "G-CSCD2VLS06"
};
```"
