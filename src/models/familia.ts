import { FamiliaProps } from "../types/familia";
import { Meta } from "./meta";
import { Usuario } from "./usuario";
import { Gasto } from "./gasto";
import { Lembrete } from "./Lembrete";

export class Familia implements FamiliaProps {
    constructor(
        public id: string,
        public nome: string,
        public codigo_convite: string,
        public admin: Usuario,
        public membros: Usuario[],
        public lembretes: Lembrete[],
        public metas: Meta[],
        public gastos: Gasto[]
    ) {}

    static fromJson(id: string, dadosFamilia: any, dadosMetas: Meta[], dadosGastos: Gasto[] = []): Familia {
        return new Familia(
            id,
            dadosFamilia.nome,
            dadosFamilia.codigo_convite,
            Usuario.fromFirestore(dadosFamilia.admin),
            (dadosFamilia.membros || []).map((m: any) => Usuario.fromFirestore(m)),
            (dadosFamilia.lembretes || []).map((l: any) => Lembrete.fromFirestore(l.id || '', l)),
            dadosMetas || [],
            dadosGastos
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
