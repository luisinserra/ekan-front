import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { BeneficiarioComDocumentosComponent } from './beneficiario-com-documentos/beneficiario-com-documentos.component';

const routes: Routes = [
  {path: '', component: BeneficiariosComponent},
  {path: 'beneficiarios', component: BeneficiariosComponent},
  {path: 'beneficiariosComDocumentos', component: BeneficiarioComDocumentosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
