import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  keyOutline,
  mailOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-mot-de-passe-oublie',
  templateUrl: './mot-de-passe-oublie.page.html',
  styleUrls: ['./mot-de-passe-oublie.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterLink
  ]
})
export class MotDePasseOubliePage {
  email: string = '';

  constructor(private router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'key-outline': keyOutline,
      'mail-outline': mailOutline
    });
  }

  onSubmit() {
    if (!this.email) {
      alert('Veuillez entrer votre email');
      return;
    }

    // Ici, vous pouvez envoyer la demande à votre backend
    console.log('Email pour réinitialisation:', this.email);
    alert(`Un email de réinitialisation a été envoyé à ${this.email}`);

    // Redirection vers la page de connexion
    this.router.navigateByUrl('/connexion');
  }
}
