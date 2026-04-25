import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBt-wk4sOz860Fyx6t-0XvnkfZuPmmW30",
  authDomain: "cis376legocollectorswebapp.firebaseapp.com",
  projectId: "cis376legocollectorswebapp",
  storageBucket: "cis376legocollectorswebapp.firebasestorage.app",
  messagingSenderId: "386382904178",
  appId: "1:386382904178:web:0fe6d12e71a27f1e35fbeb",
  measurementId: "G-BK6RXE6SL2"
};
// Initialize Firebase
const myapp  = initializeApp(firebaseConfig);

export const auth = getAuth(myapp);
export const db = getFirestore(myapp);
