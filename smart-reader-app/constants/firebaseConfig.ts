import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfeNWFKSTW3I2KjbVv9cL5TSZ5K7jLICY",
  authDomain: "smart-reader-app-3665c.firebaseapp.com",
  projectId: "smart-reader-app-3665c",
  storageBucket: "smart-reader-app-3665c.firebasestorage.app",
  messagingSenderId: "205129078980",
  appId: "1:205129078980:web:a41c736f0090027ceb9191",
  measurementId: "G-1X7BQ2V7NP",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancias de Firestore y Authentication
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
