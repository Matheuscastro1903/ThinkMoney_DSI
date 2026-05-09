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

export interface EnderecoGasto {
  titulo?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export interface Gasto {
  valor: number;
  data: Date; // "YYYY-MM-DD"
  descricao: string;
  categoria: string;
  fixo: boolean; // true = fixo | false = variável
  endereco?: EnderecoGasto;
}

// Criar gasto
export async function criarGasto(
  userId: string,
  dados: Gasto,
): Promise<string> {
  const ref = await addDoc(collection(db, "usuarios", userId, "gastos"), {
    ...dados,
    criadoEm: Timestamp.now(),
  });
  return ref.id;
}

// Buscar todos os gastos
export async function buscarGastos(
  userId: string,
): Promise<(Gasto & { id: string })[]> {
  const q = query(
    collection(db, "usuarios", userId, "gastos"),
    orderBy("criadoEm", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Gasto) }));
}

// Buscar só os fixos ou só os variáveis
export async function buscarGastosPorTipo(userId: string, fixo: boolean) {
  const q = query(
    collection(db, "usuarios", userId, "gastos"),
    where("fixo", "==", fixo),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Gasto) }));
}

// Excluir gasto
export async function excluirGasto(
  userId: string,
  gastoId: string,
): Promise<void> {
  await deleteDoc(doc(db, "usuarios", userId, "gastos", gastoId));
}

// atualizar gasto
export async function atualizarGasto(
  userId: string,
  gastoId: string,
  dados: Partial<Gasto>,
): Promise<void> {
  await updateDoc(doc(db, "usuarios", userId, "gastos", gastoId), {
    ...dados,
    atualizadoEm: Timestamp.now(),
  });
}
