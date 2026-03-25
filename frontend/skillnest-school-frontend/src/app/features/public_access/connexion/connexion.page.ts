import { Component } from '@angular/core';
import { Router } from '@angular/router'; // On ne garde que Router
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgIf } from "@angular/common";
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    // RouterLink a été supprimé d'ici
    NgIf
  ]
})
export class ConnexionPage {
  // ... (le reste du code reste identique)

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  // Profil reçu depuis la page d’accueil
  role: 'student' | 'parent' | null = null;

  // On passe le router en "public" pour y accéder depuis le HTML si besoin
  constructor(public router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'eye-outline': eyeOutline,
      'lock-closed-outline': lockClosedOutline,
      'mail-outline': mailOutline,
      'person-outline': personOutline,
      'sparkles-outline': sparklesOutline
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.role = navigation.extras.state['role'];
    }

    console.log('Profil détecté :', this.role);
  }

  // Fonctions de navigation pour remplacer les routerLink si tu préfères le TS
  goToForgot() {
    this.router.navigate(['/mot-de-passe-oublie']);
  }

  goToRegister() {
    this.router.navigate(['/inscription']);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      // Conseil : Utilise ion-toast pour un rendu plus mobile/moderne qu'un alert()
      console.error('Champs manquants');
      return;
    }

    console.log('Tentative de connexion', {
      role: this.role,
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });

    // Logique de redirection selon le rôle
    if (this.role === 'student') {
      this.router.navigate(['/liste-matiere']); // Redirection vers ta page de cours
    } else if (this.role === 'parent') {
      this.router.navigate(['/dashboard-parent']);
    } else {
      // Si pas de rôle (accès direct), redirection par défaut
      this.router.navigate(['/liste-matiere']);
    }
  }
}
