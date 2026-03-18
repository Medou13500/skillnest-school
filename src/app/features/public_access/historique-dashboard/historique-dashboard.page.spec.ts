import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueDashboardPage } from './historique-dashboard.page';

describe('HistoriqueDashboardPage', () => {
  let component: HistoriqueDashboardPage;
  let fixture: ComponentFixture<HistoriqueDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
