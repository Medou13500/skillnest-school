import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonButton, IonContent, IonCheckbox, IonProgressBar } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'page_quiz',
  templateUrl: 'page-quiz.component.html',
  styleUrls: ['page-quiz.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonButton, IonContent, IonCheckbox, IonProgressBar, FormsModule],
  standalone: true
})

export class PageQuizComponent {
  public progress = 0;

  constructor() {
  }

  borders = [
    { id: 0, value: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus.'},
    { id: 1, value: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus.'},
    { id: 2, value: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus.'},
    { id: 3, value: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus.'},
  ]

  trackBorders(index: number, borderObject: any) {
  return borderObject.id;
  }
}