import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    RouterLink,
    NgIf
  ]
})
export class ConnexionPage {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  // 🔹 Profil reçu depuis la page d’accueil
  role: 'student' | 'parent' | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.role = navigation?.extras.state?.['role'] || null;

    console.log('Profil détecté :', this.role);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    console.log('Connexion', {
      role: this.role,
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });

    if (this.role === 'student') {
      alert(`Connexion Étudiant réussie pour ${this.email}`);
      // this.router.navigateByUrl('/dashboard-student');
    }

    if (this.role === 'parent') {
      alert(`Connexion Parent réussie pour ${this.email}`);
      // this.router.navigateByUrl('/dashboard-parent');
    }

    if (!this.role) {
      alert(`Connexion réussie pour ${this.email}`);
      // fallback si accès direct à /connexion
    }
  }
}
