import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzU_ijLEQnDI25SzV5zYD47i4FP-FmthI",
  authDomain: "hireiq-2d601.firebaseapp.com",
  projectId: "hireiq-2d601",
  storageBucket: "hireiq-2d601.firebasestorage.app",
  messagingSenderId: "1080071096790",
  appId: "1:1080071096790:web:7a04d9dfda1950ffd1fc77",
  measurementId: "G-YSVS9H6MV3",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
