import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/AuthService';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() active?: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigate(path: string): void {
    if (path === '/logout' || path === 'logout') {
      void this.authService.logout();
      return;
    }
    void this.router.navigate([path]);
  }
}
