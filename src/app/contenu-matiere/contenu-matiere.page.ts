import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import { Router } from '@angular/router';


@Component({
  selector: 'app-contenu-matiere',
  templateUrl: './contenu-matiere.page.html',
  styleUrls: ['./contenu-matiere.page.scss'],
  imports: [
    IonicModule,
    NgIf,
    NgForOf
  ]
})
export class ContenuMatierePage {


  constructor(private router: Router) {}


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


  toggle(theme: any): void {
    theme.open = !theme.open;
  }


  goTo(item: any): void {
    this.router.navigate([item.route]);
  }
}
