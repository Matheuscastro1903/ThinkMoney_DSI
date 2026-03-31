import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from './firebaseConfig'


// == CADASTRO ==

interface CadastroUsuario {
  nome: string
  email: string
  senha: string
  dataNascimento: string,
  username: string  // formato "YYYY-MM-DD"
}

export async function cadastrarUsuario(dados: CadastroUsuario): Promise<void> {
  // 1. Cria o usuário no Firebase Auth (gerencia a senha com segurança)
  const { user } = await createUserWithEmailAndPassword(auth, dados.email, dados.senha)

  // 2. Cria o documento do usuário no Firestore (SEM a senha)
  await setDoc(doc(db, 'usuarios', user.uid), {
    nome: dados.nome,
    email: dados.email,
    dataNascimento: dados.dataNascimento,
    username: dados.username,
    criadoEm: Timestamp.now()
  })
}

// == LOGIN ===


export async function loginUsuario(dados: {email: string, senha: string}) {
  const { user } = await signInWithEmailAndPassword(auth, dados.email, dados.senha)
  return user
}


// == Logout ==

export async function logoutUsuario(): Promise<void> {
  await signOut(auth)
}



