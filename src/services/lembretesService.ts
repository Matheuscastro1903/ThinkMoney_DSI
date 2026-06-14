import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'
import { Lembrete } from '@/src/models/Lembrete'

export class LembretesService {
  constructor(private userId: string) {}

  private col() {
    return collection(db, 'usuarios', this.userId, 'lembretes')
  }

  async criarLembrete(dados: object) {
    await addDoc(this.col(), { ...dados, criadoEm: Timestamp.now() })
  }

  async buscarLembretes(): Promise<Lembrete[]> {
    const snapshot = await getDocs(query(this.col(), orderBy('vencimento', 'asc')))
    return snapshot.docs.map(d => Lembrete.fromFirestore(d.id, d.data()))
  }

  async atualizar(id: string, dados: object) {
    await updateDoc(doc(db, 'usuarios', this.userId, 'lembretes', id), dados as any)
  }

  async deletar(id: string) {
    await deleteDoc(doc(db, 'usuarios', this.userId, 'lembretes', id))
  }
}
