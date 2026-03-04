import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterLink
  ]
})
export class InscriptionPage {
  nom: string = '';       // <- Nouveau champ Nom
  prenom: string = '';    // <- Nouveau champ Prénom
  username: string = '';
  email: string = '';
  classe: string = '';    // <- Propriété Classe
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Vérification mots de passe
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérification classe
    if (!this.classe) {
      alert('Veuillez sélectionner votre classe');
      return;
    }

    // Vérification nom et prénom
    if (!this.nom || !this.prenom) {
      alert('Veuillez renseigner votre nom et prénom');
      return;
    }

    // Ici vous pouvez envoyer les données à votre backend
    console.log('Nom:', this.nom);
    console.log('Prénom:', this.prenom);
    console.log('Nom d’utilisateur:', this.username);
    console.log('Email:', this.email);
    console.log('Classe:', this.classe);
    console.log('Mot de passe:', this.password);

    alert(`Inscription réussie pour ${this.prenom} ${this.nom} (${this.classe})`);

    // Redirection vers la page de connexion
    this.router.navigateByUrl('/connexion');
  }
}
