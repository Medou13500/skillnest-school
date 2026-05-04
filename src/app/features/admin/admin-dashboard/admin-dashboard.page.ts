import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminDashboardPage implements OnInit {
  usersCount = 124;
  coursesCount = 18;
  pendingReports = 3;

  user = {
    nom: 'Admin Emma',
    niveau: 'Administrateur',
    email: 'admin@skillnest.local',
    initiales: 'AD'
  };

  stats = [
    { label: 'Utilisateurs actifs', value: this.usersCount, icon: '👥', color: 'blue-icon' },
    { label: 'Cours publiés', value: this.coursesCount, icon: '📚', color: 'green-icon' },
    { label: 'Signalements', value: this.pendingReports, icon: '⚠️', color: 'orange-icon' },
    { label: 'Tâches en attente', value: '12', icon: '🛠️', color: 'purple-icon' }
  ];

  constructor(
    public router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit(): void { }

  async presentToast(message: string) {
    const t = await this.toastController.create({ message, duration: 2000, position: 'top' });
    await t.present();
  }
}
