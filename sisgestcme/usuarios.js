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

   listaUsuarios.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <strong>${u.email}</strong><br>

        Setor:
        <select onchange="alterarSetor('${uid}', this.value)">
          <option value="expurgo" ${u.setor === "expurgo" ? "selected" : ""}>expurgo</option>
          <option value="lavagem" ${u.setor === "lavagem" ? "selected" : ""}>lavagem</option>
          <option value="preparo" ${u.setor === "preparo" ? "selected" : ""}>preparo</option>
          <option value="esterilizacao" ${u.setor === "esterilizacao" ? "selected" : ""}>esterilizacao</option>
          <option value="distribuicao" ${u.setor === "distribuicao" ? "selected" : ""}>distribuicao</option>
          <option value="admin" ${u.setor === "admin" ? "selected" : ""}>admin</option>
        </select>
      </div>
    `;
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