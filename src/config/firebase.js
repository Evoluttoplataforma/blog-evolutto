import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCeNwe3kjMYvES5aJgx27-xeI9k2oWcFKM",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blog-do-evolutto.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blog-do-evolutto",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blog-do-evolutto.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "815313176198",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:815313176198:web:9bd61cb28e4c144b82b307"
};

// Validar se as credenciais básicas estão presentes
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

let app;
try {
    if (isConfigValid) {
        app = initializeApp(firebaseConfig);
    } else {
        console.warn('Firebase credentials missing or invalid. Check your .env file.');
        app = null;
    }
} catch (error) {
    console.error('Firebase initialization failed:', error);
    app = null;
}

// Initialize services with null check
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;
