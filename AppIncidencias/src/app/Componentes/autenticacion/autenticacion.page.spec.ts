import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutenticacionPage } from './autenticacion.page';

describe('AutenticacionPage', () => {
  let component: AutenticacionPage;
  let fixture: ComponentFixture<AutenticacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutenticacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
