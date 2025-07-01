import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize on the server, using default credentials in a managed environment
const adminApp: App =
  getApps().find((app) => app.name === 'admin') || initializeApp({}, 'admin');

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
