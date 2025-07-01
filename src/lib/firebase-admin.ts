import { config } from 'dotenv';
config({ path: '.env.local' }); // Explicitly load .env.local

import { initializeApp, getApps, App, AppOptions, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


// This function handles initialization, preventing re-initialization in hot-reload environments.
function initializeAdminApp() {
    const existingApp = getApps().find(app => app.name === 'admin');
    if (existingApp) {
        return existingApp;
    }

    // Try to use service account credentials from environment variables.
    // This is the recommended approach for local development and CI/CD.
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replaces escaped newlines
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    const hasServiceAccount = serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail;

    // Use cert credentials if all parts of the service account are provided.
    // Otherwise, fall back to default credentials (for deployed environments like Cloud Run).
    const options: AppOptions = hasServiceAccount ? { credential: cert(serviceAccount) } : {};
    
    if (!hasServiceAccount) {
        console.warn(
            "Firebase Admin SDK: Service account credentials not found in .env.local. " +
            "Attempting to initialize with default credentials. " +
            "For local development, please create a .env.local file with FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
        );
    }

    return initializeApp(options, 'admin');
}

const adminApp: App = initializeAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
