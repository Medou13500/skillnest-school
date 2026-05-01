import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important pour le *ngFor
import { IonicModule } from '@ionic/angular'; // Important pour les balises ion-

// Interface pour structurer les niveaux proprement
interface Level {
  name: string;
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-test-positionnement',
  templateUrl: './test-positionnement.component.html',
  styleUrls: ['./test-positionnement.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule] // On importe les outils nécessaires
})
export class TestPositionnementComponent implements OnInit {

  // Données pour la liste des niveaux (Capture_decran_2026-03-25_143313.png)
  public levels: Level[] = [
    { name: 'Débutant', emoji: '🌱', color: '#43a047' },
    { name: 'Élémentaire', emoji: '🌿', color: '#00796b' },
    { name: 'Intermédiaire', emoji: '⚡', color: '#ef6c00' },
    { name: 'Avancé', emoji: '🚀', color: '#3949ab' },
    { name: 'Expert', emoji: '🏆', color: '#d9822b' }
  ];

  constructor() { }

  ngOnInit() {
    console.log('Composant Quiz End chargé avec succès !');
  }

  // Fonction pour le bouton orange "Démarrer le test"
  startTest() {
    console.log('Démarrage du test en cours...');
  }
}