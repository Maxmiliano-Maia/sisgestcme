import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOLP_uGOCGJLW2y8df69zw13q7JpLbnzk",
  authDomain: "sisgestcme.firebaseapp.com",

  // 👇 ESSA LINHA ESTAVA FALTANDO
  databaseURL: "https://sisgestcme-default-rtdb.firebaseio.com",

  projectId: "sisgestcme",
  storageBucket: "sisgestcme.firebasestorage.app",
  messagingSenderId: "391084451116",
  appId: "1:391084451116:web:bff3c0aeaea67bd1d7f889",
  measurementId: "G-X2RPP78N6J"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);