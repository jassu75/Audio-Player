import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCzIBB_iwCZZAu9nOIc-ODErBuwQnr6OAE",
  authDomain: "music-app-ece08.firebaseapp.com",
  projectId: "music-app-ece08",
  storageBucket: "music-app-ece08.firebasestorage.app",
  messagingSenderId: "259636439588",
  appId: "1:259636439588:web:b08a8d7e8b41337695c6b1",
  measurementId: "G-40SZYYDL5S",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
