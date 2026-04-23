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
  trashOutline
} from 'ionicons/icons';

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
  imports: [IonicModule, CommonModule]
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
        { label: 'Supprimer le compte', route: '/compte', icon: 'trash-outline', danger: true }
      ]
    }
  ];

  constructor(private router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'book-outline': bookOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'lock-closed-outline': lockClosedOutline,
      'notifications-outline': notificationsOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline,
      'trash-outline': trashOutline
    });
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
