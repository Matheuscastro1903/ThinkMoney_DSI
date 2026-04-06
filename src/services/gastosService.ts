import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where, Timestamp } from 'firebase/firestore'
import { db } from './firebaseConfig'

interface Gasto {
  valor: number
  data: string        // "YYYY-MM-DD"
  descricao: string
  categoria: string
  fixo: boolean       // true = fixo | false = variável
}

// Criar gasto
export async function criarGasto(userId: string, dados: Gasto): Promise<void> {
  await addDoc(collection(db, 'usuarios', userId, 'gastos'), {
    ...dados,
    criadoEm: Timestamp.now()
  })
}
// Buscar todos os gastos
export async function buscarGastos(userId: string): Promise<(Gasto & { id: string })[]> {
  const q = query(
    collection(db, 'usuarios', userId, 'gastos'),
    orderBy('criadoEm', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Gasto }))
}

// Buscar só os fixos ou só os variáveis
export async function buscarGastosPorTipo(userId: string, fixo: boolean) {
  const q = query(
    collection(db, 'usuarios', userId, 'gastos'),
    where('fixo', '==', fixo)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Gasto }))
}

// Excluir gasto
export async function excluirGasto(userId: string, gastoId: string): Promise<void> {
  await deleteDoc(doc(db, 'usuarios', userId, 'gastos', gastoId))
}