import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarioComDocumentosComponent } from './beneficiario-com-documentos.component';

describe('BeneficiarioComDocumentosComponent', () => {
  let component: BeneficiarioComDocumentosComponent;
  let fixture: ComponentFixture<BeneficiarioComDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiarioComDocumentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeneficiarioComDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
