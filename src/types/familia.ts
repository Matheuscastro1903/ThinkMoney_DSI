import { Meta } from "../models/meta";
import { Usuario } from "../models/usuario";
import { Gasto } from "../models/gasto";
import { Lembrete } from "../models/Lembrete";

export interface FamiliaProps {
    id: string
    nome: string
    codigo_convite: string // formato do código: THKM-X7R2-89
    admin: Usuario
    membros: Usuario[]
    lembretes: Lembrete[]
    metas: Meta[]
    gastos: Gasto[]
};