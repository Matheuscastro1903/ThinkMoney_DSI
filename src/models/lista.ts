
import { ListaCompraProps,ProdutoCompraProps } from "../types/lista";


import { Timestamp } from "firebase/firestore";



export class ProdutoCompra {
  constructor(
    public id: string, 
    public nome: string,
    public quantidade: number,
    public valor: number,
    public comprado: boolean
  ) {}

  static fromFirestore(dados: any): ProdutoCompra {
    return new ProdutoCompra(
      dados.id, 
      dados.nome,
      dados.quantidade,
      dados.valor,
      dados.comprado
    );
  }

  toFirestore(): any {
    return {
      id: this.id, 
      nome: this.nome,
      quantidade: this.quantidade,
      valor: this.valor,
      comprado: this.comprado,
    };
  }
}


export class ListaCompra {
  constructor(
    public titulo: string,
    public categoria: string,
    public totalCompra: number,
    public listaFinalizada: boolean,
    public produtos: ProdutoCompra[],
    public localCompra:string,
    public id?: string,
    public descricao?: string,
    public dataPrazo?: Date | null,
    public criadoEm?: Timestamp,
    
  ) {}

  
  static fromFirestore(dados: any): ListaCompra {
    
    let prazo = null;
    if (dados.dataPrazo) {
      prazo = dados.dataPrazo instanceof Timestamp ? dados.dataPrazo.toDate() : dados.dataPrazo;
    }
    
    //vai pegar o dado que for array do json de produtos
    //se for entra no map
    //se nã o fica vazio
    const produtosInstanciados = Array.isArray(dados.produtos) 
      ? dados.produtos.map((prod: any) => ProdutoCompra.fromFirestore(prod))
      : [];

    return new ListaCompra(
      dados.titulo || "",
      dados.categoria || "",
      dados.totalCompra || 0,
      dados.listaFinalizada || false,
      produtosInstanciados,
      dados.localCompra,
      dados.id, 
      dados.descricao,
      prazo,
      dados.criadoEm,
      
    );
  }

  toFirestore(): any {
    const produtosFormatados = this.produtos.map((prod) => prod.toFirestore());

    return {
      titulo: this.titulo,
      categoria: this.categoria,
      totalCompra: this.totalCompra,
      listaFinalizada: this.listaFinalizada,
      produtos: produtosFormatados,
      descricao: this.descricao || null,
      dataPrazo: this.dataPrazo || null,
      criadoEm: this.criadoEm ?? Timestamp.now(),
    };
  }
}