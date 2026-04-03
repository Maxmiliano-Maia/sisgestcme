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

  if (!dados || dados.setor !== "admin") {
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

  let u = dados[uid];

  const div = document.createElement("div");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.margin = "10px";

  // email
  const strong = document.createElement("strong");
  strong.textContent = u.email;
  div.appendChild(strong);

  div.appendChild(document.createElement("br"));

  // texto setor
  const textoSetor = document.createElement("span");
  textoSetor.textContent = "Setor: ";
  div.appendChild(textoSetor);

  // select
  const select = document.createElement("select");

  const setores = [
    "expurgo",
    "lavagem",
    "preparo",
    "esterilizacao",
    "distribuicao",
    "admin"
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

  listaUsuarios.appendChild(div);

}
  });
}

// ✏️ ALTERAR PERMISSÃO
window.alterarSetor = (uid, novoSetor) => {
  if (!isAdmin) return;

  if (!confirm("Alterar permissão do usuário?")) return;

  update(ref(db, `usuarios/${uid}`), {
    setor: novoSetor
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