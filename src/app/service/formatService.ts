import { Injectable } from '@angular/core';

declare  global {
    export interface String {
      gentNum(): string;
      numGent(): string;
      floMoe(): string;
    }
  }

  export interface String {
    floMoe(): string
  }
@Injectable({
    providedIn: 'root'
})
export class FormatServices {

    
    constructor() {
        console.log('construtor de formatServices');
        console.log('Construtor');
        String.prototype.gentNum = function() {
            const parm = this;
            let retorno = parm;
            if (parm.length > 9) {
                retorno = parm.substring(6, 10) + '-' + parm.substring(3, 5) + '-' + parm.substring(0, 2);
            }
            return ''+retorno;
        };
        String.prototype.numGent = function() {
            const parm = this;
            let retorno = parm;
            if (parm.length > 9) {
                retorno = parm.substring(8, 10) + '/' + parm.substring(5, 7) + '/' + parm.substring(0, 4);
            }
            return ''+retorno;
        };
        String.prototype.floMoe = function() {
            let parm = this;
            let n = parm.indexOf('.');
            while (n >= 0) {
                parm = parm.substring(0, n) + parm.substring(n + 1, parm.length);
                n = parm.indexOf('.');
            }
            n = parm.indexOf(',');
            while (n >= 0) {
                parm = parm.substring(0, n) + '.' + parm.substring(n + 1, parm.length);
                n = parm.indexOf(',');
            }
            return ''+parm;
        }
    }

    mascaraFone = (idElemento: string, qtipo: string) => {
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        if (parm.length === 1) {
            if (parm !== '(') {
                parm = '(' + parm;
            }
            this.setValue(elemento, parm);
        }
        if (parm.length === 3) {
            parm = parm + ') ';
            this.setValue(elemento, parm);
        }
        if (qtipo === '2') {
            if (parm.length === 6) {
                parm += ' ';
                this.setValue(elemento, parm);
            }
            if (parm.length === 11) {
                parm += '-';
                this.setValue(elemento, parm);
            }
        } else {
            if (parm.length === 9) {
                parm += '-';
                this.setValue(elemento, parm);
            }
        }
    }

    separaFone = (parm: string) => {
        let retorno = parm;
        if (parm.indexOf('(') === 0) {
            if (parm.indexOf(') ') > 0) {
                const ddd=parm.substring(1, 3);
                const fone = parm.substring(5);
                retorno = ddd + ':' + fone;
            }
        }
        return retorno;
    }

    mascaraCpf = (idElemento: string) => {
        const digitos = '0123456789./-';
        const elemento = document.getElementById(idElemento);
        let parm: string = this.getValue(elemento);
        const car = parm.substring(parm.length - 1);
        if (digitos.indexOf(car) < 0) {
            parm = parm.substring(0, parm.length - 1);
            this.setValue(elemento, parm);
        }else {
            if (parm.length === 3) {
                parm += '.';
                this.setValue(elemento, parm);
            }
            if (parm.length === 7) {
                parm += '.';
                this.setValue(elemento, parm);
            }
            if (parm.length === 11) {
                parm += '-';
                this.setValue(elemento, parm);
            }
            if (parm.length > 14) {
                parm = parm.substring(0, parm.length - 1);
                this.setValue(elemento, parm);
            }
            if (parm.length === 14) {
                // parm = parm.substring(0, parm.length - 1);
                // this.setValue(elemento, parm);
                return this.validaCpf(parm);
            }
        }
        return '';
    }

    mascaraCnpj = (idElemento: string) => {
        const digitos = '0123456789./-';
        const elemento = document.getElementById(idElemento);
        let parm: string = this.getValue(elemento);
        const car = parm.substring(parm.length - 1);
        if (digitos.indexOf(car) < 0) {
            parm = parm.substring(0, parm.length - 1);
            this.setValue(elemento, parm);
        } else {
            if (parm.length === 2) {
                parm += '.';
                this.setValue(elemento, parm);
            }
            if (parm.length === 6) {
                parm += '.';
                this.setValue(elemento, parm);
            }
            if (parm.length === 10) {
                parm += '/';
                this.setValue(elemento, parm);
            }
            if (parm.length === 15) {
                parm += '-';
                this.setValue(elemento, parm);
            }
            if (parm.length === 18) {
                // parm = parm.substring(0, parm.length - 1);
                // this.setValue(elemento, parm);
                this.validaCNPJ(parm);
            }
        }
    }

    getValue = (elemento: any) => {
        return elemento.value;
    }
    setValue = (elemento: any, valor: any) => {
        elemento.value = valor;
    }

    mascaraMoeda = (idElemento: string) => {
        const numeros = '1234567890';
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        const c = parm.substring(parm.length - 1, parm.length);
        const n = numeros.indexOf(c);
        const iv = parm.indexOf(',');
        if (n < 0) {
            parm = parm.substring(0, parm.length - 1);
            this.setValue(elemento, parm);
        }
        let pleno = parm.replace(',', '');
        if (pleno.length > 0) {
            pleno = parseInt(pleno, 10);
            pleno = pleno.toString();
        }
        for (let i=pleno.length; i<3; i++) {
            pleno = '0' + pleno;
        }
        pleno = pleno.substring(0,pleno.length - 2) + ',' + pleno.substring(pleno.length - 2);
        parm = pleno;
        this.setValue(elemento, parm);
    }

    mascaracep = (idElemento: string) => {
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        if (parm.length === 5) {
            parm += '-';
            this.setValue(elemento, parm);
        }
        if (parm.length > 9) {
            let valor = parm.substring(0,9);
            this.setValue(elemento, valor);
        }
    }

    mascaraHora = (idElemento: string) => {
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        if (parm.length === 2) {
            parm += ':';
            this.setValue(elemento, parm);
        }
        if (parm.length > 5) {
            let valor = parm.substring(0,5);
            this.setValue(elemento, valor);
        }
        if (parm.length == 5) {
            if (parm.indexOf(':') < 0) {
                return 'Formato de hora inválido';
            }
            let partes = parm.split(':');
            if(isNaN(partes[0])) {
                return 'Formato de hora inválido';
            }
            if(isNaN(partes[1])) {
                return 'Formato de hora inválido';
            }
        }
        return ''
    }

    mascaraData = (idElemento: string) => {
        let ok = true;
        const elemento = document.getElementById(idElemento);
        let parm = this.getValue(elemento);
        if (parm.length === 2) {
            let nDia = parseInt(parm, 10);
            if (nDia > 31) {
                parm = '';
                this.setValue(elemento, parm);
                return 'Dia pode ser no máximo 31';
                ok = false;
            } else {
                parm += '/';
                this.setValue(elemento, parm);
            }
            return '';
        }
        if (parm.length === 5) {
            let nMes = parseInt(parm.substring(3,5), 10);
            if (nMes > 12) {
                parm = parm.substring(0, 3);
                this.setValue(elemento, parm);
                return 'Mês pode ser no máximo 12';
                ok = false;
            } else {
                let nDia = parseInt(parm.substring(0,2), 10);
                const maxDias = this.getNDiasMes(nMes);
                if (nDia > maxDias) {
                    parm = parm.substring(0, 3);
                    this.setValue(elemento, parm);
                    return 'Dia pode ser no máximo ' + maxDias;
                    ok = false;
                }
            }
            if (ok) {
                parm += '/';
                this.setValue(elemento, parm);
            }
        }
        if (parm.length === 10) {
            let nDia = parseInt(parm.substring(0,2), 10);
            let nMes = parseInt(parm.substring(3,5), 10);
            let bisexto = false;
            let nAno = parseInt(parm.substring(6), 10);
            if (nAno % 4 == 0) {
                bisexto = true;
            }
            if (nMes == 2 && !bisexto && nDia > 28) {
                parm = '';
                this.setValue(elemento, parm);
                return 'data inválida';
            }
        }
        return '';
    }

    validaCNPJ = (CNPJ: string) => {
        let erro = '';
        if (CNPJ.length < 18) {
            erro += 'É necessario preencher corretamente o nъmero do CNPJ!';
        }
        if ((CNPJ.charAt(2) !== '.') || (CNPJ.charAt(6) !== '.') || (CNPJ.charAt(10) !== '/') || (CNPJ.charAt(15) !== '-')) {
            if (erro.length === 0) {
                erro += 'É necessбrio preencher corretamente o nъmero do CNPJ! \n\n';
             }
        }
        CNPJ = CNPJ. replace ('.','');
        CNPJ = CNPJ. replace ('.','');
        CNPJ = CNPJ. replace ('-','');
        CNPJ = CNPJ. replace ('/','');
        const nonNumbers = /\D/;
        if (nonNumbers.test(CNPJ)) {
            erro += 'A verificaзгo de CNPJ suporta apenas nъmeros! \n\n';
        }
        const a: any = [];
        let b = 0;
        const c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i = 0; i < 12; i++){
                a[i] = CNPJ.charAt(i);
                const n = parseInt(a[i], 10);
                let z =  n * c[i + 1];
                b += z;
        }
        let x = (b % 11);
        if (x < 2) { a[12] = 0; } else { a[12] = 11 - x }
        b = 0;
        for (let y = 0; y < 13; y++) {
                b += (a[y] * c[y]);
        }
        x = b % 11;
        if (x < 2) { a[13] = 0; } else { a[13] = 11 - x; }
        if ((parseInt(CNPJ.charAt(12),10) !== a[12]) || (parseInt(CNPJ.charAt(13),10) !== a[13])){
                erro += 'Dнgito verificador com problema!';
        }
        if (erro.length > 0){
            alert(erro);
            return false;
                //document.getElementById("retornoCnpj").value="pau";
        } else {
                //document.getElementById("retornoCnpj").value="Bateu";
        }
        return true;
    }

    validaCpf = (parm: string) => {
        const cpf = this.getSoNumeros(parm);
        let erro = '';
        var a = [];
        var b = 0;
        var c = 11;
        var x = 0;
        var i = 0;
        for (i=0; i<11; i++)
        {
        	a[i] = parseInt(cpf.charAt(i), 10);
            if (i < 9) {
                b += (a[i] * --c)
            }
        }
        if ((x = b % 11) < 2) {
            a[9] = 0
        } else {
            a[9] = 11-x
        }
        b = 0;
        c = 11;
        let y = 0;
        for (y=0; y<10; y++) {
            b += (a[y] * c--);
        }
        if ((x = b % 11) < 2) {
            a[10] = 0;
        } else {
            a[10] = 11-x;
        }
        let a9 = parseInt(cpf.charAt(9), 10);
        let a10 = parseInt(cpf.charAt(10), 10);
        if ((a9 != a[9]) || (a10 != a[10]))
        {
            erro +="Digito verificador com problema!";
        }
        return erro;
    }

    float2moeda = (num: any) => {
        let x = 0;

        if (num < 0) {
            num = Math.abs(num);
            x = 1;
        }
        if (isNaN(num)) {
            num = '0';
        }
        const cents = Math.floor((num * 100 + 0.5) % 100);
        let centa = cents.toString();
        num = Math.floor((num * 100 + 0.5) / 100).toString();
        if (cents < 10) {
            centa = '0' + centa;
        }
        for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + '.'
               + num.substring(num.length - (4 * i + 3));
        }
        let ret = num + ',' + centa;
        if (x === 1) {
            ret = ' - ' + ret;
        }
        return ret;
    }

    trocaVigulaPonto = (parm: string) => {
        let n = parm.indexOf(',');
        while (n >= 0) {
            parm = parm.substring(0, n) + '.' + parm.substring(n + 1, parm.length);
            n = parm.indexOf(',');
        }
        return parm;
    }
    removePonto = (parm: string) => {
        let n = parm.indexOf('.');
        while (n >= 0) {
            parm = parm.substring(0, n) + parm.substring(n + 1, parm.length);
            n = parm.indexOf('.');
        }
        return parm;
    }
    correnciaParaFloat = (parm: string) => {
        parm = this.removePonto(parm);
        parm = this.trocaVigulaPonto(parm);
        parm = parm.replace('R$', '');
        parm = parm.replace(' ', '');
        return parm;
    }

    getSoNumeros = (parm: string) => {
        let retorno="";
		const numeros="0123456789";
        let c = '';
        let n = 0;
        let i = 0;
        for (i=0; i<parm.length; i++)
		{
			c=parm.substring(i, i+1);
			n=numeros.indexOf(c);
			if (n >= 0)
			{
				retorno+=c;
			}
		}
        return retorno;
    }

    getNDiasMes = (mes: number) => {
        let retorno = 0;
        switch (mes) {
            case 1:
                return 31;
            case 2:
                return 29;
            case 3:
                return 31;
            case 4:
                return 30;
            case 5:
                return 31;
            case 6:
                return 30;
            case 7:
                return 31;
            case 8:
                return 31;
            case 9:
                return 30;
            case 10:
                return 31;
            case 11:
                return 30;
            case 12:
                return 31;
            default:
                return 0;
        }
    }

    dtNumGent = (parm: string) => {
        return parm.numGent();
    }
    dtGentNum = (parm: string) => {
        return parm.gentNum();
    }

    getDia = (parm: any) => {
        let dia = parm.getDate();
        if (dia < 10) {
            dia = '0' + dia;
        }
        return dia;
    }
    getMes = (parm: any) => {
        let mes = parm.getMonth() + 1;
        if (mes < 10) {
            mes = '0' + mes;
        }
        return mes;
    }
    getAno = (parm: any) => {
        return parm.getFullYear();
    }
    getHora = (parm: any) => {
        return this.pad(parseInt(parm.getHours(),10))
    }
    getMinuto = (parm: any) => {
        return this.pad(parm.getMinutes())
    }
    getDataAgora = () => {
        const parm = new Date();
        const msg = this.getDia(parm) + '/' + this.getMes(parm) + '/' + this.getAno(parm);
        return msg;
    }
    getTempoAgora = () => {
        const parm = new Date();
        const msg = this.getDia(parm) + '/' + this.getMes(parm) + '/' + this.getAno(parm) + ' ' + this.getHora(parm) + ':' + this.getMinuto(parm);
        return msg;
    }

    pad = (d: number) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }
}
