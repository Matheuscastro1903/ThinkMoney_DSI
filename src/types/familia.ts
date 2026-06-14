import { GastoProps } from "./gasto";
import { LembreteProps } from "./lembrete";
import { Meta } from "../models/meta";
import { Usuario } from "../models/usuario";
import { UsuarioFirestore } from "./usuario";

export interface FamiliaProps {
    id: string
    nome: string
    codigo_convite: string // formato do código: THKM-X7R2-89
    admin: Usuario
    membros: Usuario[]

    // Em breve esses campos abaixo vão ter seus tipos substituiídos por models.
    lembretes: LembreteProps[]
    metas: Meta[]
    gastos: GastoProps[]
};