// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBELgYSM2ZcgJ6NdmH9PRv8ZJxq6hjwWz4",
  authDomain: "zapdeals.firebaseapp.com",
  projectId: "zapdeals",
  storageBucket: "zapdeals.firebasestorage.app",
  messagingSenderId: "516142837694",
  appId: "1:516142837694:web:c10dcf26e2a7c289d8d3ef",
  measurementId: "G-FL6WWSYJGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error(error);
  }
};

// Function to log out
const logout = () => signOut(auth);

export { auth, signInWithGoogle, logout };

