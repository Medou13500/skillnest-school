import { Component } from '@angular/core';
import { Router } from '@angular/router'; // On garde Router pour la navigation TS
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  atOutline,
  eyeOutline,
  personAddOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
    // RouterLink a été supprimé ici pour enlever le warning
  ]
})
export class InscriptionPage {

  nom: string = '';
  prenom: string = '';
  username: string = '';
  email: string = '';
  classe: string = '';
  password: string = '';
  confirmPassword: string = '';

  acceptTerms: boolean = false;
  acceptPrivacy: boolean = false;

  constructor(public router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'at-outline': atOutline,
      'eye-outline': eyeOutline,
      'person-add-outline': personAddOutline,
      'sparkles-outline': sparklesOutline
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/connexion']);
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      nom: this.nom,
      prenom: this.prenom,
      username: this.username,
      email: this.email,
      classe: this.classe,
      password: this.password
    };

    console.log('Inscription :', payload);

    // Une fois l'inscription réussie :
    this.router.navigate(['/connexion'], {
      queryParams: { notification: 'account-created' }
    });
  }
}
