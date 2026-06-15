import { GastoProps } from "../types/gasto";
import { Endereco } from "./endereco";
import { Usuario } from "./usuario";

export class Gasto implements GastoProps {
    constructor(
        public titulo: string,
        public categoria: string,
        public valor: number,
        public data: Date,
        public fixo: boolean,
        public id: string = "",
        public status?: 'concluido' | 'pendente' | 'cancelado',
        public endereco?: Endereco,
        public criador?: Usuario
    ) {}

    static fromJson(id: string, dados: any): Gasto {
        let criadorObj: Usuario | undefined = undefined;
        if (dados.criador) {
            criadorObj = Usuario.fromFirestore(dados.criador);
        }

        let enderecoObj: Endereco | undefined = undefined;
        if (dados.endereco) {
            enderecoObj = Endereco.fromJson(dados.endereco);
        }

        // Firestore salva datas como Timestamp. Precisamos converter para Date.
        let dataGasto = dados.data;
        if (dataGasto && typeof dataGasto.toDate === 'function') {
            dataGasto = dataGasto.toDate();
        } else if (typeof dataGasto === 'string') {
            dataGasto = new Date(dataGasto);
        }

        return new Gasto(
            dados.titulo ?? dados.descricao ?? "",
            dados.categoria,
            dados.valor,
            dataGasto,
            dados.fixo ?? false,
            id,
            dados.status,
            enderecoObj,
            criadorObj
        );
    }

    toJson(): Record<string, any> {
        const payload: Record<string, any> = {
            titulo: this.titulo,
            categoria: this.categoria,
            valor: this.valor,
            data: this.data,
            fixo: this.fixo
        };

        if (this.status !== undefined) payload.status = this.status;
        if (this.endereco !== undefined) payload.endereco = this.endereco.toJson();
        if (this.criador !== undefined) payload.criador = this.criador.toFirestore();

        return payload;
    }
}
