import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuNavigationPage } from './menu-navigation.page';

describe('MenuNavigationPage', () => {
  let component: MenuNavigationPage;
  let fixture: ComponentFixture<MenuNavigationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNavigationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
