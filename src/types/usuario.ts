import { Timestamp } from 'firebase/firestore'
import { Endereco } from '@/src/models/endereco';
import { Familia } from '@/src/models/familia';
import { Gasto } from '@/src/models/gasto';
import { Meta } from '@/src/models/meta';
import { Lembrete } from '@/src/models/Lembrete';

export interface UsuarioProps {
    nome: string;
    email: string;
    senha: string;
    datanascimento: string;
    username: string;
    renda: string;
    telefone: string;
    profissao: string;
    endereco: Endereco;
    avatar: number;
    familia?: Familia;
    gastos?: Gasto[];
    metas?: Meta[];
    lembretes?: Lembrete[];
}

export type UsuarioFirestore = Omit<UsuarioProps, "senha"> & {
    criadoEm: Timestamp;
};