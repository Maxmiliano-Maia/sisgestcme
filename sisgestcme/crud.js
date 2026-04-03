import { db } from "./firebase.js";
import {
  ref,
  push,
  onValue,
  update,
  remove,
  off
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let materiaisRef = ref(db, "materiais");

// CREATE
export function criarMaterial(lote, descricao) {

  if (!lote || !descricao) {
    alert("Preencha todos os campos!");
    return;
  }

  push(materiaisRef, {
    lote,
    descricao,
    status: "expurgo",
    dataCriacao: Date.now()
  });
}

// READ (com controle de listener)
export function listarMateriais(callback) {

  off(materiaisRef); // evita duplicação

  onValue(materiaisRef, (snap) => {
    callback(snap.val());
  });
}

// UPDATE
export function atualizarStatus(id, status) {

  if (!id || !status) return;

  update(ref(db, `materiais/${id}`), {
    status,
    ultimaAtualizacao: Date.now()
  });
}

// DELETE
export function deletarMaterial(id) {

  if (!id) return;

  if (!confirm("Tem certeza que deseja excluir?")) return;

  remove(ref(db, `materiais/${id}`));
}