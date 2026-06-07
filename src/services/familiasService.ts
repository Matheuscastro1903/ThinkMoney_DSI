import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  Timestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebaseConfig'

import { UsuarioProps } from "@/src/types/usuario";
import { FamiliaPayloadProps, FamiliaProps } from "@/src/types/familia";

export class FamiliaService {

  async verMembrosFamilia(id: string): Promise<FamiliaProps | null> {
    try {
      const docRef = doc(db, 'familias', id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        console.warn(`Família com id "${id}" não encontrada.`)
        return null
      }

      return { id: docSnap.id, ...docSnap.data() } as FamiliaProps
    } catch (error) {
      console.error('Erro ao buscar membros da família:', error)
      throw error
    }
  }

  async criarFamilia(nome: string, admin: UsuarioProps): Promise<string> {
    try {
      const codigo_convite = await this.gerarCodigo()

      const novaFamilia: FamiliaPayloadProps = {
        nome,
        codigo_convite,
        admin,
        membros: [admin],
        lembretes: [],
        metas: [],
        gastos: []
      }

      const docRef = await addDoc(collection(db, 'familias'), novaFamilia)
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar família:', error)
      throw error
    }
  }

  async editarFamilia(id: string, nome: string): Promise<void> {
    try {
      const docRef = doc(db, 'familias', id)
      await updateDoc(docRef, {
        nome,
        atualizadoEm: Timestamp.now(),
      })
    } catch (error) {
      console.error('Erro ao editar família:', error)
      throw error
    }
  }

  async excluirFamilia(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'familias', id))
    } catch (error) {
      console.error('Erro ao excluir família:', error)
      throw error
    }
  }

  async adicionarMembro(familiaId: string, membro: UsuarioProps): Promise<void> {
    try {
      const docRef = doc(db, 'familias', familiaId)
      await updateDoc(docRef, {
        membros: arrayUnion(membro),
      })
    } catch (error) {
      console.error('Erro ao adicionar membro:', error)
      throw error
    }
  }

  async removerMembro(familiaId: string, membro: UsuarioProps): Promise<void> {
    try {
      const docRef = doc(db, 'familias', familiaId)
      await updateDoc(docRef, {
        membros: arrayRemove(membro),
      })
    } catch (error) {
      console.error('Erro ao remover membro:', error)
      throw error
    }
  }

  async buscarPorCodigo(codigo_convite: string): Promise<(FamiliaProps & { id: string }) | null> {
    try {
      const q = query(
        collection(db, 'familias'),
        where('codigo_convite', '==', codigo_convite)
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        console.warn(`Nenhuma família encontrada com o código "${codigo_convite}".`)
        return null
      }

      const docSnap = snapshot.docs[0]
      return { id: docSnap.id, ...docSnap.data() } as FamiliaProps & { id: string }
    } catch (error) {
      console.error('Erro ao buscar família por código:', error)
      throw error
    }
  }

  async gerarCodigo(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const parte = (n: number) =>
      Array.from({ length: n }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    return `FAM-${parte(4)}`
  }
}

const familiaService = new FamiliaService();

export default familiaService;