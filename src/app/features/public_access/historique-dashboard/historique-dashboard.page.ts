import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline } from 'ionicons/icons';

interface Session {
  id: number;
  titre: string;
  categorie: string;
  date: string;
  duree: string;
  score: number;
  total: number;
  pourcentage: number;
  icon: string;
  statusColor: string; // 'green' ou 'red'
}

@Component({
  selector: 'app-historique',
  templateUrl: './historique-dashboard.page.html',
  styleUrls: ['./historique-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HistoriqueDashboardPage implements OnInit {

  filtres = ['Tout', 'Variables', 'Conditions', 'Boucles', 'Fonctions'];
  filtreActif = 'Tout';

  sessions: Session[] = [
    { id: 1, titre: 'Variables', categorie: 'Algorithmique', date: 'Auj. 14h32', duree: '4min', score: 8, total: 10, pourcentage: 80, icon: '🧮', statusColor: 'green' },
    { id: 2, titre: 'Boucles', categorie: 'Programmation', date: 'Hier 10h15', duree: '6min', score: 6, total: 10, pourcentage: 60, icon: '🔄', statusColor: 'green' },
    { id: 3, titre: 'Conditions', categorie: 'Algorithmique', date: 'Hier 09h00', duree: '5min', score: 5, total: 10, pourcentage: 50, icon: '🔀', statusColor: 'red' },
    { id: 4, titre: 'Fonctions', categorie: 'Maths', date: 'Lun. 16h20', duree: '5min', score: 7, total: 10, pourcentage: 70, icon: '⚙️', statusColor: 'green' },
    { id: 5, titre: 'Variables', categorie: 'Programmation', date: 'Lun. 11h05', duree: '3min', score: 9, total: 10, pourcentage: 90, icon: '📦', statusColor: 'green' },
    { id: 6, titre: 'Tableaux', categorie: 'Algorithmique', date: 'Dim. 15h40', duree: '7min', score: 4, total: 10, pourcentage: 40, icon: '📋', statusColor: 'red' },
    { id: 7, titre: 'Algorithmes', categorie: 'Maths', date: 'Sam. 18h00', duree: '8min', score: 6, total: 10, pourcentage: 60, icon: '📉', statusColor: 'green' },
    { id: 8, titre: 'Boucles', categorie: 'Programmation', date: 'Ven. 20h15', duree: '5min', score: 8, total: 10, pourcentage: 80, icon: '🔁', statusColor: 'green' },
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'calendar-outline': calendarOutline
    });
  }

  ngOnInit() {}

  setFiltre(f: string) {
    this.filtreActif = f;
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
        void this.router.navigate(['/notions']);
        return;
      case 2:
        return;
      case 3:
        void this.presentToast('La page badges sera disponible bientot.');
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
