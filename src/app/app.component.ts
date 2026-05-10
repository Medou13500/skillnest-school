import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MobileMenuComponent } from './shared/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MobileMenuComponent],
})
export class AppComponent {
  constructor() {}
}
