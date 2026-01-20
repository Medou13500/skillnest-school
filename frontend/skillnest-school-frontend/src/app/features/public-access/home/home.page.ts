import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgOptimizedImage
  ]
})
export class HomePage {

  constructor(private router: Router) {}

  goToLogin(role: 'student' | 'parent') {
    this.router.navigate(['/connexion'], {
      state: { role }
    });
  }
}
