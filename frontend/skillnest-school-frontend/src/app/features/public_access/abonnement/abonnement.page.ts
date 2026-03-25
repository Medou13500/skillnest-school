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
  personOutline,
  ribbonOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.page.html',
  styleUrls: ['./abonnement.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AbonnementPage {
  typeAbonnement = 'mensuel';

  constructor(public router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'book-outline': bookOutline,
      'checkmark-outline': checkmarkOutline,
      'person-outline': personOutline,
      'ribbon-outline': ribbonOutline
    });
  }

  segmentChanged(ev: any): void {
    this.typeAbonnement = ev.detail.value;
  }
}
