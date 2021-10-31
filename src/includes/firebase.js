/* eslint-disable import/no-unresolved */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCbhgGxMI5oi6bgzAqR1irnz6AlHczLPLw',
  authDomain: 'music-9b0d4.firebaseapp.com',
  projectId: 'music-9b0d4',
  storageBucket: 'music-9b0d4.appspot.com',
  appId: '1:601084594658:web:8ce5e12fbef14d2d03d1bb',
};

const fireBaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

// Initialize Firebase
export {
  fireBaseApp, db, onAuthStateChanged, storage, ref, uploadBytesResumable,
};
