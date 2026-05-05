import { addDoc, collection, deleteDoc, doc, getDocs, increment, orderBy, query, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

export interface Meta {
  nomeMeta: string
  valorTotal: number
  valorPoupado: number
  dataLimite: string
  categoria: string
  descricao?: string
}

class MetasService {
  async criar(userId: string, dados: Omit<Meta, 'valorPoupado'>): Promise<void> {
    await addDoc(collection(db, 'usuarios', userId, 'metas'), {
      ...dados,
      valorPoupado: 0,
      criadoEm: Timestamp.now()
    })
  }

  async buscarTodas(userId: string): Promise<(Meta & { id: string })[]> {
    const q = query(
      collection(db, 'usuarios', userId, 'metas'),
      orderBy('criadoEm', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Meta }))
  }

  async contribuir(userId: string, metaId: string, valor: number): Promise<void> {
    await updateDoc(doc(db, 'usuarios', userId, 'metas', metaId), {
      valorPoupado: increment(valor)
    })
  }

  async atualizar(userId: string, metaId: string, dados: Partial<Omit<Meta, 'valorPoupado'>>): Promise<void> {
    await updateDoc(doc(db, 'usuarios', userId, 'metas', metaId), dados)
  }

  async excluir(userId: string, metaId: string): Promise<void> {
    await deleteDoc(doc(db, 'usuarios', userId, 'metas', metaId))
  }
}

export const metasService = new MetasService()