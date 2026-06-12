import { Usuario } from "../models/usuario";
import { Endereco } from "../models/endereco";

export interface GastoProps {
    id: string;
    titulo: string;
    categoria: string;
    valor: number;
    data: Date;
    fixo: boolean;
    status?: 'concluido' | 'pendente' | 'cancelado';
    endereco?: Endereco;
    criador?: Usuario; // Campo necessário para visualização de gastos específicos para família
}

export interface GastosSection {
    section: string;
    data: GastoProps[];
}