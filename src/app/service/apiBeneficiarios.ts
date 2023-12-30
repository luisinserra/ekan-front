import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})


export class ApiBeneficiario {
    
    constructor(public http: HttpClient) {}

    getServer = () => {
        const protocolo = window.location.href.split(':')[0]
        console.log('protocolo: ' + protocolo)
        let server = protocolo + '://localhost:8080/beneficiarios/';
        return server;
    }

    trazerListaBeneficiarios = (pagina: number, tamanhoPagina: number) => {
        let url = this.getServer() + 'listaPaginadaDeBeneficiarios?tamanhoPagina=' + tamanhoPagina;
        url += '&pagina=' + pagina;
        return this.http.get(url).toPromise();
    }

    listarDocumentosDoBeneficiario = (idBeneficiario: number) => {
        const url = this.getServer() + 'beneficiarioComDocumentos?idBeneficiario=' + idBeneficiario
        return this.http.get(url).toPromise();
    }

    alterarBeneficiario = (parms: any) => {
        const url = this.getServer() + 'alteraBeneficiario'
        return this.http.post(url, parms).toPromise()
    }

    apagarBeneficiario = (idBeneficiario: number) => {
        const url = this.getServer() + 'apagaBeneficiario/' + idBeneficiario
        return this.http.delete(url).toPromise()
    }

    insereBeneficiario = (parms: any) => {
        const url = this.getServer() + 'novoBeneficiario'
        return this.http.post(url, parms).toPromise()
    }

    trazerBeneficiarioPorId = (idBeneficiario: number) => {
        const url = this.getServer() + 'buscarBeneficiarioPorId?idBeneficiario=' + idBeneficiario
        return this.http.get(url).toPromise();
    }
}