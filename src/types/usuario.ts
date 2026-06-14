import { Timestamp } from 'firebase/firestore'

export interface UsuarioProps {
    nome: string;
    email: string;
    senha: string;
    datanascimento: string;
    username: string;
    renda: string;
    telefone: string;
    profissao: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    avatar: number;
    // familiaId vincula o usuário ao documento da família no Firestore.
    // undefined = usuário que ainda não pertence a nenhuma família.
    familiaId?: string;
    // Adições futuras:
    // gastos?: Gastos[]
    // metas?: Metas[]
    // lembretes?: Lembretes[]
}

export type UsuarioFirestore = Omit<UsuarioProps, "senha"> & {
    criadoEm: Timestamp;
};