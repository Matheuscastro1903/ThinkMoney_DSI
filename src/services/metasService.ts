import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, increment, Timestamp } from 'firebase/firestore'
import { db } from './firebaseConfig'

interface Meta {
  nomeObjetivo: string
  valorTotal: number
  valorPoupado: number
  dataLimite: string   // "YYYY-MM-DD"
}

// Criar meta
export async function criarMeta(userId: string, dados: Omit<Meta, 'valorPoupado'>): Promise<void> {
  await addDoc(collection(db, 'usuarios', userId, 'metas'), {
    ...dados,
    valorPoupado: 0,   // sempre começa em zero
    criadoEm: Timestamp.now()
  })
}

// Buscar todas as metas
export async function buscarMetas(userId: string): Promise<(Meta & { id: string })[]> {
  const q = query(
    collection(db, 'usuarios', userId, 'metas'),
    orderBy('criadoEm', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Meta }))
}

// Adicionar valor poupado à meta
export async function contribuirMeta(userId: string, metaId: string, valor: number): Promise<void> {
  await updateDoc(doc(db, 'usuarios', userId, 'metas', metaId), {
    valorPoupado: increment(valor)   // soma sem precisar ler antes
  })
}

// Excluir meta
export async function excluirMeta(userId: string, metaId: string): Promise<void> {
  await deleteDoc(doc(db, 'usuarios', userId, 'metas', metaId))
}