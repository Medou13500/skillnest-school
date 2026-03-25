import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotionsPage } from './notions.page';

describe('NotionsPage', () => {
  let component: NotionsPage;
  let fixture: ComponentFixture<NotionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
