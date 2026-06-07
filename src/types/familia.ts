import { GastoProps } from "./gasto";
import { LembreteProps } from "./lembrete";
import { MetaProps } from "./meta";
import { UsuarioProps } from "./usuario";

export interface FamiliaProps {
    id: string
    nome: string
    codigo_convite: string // formato do código: THKM-X7R2-89
    admin: UsuarioProps
    membros: UsuarioProps[]
    lembretes: LembreteProps[]
    metas: MetaProps[]
    gastos: GastoProps[]
};

export type FamiliaPayloadProps = Omit<FamiliaProps, 'id'>;