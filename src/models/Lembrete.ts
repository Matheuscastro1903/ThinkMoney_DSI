import { LembreteProps } from '../types/lembrete'

export class Lembrete implements LembreteProps {
  constructor(
    public nomeGasto: string,
    public categoria: string,
    public vencimento: string,
    public valor: number,
    public status: 'PENDENTE' | 'PAGO',
    public descricao?: string,
    public id?: string,
    public criadoEm?: Date,
  ) {}

  static fromFirestore(id: string, dados: any): Lembrete {
    let dataCriacao = dados.criadoEm;
    if (dataCriacao && typeof dataCriacao.toDate === 'function') {
      dataCriacao = dataCriacao.toDate();
    }
    return new Lembrete(
      dados.nomeGasto,
      dados.categoria,
      dados.vencimento,
      dados.valor,
      dados.status,
      dados.descricao,
      id,
      dataCriacao,
    )
  }

  toFirestore(): object {
    return {
      nomeGasto: this.nomeGasto,
      categoria: this.categoria,
      vencimento: this.vencimento,
      valor: this.valor,
      status: this.status,
      ...(this.descricao !== undefined && { descricao: this.descricao }),
      criadoEm: this.criadoEm ?? new Date(),
    }
  }
}
