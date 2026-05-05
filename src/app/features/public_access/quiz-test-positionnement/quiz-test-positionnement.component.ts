import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { QuestionService, ApiQuestion } from '../../../core/services/question.service';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-quiz-test-positionnement',
  templateUrl: './quiz-test-positionnement.component.html',
  styleUrls: ['./quiz-test-positionnement.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class QuizTestPositionnementComponent implements OnInit, OnDestroy {

  // État des questions
  questions: ApiQuestion[] = [];
  currentQuestionIndex: number = 0;
  
  // État de l'UI
  isLoading: boolean = true;
  error: string | null = null;
  
  // Réponses de l'utilisateur
  userAnswers: Record<number, string> = {};
  
  // Timer
  remainingTime: number = 30;
  timerInterval: any;
  
  private destroy$ = new Subject<void>();

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.loadTestQuestions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  /**
   * Charge les questions du test de positionnement depuis l'API
   */
  loadTestQuestions() {
    this.isLoading = true;
    this.error = null;

    this.questionService.getTestPositionnementQuestions()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Erreur chargement questions:', err);
          this.error = 'Erreur lors du chargement des questions';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(questions => {
        if (questions.length > 0) {
          this.questions = questions;
          this.startTimer();
        } else {
          this.error = 'Aucune question trouvée';
        }
        this.isLoading = false;
      });
  }

  /**
   * Démarre le timer pour la question actuelle
   */
  startTimer() {
    this.remainingTime = 30;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.nextQuestion(); // Auto-avancer si timeout
      }
    }, 1000);
  }

  /**
   * Récupère la question actuelle
   */
  get currentQuestion(): ApiQuestion | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Récupère les réponses de la question actuelle en tableau
   */
  get currentAnswers(): string[] {
    if (!this.currentQuestion) return [];
    
    const answers = this.currentQuestion.answers;
    if (typeof answers === 'string') {
      try {
        return JSON.parse(answers);
      } catch {
        return [answers];
      }
    }
    return answers as string[];
  }

  /**
   * Vérifie si une réponse a été sélectionnée pour la question actuelle
   */
  isAnswerSelected(answer: string): boolean {
    if (!this.currentQuestion) return false;
    return this.userAnswers[this.currentQuestion.id] === answer;
  }

  /**
   * Sélectionne une réponse pour la question actuelle
   */
  selectAnswer(answer: string) {
    if (this.currentQuestion) {
      this.userAnswers[this.currentQuestion.id] = answer;
    }
  }

  /**
   * Passe à la question suivante
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
    } else {
      // Quiz terminé
      this.completeQuiz();
    }
  }

  /**
   * Revient à la question précédente
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.startTimer();
    }
  }

  /**
   * Calcule la progression (%) du quiz
   */
  getProgressPercentage(): number {
    if (this.questions.length === 0) return 0;
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  /**
   * Calcule le nombre de questions répondues
   */
  getAnsweredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  /**
   * Obtient la lettre (A, B, C, D) pour un index de réponse
   */
  getLetterForIndex(index: number): string {
    return ['A', 'B', 'C', 'D'][index] || '?';
  }

  /**
   * Termine le quiz et effectue les actions finales
   */
  completeQuiz() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    console.log('Quiz complété', {
      totalQuestions: this.questions.length,
      answeredQuestions: this.getAnsweredCount(),
      userAnswers: this.userAnswers
    });

    // TODO: Envoyer les réponses au backend
    // TODO: Rediriger vers la page de résultats
  }

  /**
   * Peut avancer vers la prochaine question
   */
  canGoNext(): boolean {
    return this.currentQuestionIndex < this.questions.length - 1;
  }

  /**
   * Peut revenir à la question précédente
   */
  canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }
}