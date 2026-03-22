import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifMdpPage } from './modif-mdp.page';

describe('ModifMdpPage', () => {
  let component: ModifMdpPage;
  let fixture: ComponentFixture<ModifMdpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifMdpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
