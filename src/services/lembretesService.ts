import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from './firebaseConfig'

interface Lembrete {
  nomeGasto: string
  categoria: string
  vencimento: string   // "YYYY-MM-DD"
  valor: number
}

// Criar lembrete
export async function criarLembrete(userId: string, dados: Lembrete): Promise<void> {
  await addDoc(collection(db, 'usuarios', userId, 'lembretes'), {
    ...dados,
    criadoEm: Timestamp.now()
  })
}
// Buscar lembretes ordenados pelo vencimento mais próximo
export async function buscarLembretes(userId: string): Promise<(Lembrete & { id: string })[]> {
  const q = query(
    collection(db, 'usuarios', userId, 'lembretes'),
    orderBy('vencimento', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Lembrete }))
}

// Excluir lembrete
export async function excluirLembrete(userId: string, lembreteId: string): Promise<void> {
  await deleteDoc(doc(db, 'usuarios', userId, 'lembretes', lembreteId))
}