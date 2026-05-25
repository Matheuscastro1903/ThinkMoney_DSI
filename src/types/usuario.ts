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
    // Adições futuras:
    // familiaId?: string;
    // gastos?: Gastos[]
    // metas?: Metas[]
    // lembretes?: Lembretes[]
}

export type UsuarioFirestore = Omit<UsuarioProps, "senha"> & {
    criadoEm: Timestamp;
};