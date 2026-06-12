import { Usuario } from "../models/usuario";

export interface MetaProps {
  id: string; // obrigatório no código, pode ser '' durante a criação local
  nomeMeta: string;
  valorTotal: number;
  valorPoupado: number;
  dataLimite: Date;
  categoria: string;
  descricao?: string;
  id_imagem?: string | null;
  criador?: Usuario;
}