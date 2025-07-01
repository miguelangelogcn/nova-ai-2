import { initializeApp, getApps, App, AppOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const adminAppOptions: AppOptions = {};

// In a local or non-standard environment, we need to be explicit
// about the project ID to ensure the Admin SDK can authenticate correctly.
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    adminAppOptions.projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

// Initialize on the server, using default credentials in a managed environment
const adminApp: App =
  getApps().find((app) => app.name === 'admin') || initializeApp(adminAppOptions, 'admin');

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);