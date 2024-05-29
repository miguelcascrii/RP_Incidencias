import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentroPage } from './centro.page';

describe('CentroPage', () => {
  let component: CentroPage;
  let fixture: ComponentFixture<CentroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
