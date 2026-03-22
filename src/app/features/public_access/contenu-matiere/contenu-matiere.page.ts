import { Component } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NgForOf, NgIf } from "@angular/common";
import { Router } from '@angular/router';

// Importez addIcons et toutes les icônes nécessaires (contenu + footer)
import { addIcons } from 'ionicons';
import {
  bookOutline,
  readerOutline,
  checkmarkCircle,
  ellipseOutline,
  chevronDownOutline,
  chevronForwardOutline,
  ribbonOutline, // Icône pour la couronne/premium
  personOutline  // Icône pour le compte
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
      title: 'Thème 1',
      subtitle: 'Lorem ipsum',
      open: true,
      items: [
        { id: 1, type: 'Leçon', title: 'Titre leçon 1', done: true, route: '/lesson/1' },
        { id: 1, type: 'Quizz', title: 'Titre quizz 1', done: false, route: '/quiz/1' },
      ],
    },
    {
      title: 'Thème 2',
      subtitle: 'Lorem ipsum',
      open: true,
      items: [
        { id: 2, type: 'Leçon', title: 'Titre leçon 2', done: false, route: '/lesson/2' },
        { id: 2, type: 'Quizz', title: 'Titre quizz 2', done: true, route: '/quiz/2' },
      ],
    },
    {
      title: 'Thème 3',
      subtitle: 'Lorem ipsum',
      open: false,
      items: [],
    },
  ];

  // Le router est mis en "public" pour être accessible depuis le fichier HTML
  constructor(public router: Router) {
    addIcons({
      'book-outline': bookOutline,
      'reader-outline': readerOutline,
      'checkmark-circle': checkmarkCircle,
      'ellipse-outline': ellipseOutline,
      'chevron-down-outline': chevronDownOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline
    });
  }

  toggle(theme: any): void {
    theme.open = !theme.open;
  }

  goTo(item: any): void {
    this.router.navigate([item.route]);
  }
}
