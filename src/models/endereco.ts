import { EnderecoProps } from '../types/endereco';

export class Endereco implements EnderecoProps {
    constructor(
        public logradouro: string,
        public numero: string,
        public bairro: string,
        public cidade: string,
        public cep: string,
        public titulo?: string,
        public latitude?: number,
        public longitude?: number
    ) {}

    static fromJson(dados: any): Endereco {
        return new Endereco(
            dados.logradouro ?? '',
            dados.numero ?? '',
            dados.bairro ?? '',
            dados.cidade ?? '',
            dados.cep ?? '',
            dados.titulo,
            dados.latitude,
            dados.longitude
        );
    }

    toJson(): Record<string, any> {
        const payload: Record<string, any> = {
            logradouro: this.logradouro,
            numero: this.numero,
            bairro: this.bairro,
            cidade: this.cidade,
            cep: this.cep
        };
        if (this.titulo !== undefined) payload.titulo = this.titulo;
        if (this.latitude !== undefined) payload.latitude = this.latitude;
        if (this.longitude !== undefined) payload.longitude = this.longitude;
        return payload;
    }
}
