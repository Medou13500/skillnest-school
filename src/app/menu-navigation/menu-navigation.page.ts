import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.page.html',
  styleUrls: ['./menu-navigation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MenuNavigationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
