import { Meta } from '@/src/types/meta';
import * as Crypto from 'expo-crypto';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

class MetasService {
  async criar(userId: string, dados: Omit<Meta, 'valorPoupado'>, familiaId?: string): Promise<void> {
    const metaPayload = {
      ...dados,
      valorPoupado: 0,
      criadoEm: Timestamp.now()
    };

    // Para usuários individuais, o próprio Firestore gera o ID do documento na coleção.
    // Para famílias, salvamos como objeto dentro de um array, então geramos o ID na mão com Crypto.
    if (familiaId) {
      metaPayload.id = Crypto.randomUUID();
      const familiaRef = doc(db, 'familias', familiaId);
      await updateDoc(familiaRef, {
        metas: arrayUnion(metaPayload)
      });
    } else {
      await addDoc(collection(db, 'usuarios', userId, 'metas'), metaPayload);
    }
  }

  async buscarTodas(userId: string): Promise<(Meta & { id: string })[]> {
    const q = query(
      collection(db, 'usuarios', userId, 'metas'),
      orderBy('criadoEm', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Meta }))
  }

  async buscarTodasFamilia(familiaId: string): Promise<(Meta & { id: string })[]> {
    const q = query(
      collection(db, 'familias', familiaId, 'metas'),
      orderBy('criadoEm', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() as Meta }))
  }

  async buscarPorId(userId: string, metaId: string, familiaId?: string): Promise<(Meta & { id: string }) | null> {
    const metaRef = familiaId
      ? doc(db, 'familias', familiaId, 'metas', metaId)
      : doc(db, 'usuarios', userId, 'metas', metaId);

    const snapshot = await getDoc(metaRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() as Meta };
    }
    return null;
  }

  async contribuir(userId: string, metaId: string, valor: number, familiaId?: string): Promise<void> {
    const metaRef = familiaId
      ? doc(db, 'familias', familiaId, 'metas', metaId)
      : doc(db, 'usuarios', userId, 'metas', metaId);

    await updateDoc(metaRef, {
      valorPoupado: increment(valor)
    });

    // Mantemos o histórico de contribuições na coleção do usuário logado (opcionalmente)
    await addDoc(collection(db, 'usuarios', userId, 'contribuicoes'), {
      valor,
      metaId,
      familiaId: familiaId || null,
      data: Timestamp.now()
    });
  }

  async buscarContribuicoesDoDia(userId: string): Promise<number> {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const q = query(
      collection(db, 'usuarios', userId, 'contribuicoes'),
      where('data', '>=', Timestamp.fromDate(hoje)),
      where('data', '<', Timestamp.fromDate(amanha))
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.reduce((acc, d) => acc + (d.data().valor || 0), 0)
  }

  async buscarContribuicoesDaMeta(userId: string, metaId: string): Promise<any[]> {
    const q = query(
      collection(db, 'usuarios', userId, 'contribuicoes'),
      where('metaId', '==', metaId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  async atualizar(userId: string, metaId: string, dados: Partial<Omit<Meta, 'valorPoupado'>>, familiaId?: string): Promise<void> {
    const metaRef = familiaId
      ? doc(db, 'familias', familiaId, 'metas', metaId)
      : doc(db, 'usuarios', userId, 'metas', metaId);

    await updateDoc(metaRef, dados)
  }

  async excluir(userId: string, metaId: string, familiaId?: string): Promise<void> {
    const metaRef = familiaId
      ? doc(db, 'familias', familiaId, 'metas', metaId)
      : doc(db, 'usuarios', userId, 'metas', metaId);

    await deleteDoc(metaRef)
  }
}

export const metasService = new MetasService()