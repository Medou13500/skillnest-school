import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import {
  arrowBackOutline,
  arrowForwardOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: {
    id: number;
    email: string;
    role: string;
    is_new_user?: boolean;
  };
}

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, NgIf]
})
export class ConnexionPage {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isSubmitting: boolean = false;

  role: 'student' | 'parent' | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'eye-outline': eyeOutline,
      'lock-closed-outline': lockClosedOutline,
      'mail-outline': mailOutline,
      'person-outline': personOutline,
      'sparkles-outline': sparklesOutline
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.role = navigation.extras.state['role'];
    }

    this.showAccountCreatedToastIfNeeded();
  }

  goToForgot() {
    this.router.navigate(['/mot-de-passe-oublie']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/inscription'], {
      state: { role: this.role }
    });
  }

  private showAccountCreatedToastIfNeeded(): void {
    const notification = this.route.snapshot.queryParamMap.get('notification');
    if (notification !== 'account-created') {
      return;
    }

    void this.presentToast('Compte crée avec succés. Vous pouvez maintenant vous connecter.');
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

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    if (!this.email || !this.password) {
      await this.presentToast('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.apiUrl}/api/auth/login`,
          {
            email: this.email.trim(),
            password: this.password
          },
          { withCredentials: true }
        )
      );

      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      localStorage.setItem('rememberMe', String(this.rememberMe));

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      const effectiveRole = (response.user?.role ?? this.role ?? 'student').toLowerCase();
      let targetRoute = '/liste-matiere';
      const isNewStudent = effectiveRole === 'student' && response.user?.is_new_user === true;

      if (effectiveRole === 'admin') {
        targetRoute = '/admin';
      } else if (effectiveRole === 'parent') {
        targetRoute = '/parent';
      } else if (isNewStudent) {
        targetRoute = '/test-positionnement';
      }

      await this.router.navigate([targetRoute], {
        queryParams: { notification: 'login-success' }
      });
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const backendError = error.error?.error;

        if (backendError === 'USER_NOT_FOUND' || backendError === 'INVALID_PASSWORD') {
          await this.presentToast('Email ou mot de passe incorrect.');
          return;
        }

        if (backendError === 'EMAIL_AND_PASSWORD_REQUIRED') {
          await this.presentToast('Veuillez renseigner votre email et votre mot de passe.');
          return;
        }
      }

      await this.presentToast('Connexion impossible. Vérifiez que le backend est démarré.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
