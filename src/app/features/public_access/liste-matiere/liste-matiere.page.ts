import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  bookOutline,
  checkmarkOutline,
  medalOutline,
  personOutline,
  ribbonOutline,
  speedometerOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/AuthService';

interface Matiere {
  nom: string;
  icon: string;
  leconsFaites: number;
  leconsTotal: number;
  quizFaits: number;
  quizTotal: number;
  progression: number;
  couleur: string;
  progressColor: string;
}

@Component({
  selector: 'app-liste-matiere',
  templateUrl: './liste-matiere.page.html',
  styleUrls: ['./liste-matiere.page.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class ListeMatierePage {
  matieres: Matiere[] = [
    {
      nom: 'Geographie',
      icon: 'assets/icon/globe-terrestre.png',
      leconsFaites: 8,
      leconsTotal: 10,
      quizFaits: 8,
      quizTotal: 10,
      progression: 80,
      couleur: '#4caf50',
      progressColor: '#ef8431'
    },
    {
      nom: 'Maths',
      icon: 'assets/icon/calculator.png',
      leconsFaites: 0,
      leconsTotal: 15,
      quizFaits: 0,
      quizTotal: 15,
      progression: 0,
      couleur: '#ef8431',
      progressColor: '#d8c5b1'
    },
    {
      nom: 'Anglais',
      icon: 'assets/icon/book.png',
      leconsFaites: 8,
      leconsTotal: 16,
      quizFaits: 14,
      quizTotal: 16,
      progression: 50,
      couleur: '#2f8be6',
      progressColor: '#ef8431'
    },
    {
      nom: 'Francais',
      icon: 'assets/icon/flag.png',
      leconsFaites: 8,
      leconsTotal: 8,
      quizFaits: 8,
      quizTotal: 8,
      progression: 100,
      couleur: '#4950b7',
      progressColor: '#26b85f'
    },
    {
      nom: 'Sciences',
      icon: 'assets/icon/flask.png',
      leconsFaites: 0,
      leconsTotal: 14,
      quizFaits: 0,
      quizTotal: 14,
      progression: 0,
      couleur: '#0f9bb0',
      progressColor: '#d8c5b1'
    },
    {
      nom: 'SVT',
      icon: 'assets/icon/globe-terrestre.png',
      leconsFaites: 2,
      leconsTotal: 9,
      quizFaits: 2,
      quizTotal: 9,
      progression: 20,
      couleur: '#73c56d',
      progressColor: '#f0b020'
    }
  ];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'book-outline': bookOutline,
      'speedometer-outline': speedometerOutline,
      'checkmark-outline': checkmarkOutline,
      'medal-outline': medalOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline,
      'log-out-outline': logOutOutline
    });

    this.showLoginSuccessToastIfNeeded();
  }

  private showLoginSuccessToastIfNeeded(): void {
    const notification = this.route.snapshot.queryParamMap.get('notification');
    if (notification !== 'login-success') {
      return;
    }

    void this.presentToast('Connexion réussie. Bienvenue sur votre compte.');
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { notification: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'success',
      position: 'top',
      cssClass: 'centered-toast'
    });
    await toast.present();
  }

  openMatiere(matiere: Matiere): void {
    this.router.navigate(['/contenu-matiere'], {
      state: { matiere: matiere.nom }
    });
  }

  logout(): Promise<void> {
    return this.authService.logout();
  }
}
