import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  ribbonOutline,
  personOutline,
  logOutOutline,
  speedometerOutline,
  statsChartOutline,
  trendingUpOutline,
  pieChartOutline,
  timeOutline
} from 'ionicons/icons';
import { MenuComponent } from '../../../shared/menu/menu.component';
import { environment } from '../../../../environments/environment';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MenuComponent]
})
export class DashboardPage implements OnInit, AfterViewInit {
  private http = inject(HttpClient);

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
    { label: 'Quizz terminés', value: '0', icon: '✅', color: 'green-icon' },
    { label: 'Questions', value: '0', icon: '❓', color: 'purple-icon' },
    { label: 'Série actuelle', value: '0 j', icon: '🔥', color: 'orange-icon' }
  ];

  // Données de la dernière session
  lastSession: any = null;

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
      'speedometer-outline': speedometerOutline,
      'stats-chart-outline': statsChartOutline,
      'trending-up-outline': trendingUpOutline,
      'pie-chart-outline': pieChartOutline,
      'time-outline': timeOutline
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
    this.loadUserData();
    this.loadStats();
    this.loadHistory();
  }

  loadUserData() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const u = JSON.parse(userJson);
      const firstName = u.first_name || 'Emma';
      const lastName = u.last_name || 'Dubois';

      this.user = {
        nom: firstName + ' ' + lastName,
        niveau: 'Intermédiaire',
        email: u.email,
        initiales: (firstName[0] || '') + (lastName[0] || '') || 'ED'
      };
    }
  }

  loadStats() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.http.get(`${environment.apiUrl}/api/answers/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        if (data.global) {
          this.stats[0].value = `${data.global.averageScore} %`;
          this.stats[1].value = data.global.totalQuizzes.toString();
          this.stats[2].value = data.global.totalAnswers.toString();
          this.stats[3].value = `${data.global.streak} j`;
        }

        if (data.subjects && data.subjects.length > 0) {
          this.updateBarChart(data.subjects);
        }
      },
      error: (err: any) => console.error('Erreur stats dashboard:', err)
    });

    this.loadPerformanceData();
  }

  loadPerformanceData() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.http.get(`${environment.apiUrl}/api/answers/performance?period=${this.selectedPeriod}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.updateLineChart(data);
      },
      error: (err) => console.error('Erreur performance dashboard:', err)
    });
  }

  changePeriod(period: string) {
    this.selectedPeriod = period;
    this.loadPerformanceData();
  }

  updateLineChart(data: any[]) {
    if (!this.lineChartInstance) return;

    if (!data || data.length === 0) {
      this.lineChartInstance.data.labels = ['Aucune donnée'];
      this.lineChartInstance.data.datasets[0].data = [0];
    } else {
      this.lineChartInstance.data.labels = data.map(d => d.day);
      this.lineChartInstance.data.datasets[0].data = data.map(d => d.score);
    }
    this.lineChartInstance.update();
  }

  loadHistory() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.http.get(`${environment.apiUrl}/api/answers/history`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.lastSession = data[0];
        }
      },
      error: (err: any) => console.error('Erreur history dashboard:', err)
    });
  }

  updateBarChart(subjects: any[]) {
    if (!this.barChartInstance) return;

    const labels = subjects.map(s => s.name.substring(0, 5) + '.');
    const values = subjects.map(s => s.score);

    this.barChartInstance.data.labels = labels;
    this.barChartInstance.data.datasets[0].data = values;
    this.barChartInstance.update();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createLineChart();
      this.createBarChart();
      this.loadStats();
    }, 500);
  }

  createLineChart() {
    if (this.lineChartInstance) this.lineChartInstance.destroy();
    this.lineChartInstance = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0, 0],
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
        labels: ['...', '...', '...', '...', '...', '...'],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0],
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
