import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './firebaseConfig'
import { UsuarioProps } from '../types/usuario'
import usuarioService from './usuarioService'

class AuthService {
  async cadastrarUsuario(dados: UsuarioProps): Promise<void> {
    // 1. Cria o usuário no Firebase Auth (gerencia a senha com segurança)
    const { user } = await createUserWithEmailAndPassword(auth, dados.email, dados.senha)

    // 2. Persiste o perfil do usuário no Firestore (SEM a senha)
    await usuarioService.salvarUsuario(user.uid, dados)
  }

  async loginUsuario(dados: {email: string, senha: string}) {
    const { user } = await signInWithEmailAndPassword(auth, dados.email, dados.senha)
    return user
  }

  async logoutUsuario(): Promise<void> {
    await signOut(auth)
  }

  async recuperarSenha(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email)
  }
};

const authService = new AuthService()
export default authService