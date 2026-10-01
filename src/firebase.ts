import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBll5zwC4i3dVwZ3oCyBe1YSXYKNAtqe7I",
  authDomain: "brewlytics-app-prototype.firebaseapp.com",
  projectId: "brewlytics-app-prototype",
  storageBucket: "brewlytics-app-prototype.firebasestorage.app",
  messagingSenderId: "321765357309",
  appId: "1:321765357309:web:aec710a86daac1af98b094"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
