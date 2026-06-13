import { MetaProps } from "../types/meta";
import { Usuario } from "./usuario";

export class Meta implements MetaProps {
    constructor(
        public nomeMeta: string,
        public valorTotal: number,
        public valorPoupado: number,
        public dataLimite: Date,
        public categoria: string,
        public id: string = "",
        public descricao?: string,
        public id_imagem?: string | null,
        public criador?: Usuario
    ) {}

    static fromJson(id: string, dados: any): Meta {
        let criadorObj: Usuario | undefined = undefined;
        if (dados.criador) {
            criadorObj = Usuario.fromFirestore(dados.criador);
        }

        let dataMeta = dados.dataLimite;
        if (dataMeta && typeof dataMeta.toDate === 'function') {
            dataMeta = dataMeta.toDate();
        } else if (typeof dataMeta === 'string') {
            dataMeta = new Date(dataMeta);
        } else {
            dataMeta = new Date(); // Fallback caso não venha data
        }

        return new Meta(
            dados.nomeMeta ?? "",
            dados.valorTotal ?? 0,
            dados.valorPoupado ?? 0,
            dataMeta,
            dados.categoria ?? "Outros",
            id,
            dados.descricao,
            dados.id_imagem,
            criadorObj
        );
    }

    toJson(): Record<string, any> {
        const payload: Record<string, any> = {
            nomeMeta: this.nomeMeta,
            valorTotal: this.valorTotal,
            valorPoupado: this.valorPoupado,
            dataLimite: this.dataLimite,
            categoria: this.categoria
        };

        if (this.descricao !== undefined) payload.descricao = this.descricao;
        if (this.id_imagem !== undefined) payload.id_imagem = this.id_imagem;
        if (this.criador !== undefined) payload.criador = this.criador.toFirestore();

        return payload;
    }
}
