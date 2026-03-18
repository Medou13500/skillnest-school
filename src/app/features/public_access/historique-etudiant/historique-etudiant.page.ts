import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Interface pour structurer tes données de quiz
interface QuizResult {
  id: number;
  titre: string;
  categorie: string;
  score: number;
  totalQuestions: number;
  date: string;
  status: 'reussi' | 'echoue';
}

@Component({
  selector: 'app-historique-etudiant',
  templateUrl: './historique-etudiant.page.html',
  styleUrls: ['./historique-etudiant.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class HistoriqueEtudiantPage implements OnInit {

  // Données fictives pour l'affichage (à remplacer plus tard par un appel API)
  historique: QuizResult[] = [
    {
      id: 1,
      titre: 'Algèbre Linéaire',
      categorie: 'Mathématiques',
      score: 18,
      totalQuestions: 20,
      date: '2024-05-20',
      status: 'reussi'
    },
    {
      id: 2,
      titre: 'La Rome Antique',
      categorie: 'Histoire',
      score: 8,
      totalQuestions: 20,
      date: '2024-05-18',
      status: 'echoue'
    },
    {
      id: 3,
      titre: 'Optique Géométrique',
      categorie: 'Physique',
      score: 15,
      totalQuestions: 20,
      date: '2024-05-15',
      status: 'reussi'
    }
  ];

  constructor() { }

  ngOnInit() {
    console.log('Historique chargé');
  }

  /**
   * Calcule le pourcentage de réussite pour la barre de progression
   */
  getPercentage(score: number, total: number): number {
    return (score / total) * 100;
  }

}
