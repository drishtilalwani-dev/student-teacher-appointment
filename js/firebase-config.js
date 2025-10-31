// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgcNdzNE8dUAPSTm7DKgbgQSOjDfmCGMQ",
  authDomain: "student-teacher-appointm-7fbd3.firebaseapp.com",
  projectId: "student-teacher-appointm-7fbd3",
  storageBucket: "student-teacher-appointm-7fbd3.appspot.com",
  messagingSenderId: "58908069775",
  appId: "1:58908069775:web:3403fc9ce743b03eae85fa",
  measurementId: "G-CZB5D98K4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
