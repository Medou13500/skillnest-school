import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call logout endpoint if we have a refresh token
      if (refreshToken) {
        try {
          await this.http.post(
            `${environment.apiUrl}/api/auth/logout`,
            { refresh_token: refreshToken }
          ).toPromise();
        } catch (error) {
          console.error('Error calling logout endpoint:', error);
        }
      }

    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage regardless of API response
      this.clearAuthData();
      
      // Show success message
      await this.showToast('Déconnecté avec succès', 'success');
      
      // Redirect to login
      setTimeout(() => {
        this.router.navigate(['/connexion']);
      }, 1000);
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
