import { Timestamp } from 'firebase/firestore';

export interface LembreteProps {
  nomeGasto: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO';
  descricao?: string;
  id?: string;
  criadoEm?: Timestamp;
}
