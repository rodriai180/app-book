import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, terminate } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfeNWFKSTW3I2KjbVv9cL5TSZ5K7jLICY",
  authDomain: "smart-reader-app-3665c.firebaseapp.com",
  projectId: "smart-reader-app-3665c",
  storageBucket: "smart-reader-app-3665c.firebasestorage.app",
  messagingSenderId: "205129078980",
  appId: "1:205129078980:web:a41c736f0090027ceb9191",
  measurementId: "G-1X7BQ2V7NP",
};

// Inicializar Firebase (evitar duplicados en hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportar instancias de Firestore, Authentication y Storage
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Resetea la conexión de Firestore cuando el SDK queda atascado en backoff.
 * Usar cuando aparece "Write stream exhausted" o "Using maximum backoff delay".
 * Después de llamar esto, recargar la página para reinicializar limpiamente.
 */
export const resetFirestore = async (): Promise<void> => {
    try {
        await terminate(db);
        console.log('[Firestore] Conexión terminada. Recargá la página para reinicializar.');
    } catch (e) {
        console.warn('[Firestore] Error al terminar la conexión:', e);
    }
};

export default app;
