import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowBackOutline,
  arrowForwardOutline,
  documentTextOutline,
  schoolOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-infos-perso',
  templateUrl: './modif-info-perso.page.html',
  styleUrls: ['./modif-info-perso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModifInfoPersoPage {
  // Modèle pour le formulaire
  user = {
    prenom: '',
    nom: '',
    username: '',
    email: '',
    classe: ''
  };

  constructor(public router: Router) {
    addIcons({
      'add-outline': addOutline,
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'document-text-outline': documentTextOutline,
      'school-outline': schoolOutline
    });
  }

  updateProfile() {
    console.log('Données à mettre à jour :', this.user);
    // Logique de mise à jour ici
  }
}
