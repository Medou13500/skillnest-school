import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetMotDePassePage } from './reset-mot-de-passe.page';

describe('ResetMotDePassePage', () => {
  let component: ResetMotDePassePage;
  let fixture: ComponentFixture<ResetMotDePassePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetMotDePassePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
