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
  themes = [
    {
      title: 'Theme 1',
      subtitle: 'Variables & Types',
      progress: '1/2',
      open: true,
      items: [
        { id: 1, type: 'Lecon', title: 'Introduction...', done: true, route: '/lesson/1' },
        { id: 2, type: 'Quizz', title: 'Quiz ...', done: false, route: '/quiz/1' }
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
    if (item.type === 'Quizz') {
      this.router.navigate(['/quiz'], { queryParams: { matiere: this.getMatiereFromTheme(item) } });
    } else {
      this.router.navigate([item.route]);
    }
  }

  private getMatiereFromTheme(item: any): string | null {
    const theme = this.themes.find(t => t.items.some(i => i.id === item.id));
    if (theme) {
      // This is a simple mapping, you might need a more robust solution
      switch (theme.title) {
        case 'Theme 1': return 'maths';
        case 'Theme 2': return 'francais';
        case 'Theme 3': return 'anglais';
        default: return null;
      }
    }
    return null;
  }
}
