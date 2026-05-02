import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import {
  arrowBackOutline,
  arrowForwardOutline,
  bookOutline,
  keyOutline,
  lockClosedOutline,
  personOutline,
  ribbonOutline,
  logOutOutline
} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/AuthService';

@Component({
  selector: 'app-change-password',
  templateUrl: './modif-mdp.page.html',
  styleUrls: ['./modif-mdp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModifMdpPage {
  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  isSubmitting: boolean = false;

  constructor(
    public router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private authService: AuthService
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'book-outline': bookOutline,
      'key-outline': keyOutline,
      'lock-closed-outline': lockClosedOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline,
      'log-out-outline': logOutOutline
    });
  }

  async updatePassword(): Promise<void> {
    if (this.passwordData.new !== this.passwordData.confirm) {
      await this.showToast('Les mots de passe ne correspondent pas', 'danger');
      return;
    }

    if (this.passwordData.new.length < 8) {
      await this.showToast('Le nouveau mot de passe doit contenir au moins 8 caractères', 'danger');
      return;
    }

    if (!this.passwordData.current || !this.passwordData.new) {
      await this.showToast('Veuillez remplir tous les champs', 'danger');
      return;
    }

    this.isSubmitting = true;

    try {
      const token = localStorage.getItem('authToken');
      
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/api/auth/change-password`,
          {
            currentPassword: this.passwordData.current,
            newPassword: this.passwordData.new
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      );

      await this.showToast('Mot de passe mis à jour avec succès', 'success');
      
      // Reset form
      this.passwordData = {
        current: '',
        new: '',
        confirm: ''
      };
      
      // Redirect to dashboard
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const errorBody = error.error;
          if (errorBody.error === 'CURRENT_PASSWORD_INVALID') {
            await this.showToast('Mot de passe actuel incorrect', 'danger');
          } else if (errorBody.error === 'PASSWORD_TOO_SHORT') {
            await this.showToast('Le nouveau mot de passe doit contenir au moins 8 caractères', 'danger');
          } else {
            await this.showToast(errorBody.error || 'Erreur lors du changement de mot de passe', 'danger');
          }
        } else if (error.status === 401) {
          await this.showToast('Session expirée, veuillez vous reconnecter', 'danger');
          this.router.navigate(['/connexion']);
        } else {
          await this.showToast('Erreur lors du changement de mot de passe', 'danger');
        }
      } else {
        await this.showToast('Erreur lors du changement de mot de passe', 'danger');
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  goTo(route: string): void {
    if (route === '/logout') {
      this.authService.logout();
    } else {
      this.router.navigate([route]);
    }
  }
}
