import { auth, db } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  ref,
  onValue,
  update,
  remove,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { set } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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

const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

document.getElementById("btnVoltar").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  if (!confirm("Deseja realmente sair?")) return;

  await signOut(auth);
  window.location.href = "login.html";
});

let isAdmin = false;

const listaUsuarios = document.getElementById("listaUsuarios");

// 🔐 VERIFICA SE É ADMIN
onAuthStateChanged(auth, async (user) => {
  console.log("USER:", user);
  if (!user) {
    console.log("Não logado");
    window.location.href = "login.html";
    return;
  }

  const snap = await get(ref(db, `usuarios/${user.uid}`));
  const dados = snap.val();

if (!dados || dados.permissao !== "admin") {
  alert("Acesso negado!");
  window.location.href = "index.html";
  return;
}

  console.log("É ADMIN ✅");
  isAdmin = true;

  carregarUsuarios();
});

// 📋 LISTAR USUÁRIOS
function carregarUsuarios() {
  console.log("CARREGANDO USUÁRIOS...");
  onValue(ref(db, "usuarios"), (snap) => {
    const dados = snap.val();

    console.log("DADOS USUARIOS:", dados);
    listaUsuarios.innerHTML = "";

    if (!dados) {
      listaUsuarios.innerHTML = "Nenhum usuário encontrado";
      return;
    }

for (let uid in dados) {

  let avatarSetor = {
  expurgo: "🧹",
  lavagem: "🧼",
  preparo: "🧪",
  esterilizacao: "🔥",
  distribuicao: "📦"
};
  let u = dados[uid];

  const div = document.createElement("div");
  div.style.border = "3px solid #ccc";
  div.style.padding = "10px";
  div.style.margin = "10px";

  // email
  const avatar = avatarSetor[u.setor] || "👤";

  const email = document.createElement("div");
  email.textContent = `${avatar} ${u.email}`;
  email.style.fontWeight = "bold";
  email.style.fontSize = "16px";

  div.appendChild(email);

  const setor = document.createElement("div");
  setor.textContent = "🏥 " + u.setor;
  div.appendChild(setor);

  const perm = document.createElement("div");
  perm.textContent = "🔑 " + u.permissao;
  div.appendChild(perm);

  div.appendChild(document.createElement("br"));

  // -------- SETOR --------
  const textoSetor = document.createElement("span");
  textoSetor.textContent = "Setor: ";
  div.appendChild(textoSetor);

  const select = document.createElement("select");

  const setores = [
    "expurgo",
    "lavagem",
    "preparo",
    "esterilizacao",
    "distribuicao"
  ];

  setores.forEach(s => {

    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;

    if (u.setor === s) {
      option.selected = true;
    }

    select.appendChild(option);

  });

  select.addEventListener("change", (e) => {
    alterarSetor(uid, e.target.value);
  });

  div.appendChild(select);

  // -------- PERMISSÃO --------

  div.appendChild(document.createElement("br"));

  const textoPerm = document.createElement("span");
  textoPerm.textContent = "Permissão: ";
  div.appendChild(textoPerm);

  const selectPermissao = document.createElement("select");

  const permissoes = ["usuario", "admin"];

  permissoes.forEach(p => {

    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;

    if (u.permissao === p) {
      option.selected = true;
    }

    selectPermissao.appendChild(option);

  });

  selectPermissao.addEventListener("change", (e) => {
    alterarPermissao(uid, e.target.value);
  });

  div.appendChild(selectPermissao);

  listaUsuarios.appendChild(div);

}
  });
}

// ✏️ ALTERAR PERMISSÃO
window.alterarSetor = (uid, novoSetor) => {
  if (!isAdmin) return;

  if (!confirm("Alterar setor do usuário?")) return;

  update(ref(db, `usuarios/${uid}`), {
    setor: novoSetor
  });
};

window.alterarPermissao = (uid, novaPermissao) => {

  if (!isAdmin) return;

  if (!confirm("Alterar permissão do usuário?")) return;

  update(ref(db, `usuarios/${uid}`), {
    permissao: novaPermissao
  });

};

// ❌ EXCLUIR
window.removerUsuario = (uid) => {
  if (!isAdmin) {
    alert("Sem permissão!");
    return;
  }

  if (!confirm("Tem certeza?")) return;

  remove(ref(db, `usuarios/${uid}`));
};

document.getElementById("btnCriarUsuario").addEventListener("click", async () => {

  if (!isAdmin) {
    alert("Apenas admin pode criar usuários!");
    return;
  }

  const email = document.getElementById("novoEmail").value.trim();
  const senha = document.getElementById("novaSenha").value.trim();
  const setor = document.getElementById("novoSetor").value;
  const permissao = document.getElementById("novaPermissao").value;

    if (!email.includes("@")) {
    alert("Email inválido");
    return;
  }

  if (senha.length < 6) {
    alert("Senha precisa ter pelo menos 6 caracteres");
    return;
  }

  try {

const cred = await createUserWithEmailAndPassword(
  secondaryAuth,
  email,
  senha
);

// UID do novo usuário
const uid = cred.user.uid;

// salvar no banco
await set(ref(db, `usuarios/${uid}`), {
  email: email,
  setor: setor,
  permissao: permissao
});

alert("Usuário criado!");

  } catch (erro) {

    alert("Erro: " + erro.code);

  }

});