import { UsuarioProps } from "./usuario";

export interface Meta {
  nomeMeta: string
  valorTotal: number
  valorPoupado: number
  dataLimite: Date
  categoria: string
  descricao?: string
  id_imagem?: string | null

  // campos úteis apenas para metas presentes em família
  id?: string // gerado pelo app e usado para manipular as metas dentro do array do firestore
  emailCriador?: UsuarioProps["email"]
  nomeCriador?: UsuarioProps["nome"]
}