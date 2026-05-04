import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  arrowBackOutline,
  checkmarkCircle,
  trashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-suppression-compte',
  templateUrl: './suppression-compte.page.html',
  styleUrls: ['./suppression-compte.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class SuppressionComptePage implements OnInit {
  readonly deletedItems = [
    'Ton profil et tes informations personnelles',
    'Ta progression et tous tes resultats de quiz',
    'Ton abonnement actif (sans remboursement)'
  ];

  constructor(private readonly router: Router) {
    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      checkmarkCircle,
      trashOutline
    });
  }

  ngOnInit() {
  }

  goBackToAccount(): void {
    this.router.navigate(['/compte']);
  }

}
