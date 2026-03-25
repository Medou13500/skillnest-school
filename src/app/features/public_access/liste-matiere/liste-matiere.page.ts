import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router'; // Import du Router

// Imports pour les icônes du menu
import { addIcons } from 'ionicons';
import { bookOutline, ribbonOutline, personOutline } from 'ionicons/icons';

interface Matiere {
  nom: string;
  icon: string;
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
  standalone: true, // Recommandé pour utiliser les imports directs
  imports: [
    IonicModule,
    NgForOf
  ]
})
export class ListeMatierePage {

  matieres: Matiere[] = [
    {
      nom: 'Géographie',
      icon: 'assets/icon/globe-terrestre.png',
      leconsFaites: 8,
      leconsTotal: 10,
      quizFaits: 8,
      quizTotal: 10,
      progression: 80,
      couleur: '#4CAF50'
    },
    {
      nom: 'Maths',
      icon: 'assets/icon/calculator.png',
      leconsFaites: 0,
      leconsTotal: 15,
      quizFaits: 0,
      quizTotal: 15,
      progression: 0,
      couleur: '#FF7043'
    },
    {
      nom: 'Anglais',
      icon: 'assets/icon/book.png',
      leconsFaites: 8,
      leconsTotal: 16,
      quizFaits: 14,
      quizTotal: 16,
      progression: 50,
      couleur: '#42A5F5'
    },
    {
      nom: 'Français',
      icon: 'assets/icon/flag.png',
      leconsFaites: 8,
      leconsTotal: 8,
      quizFaits: 8,
      quizTotal: 8,
      progression: 100,
      couleur: '#3F51B5'
    },
    {
      nom: 'Physique-Chimie',
      icon: 'assets/icon/flask.png',
      leconsFaites: 0,
      leconsTotal: 14,
      quizFaits: 0,
      quizTotal: 14,
      progression: 0,
      couleur: '#0097A7'
    },
    {
      nom: 'SVT',
      icon: 'assets/icon/leaf.png',
      leconsFaites: 2,
      leconsTotal: 9,
      quizFaits: 2,
      quizTotal: 9,
      progression: 20,
      couleur: '#66BB6A'
    }
  ];

  // Le router est en "public" pour être utilisé dans le HTML (click)
  constructor(public router: Router) {
    // Enregistrement des icônes du footer
    addIcons({
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline
    });
  }

}
