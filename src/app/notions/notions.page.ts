import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Notion {
  titre: string;
  pourcentage: number;
  statut: 'Maîtrisé' | 'En cours' | 'À renforcer';
  sessions: number;
  icon: string;
  color: string;
  prochaineEtape: string;
}

@Component({
  selector: 'app-notions',
  templateUrl: './notions.page.html',
  styleUrls: ['./notions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NotionsPage implements OnInit {

  // Données basées sur la capture d'écran
  notions: Notion[] = [
    { titre: 'Variables', pourcentage: 85, statut: 'Maîtrisé', sessions: 8, icon: '📦', color: '#42b883', prochaineEtape: 'Passe à la notion suivante' },
    { titre: 'Conditions', pourcentage: 70, statut: 'En cours', sessions: 6, icon: '🔀', color: '#4d7cfe', prochaineEtape: 'Continue encore 2 sessions' },
    { titre: 'Boucles', pourcentage: 60, statut: 'En cours', sessions: 5, icon: '🔄', color: '#ff823a', prochaineEtape: 'Continue encore 2 sessions' },
    { titre: 'Fonctions', pourcentage: 40, statut: 'À renforcer', sessions: 3, icon: '⚙️', color: '#a855f7', prochaineEtape: 'Reprends les bases' },
    { titre: 'Tableaux', pourcentage: 30, statut: 'À renforcer', sessions: 2, icon: '📋', color: '#facd15', prochaineEtape: 'Reprends les bases' },
    { titre: 'Algorithmes', pourcentage: 18, statut: 'À renforcer', sessions: 1, icon: '🧮', color: '#ef4444', prochaineEtape: 'Reprends les bases' }
  ];

  constructor() { }

  ngOnInit() {}

  getStatutClass(statut: string) {
    switch(statut) {
      case 'Maîtrisé': return 'status-mastered';
      case 'En cours': return 'status-progress';
      case 'À renforcer': return 'status-warning';
      default: return '';
    }
  }

  goBack() {
    // Logique pour le bouton retour
    console.log('Retour cliqué');
  }
}
