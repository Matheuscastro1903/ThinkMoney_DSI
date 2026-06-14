import { Timestamp } from "firebase/firestore";
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
        public criadoEm?: Timestamp,
        public familia?: Familia,
        public gastos?: Gasto[],
        public metas?: Meta[],
        public lembretes?: Lembrete[],
  ) {}

  static fromFirestore(dados: UsuarioFirestore): Usuario {
    return new Usuario(
        dados.nome,
        dados.email,
        dados.datanascimento,
        dados.username,
        dados.renda,
        dados.telefone,
        dados.profissao,
        Endereco.fromJson(dados),
        dados.avatar,
        dados.criadoEm,
        dados?.familia,
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
        endereco: this.endereco,
        avatar: this.avatar,
        criadoEm: this.criadoEm ?? Timestamp.now(),
        ...(this.familia !== undefined && { familia: this.familia }),
        ...(this.gastos !== undefined && { gastos: this.gastos }),
        ...(this.metas !== undefined && { metas: this.metas }),
        ...(this.lembretes !== undefined && { lembretes: this.lembretes }),
    };
  }
}