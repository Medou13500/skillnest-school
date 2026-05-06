import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueEtudiantPage } from './historique-etudiant.page';

describe('HistoriqueEtudiantPage', () => {
  let component: HistoriqueEtudiantPage;
  let fixture: ComponentFixture<HistoriqueEtudiantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueEtudiantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
