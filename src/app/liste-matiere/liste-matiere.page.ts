import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgForOf } from '@angular/common';

interface Matiere {
  nom: string;
  icon: string; // chemin vers l'image dans assets
  leconsFaites: number;
  leconsTotal: number;
  quizFaits: number;
  quizTotal: number;
  progression: number;
  couleur: string;
}

@Component({
  selector: 'app-liste-matiere',
  templateUrl: './liste-matiere.page.html',
  styleUrls: ['./liste-matiere.page.scss'],
  imports: [
    IonicModule,
    NgForOf
  ]
})
export class ListeMatierePage {

  matieres: Matiere[] = [
    {
      nom: 'Géographie',
      icon: 'assets/icon/globe-terrestre.png', // corrigé
      leconsFaites: 8,
      leconsTotal: 10,
      quizFaits: 8,
      quizTotal: 10,
      progression: 80,
      couleur: '#4CAF50'
    },
    {
      nom: 'Maths',
      icon: 'assets/icon/calculator.png', // corrigé
      leconsFaites: 0,
      leconsTotal: 15,
      quizFaits: 0,
      quizTotal: 15,
      progression: 0,
      couleur: '#FF7043'
    },
    {
      nom: 'Anglais',
      icon: 'assets/icon/book.png', // corrigé
      leconsFaites: 8,
      leconsTotal: 16,
      quizFaits: 14,
      quizTotal: 16,
      progression: 50,
      couleur: '#42A5F5'
    },
    {
      nom: 'Français',
      icon: 'assets/icon/flag.png', // corrigé
      leconsFaites: 8,
      leconsTotal: 8,
      quizFaits: 8,
      quizTotal: 8,
      progression: 100,
      couleur: '#3F51B5'
    },
    {
      nom: 'Physique-Chimie',
      icon: 'assets/icon/flask.png', // corrigé
      leconsFaites: 0,
      leconsTotal: 14,
      quizFaits: 0,
      quizTotal: 14,
      progression: 0,
      couleur: '#0097A7'
    },
    {
      nom: 'SVT',
      icon: 'assets/icon/leaf.png', // corrigé
      leconsFaites: 2,
      leconsTotal: 9,
      quizFaits: 2,
      quizTotal: 9,
      progression: 20,
      couleur: '#66BB6A'
    }
  ];

}
