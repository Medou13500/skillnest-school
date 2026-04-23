import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  bookOutline,
  keyOutline,
  lockClosedOutline,
  personOutline,
  ribbonOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-change-password',
  templateUrl: './modif-mdp.page.html',
  styleUrls: ['./modif-mdp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModifMdpPage {
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(public router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'book-outline': bookOutline,
      'key-outline': keyOutline,
      'lock-closed-outline': lockClosedOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline
    });
  }

  updatePassword(): void {
    if (this.passwordData.new !== this.passwordData.confirm) {
      console.error('Les mots de passe ne correspondent pas');
      return;
    }

    console.log('Mise a jour du mot de passe...', this.passwordData);
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
