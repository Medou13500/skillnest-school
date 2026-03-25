import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  bookOutline,
  checkmarkOutline,
  helpCircleOutline,
  megaphoneOutline,
  notificationsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NotificationsPage {

  constructor(public router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'book-outline': bookOutline,
      'checkmark-outline': checkmarkOutline,
      'help-circle-outline': helpCircleOutline,
      'megaphone-outline': megaphoneOutline,
      'notifications-outline': notificationsOutline
    });
  }
}
