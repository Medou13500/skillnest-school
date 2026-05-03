import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
  imports: [CommonModule, IonicModule, RouterModule] // On importe les outils nécessaires
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
  }

  startTest() {
  }
}