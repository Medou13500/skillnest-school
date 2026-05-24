import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  bookOutline,
  chevronForwardOutline,
  lockClosedOutline,
  notificationsOutline,
  personOutline,
  ribbonOutline,
  speedometerOutline,
  trashOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/AuthService';
import { MenuComponent } from '../../../shared/menu/menu.component';

interface AccountMenuItem {
  label: string;
  route: string;
  icon: string;
  danger?: boolean;
}

interface AccountSection {
  title: string;
  danger?: boolean;
  items: AccountMenuItem[];
}

@Component({
  selector: 'app-compte',
  templateUrl: './compte.page.html',
  styleUrls: ['./compte.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent]
})
export class ComptePage {
  sections: AccountSection[] = [
    {
      title: 'Compte',
      items: [
        { label: 'Informations personnelles', route: '/modif-info-perso', icon: 'person-outline' },
        { label: 'Changer le mot de passe', route: '/modif-mdp', icon: 'lock-closed-outline' }
      ]
    },
    {
      title: 'Abonnement & Preferences',
      items: [
        { label: 'Voir les abonnements', route: '/abonnement', icon: 'ribbon-outline' },
        { label: 'Gerer les notifications', route: '/notifications', icon: 'notifications-outline' }
      ]
    },
    {
      title: 'Zone dangereuse',
      danger: true,
      items: [
        { label: 'Supprimer le compte', route: '/compte', icon: 'trash-outline', danger: true },
        { label: 'Se déconnecter', route: '/logout', icon: 'log-out-outline', danger: true }
      ]
    }
  ];

  constructor(private router: Router, private authService: AuthService) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'book-outline': bookOutline,
      'speedometer-outline': speedometerOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'lock-closed-outline': lockClosedOutline,
      'notifications-outline': notificationsOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline,
      'trash-outline': trashOutline,
      'log-out-outline': logOutOutline
    });
  }

  goTo(route: string): void {
    if (route === '/logout') {
      this.authService.logout();
    } else {
      this.router.navigate([route]);
    }
  }
}
