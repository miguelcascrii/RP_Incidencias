import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaincidenciaPage } from './nuevaincidencia.page';

describe('NuevaincidenciaPage', () => {
  let component: NuevaincidenciaPage;
  let fixture: ComponentFixture<NuevaincidenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaincidenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
