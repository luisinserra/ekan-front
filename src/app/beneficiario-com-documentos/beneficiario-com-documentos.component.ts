import { Component, OnInit, Inject } from '@angular/core';
import { Beneficiario, Documento } from '../service/entidadesService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiBeneficiario } from '../service/apiBeneficiarios';
import { ApiDocumentos } from '../service/apiDocumentos';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormatServices } from '../service/formatService';
import { Router } from '@angular/router';

export interface Comando {
  callBackRetorno: any,
  callExclusao: any,
  acao: number
}

export interface Retorno {
  nome: string,
  valor: string,
  acao: number
}

export interface TiposDocumentos {
  id: number,
  descricao: string,
  tipoDocumento: string
}


@Component({
  selector: 'app-beneficiario-com-documentos',
  templateUrl: './beneficiario-com-documentos.component.html',
  styleUrl: './beneficiario-com-documentos.component.css',
})
export class BeneficiarioComDocumentosComponent implements OnInit {

  public beneficiario!: Beneficiario
  public documentos!: Documento[]
  public gradeTitulo!: any
  public grade!: any
  public tNome!: string
  public tFone!: string
  public tData!: string

  constructor(
    private snackBar: MatSnackBar,
    private apiBeneficiario: ApiBeneficiario,
    private apiDocumento: ApiDocumentos,
    private router: Router,
    public dialog: MatDialog,
    public fmt: FormatServices
  ) {}
  
  ngOnInit(): void {
    console.log('beneficiário com documentos')
    const mem = window.localStorage.getItem('beneficionario')
    if (mem) {
      this.beneficiario = JSON.parse(mem)
    }
    this.buscarListaDeDocumentos()
  }

  buscarListaDeDocumentos = () => {
    this.apiDocumento.trazerListaDocumentosDeBeneficiario(this.beneficiario.id).then(res => this.respostaListaDocumentos(res))
  }
  respostaListaDocumentos = (res: any) => {
    console.log(res)
    this.documentos = res
    this.formatacaoDatasDocumentos()
  }
  formatacaoDatasDocumentos = () => {
    for (let doc of this.documentos) {
      let dtAtualizacao = "Ainda não atualizado"
      doc.dtInclusao = doc.dataInclusao.substring(8,10) + '/' + doc.dataInclusao.substring(5,7) + '/' + doc.dataInclusao.substring(0,4) + ' ' + doc.dataInclusao.substring(11, 19)
      try {
        dtAtualizacao = doc.dataAtualizacao.substring(8,10) + '/' + doc.dataAtualizacao.substring(5,7) + '/' + doc.dataAtualizacao.substring(0,4)
      } catch (e) {}
      doc.dtAtualizacao = dtAtualizacao
    }
    console.log(this.documentos)
    this.preenchimentoGrade()
  }

  preenchimentoGrade = () => {
    this.gradeTitulo = []
    const gTipo = {text: 'Tipo Documento', cols: 1, rows: 1};
    const gDescricao = {text: 'Descrição', cols: 1, rows: 1}
    const gInclusao = {text: 'Data Inclusão', cols: 1, rows: 1}
    const gAtualizacao = {text: 'Data Atualização', cols: 1, rows: 1}
    this.gradeTitulo[this.gradeTitulo.length] = gTipo
    this.gradeTitulo[this.gradeTitulo.length] = gDescricao
    this.gradeTitulo[this.gradeTitulo.length] = gInclusao
    this.gradeTitulo[this.gradeTitulo.length] = gAtualizacao

    this.grade = []
    for (let documento of this.documentos) {
      const rTipo = {text: documento.tipoDocumento, cols: 1, rows: 1, id: documento.id};
      const rDescricao = {text: documento.descricao, cols: 1, rows: 1, id: documento.id}
      const rInclusao = {text: documento.dtInclusao, cols: 1, rows: 1, id: documento.id}
      const rAtualizacao = {text: documento.dtAtualizacao, cols: 1, rows: 1, id: documento.id}
  
      this.grade[this.grade.length] =rTipo
      this.grade[this.grade.length] =rDescricao
      this.grade[this.grade.length] =rInclusao
      this.grade[this.grade.length] =rAtualizacao
    }
  }

  getRetornoDialogo = (retorno: Retorno) => {
    let ok = true
    console.log(retorno)
    const filtroDocumentos = this.documentos.find(d => d.tipoDocumento === retorno.nome)
    if (filtroDocumentos !== undefined && retorno.acao == 0) {
      alert('Esse tipo de documento já está na lista')
      ok = false
    } 
    if (ok) {
      const idBeneficiario = this.beneficiario.id
      const tipoDoc = retorno.nome
      if (retorno.acao == 1) {
        const parms = {
          id: 0,
          tipoDocumento: retorno.nome,
          descricao: '',
          idBeneficiario: idBeneficiario,
          valor: retorno.valor
        }
        this.alterarDocumento(parms)
      } else {
        const parms = {
          tipoDocumento: retorno.nome,
          descricao: '',
          idBeneficiario: idBeneficiario,
          valor: retorno.valor
        }
        this.apiDocumento.incluirDocumento(parms).then(res => this.documentoInserido(res))
      }
    }
  }
  documentoInserido = (res: any) => {
    if (res.id) {
      this.refreshDocumento()
    } else {
      this.sobeTorrada("Erro incluindo documento")
    }
  }

  refreshDocumento = () => {
    this.buscarListaDeDocumentos()
  }
  
  alterarDocumento = (parms: any) => {
    const idBeneficiario = parms.idBeneficiario
    const tipoDoc = parms.tipoDocumento    
    this.apiDocumento.buscarDocumentoPorIdBeneficiarioETipoDocumento(idBeneficiario, tipoDoc).then(res => this.respostaAlterarDocumento(res, parms))
  }
  respostaAlterarDocumento = (res: any, parms: any) => {
    if (res.id) {
      parms.id = res.id
      this.enviarDadosParaAlteracao(parms)
    } else {
        this.sobeTorrada('Documento não foi localizado')
    }
  }
  enviarDadosParaAlteracao = (parms: any) => {
    console.log('payload:')
    console.log(parms)
    this.apiDocumento.alterarDocumento(parms).then(res => this.respostaAlteracaoDocumento(res))
  }
  respostaAlteracaoDocumento = (res: any) => {
    if (res.retorno === 'Ok') {
      this.sobeTorrada('Alteração realizada com sucesso')
      this.refreshDocumento()
    } else {
      this.sobeTorrada('Erro na alteração do documento')
    }
  }

  excluirDocumento = (id: number) => {
    this.apiDocumento.excluirDocumento(id).then(res => this.documentoExcluido(res))
  }
  documentoExcluido = (res: any) => {
    if (res.retorno === 'Ok') {
      this.refreshDocumento()
    } else {
      this.sobeTorrada("Erro excluido documento")
    }
  }

  private acao: Comando = {
    callBackRetorno: this.getRetornoDialogo,
    callExclusao: this.excluirDocumento,
    acao: 0
  }

  editandoNome = () => {
    this.tNome = this.beneficiario.nome
    this.ocultar('spanNome')
    this.mostrar('spanINome')
  }
  fechaNome = () => {
    this.mostrar('spanNome')
    this.ocultar('spanINome')
  }

  editandoFone = () => {
    this.tFone = this.beneficiario.telefone
    this.ocultar('spanFone')
    this.mostrar('spanIFone')
  }
  fechaFone = () => {
    this.mostrar('spanFone')
    this.ocultar('spanIFone')
  }
  formataFone = (idElemento: string, tipo: string) => {
    this.fmt.mascaraFone(idElemento, tipo);
  }
  alteraFone = () => {
    let ok = true
    if (this.beneficiario.telefone === this.tFone) {
      this.fechaFone()
      ok = false
    }
    if (ok) {
      this.beneficiario.telefone = this.tFone
      this.apiBeneficiario.alterarBeneficiario(this.beneficiario).then(res => this.beneficiarioAlterado(res))
    }
  }

  editandoData = () => {
    this.tData = this.beneficiario.dtNascimento
    this.ocultar('spanData')
    this.mostrar('spanIData')
  }
  fechaData = () => {
    this.ocultar('spanIData')
    this.mostrar('spanData')
  }
  formataData = () => {
    const idElemento = 'tData'
    const msg = this.fmt.mascaraData(idElemento)
    if (msg !== '') {
      alert(msg)
    }
  }
  alteraData = () => {
    this.beneficiario.dataNascimento = this.tData.substring(6,10) + '-' + this.tData.substring(3,5) + '-' + this.tData.substring(0,2) + 'T03:00:00.000+00:00'
    this.beneficiario.dtNascimento = this.tData
    this.apiBeneficiario.alterarBeneficiario(this.beneficiario).then(res => this.beneficiarioAlterado(res))
  }

  alteraNome = () => {
    let ok = true
    if (this.beneficiario.nome === this.tNome) {
      this.fechaNome()
      ok = false
    }
    if (ok) {
      if (this.tNome === '') {
        this.sobeTorrada('Um nome deve ser informado')
        ok = false
      }
    }
    if (ok) {
      this.beneficiario.nome = this.tNome
      this.apiBeneficiario.alterarBeneficiario(this.beneficiario).then(res => this.beneficiarioAlterado(res))
    }
  }
  beneficiarioAlterado = (res: any) => {
    console.log(res)
    if (res.resultado !== 'Ok') {
      this.sobeTorrada('Erro alterando beneficiário')
    } else {
      this.sobeTorrada('Alteração realizada com sucesso')
      this.fechaNome()
      this.fechaFone()
      this.fechaData()
    }
  }

  editarDocumento = (id: number) => {
    const documentoEditando = this.documentos.find(d => d.id == id)
    if (documentoEditando) {
      window.localStorage.setItem('documentoEditando', JSON.stringify(documentoEditando))
    }
    this.openDialog()
  }

  novoDocumento = () => {
    this.openDialog()
  }

  goLista = () => {
    this.router.navigateByUrl('beneficiarios')
  }

  apagarBeneficiario = () => {
    if (window.confirm('Confirma intenção de apagar o beneficiário?')) {
      this.apiBeneficiario.apagarBeneficiario(this.beneficiario.id).then(res => this.beneficiarioApagado(res))
    }
  }
  beneficiarioApagado = (res: any) => {
    if (res.resultado !== 'Ok') {
      this.sobeTorrada('Erro apagando beneficiário')
    } else {
      this.goLista()
    }
  }

  mostrar = (idElemento: string) => {
    const el = document.getElementById(idElemento)
    if (el) {
      if (el.classList.contains('oculto')) {
        el.classList.remove('oculto')
      }
    }
  }

  ocultar = (idElemento: string) => {
    const el = document.getElementById(idElemento)
    if (el) {
      if (!el.classList.contains('oculto')) {
        el.classList.add('oculto')
      }
    }
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width      : '50%',
      position: {
        left: '25%',
        top: '-200px'
      },
      panelClass: 'fullscreen-dialog',
      data: {
        acao: this.acao
      }},
      
      );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  sobeTorrada(content: string) {
    this.snackBar.open(content);
    setTimeout(() => {
      this.snackBar.dismiss();
    }, 2000);
  }
}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialogo-tela.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgForOf],
})

export class DialogContentExampleDialog implements OnInit {
  private nome!: string
  private valor!: string
  private dataLocal: any
  private tipoDocEscolhido!: string
  private acao: number = 0
  private idDocumento!: number

  public documentos!: TiposDocumentos[]
  public btInclui: string = 'Inserir'

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Comando,
      private apiDocumento: ApiDocumentos,
      private fb: FormBuilder,
      private fmt: FormatServices
    ) {
    this.dataLocal = data
  }

  ngOnInit(): void {
    console.log('Modal Inclui documentos');
    this.apiDocumento.trazerListaDeTiposDeDocumentos().then(res => this.respostaListaTipoDocumentos(res))
  }
  respostaListaTipoDocumentos = (res: any) => {
    console.log(res);
    this.documentos = res
    this.verificaEdicao()
  }
  
  verificaEdicao = () => {
    const mem = window.localStorage.getItem('documentoEditando')
    if (mem) {
      this.mostrar('spanExclui')
      this.btInclui = 'Alterar'
      setTimeout(() => {
        this.preencheJanelas();
      }, 1000)
    } else {
      this.ocultar('spanExclui')
      this.btInclui = 'Inserir'
    }
  }
  
  preencheJanelas = () => {
    let doc: Documento
    const mem = window.localStorage.getItem('documentoEditando')
    if (mem) {
      this.acao = 1
      doc = JSON.parse(mem)
      const tipo = doc.tipoDocumento
      this.tipoDocEscolhido = tipo
      this.idDocumento = doc.id
      const idx = this.descobreIndiceSelecionado(tipo)
      const elSelect = (document.getElementById('selTipoDoc') as HTMLSelectElement)
      elSelect.selectedIndex = idx
      const elInput = (document.getElementById('tValor') as HTMLInputElement)
      if (elInput) {
        elInput.value = doc.valor
        this.valor = doc.valor
      }
    }
    window.localStorage.removeItem('documentoEditando')
  }

  descobreIndiceSelecionado = (tipo: string) => {
    let idx = 0
    let conta = 1
    for (let d of this.documentos) {
      if (d.tipoDocumento === tipo) {
        idx = conta
      }
      conta +=1
    }
    return idx
  }

  digitacaoTipo = (event: any) => {
    const digitado = event.target.value
    this.nome = digitado
    console.log(digitado)
    console.log('Aqui data:')
    console.log(this.dataLocal)
    this.dataLocal.acao.comando(digitado)
  }

  digitacaoValor = (event: any) => {
    const digitado = event.target.value
    this.valor = digitado
    if (this.tipoDocEscolhido === 'CPF') {
      this.formataCpf()
    }
  }

  formataCpf = () => {
    const idElemento = 'tValor'
    const msg = this.fmt.mascaraCpf(idElemento);
    if (msg !== '') {
      alert(msg);
    }
  }

  mudancaTipoEscolhido = (event: any) => {
    this.tipoDocEscolhido = event.target.value
    console.log('Selecionado ' + this.tipoDocEscolhido)
    /*
    const el = (document.getElementById('tValor') as HTMLInputElement)
    if (el) {
      el.removeEventListener('change', this.formataCpf)
      if (this.tipoDocEscolhido === 'RG') {
        el.addEventListener('change', this.formataCpf)
      }
    }
    */
  }

  mostrar = (idElemento: string) => {
    const el = document.getElementById(idElemento)
    if (el) {
      if (el.classList.contains('oculto')) {
        el.classList.remove('oculto')
      }
    }
  }

  ocultar = (idElemento: string) => {
    const el = document.getElementById(idElemento)
    if (el) {
      if (!el.classList.contains('oculto')) {
        el.classList.add('oculto')
      }
    }
  }

  enviarPreenchimento = () => {
    let ok = true
    if (this.tipoDocEscolhido === '' || this.tipoDocEscolhido === undefined) {
      alert('Escolha um tipo de documento')
      ok = false
    }
    if (ok) {
      if (this.valor === '' || this.valor === undefined) {
        alert('Informe o valor')
        ok = false
      }
    }
    if (ok) {
      const retorno: Retorno = {
        nome: this.tipoDocEscolhido,
        valor: this.valor,
        acao: this.acao
      }
      this.dataLocal.acao.callBackRetorno(retorno)
      const el = document.getElementById('btFecha')
      if (el) {
        el.click()
      }
    }
  }

  chamarExclusaoDocumento = () => {
    if (window.confirm('Confirma intenção de excluir o registro?')) {
      this.dataLocal.acao.callExclusao(this.idDocumento)
      const el = document.getElementById('btFecha')
      if (el) {
        el.click()
      }
    }
  }

  fecharInclusao = () => {
    const el = document.getElementById('btFecha')
    if (el) {
      el.click()
    }
  }
}