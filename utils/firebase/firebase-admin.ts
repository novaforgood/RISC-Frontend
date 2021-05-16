import admin from 'firebase-admin';

const serviceAccount = require('serviceaccount.json') // should b stored somewhere

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL
  });
}

const db = admin.firestore();
const auth = admin.auth();

export default {db, auth};
