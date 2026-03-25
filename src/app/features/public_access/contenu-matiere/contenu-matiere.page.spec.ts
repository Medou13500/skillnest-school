import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenuMatierePage } from './contenu-matiere.page';

describe('ContenuMatierePage', () => {
  let component: ContenuMatierePage;
  let fixture: ComponentFixture<ContenuMatierePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenuMatierePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
