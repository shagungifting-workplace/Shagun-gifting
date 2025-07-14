// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB0xA8sb1-LQPoiOaGnLMzZwp3jJG4OpMI",
    authDomain: "shagun-gifting.firebaseapp.com",
    projectId: "shagun-gifting",
    storageBucket: "shagun-gifting.firebasestorage.app",
    messagingSenderId: "125393577354",
    appId: "1:125393577354:web:3995616ef514066cca5473",
    measurementId: "G-YYGY9LZ0DN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
