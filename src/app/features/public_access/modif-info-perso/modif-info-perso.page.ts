import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import {
  addOutline,
  arrowBackOutline,
  arrowForwardOutline,
  documentTextOutline,
  schoolOutline
} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-infos-perso',
  templateUrl: './modif-info-perso.page.html',
  styleUrls: ['./modif-info-perso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModifInfoPersoPage implements OnInit {
  // Modèle pour le formulaire
  user = {
    prenom: '',
    nom: '',
    username: '',
    email: '',
    classe: ''
  };

  isSubmitting: boolean = false;
  isLoading: boolean = true;

  constructor(
    public router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({
      'add-outline': addOutline,
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'document-text-outline': documentTextOutline,
      'school-outline': schoolOutline
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await firstValueFrom(
        this.http.get<any>(
          `${environment.apiUrl}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      );

      this.user.prenom = response.firstName || '';
      this.user.nom = response.lastName || '';
      this.user.email = response.email || '';
      this.user.username = response.email?.split('@')[0] || '';
      
    } catch (error) {
      console.error('Error loading profile:', error);
      await this.showToast('Erreur lors du chargement du profil', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(): Promise<void> {
    if (!this.user.prenom || !this.user.nom || !this.user.email) {
      await this.showToast('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    this.isSubmitting = true;

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await firstValueFrom(
        this.http.put(
          `${environment.apiUrl}/api/auth/profile`,
          {
            firstName: this.user.prenom,
            lastName: this.user.nom,
            email: this.user.email
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      );

      await this.showToast('Profil mis à jour avec succès', 'success');
      
      // Mettre à jour le localStorage avec les nouvelles infos
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.firstName = this.user.prenom;
      userData.lastName = this.user.nom;
      userData.email = this.user.email;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to dashboard
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          const errorBody = error.error;
          if (errorBody.error === 'EMAIL_ALREADY_USED') {
            await this.showToast('Cet email est déjà utilisé par un autre utilisateur', 'danger');
          } else {
            await this.showToast(errorBody.error || 'Erreur lors de la mise à jour du profil', 'danger');
          }
        } else if (error.status === 401) {
          await this.showToast('Session expirée, veuillez vous reconnecter', 'danger');
          this.router.navigate(['/connexion']);
        } else {
          await this.showToast('Erreur lors de la mise à jour du profil', 'danger');
        }
      } else {
        await this.showToast('Erreur lors de la mise à jour du profil', 'danger');
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
}
