import { Injectable } from '@angular/core';

export interface Beneficiario {
    id: number,
    nome: string,
    telefone: string,
    dataNascimento: string,
    dataInclusao: string,
    dataAtualizacao: string,
    dtNascimento: string,
    dtInclusao: string,
    dtAtualizacao: string,
    valor: string
}

export interface Documento {
    dataAtualizacao: string,
    dataInclusao: string,
    descricao: string,
    id: number,
    tipoDocumento: string,
    dtInclusao: string,
    dtAtualizacao: string,
    valor: string
}

@Injectable({
    providedIn: 'root'
})    

export class EntidadesService {
    
}