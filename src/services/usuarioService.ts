import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore'
import { db } from './firebaseConfig'
import { UsuarioFirestore, UsuarioProps } from '../types/usuario'
import { Usuario } from '../models/usuario'

class UsuarioService {
    async salvarUsuario(uid: string, dados: Omit<UsuarioProps, 'senha'> | Usuario): Promise<void> {
        const docRef = doc(db, 'usuarios', uid)
        if (dados instanceof Usuario) {
            const dataToSave = dados.toFirestore();
            if (dataToSave.endereco && typeof (dataToSave.endereco as any).toJson === 'function') {
                dataToSave.endereco = (dataToSave.endereco as any).toJson();
            }
            await setDoc(docRef, dataToSave)
            return
        }
        
        const dataToSave = {
            ...dados,
            criadoEm: new Date(),
        } as any;

        if (dataToSave.endereco && typeof dataToSave.endereco.toJson === 'function') {
            dataToSave.endereco = dataToSave.endereco.toJson();
        }

        await setDoc(docRef, dataToSave)
    }

    async buscarDadosUsuario(uid: string): Promise<Usuario | null> {
        const docRef = doc(db, 'usuarios', uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data() as UsuarioFirestore
            return Usuario.fromFirestore(data)
        } else {
            console.log("Usuário não encontrado")
            return null
        }
    }

    /**
     * Sincroniza o vínculo do usuário com a família no Firestore.
     * Chamado após criarFamilia, entrarEmFamilia, sairDaFamilia e excluirFamilia.
     * Usa updateDoc para alterar apenas esse campo, sem sobrescrever o restante do perfil.
     * @param familiaId ID da família ou null para remover o vínculo.
     */
    async atualizarFamiliaId(uid: string, familiaId: string | null): Promise<void> {
        const docRef = doc(db, 'usuarios', uid)
        if (familiaId === null) {
            // Remove o campo do documento (usuário sem família)
            await updateDoc(docRef, { familiaId: deleteField() })
        } else {
            await updateDoc(docRef, { familiaId })
        }
    }
}

const usuarioService = new UsuarioService()
export default usuarioService