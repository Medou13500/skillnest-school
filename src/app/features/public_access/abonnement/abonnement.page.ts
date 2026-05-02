import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  bookOutline,
  checkmarkOutline,
  speedometerOutline,
  personOutline,
  ribbonOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../../../core/services/AuthService';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.page.html',
  styleUrls: ['./abonnement.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AbonnementPage {
  typeAbonnement = 'mensuel';

  constructor(public router: Router, private authService: AuthService) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'book-outline': bookOutline,
      'speedometer-outline': speedometerOutline,
      'checkmark-outline': checkmarkOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline,
      'log-out-outline': logOutOutline
    });
  }

  logout(): Promise<void> {
    return this.authService.logout();
  }

  segmentChanged(ev: any): void {
    this.typeAbonnement = ev.detail.value;
  }
}
