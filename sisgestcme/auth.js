import { auth, db } from "./firebase.js";

import {
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// CADASTRAR COM SETOR
export async function cadastrar(email, senha) {

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

    console.log("Usuário criado:", userCredential.user);

  } catch (error) {

    if (error.code === "auth/email-already-in-use") {

      alert("Este email já está cadastrado. Faça login.");

    } else {

      console.error("Erro no cadastro:", error);
      alert(error.message);

    }

  }

}

// LOGIN
export async function login(email, senha) {
  try {

    const cred = await signInWithEmailAndPassword(auth, email, senha);

    console.log("LOGIN OK:", cred.user);

  } catch (error) {

    console.log("ERRO FIREBASE:", error.code);
    console.log(error);

    alert(error.code);

  }
}

// LOGOUT
export function logout() {
  return signOut(auth);
}

export async function recuperarSenha(email) {

  try {

    await sendPasswordResetEmail(auth, email);

    alert("Email de recuperação enviado!");

  } catch (error) {

    alert("Erro: " + error.message);

  }

}