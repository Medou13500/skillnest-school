import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookOutline, ribbonOutline, personOutline, logOutOutline, speedometerOutline } from 'ionicons/icons';
import { MenuComponent } from '../../../shared/menu/menu.component';

interface Notion {
  titre: string;
  pourcentage: number;
  statut: 'Maîtrisé' | 'En cours' | 'À renforcer';
  sessions: number;
  icon: string;
  color: string;
  prochaineEtape: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-notions',
  templateUrl: './notions.page.html',
  styleUrls: ['./notions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent]
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
    public router: Router,
    private toastController: ToastController
  ) {}

  ngAfterContentInit() {
    addIcons({
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline,
      'log-out-outline': logOutOutline,
      'speedometer-outline': speedometerOutline
    });
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('refreshToken');
    void this.router.navigate(['/connexion'], { replaceUrl: true });
  }

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

  toggleNotion(notion: Notion): void {
    notion.expanded = !notion.expanded;
  }

  goBack(): void {
    void this.router.navigate(['/dashboard']);
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
