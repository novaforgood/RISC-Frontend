import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL, // does this proj use db?
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
