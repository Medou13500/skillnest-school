import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  keyOutline,
  lockClosedOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-reset-mot-de-passe',
  templateUrl: './reset-mot-de-passe.page.html',
  styleUrls: ['./reset-mot-de-passe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ResetMotDePassePage {
  newPassword = '';
  confirmPassword = '';

  constructor(private router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'key-outline': keyOutline,
      'lock-closed-outline': lockClosedOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline
    });
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      alert('Veuillez remplir les deux champs.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    alert('Votre mot de passe a ete mis a jour.');
    this.router.navigateByUrl('/connexion');
  }
}
