// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ikeep-mern.firebaseapp.com",
  projectId: "ikeep-mern",
  storageBucket: "ikeep-mern.appspot.com",
  messagingSenderId: "128405169999",
  appId: "1:128405169999:web:3efdbf87625c87b89fc73a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);