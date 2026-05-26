import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/services/AuthService';
import { QuestionService } from '../../../core/services/question.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, logOutOutline, arrowForwardCircleOutline } from 'ionicons/icons';

// Interface pour structurer les niveaux proprement
interface Level {
  name: string;
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-test-positionnement',
  templateUrl: './test-positionnement.component.html',
  styleUrls: ['./test-positionnement.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule] // On importe les outils nécessaires
})
export class TestPositionnementComponent implements OnInit {

  public questionCount: number = 0;
  public isLoading: boolean = true;

  // Données pour la liste des niveaux (Capture_decran_2026-03-25_143313.png)
  public levels: Level[] = [
    { name: 'Débutant', emoji: '🌱', color: '#43a047' },
    { name: 'Élémentaire', emoji: '🌿', color: '#00796b' },
    { name: 'Intermédiaire', emoji: '⚡', color: '#ef6c00' },
    { name: 'Avancé', emoji: '🚀', color: '#3949ab' },
    { name: 'Expert', emoji: '🏆', color: '#d9822b' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private questionService: QuestionService
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'log-out-outline': logOutOutline,
      'arrow-forward-circle': arrowForwardCircleOutline
    });
  }

  ngOnInit() {
    this.loadQuestionCount();
  }

  loadQuestionCount() {
    this.isLoading = true;
    // On utilise la même logique de filtrage que dans le quiz pour la cohérence
    this.questionService.getAllQuestions().subscribe({
      next: (questions) => {
        const testQuestions = questions.filter(q =>
          q.type === 'test' || (q as any).notionId === null || (q as any).notion_id === null || (q as any).notionId === -1
        );
        this.questionCount = testQuestions.length > 0 ? testQuestions.length : questions.slice(0, 10).length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    void this.authService.logout();
  }

  startTest() {
  }
}
