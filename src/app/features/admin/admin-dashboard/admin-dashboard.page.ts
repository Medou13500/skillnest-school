import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/AuthService';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminDashboardPage implements OnInit {
  usersCount = 124;
  coursesCount = 18;
  pendingReports = 3;

  user = {
    nom: 'Admin Emma',
    niveau: 'Administrateur',
    email: 'admin@skillnest.local',
    initiales: 'AD'
  };

  stats = [
    { label: 'Utilisateurs actifs', value: this.usersCount, icon: '👥', color: 'blue-icon' },
    { label: 'Cours publiés', value: this.coursesCount, icon: '📚', color: 'green-icon' },
    { label: 'Signalements', value: this.pendingReports, icon: '⚠️', color: 'orange-icon' },
    { label: 'Tâches en attente', value: '12', icon: '🛠️', color: 'purple-icon' }
  ];

  constructor(
    public router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // ensure logout icon is available in this standalone component
    try { addIcons({ 'log-out-outline': logOutOutline }); } catch (e) { /* ignore */ }
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const t = await this.toastController.create({ message, duration: 2000, position: 'top', color });
    await t.present();
  }

  async markTestAccountAsNew(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      await this.presentToast('Jeton manquant. Veuillez vous reconnecter.', 'danger');
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/api/auth/profile/admin/mark-new`,
          { email: 'test@gmail.com' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );
      await this.presentToast('Le compte test@gmail.com est maintenant marqué comme nouveau utilisateur.');
    } catch (error) {
      console.error('Erreur remise à neuf du compte test@gmail.com :', error);
      await this.presentToast('Impossible de marquer le compte comme nouveau.', 'danger');
    }
  }

  logout(): Promise<void> {
    return this.authService.logout();
  }
}
