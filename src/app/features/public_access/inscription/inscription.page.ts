import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import {
  arrowBackOutline,
  arrowForwardOutline,
  atOutline,
  caretDownOutline,
  eyeOffOutline,
  eyeOutline,
  personAddOutline,
  sparklesOutline
} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';

interface RegisterResponse {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class InscriptionPage {
  nom: string = '';
  prenom: string = '';
  username: string = '';
  email: string = '';
  classe: string = '';
  password: string = '';
  confirmPassword: string = '';

  acceptTerms: boolean = false;
  acceptPrivacy: boolean = false;

  isSubmitting: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    public router: Router,
    private http: HttpClient,
    private toastController: ToastController
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'at-outline': atOutline,
      'caret-down-outline': caretDownOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'person-add-outline': personAddOutline,
      'sparkles-outline': sparklesOutline
    });
  }

  goBack(): void {
    void this.router.navigate(['/home']);
  }

  goToLogin(): void {
    void this.router.navigate(['/connexion']);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  private async presentToast(message: string, color: 'success' | 'danger' = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2600,
      color,
      position: 'top',
      cssClass: 'centered-toast'
    });
    await toast.present();
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.presentToast('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isSubmitting = true;

    try {
      await firstValueFrom(
        this.http.post<RegisterResponse>(`${environment.apiUrl}/api/auth/register`, {
          email: this.email.trim(),
          password: this.password
        })
      );

      await this.presentToast('Compte créé avec succès.', 'success');

      await this.router.navigate(['/connexion'], {
        queryParams: { notification: 'account-created' }
      });
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const backendError = error.error?.error;

        if (backendError === 'USER_ALREADY_EXISTS') {
          await this.presentToast('Cet email est déjà utilisé.');
          return;
        }

        if (backendError === 'EMAIL_AND_PASSWORD_REQUIRED') {
          await this.presentToast('Email et mot de passe obligatoires.');
          return;
        }
      }

      await this.presentToast("Inscription impossible. Vérifiez que le backend est démarré.");
    } finally {
      this.isSubmitting = false;
    }
  }
}
