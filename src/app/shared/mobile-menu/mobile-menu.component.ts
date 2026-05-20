import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/AuthService';
import { addIcons } from 'ionicons';
import { logOutOutline, speedometerOutline, bookOutline, ribbonOutline, personOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [IonicModule, NgIf],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent {
  open = false;
  isAuthenticated = false;

  nav = [
    { label: 'Mon dashboard', icon: 'speedometer-outline', path: '/dashboard' },
    { label: 'Matieres', icon: 'book-outline', path: '/liste-matiere' },
    { label: 'Classement', icon: 'ribbon-outline', path: '/abonnement' },
    { label: 'Profil', icon: 'person-outline', path: '/compte' }
  ];

  private subs: Subscription[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // register used ionicons locally for this standalone component
    addIcons({
      'log-out-outline': logOutOutline,
      'speedometer-outline': speedometerOutline,
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline,
      'close-outline': closeOutline
    });

    this.updateAuthState();

    // update on route changes (login redirects will update visibility)
    const sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.updateAuthState();
      }
    });
    this.subs.push(sub);

    // listen to storage events (other tabs)
    const storageHandler = () => this.updateAuthState();
    window.addEventListener('storage', storageHandler);
    // store for removal
    this.subs.push({ unsubscribe: () => window.removeEventListener('storage', storageHandler) } as Subscription);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private updateAuthState(): void {
    const token = !!localStorage.getItem('authToken');
    let isAdmin = false;
    try {
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        const role = (parsed?.role ?? parsed?.roles ?? '') as string;
        if (typeof role === 'string' && role.toLowerCase() === 'admin') {
          isAdmin = true;
        }
      }
    } catch (err) {
      // ignore parse errors
    }

    // show mobile menu only when there is a token and user is NOT admin
    this.isAuthenticated = token && !isAdmin;
  }

  toggle() {
    this.open = !this.open;
  }

  navigate(p: string) {
    this.open = false;
    void this.router.navigate([p]);
  }

  logout() {
    void this.authService.logout();
  }
}
