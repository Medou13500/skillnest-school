import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { addIcons } from 'ionicons';
import { bookOutline, ribbonOutline, personOutline, logOutOutline, speedometerOutline } from 'ionicons/icons';
import { MenuComponent } from '../../../shared/menu/menu.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MenuComponent]
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;

  private lineChartInstance: any;
  private barChartInstance: any;

  selectedPeriod = '7';

  user = {
    nom: 'Emma Dubois',
    niveau: 'Intermédiaire',
    email: 'emma.dubois@lycee.fr',
    initiales: 'ED'
  };

  stats = [
    { label: 'Score moyen', value: '72 %', icon: '🎯', color: 'blue-icon' },
    { label: 'Quizz terminés', value: '24', icon: '✅', color: 'green-icon' },
    { label: 'Notions maîtrisées', value: '8 / 15', icon: '🧠', color: 'purple-icon' },
    { label: 'Série actuelle', value: '5 j', icon: '🔥', color: 'orange-icon' }
  ];

  // Données de la dernière session
  lastSession = {
    titre: 'Variables',
    categorie: 'Algorithmie',
    date: 'Auj. 14h32',
    duree: '4min',
    score: 8,
    total: 10,
    pourcentage: 80,
    icon: '🧮'
  };

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { }

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

  ngOnInit() {
    this.showLoginSuccessToastIfNeeded();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createLineChart();
      this.createBarChart();
    }, 200);
  }

  createLineChart() {
    if (this.lineChartInstance) this.lineChartInstance.destroy();
    this.lineChartInstance = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          data: [55, 70, 62, 80, 75, 88, 72],
          borderColor: '#ff823a',
          backgroundColor: 'rgba(255, 130, 58, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ff823a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  createBarChart() {
    if (this.barChartInstance) this.barChartInstance.destroy();
    this.barChartInstance = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Vari.', 'Cond.', 'Bouc.', 'Fonc.', 'Tabl.', 'Algo.'],
        datasets: [{
          data: [85, 70, 60, 40, 30, 18],
          backgroundColor: ['#42b883', '#4d7cfe', '#ff823a', '#a855f7', '#facd15', '#ef4444'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
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
        return;
      case 1:
        void this.router.navigate(['/notions']);
        return;
      case 2:
        void this.router.navigate(['/historique-dashboard']);
        return;
      case 3:
        void this.presentToast('La page badges sera disponible bientot.');
        return;
      default:
        return;
    }
  }

  private showLoginSuccessToastIfNeeded(): void {
    const notification = this.route.snapshot.queryParamMap.get('notification');
    if (notification !== 'login-success') {
      return;
    }

    void this.presentToast('Connexion reussie. Bienvenue sur votre compte.');
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
}
