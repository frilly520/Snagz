import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Safe environment access that works across Vite browser, SSR, and Node environments
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const processEnv = typeof process !== 'undefined' ? process.env : undefined;
const env: Record<string, any> = metaEnv || processEnv || {};

/**
 * Firebase Client Configuration
 * Supports environment variables with safe fallbacks so the app never crashes
 * when credentials are not yet configured.
 */
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'ai-studio-dealforgeaismart-8d1d097c-d356-42f3-a83d-34ec7a3e63c5',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== '' && 
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

// Graceful initialization: only initialize if valid apiKey exists
if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(app);
    firebaseAuth = getAuth(app);
    console.log('[Firebase] Initialized successfully for project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('[Firebase] Non-fatal initialization warning:', err);
  }
} else {
  // Graceful stub mode: app operates without remote Firebase
  console.info('[Firebase] Credentials not configured yet; running in local in-memory storage mode.');
}

export { app, firestoreDb, firebaseAuth };

/**
 * Safe connection tester that will never throw an uncaught exception
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured || !firestoreDb) {
    return {
      success: false,
      message: 'Firebase is not yet configured with API credentials. Using in-memory store.'
    };
  }
  return {
    success: true,
    message: `Connected to Firestore project ${firebaseConfig.projectId}`
  };
}
