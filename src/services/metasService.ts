import { Meta } from '../models/meta';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

const getMetasCollection = (userId: string, familiaId?: string) =>
  familiaId
    ? collection(db, "familias", familiaId, "metas")
    : collection(db, "usuarios", userId, "metas");

const getMetaDoc = (userId: string, metaId: string, familiaId?: string) =>
  familiaId
    ? doc(db, "familias", familiaId, "metas", metaId)
    : doc(db, "usuarios", userId, "metas", metaId);

class MetasService {
  async criar(userId: string, meta: Meta, familiaId?: string): Promise<void> {
    const payload = meta.toJson();
    // Garante que o valorPoupado inicial seja 0, mas se vier algo, mantém
    payload.valorPoupado = payload.valorPoupado || 0;
    payload.criadoEm = Timestamp.now();

    await addDoc(getMetasCollection(userId, familiaId), payload);
  }

  async buscarTodas(userId: string, familiaId?: string): Promise<Meta[]> {
    const q = query(
      getMetasCollection(userId, familiaId),
      orderBy('criadoEm', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => Meta.fromJson(d.id, d.data()));
  }

  async buscarPorId(userId: string, metaId: string, familiaId?: string): Promise<Meta | null> {
    const metaRef = getMetaDoc(userId, metaId, familiaId);
    const snapshot = await getDoc(metaRef);

    if (snapshot.exists()) {
      return Meta.fromJson(snapshot.id, snapshot.data());
    }
    return null;
  }

  async contribuir(userId: string, metaId: string, valor: number, familiaId?: string): Promise<void> {
    const metaRef = getMetaDoc(userId, metaId, familiaId);

    await updateDoc(metaRef, {
      valorPoupado: increment(valor),
      atualizadoEm: Timestamp.now()
    });

    // Mantemos o histórico de contribuições na coleção do usuário logado
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

  async atualizar(userId: string, metaId: string, meta: Meta, familiaId?: string): Promise<void> {
    const metaRef = getMetaDoc(userId, metaId, familiaId);

    await updateDoc(metaRef, {
      ...meta.toJson(),
      atualizadoEm: Timestamp.now()
    });
  }

  async excluir(userId: string, metaId: string, familiaId?: string): Promise<void> {
    const metaRef = getMetaDoc(userId, metaId, familiaId);
    await deleteDoc(metaRef);
  }
}

export const metasService = new MetasService();