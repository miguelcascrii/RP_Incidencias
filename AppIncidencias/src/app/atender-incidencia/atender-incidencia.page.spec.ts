import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtenderIncidenciaPage } from './atender-incidencia.page';

describe('AtenderIncidenciaPage', () => {
  let component: AtenderIncidenciaPage;
  let fixture: ComponentFixture<AtenderIncidenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AtenderIncidenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
