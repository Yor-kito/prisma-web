import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

if (!getApps().length) {
    initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : undefined,
    });
}

const adminDb = getFirestore();

export { adminDb };
