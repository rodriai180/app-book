import { initializeApp } from 'firebase/app';
import {
    browserLocalPersistence,
    browserSessionPersistence,
    indexedDBLocalPersistence,
    initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAmWDkhB3wrQw_Vk8IbE4bKkM1GCoKq1xU",
  authDomain: "italian-app-488ee.firebaseapp.com",
  projectId: "italian-app-488ee",
  storageBucket: "italian-app-488ee.firebasestorage.app",
  messagingSenderId: "923769718572",
  appId: "1:923769718572:web:747c42ade31331f0758e89",
  measurementId: "G-CSCD2VLS06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);

// Initialize Auth with persistent session
// Web: initializeAuth with explicit browser persistence (localStorage + indexedDB)
// Native: initializeAuth with AsyncStorage persistence (via getReactNativePersistence)
function createAuth() {
  if (Platform.OS === 'web') {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    });
  } else {
    // On React Native, firebase/auth resolves to the RN entry point
    // which exports getReactNativePersistence
    const { getReactNativePersistence } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
}

export const auth = createAuth();

export default app;
