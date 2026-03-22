import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { bookOutline, ribbonOutline, personOutline } from 'ionicons/icons';

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
      'book-outline': bookOutline,
      'ribbon-outline': ribbonOutline,
      'person-outline': personOutline
    });
  }
}
