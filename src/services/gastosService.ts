import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

import { Gasto } from "../models/gasto";

const getGastosCollection = (userId: string, familiaId?: string) =>
  familiaId
    ? collection(db, "familias", familiaId, "gastos")
    : collection(db, "usuarios", userId, "gastos");

const getGastoDoc = (userId: string, gastoId: string, familiaId?: string) =>
  familiaId
    ? doc(db, "familias", familiaId, "gastos", gastoId)
    : doc(db, "usuarios", userId, "gastos", gastoId);

// Criar gasto
export async function criarGasto(
  userId: string,
  gasto: Gasto,
  familiaId?: string
): Promise<string> {
  const ref = await addDoc(getGastosCollection(userId, familiaId), {
    ...gasto.toJson(),
    criadoEm: Timestamp.now(),
  });
  return ref.id;
}

// Buscar todos os gastos
export async function buscarGastos(
  userId: string,
  familiaId?: string
): Promise<Gasto[]> {
  const q = query(
    getGastosCollection(userId, familiaId),
    orderBy("criadoEm", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => Gasto.fromJson(d.id, d.data()));
}

// Buscar só os fixos ou só os variáveis
export async function buscarGastosPorTipo(
  userId: string, 
  fixo: boolean,
  familiaId?: string
): Promise<Gasto[]> {
  const q = query(
    getGastosCollection(userId, familiaId),
    where("fixo", "==", fixo),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => Gasto.fromJson(d.id, d.data()));
}

// Excluir gasto
export async function excluirGasto(
  userId: string,
  gastoId: string,
  familiaId?: string
): Promise<void> {
  await deleteDoc(getGastoDoc(userId, gastoId, familiaId));
}

// Atualizar gasto
export async function atualizarGasto(
  userId: string,
  gastoId: string,
  gasto: Gasto,
  familiaId?: string
): Promise<void> {
  await updateDoc(getGastoDoc(userId, gastoId, familiaId), {
    ...gasto.toJson(),
    atualizadoEm: Timestamp.now(),
  });
}
