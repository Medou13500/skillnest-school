import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifInfoPersoPage } from './modif-info-perso.page';

describe('ModifInfoPersoPage', () => {
  let component: ModifInfoPersoPage;
  let fixture: ComponentFixture<ModifInfoPersoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifInfoPersoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
