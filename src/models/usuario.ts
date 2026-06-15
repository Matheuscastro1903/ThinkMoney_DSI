import { UsuarioFirestore, UsuarioProps } from "../types/usuario";
import { Endereco } from "./endereco";
import { Familia } from "./familia";
import { Gasto } from "./gasto";
import { Meta } from "./meta";
import { Lembrete } from "./Lembrete";

export class Usuario implements Omit<UsuarioProps, 'senha'>{
    constructor(
        public nome: string,
        public email: string,
        public datanascimento: string,
        public username: string,
        public renda: string,
        public telefone: string,
        public profissao: string,
        public endereco: Endereco,
        public avatar: number,
        public criadoEm?: Date,
        public familia?: Familia,
        public familiaId?: string,
        public gastos?: Gasto[],
        public metas?: Meta[],
        public lembretes?: Lembrete[],
  ) {}

  static fromFirestore(dados: UsuarioFirestore): Usuario {
    let dataCriacao = dados.criadoEm;
    if (dataCriacao && typeof (dataCriacao as any).toDate === 'function') {
        dataCriacao = (dataCriacao as any).toDate();
    }

    return new Usuario(
        dados.nome,
        dados.email,
        dados.datanascimento,
        dados.username,
        dados.renda,
        dados.telefone,
        dados.profissao,
        Endereco.fromJson((dados as any)?.endereco || {}),
        dados.avatar,
        dataCriacao as unknown as Date,
        dados?.familia,
        dados?.familiaId,
        dados?.gastos,
        dados?.metas,
        dados?.lembretes,
    );
  }

  toFirestore(): UsuarioFirestore {
    return {
        nome: this.nome,
        email: this.email,
        datanascimento: this.datanascimento,
        username: this.username,
        renda: this.renda,
        telefone: this.telefone,
        profissao: this.profissao,
        endereco: this.endereco && typeof (this.endereco as any).toJson === 'function' ? (this.endereco as any).toJson() : this.endereco,
        avatar: this.avatar,
        criadoEm: this.criadoEm ?? new Date(),
        ...(this.familiaId !== undefined && { familiaId: this.familiaId }),
        ...(this.familia !== undefined && { familia: typeof (this.familia as any).toFirestore === 'function' ? (this.familia as any).toFirestore() : (typeof (this.familia as any).toJson === 'function' ? (this.familia as any).toJson() : this.familia) }),
        ...(this.gastos !== undefined && { gastos: this.gastos.map(g => typeof (g as any).toFirestore === 'function' ? (g as any).toFirestore() : (typeof (g as any).toJson === 'function' ? (g as any).toJson() : g)) }),
        ...(this.metas !== undefined && { metas: this.metas.map(m => typeof (m as any).toFirestore === 'function' ? (m as any).toFirestore() : (typeof (m as any).toJson === 'function' ? (m as any).toJson() : m)) }),
        ...(this.lembretes !== undefined && { lembretes: this.lembretes.map(l => typeof (l as any).toFirestore === 'function' ? (l as any).toFirestore() : (typeof (l as any).toJson === 'function' ? (l as any).toJson() : l)) }),
    };
  }
}