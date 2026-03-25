import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeMatierePage } from './liste-matiere.page';

describe('ListeMatierePage', () => {
  let component: ListeMatierePage;
  let fixture: ComponentFixture<ListeMatierePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeMatierePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
