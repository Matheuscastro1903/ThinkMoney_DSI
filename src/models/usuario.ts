import { Timestamp } from "firebase/firestore";
import { UsuarioFirestore, UsuarioProps } from "../types/usuario";

export class Usuario implements Omit<UsuarioProps, 'senha'>{
    constructor(
        public nome: string,
        public email: string,
        public datanascimento: string,
        public username: string,
        public renda: string,
        public telefone: string,
        public profissao: string,
        public logradouro: string,
        public numero: string,
        public bairro: string,
        public cidade: string,
        public cep: string,
        public avatar: number,
        public criadoEm?: Timestamp,
        // Vínculo com a família — preenchido ao criar/entrar e limpo ao sair/excluir.
        public familiaId?: string,
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
        dados.logradouro,
        dados.numero,
        dados.bairro,
        dados.cidade,
        dados.cep,
        dados.avatar,
        dados.criadoEm,
        dados.familiaId,
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
        logradouro: this.logradouro,
        numero: this.numero,
        bairro: this.bairro,
        cidade: this.cidade,
        cep: this.cep,
        avatar: this.avatar,
        criadoEm: this.criadoEm ?? Timestamp.now(),
        ...(this.familiaId !== undefined && { familiaId: this.familiaId }),
    };
  }
}