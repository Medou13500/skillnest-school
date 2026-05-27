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
  userConnected = false;

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

  ngOnInit(): void {
    this.loadConnectedAccount();
  }

  private loadConnectedAccount(): void {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      this.userConnected = false;
      return;
    }

    try {
      const user = JSON.parse(userJson) as {
        email?: string;
        role?: string;
        first_name?: string;
        last_name?: string;
      };

      this.userConnected = true;
      this.user.email = user.email ?? this.user.email;
      this.user.niveau = this.formatRole(user.role ?? 'admin');
      this.user.nom = this.buildDisplayName(user);
      this.user.initiales = this.buildInitials(user);
    } catch {
      this.userConnected = false;
    }
  }

  private buildDisplayName(user: { email?: string; first_name?: string; last_name?: string; role?: string }): string {
    if (user.first_name || user.last_name) {
      return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    }

    if (user.email) {
      const prefix = user.email.split('@')[0];
      return prefix.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return 'Admin';
  }

  private buildInitials(user: { email?: string; first_name?: string; last_name?: string }): string {
    if (user.first_name || user.last_name) {
      return `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();
    }

    if (user.email) {
      const prefix = user.email.split('@')[0];
      return prefix
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join('') || 'AD';
    }

    return 'AD';
  }

  private formatRole(role: string): string {
    const normalized = role.toLowerCase();
    if (normalized === 'admin') return 'Administrateur';
    if (normalized === 'student') return 'Étudiant';
    if (normalized === 'parent') return 'Parent';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  ngAfterContentInit(): void {
    void this.loadActiveUsersCount();
  }

  private async loadActiveUsersCount(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await firstValueFrom(
        this.http.get<{ activeUsers: number }>(`${environment.apiUrl}/api/admin/active-users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      if (typeof res?.activeUsers === 'number') {
        this.usersCount = res.activeUsers;
        // mettre à jour le tableau de stats
        if (this.stats && this.stats.length > 0) {
          this.stats[0].value = this.usersCount;
        }
      }
    } catch (error) {
      console.error('Erreur récupération utilisateurs actifs :', error);
    }
  }

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

  async resetTestAccountHistory(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      await this.presentToast('Jeton manquant.', 'danger');
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/api/answers/reset-history`,
          { email: 'test@gmail.com' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );
      await this.presentToast('Historique de test@gmail.com supprimé.');
    } catch (error) {
      console.error('Erreur reset historique :', error);
      await this.presentToast('Impossible de supprimer l\'historique.', 'danger');
    }
  }

  logout(): Promise<void> {
    return this.authService.logout();
  }
}
