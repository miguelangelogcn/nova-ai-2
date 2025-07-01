import admin from 'firebase-admin';
import { config } from 'dotenv';
config();

// -----------------------------------------------------------------------------
// Firebase Admin
// -----------------------------------------------------------------------------

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
