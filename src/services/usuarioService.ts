import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebaseConfig'
import { UsuarioFirestore, UsuarioProps } from '../types/usuario'
import { Usuario } from '../models/usuario'

class UsuarioService {
    async salvarUsuario(uid: string, dados: Omit<UsuarioProps, 'senha'> | Usuario): Promise<void> {
        const docRef = doc(db, 'usuarios', uid)
        if (dados instanceof Usuario) {
            await setDoc(docRef, dados.toFirestore())
            return
        }
        await setDoc(docRef, {
            ...dados,
            criadoEm: Timestamp.now(),
        } as UsuarioFirestore)
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
}

const usuarioService = new UsuarioService()
export default usuarioService