import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "thinkmoney-teste.firebaseapp.com",
  projectId: "thinkmoney-teste",
  storageBucket: "thinkmoney-teste.firebasestorage.app",
  messagingSenderId: "923096084470",
  appId: "1:923096084470:web:e8c45606003f475e90a1d7",
  measurementId: "G-VKN0CFVTX5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)  // para login/cadastro
export const db = getFirestore(app);  // para o banco de dados 
