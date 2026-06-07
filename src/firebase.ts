import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDrHwAFxrrGxGudV5thw1DmFZ307UdXmJI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "experthire-hackathon.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "experthire-hackathon",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "experthire-hackathon.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "837712899013",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:837712899013:web:540d31391ad98fc2e439ac",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QXRZYFT9ZB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize other Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
