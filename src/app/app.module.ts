import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { HttpClientModule } from '@angular/common/http';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BeneficiarioComDocumentosComponent } from './beneficiario-com-documentos/beneficiario-com-documentos.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    BeneficiariosComponent,
    BeneficiarioComDocumentosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatGridListModule,
    MatIconModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [
    MatSnackBar,
    { 
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: 
      { 
        height: '200px', width: '250px', autoFocus: true 
      }
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
