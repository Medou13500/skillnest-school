import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuppressionComptePage } from './suppression-compte.page';

describe('SuppressionComptePage', () => {
  let component: SuppressionComptePage;
  let fixture: ComponentFixture<SuppressionComptePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppressionComptePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
