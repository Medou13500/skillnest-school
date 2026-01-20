import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    RouterLink
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

  // Conditions
  acceptTerms: boolean = false;
  acceptPrivacy: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {

    // Sécurité supplémentaire (au cas où)
    if (!this.acceptTerms || !this.acceptPrivacy) {
      alert('Vous devez accepter les conditions d’utilisation et la politique de confidentialité.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // Données prêtes à être envoyées
    const payload = {
      nom: this.nom,
      prenom: this.prenom,
      username: this.username,
      email: this.email,
      classe: this.classe,
      password: this.password
    };

    console.log('Payload inscription :', payload);

    // TODO : appel API backend ici

    alert(`Inscription réussie pour ${this.prenom} ${this.nom}`);

    // Redirection
    this.router.navigateByUrl('/connexion');
  }
}
