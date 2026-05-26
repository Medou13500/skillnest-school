import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MobileMenuComponent } from './shared/mobile-menu/mobile-menu.component';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MobileMenuComponent],
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        return;
      }

      let user: any;
      try {
        user = JSON.parse(userJson);
      } catch {
        return;
      }

      const isStudent = typeof user?.role === 'string' && user.role.toLowerCase() === 'student';
      const isNewUser = user?.is_new_user === true;
      const navigatingToTestPage = event.url.startsWith('/quiz-test-positionnement') || event.url.startsWith('/test-positionnement');
      const publicRoutes = ['/connexion', '/inscription', '/mot-de-passe-oublie', '/reset-mot-de-passe', '/'];
      const isPublicRoute = publicRoutes.some((route) => event.url.startsWith(route));

      if (isStudent && isNewUser && !navigatingToTestPage && !isPublicRoute) {
        void this.router.navigate(['/test-positionnement']);
      }
    });
  }
}
