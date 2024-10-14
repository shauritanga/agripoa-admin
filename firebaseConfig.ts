// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxsWTdZdM8oHF5W9x_dmj79Li2QJ1nZK8",
  authDomain: "agripoa-b54d1.firebaseapp.com",
  projectId: "agripoa-b54d1",
  storageBucket: "agripoa-b54d1.appspot.com",
  messagingSenderId: "891859102098",
  appId: "1:891859102098:web:640a085cbd86d7d57d394b",
  measurementId: "G-N98BC85DV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
