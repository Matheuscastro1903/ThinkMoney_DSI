import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

interface Lembrete {
  nomeGasto: string
  categoria: string
  vencimento: string   // "YYYY-MM-DD"
  valor: number
  status: 'PENDENTE' | 'PAGO'
}

export class LembretesService {
  constructor(private userId:string) {}

  private col (){
    return collection(db, 'usuarios', this.userId, 'lembretes')
  }

  async criarLembrete(lembrete: Lembrete) {
    await addDoc(this.col(), { ...lembrete, criadoEm: Timestamp.now() })
  }

  async buscarLembretes() {
    const snapshot= await getDocs(query(this.col(), orderBy('vencimento', 'asc')))
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Lembrete }))
  }

  async atualizar(id:string, dados: Partial<Lembrete>) {
    await updateDoc(doc(db, 'usuarios', this.userId, 'lembretes', id), dados)
  }

  async deletar(id:string) {
    await deleteDoc(doc(db, 'usuarios', this.userId, 'lembretes', id))
  }
}