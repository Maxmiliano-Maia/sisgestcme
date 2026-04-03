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
export async function cadastrar(email, senha, setor) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

    const uid = userCredential.user.uid;

    console.log("Criado no Auth:", uid);

    await set(ref(db, `usuarios/${uid}`), {
      email,
      setor
    });

    console.log("Salvo no DB!");

  } catch (error) {
    console.error("Erro no cadastro:", error);
    alert(error.message);
  }
}

// LOGIN
export function login(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
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