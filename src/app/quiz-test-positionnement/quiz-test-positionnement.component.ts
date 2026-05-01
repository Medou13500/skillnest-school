import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz-test-positionnement',
  templateUrl: './quiz-test-positionnement.component.html',
  styleUrls: ['./quiz-test-positionnement.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class QuizTestPositionnementComponent implements OnInit {

  // Pour le moment, on utilise juste des placeholders
  // Ces variables seront remplacées par tes données API plus tard
  public questionText: string = "X";
  public currentStep: number = 0;
  public totalSteps: number = 10;

  constructor() { }

  ngOnInit() {
    console.log('Quiz démarré');
  }
}