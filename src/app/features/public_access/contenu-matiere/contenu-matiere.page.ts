import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  bookOutline,
  checkmarkCircle,
  chevronDownOutline,
  chevronForwardOutline,
  createOutline,
  ellipseOutline,
  filterOutline,
  locateOutline,
  searchOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-contenu-matiere',
  templateUrl: './contenu-matiere.page.html',
  styleUrls: ['./contenu-matiere.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf
  ]
})
export class ContenuMatierePage {
  currentMatiere = (history.state?.matiere as string) || 'Geographie';

  themes = [
    {
      title: 'Theme 1',
      subtitle: 'Variables & Types',
      progress: '1/2',
      open: true,
      items: [
        { id: 1, type: 'Lecon', title: 'Introduction...', done: true, route: '/lesson/1' },
        { id: 2, type: 'Quizz', title: 'Quiz ...', done: false, route: '/quiz' }
      ]
    },
    {
      title: 'Theme 2',
      subtitle: 'Conditions & Boucles',
      progress: '1/2',
      open: false,
      items: []
    },
    {
      title: 'Theme 3',
      subtitle: 'Fonctions & Tableaux',
      progress: '0/2',
      open: false,
      items: []
    }
  ];

  constructor(public router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'book-outline': bookOutline,
      'checkmark-circle': checkmarkCircle,
      'chevron-down-outline': chevronDownOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'create-outline': createOutline,
      'ellipse-outline': ellipseOutline,
      'filter-outline': filterOutline,
      'locate-outline': locateOutline,
      'search-outline': searchOutline
    });
  }

  toggle(theme: any): void {
    theme.open = !theme.open;
  }

  goTo(item: any): void {
    if (item.route === '/quiz') {
      this.router.navigate(['/quiz'], {
        queryParams: { matiere: this.currentMatiere }
      });
      return;
    }

    this.router.navigate([item.route]);
  }
}
