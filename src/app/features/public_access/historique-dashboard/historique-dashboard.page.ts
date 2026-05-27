import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, bookOutline, ribbonOutline, personOutline, logOutOutline, speedometerOutline, timeOutline, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { MenuComponent } from '../../../shared/menu/menu.component';
import { environment } from '../../../../environments/environment';

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
  statusColor: string;
}

@Component({
  selector: 'app-historique',
  templateUrl: './historique-dashboard.page.html',
  styleUrls: ['./historique-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent]
})
export class HistoriqueDashboardPage implements OnInit {

  visibleCount = 5;
  sessions: Session[] = [];
  isLoading = false;
  user = { nom: 'Emma Dubois', initiales: 'ED' };

  constructor(
    public router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'calendar-outline': calendarOutline,
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline,
      'log-out-outline': logOutOutline,
      'speedometer-outline': speedometerOutline,
      'time-outline': timeOutline,
      'add-circle-outline': addCircleOutline,
      'remove-circle-outline': removeCircleOutline
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadHistory();
  }

  loadUserData() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const u = JSON.parse(userJson);
      // Fallback sur Emma Dubois si les noms ne sont pas renseignés
      const firstName = u.first_name || 'Emma';
      const lastName = u.last_name || 'Dubois';

      this.user.nom = firstName + ' ' + lastName;
      this.user.initiales = (firstName[0] || '') + (lastName[0] || '') || 'ED';
    }
  }

  loadHistory() {
    this.isLoading = true;
    const token = localStorage.getItem('authToken');

    this.http.get(`${environment.apiUrl}/api/answers/history`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.sessions = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement historique:', err);
        this.isLoading = false;
      }
    });
  }

  get visibleSessions(): Session[] {
    return this.sessions.slice(0, this.visibleCount);
  }

  showMore(): void {
    this.visibleCount += 5;
  }

  showLess(): void {
    this.visibleCount = 5;
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

  goBack(): void {
    void this.router.navigate(['/dashboard']);
  }

  onTabClick(event: Event): void {
    const target = (event.target as HTMLElement)?.closest('.tab');
    if (!target) return;

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
