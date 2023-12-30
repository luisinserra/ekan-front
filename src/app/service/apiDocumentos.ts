import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})


export class ApiDocumentos {

    constructor(public http: HttpClient) {}

    getServer = () => {
        const protocolo = window.location.href.split(':')[0]
        console.log('protocolo: ' + protocolo)
        let server = protocolo + '://localhost:8080/documentos/';
        return server;
    }

    trazerListaDocumentosDeBeneficiario = (idBeneficiario: number) => {
        const url = this.getServer() + 'listarDocumentosDeBeneficiario?idBeneficiario=' + idBeneficiario
        return this.http.get(url).toPromise();
    }

    trazerListaDeTiposDeDocumentos = () => {
        const url = this.getServer() + 'trazerListagemDeTiposDeDocumento'
        return this.http.get(url).toPromise();
    }

    incluirDocumento = (parms: any) => {
        const url = this.getServer() + 'novoDocumento'
        return this.http.post(url, parms).toPromise();
    }

    buscarDocumentoPorIdBeneficiarioETipoDocumento = (idBeneficiario: number, tipoDocumento: string) => {
        let url = this.getServer() + 'buscarDocumentoPorBeneficiarioETipoDocumento'
        url += '?idBeneficiario=' + idBeneficiario
        url += '&tipoDocumento=' + tipoDocumento
        return this.http.get(url).toPromise();
    }

    alterarDocumento = (parms: any) => {
        const url = this.getServer() + 'alterarDocumento'
        return this.http.post(url, parms).toPromise();
    }

    excluirDocumento = (idDocumento: number) => {
        const url = this.getServer() + 'apagarDocumento/' + idDocumento
        return this.http.delete(url).toPromise();
    }
}