import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { bookOutline, ribbonOutline, personOutline } from 'ionicons/icons';

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
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline
    });
  }

  updatePassword() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      console.error('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Mise à jour du mot de passe...', this.passwordData);
  }
}
