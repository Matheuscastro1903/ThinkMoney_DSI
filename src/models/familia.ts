import { FamiliaProps } from "../types/familia";
import { GastoProps } from "../types/gasto";
import { LembreteProps } from "../types/lembrete";
import { Meta } from "../types/meta";
import { Usuario } from "./usuario";

export class Familia implements FamiliaProps {
    constructor(
        public id: string,
        public nome: string,
        public codigo_convite: string,
        public admin: Usuario,
        public membros: Usuario[],
        public lembretes: LembreteProps[],
        public metas: Meta[],
        public gastos: GastoProps[]
    ) {}

    static fromJson(id: string, dadosFamilia: any, dadosMetas: Meta[]): Familia {
        return new Familia(
            id,
            dadosFamilia.nome,
            dadosFamilia.codigo_convite,
            Usuario.fromFirestore(dadosFamilia.admin),
            (dadosFamilia.membros || []).map((m: any) => Usuario.fromFirestore(m)),
            dadosFamilia.lembretes || [],
            dadosMetas || [],
            dadosFamilia.gastos || []
        );
    }

    toJson(): Record<string, any> {
        return {
            nome: this.nome,
            codigo_convite: this.codigo_convite,
            admin: this.admin.toFirestore(),
            membros: this.membros.map(m => m.toFirestore()),
            lembretes: this.lembretes,
            gastos: this.gastos
        };
    }
}
