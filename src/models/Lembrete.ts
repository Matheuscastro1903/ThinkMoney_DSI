import { Timestamp } from 'firebase/firestore'
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
    public criadoEm?: Timestamp,
  ) {}

  static fromFirestore(id: string, dados: any): Lembrete {
    return new Lembrete(
      dados.nomeGasto,
      dados.categoria,
      dados.vencimento,
      dados.valor,
      dados.status,
      dados.descricao,
      id,
      dados.criadoEm,
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
      criadoEm: this.criadoEm ?? Timestamp.now(),
    }
  }
}
