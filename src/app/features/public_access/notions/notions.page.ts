import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

interface Notion {
  titre: string;
  pourcentage: number;
  statut: 'Maîtrisé' | 'En cours' | 'À renforcer';
  sessions: number;
  icon: string;
  color: string;
  prochaineEtape: string;
}

@Component({
  selector: 'app-notions',
  templateUrl: './notions.page.html',
  styleUrls: ['./notions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NotionsPage implements OnInit {
  notions: Notion[] = [
    { titre: 'Variables', pourcentage: 85, statut: 'Maîtrisé', sessions: 8, icon: '📦', color: '#42b883', prochaineEtape: 'Passe à la notion suivante' },
    { titre: 'Conditions', pourcentage: 70, statut: 'En cours', sessions: 6, icon: '🔀', color: '#4d7cfe', prochaineEtape: 'Continue encore 2 sessions' },
    { titre: 'Boucles', pourcentage: 60, statut: 'En cours', sessions: 5, icon: '🔄', color: '#ff823a', prochaineEtape: 'Continue encore 2 sessions' },
    { titre: 'Fonctions', pourcentage: 40, statut: 'À renforcer', sessions: 3, icon: '⚙️', color: '#a855f7', prochaineEtape: 'Reprends les bases' },
    { titre: 'Tableaux', pourcentage: 30, statut: 'À renforcer', sessions: 2, icon: '📋', color: '#facd15', prochaineEtape: 'Reprends les bases' },
    { titre: 'Algorithmes', pourcentage: 18, statut: 'À renforcer', sessions: 1, icon: '🧮', color: '#ef4444', prochaineEtape: 'Reprends les bases' }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'Maîtrisé':
        return 'status-mastered';
      case 'En cours':
        return 'status-progress';
      case 'À renforcer':
        return 'status-warning';
      default:
        return '';
    }
  }

  goBack(): void {
    // Logique pour le bouton retour
    console.log('Retour cliqué');
  }

  onTabClick(event: Event): void {
    const target = (event.target as HTMLElement)?.closest('.tab');
    if (!target) {
      return;
    }

    const tabElements = Array.from(target.parentElement?.querySelectorAll('.tab') ?? []);
    const clickedIndex = tabElements.indexOf(target);

    switch (clickedIndex) {
      case 0:
        void this.router.navigate(['/dashboard']);
        return;
      case 1:
        return;
      case 2:
        void this.router.navigate(['/historique-dashboard']);
        return;
      case 3:
        void this.presentToast('La page badges sera disponible bientôt.');
        return;
      default:
        return;
    }
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      color: 'medium',
      position: 'top'
    });
    await toast.present();
  }
}
