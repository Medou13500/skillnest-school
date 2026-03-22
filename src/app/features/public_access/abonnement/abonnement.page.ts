import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  ribbonOutline,
  personOutline,
  checkmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.page.html',
  styleUrls: ['./abonnement.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AbonnementPage {
  // État du segment (Mensuel par défaut)
  typeAbonnement: string = 'mensuel';

  constructor(public router: Router) {
    addIcons({
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline,
      'checkmark-outline': checkmarkOutline
    });
  }

  segmentChanged(ev: any) {
    this.typeAbonnement = ev.detail.value;
  }
}
