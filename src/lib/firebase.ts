// Firebase initialization for aygram
// Config from user - project: aygram-8d0d0
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';

// Helper to decrypt Base64 encrypted env values
const decryptEnv = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  // Try to decode Base64 - if it looks like Base64 and decodes to valid string, use decoded
  try {
    // Check if value is Base64 (alphanumeric + +/ = and length %4==0)
    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(value) && value.length % 4 === 0;
    if (isBase64) {
      const decoded = atob(value);
      // If decoded looks valid (contains . or : or - and is readable), use it
      if (decoded && decoded.length > 3 && /^[\x20-\x7E]+$/.test(decoded)) {
        return decoded;
      }
    }
  } catch {}
  return value;
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Values are Base64 encrypted in .env for security - auto-decrypted here
const firebaseConfig = {
  apiKey: decryptEnv(import.meta.env.VITE_FIREBASE_API_KEY as string | undefined, 'AIzaSyDH-Srcg0yvNXp8U-6bnf47WgXYpXYczOk'),
  authDomain: decryptEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined, 'aygram-8d0d0.firebaseapp.com'),
  projectId: decryptEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined, 'aygram-8d0d0'),
  storageBucket: decryptEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined, 'aygram-8d0d0.firebasestorage.app'),
  messagingSenderId: decryptEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined, '1040582300799'),
  appId: decryptEnv(import.meta.env.VITE_FIREBASE_APP_ID as string | undefined, '1:1040582300799:web:28dfacf8d24e320eef9b4a'),
  measurementId: decryptEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined, 'G-K6BTVB8W6B'),
  databaseURL: decryptEnv(import.meta.env.VITE_FIREBASE_DATABASE_URL as string | undefined, 'https://aygram-8d0d0-default-rtdb.firebaseio.com'),
};

// Initialize Firebase (singleton)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Analytics - only in browser and if supported
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported in this environment
    });
}

// Auth
let auth: Auth | null = null;
try {
  auth = getAuth(app);
} catch {}

// Firestore
let db: Firestore | null = null;
try {
  db = getFirestore(app);
} catch {}

// Storage
let storage: FirebaseStorage | null = null;
try {
  storage = getStorage(app);
} catch {}

// Realtime Database
let rtdb: Database | null = null;
try {
  rtdb = getDatabase(app);
} catch {}

export { app, analytics, auth, db, storage, rtdb, firebaseConfig };
export default app;
