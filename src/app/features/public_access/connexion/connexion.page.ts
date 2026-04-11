import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons';

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

  role: 'student' | 'parent' | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
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

  goToRegister() {
    this.router.navigate(['/inscription']);
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

  onSubmit(): void {
    if (!this.email || !this.password) {
      console.error('Champs manquants');
      return;
    }

    if (this.role === 'student') {
      this.router.navigate(['/liste-matiere'], {
        queryParams: { notification: 'login-success' }
      });
    } else if (this.role === 'parent') {
      this.router.navigate(['/dashboard'], {
        queryParams: { notification: 'login-success' }
      });
    } else {
      this.router.navigate(['/liste-matiere'], {
        queryParams: { notification: 'login-success' }
      });
    }
  }
}
