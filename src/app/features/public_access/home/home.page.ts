import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, arrowForwardOutline, sparklesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class HomePage {
  constructor(private router: Router) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'sparkles-outline': sparklesOutline
    });
  }

  goToLogin(role: 'student' | 'parent') {
    this.router.navigate(['/connexion'], {
      state: { role }
    });
  }
}
