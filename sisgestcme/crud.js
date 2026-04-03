import { db } from "./firebase.js";
import {
  ref,
  push,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CREATE
export function criarMaterial(lote, descricao) {
  push(ref(db, "materiais"), {
    lote,
    descricao,
    status: "expurgo",
    dataCriacao: Date.now()
  });
}

// READ
export function listarMateriais(callback) {
  onValue(ref(db, "materiais"), (snap) => {
    callback(snap.val());
  });
}

// UPDATE
export function atualizarStatus(id, status) {
  update(ref(db, `materiais/${id}`), {
    status,
    ultimaAtualizacao: Date.now()
  });
}

// DELETE
export function deletarMaterial(id) {
  remove(ref(db, `materiais/${id}`));
}