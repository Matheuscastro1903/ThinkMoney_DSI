import { Timestamp } from "firebase/firestore";

export interface ListaCompraProps {
  id: string; 
  titulo: string;
  categoria: string;
  descricao?: string;
  dataPrazo?: Date | null;
  totalCompra: number;
  listaFinalizada: boolean; 
  criadoEm?: Timestamp;
  produtos: ProdutoCompraProps[];
  localCompra:string 
}

export interface ProdutoCompraProps {
  id: string; 
  nome: string;
  quantidade: number;
  valor: number; 
  comprado: boolean;
}