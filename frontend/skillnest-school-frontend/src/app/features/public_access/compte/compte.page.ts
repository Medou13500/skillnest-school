import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  bookOutline,
  personOutline,
  ribbonOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-compte', // J'ai remis le sélecteur standard
  templateUrl: './compte.page.html', // Correction ici : pointe vers compte.page.html
  styleUrls: ['./compte.page.scss'], // Correction ici : pointe vers compte.page.scss
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ComptePage { // Correction ici : Nom de la classe remis à ComptePage

  menuItems = [
    { label: 'Informations personnelles', route: '/info-perso' },
    { label: 'Changer le mot de passe', route: '/change-password' },
    { label: 'Voir les abonnements', route: '/subscriptions' },
    { label: 'Gérer les notifications', route: '/notifications' },
    { label: 'Supprimer le compte', route: '/delete-account' },
  ];

  constructor(private router: Router) {
    addIcons({
      'chevron-forward-outline': chevronForwardOutline,
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline
    });
  }

  goTo(route: string) {
    console.log('Navigation vers :', route);
    // this.router.navigate([route]);
  }
}
