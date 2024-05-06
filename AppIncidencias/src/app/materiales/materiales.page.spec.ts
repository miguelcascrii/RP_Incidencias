import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialesPage } from './materiales.page';

describe('MaterialesPage', () => {
  let component: MaterialesPage;
  let fixture: ComponentFixture<MaterialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
