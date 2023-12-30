import { Component, Inject, OnInit } from '@angular/core';
import { ApiBeneficiario } from '../service/apiBeneficiarios';
import { Beneficiario } from '../service/entidadesService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormatServices } from '../service/formatService';

export interface Comando {
  callBackRetorno: any,
}

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.css'],
})
export class BeneficiariosComponent implements OnInit {

  private pagina: number = 0;
  private tamanhoPagina: number = 10;

  public beneficiarios!: Beneficiario[]
  public grade!: any;
  public gradeTitulo!: any;

  constructor(
    private apiBeneciciario: ApiBeneficiario,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Lista Beneficiários')
    this.trazListaBeneficiarios()
  }

  trazListaBeneficiarios = () => {
    this.apiBeneciciario.trazerListaBeneficiarios(this.pagina, this.tamanhoPagina).then(res => this.retornoListaBeneficiarios(res))
  }
  retornoListaBeneficiarios = (res: any) => {
    this.beneficiarios = res.content
    if (res.first === true) {
      this.ocultar('goPrv')
    } else {
      this.mostrar('goPrv')
    }
    if (res.last === true) {
      this.ocultar('goNex')
    } else {
      this.mostrar('goNex')
    }
    this.preenchimentoGrade()
  }

  editarBeneficiario = (idBeneficiario: number) => {
    window.localStorage.setItem('idBeneficiario', '' + idBeneficiario)
    console.log(idBeneficiario)
    const beneficiario = this.beneficiarios.find(b => b.id == idBeneficiario)
    window.localStorage.setItem('beneficionario', JSON.stringify(beneficiario))
    this.router.navigateByUrl('beneficiariosComDocumentos')
  }

  goNex = () => {
    this.pagina += 1
    this.trazListaBeneficiarios()
  }
  goPrv = () => {
    this.pagina -= 1;
    this.trazListaBeneficiarios()
  }

  preenchimentoGrade = () => {
    this.gradeTitulo = []
    const gNome = {text: 'Nome', cols: 1, rows: 1, fontWeight: 'bold'};
    const gTelefone = {text: 'Telefone', cols: 1, rows: 1}
    const gInclusao = {text: 'Data Inclusão', cols: 1, rows: 1}
    const gAtualizacao = {text: 'Data Atualização', cols: 1, rows: 1}
    this.gradeTitulo[this.gradeTitulo.length] = gNome
    this.gradeTitulo[this.gradeTitulo.length] = gTelefone
    this.gradeTitulo[this.gradeTitulo.length] = gInclusao
    this.gradeTitulo[this.gradeTitulo.length] = gAtualizacao

    this.grade = []
    for (let beneficiario of this.beneficiarios) {
      const rNome = {text: beneficiario.nome, cols: 1, rows: 1, id: beneficiario.id}
      const rTelefone = {text: beneficiario.telefone, cols: 1, rows: 1, id: beneficiario.id}
      const rInclusao = {text: beneficiario.dtInclusao, cols: 1, rows: 1, id: beneficiario.id}
      const rAtualizacao = {text: beneficiario.dtAtualizacao, cols: 1, rows: 1, id: beneficiario.id}
      this.grade[this.grade.length] = rNome
      this.grade[this.grade.length] = rTelefone
      this.grade[this.grade.length] = rInclusao
      this.grade[this.grade.length] = rAtualizacao
      }
  }

  ocultar = (idElemento: string) => {
    const el = document.getElementById(idElemento)
    if (!el?.classList.contains('oculto')) {
      el?.classList.add('oculto')
    }
  }

  mostrar = (idElemento: string) => {
    const el = document.getElementById(idElemento)
    if (el?.classList.contains('oculto')) {
      el?.classList.remove('oculto')
    }
  }

  recebimentoDadosNovoBeneficiario = (parms: any) => {
    console.log(parms)
    this.apiBeneciciario.insereBeneficiario(parms).then(res => this.beneficiarioInserido(res))
  }
  beneficiarioInserido = (res: any) => {
    let ok = false
    if (res.id) {
      if (res.id !== '0') {
        ok = true
      }
    }
    if (ok) {
      this.apiBeneciciario.trazerBeneficiarioPorId(res.id).then(res => this.beneficiarioEncontrado(res))
    } else {
      this.sobeTorrada('Erro incluindo beneficiário')
    }
  }
  beneficiarioEncontrado = (res: any) => {
    let ok = false
    if (res.id) {
      if (res.id !== '0') {
        ok = true
      }
    }
    if (!ok) {
      this.sobeTorrada('Erro localizando beneficiário')
    } else {
      const benef: Beneficiario = res
      window.localStorage.setItem('beneficionario', JSON.stringify(benef))
      this.router.navigateByUrl('beneficiariosComDocumentos')
    }
  }

  private dados: Comando = {
    callBackRetorno: this.recebimentoDadosNovoBeneficiario,
  }

  sobeTorrada(content: string) {
    // this.snackBar.open(content);
    // setTimeout(() => {
    //   this.snackBar.dismiss();
    // }, 2000);
    this.snackBar.open(content, 'tema', {
      duration: 9000,
      // verticalPosition: 'top',
      // horizontalPosition: 'center',
      panelClass: ['my-snack']
    });
  }

  openSnackBar(message: string,Action:string) {
    this.snackBar.open(message,Action,{
      verticalPosition: 'top'
    }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogBeneficiarioContent, {
      width      : '50%',
      position: {
        left: '25%',
        top: '-200px'
      },
      panelClass: 'fullscreen-dialog',
      data: {
        dados: this.dados
      }},
      
      );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  novoBeneficiario = () => {
    this.openDialog()
  }
}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialogo-tela.html',
  standalone: true,
  imports: [MatDialogModule],
})

export class DialogBeneficiarioContent implements OnInit {

  private dataLocal: any
  private nome!: string
  private fone!: string
  private dNasc!: string

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Comando,
      private apiBeneficiario: ApiBeneficiario,
      private fmt: FormatServices,
    ) {
    this.dataLocal = data
  }
  ngOnInit(): void {
    
  }

  digitacaoNome = (event: any) => {
    this.nome = event.target.value
  }

  digitacaoFone = (event: any) => {
    this.fone = event.target.value
    this.formataFone()
  }
  formataFone = () => {
    const idElemento = 'tFone'
    const tipo = '2'
    this.fmt.mascaraFone(idElemento, tipo);
  }

  digitacaoData = (event: any) => {
    this.dNasc = event.target.value
    this.formataData()
  }
  formataData = () => {
    const idElemento = 'tData'
    const msg = this.fmt.mascaraData(idElemento)
    if (msg !== '') {
      alert(msg)
    }
  }

  enviarPreenchimento = () => {
    let ok = true
    if (this.nome === '' || this.nome === undefined) {
      alert('Informe o nome do beneficiário')
      ok = false
    }
    if (ok) {
      if (this.fone === undefined) {
        this.fone = ''
      }
    }
    let dNasc = ''
    if (ok) {
      if (this.dNasc === undefined) {
        this.dNasc = ''
      } else {
        dNasc = this.dNasc.substring(6,10) + '-' + this.dNasc.substring(3,5) + '-' + this.dNasc.substring(0,2)
      }
    }
    if (ok) {
      const parms = {
        nome: this.nome,
        telefone: this.fone,
        dataNascimento: dNasc
      }
      this.dataLocal.dados.callBackRetorno(parms)
      this.fecharDialogo()
    }
  }

  fecharDialogo = () => {
    const el = document.getElementById('btFecha')
    if (el) {
      el.click()
    }
  }
}
