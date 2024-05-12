import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicosPage } from './tecnicos.page';

describe('TecnicosPage', () => {
  let component: TecnicosPage;
  let fixture: ComponentFixture<TecnicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TecnicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
