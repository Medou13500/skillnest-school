import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { QuestionService, ApiQuestion } from '../../../core/services/question.service';
import { AuthService } from '../../../core/services/AuthService';
import { Subject, of, firstValueFrom } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { logOutOutline, arrowBackOutline, arrowForwardCircleOutline, menuOutline, chevronUpOutline, alertCircleOutline } from 'ionicons/icons';
import { environment } from '../../../../environments/environment';

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
  showFeedback: boolean = false;
  showResults: boolean = false;

  // Données de résultats
  scoreGlobal: number = 0;
  correctAnswersCount: number = 0;
  notionsMasteredCount: number = 0;
  subjectsProgress: any[] = [
    { name: 'Geographie', icon: '🌍', status: 'Non évaluée', total: 0, correct: 0, percent: 0 },
    { name: 'Maths', icon: '🔢', status: 'Non évaluée', total: 0, correct: 0, percent: 0 },
    { name: 'Anglais', icon: '🇬🇧', status: 'Non évaluée', total: 0, correct: 0, percent: 0 },
    { name: 'Francais', icon: '✍️', status: 'Non évaluée', total: 0, correct: 0, percent: 0 },
    { name: 'Sciences', icon: '🧪', status: 'Non évaluée', total: 0, correct: 0, percent: 0 },
    { name: 'SVT', icon: '🧬', status: 'Non évaluée', total: 0, correct: 0, percent: 0 }
  ];

  // Réponses de l'utilisateur
  userAnswers: Record<number, string> = {};

  // Fullscreen image viewer state
  isImageFullscreen = false;
  activeImageIndex = 0;

  // Timer
  remainingTime: number = 30;
  timerInterval: any;

  private destroy$ = new Subject<void>();

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    addIcons({
      'log-out-outline': logOutOutline,
      'arrow-back': arrowBackOutline,
      'arrow-forward-circle': arrowForwardCircleOutline,
      'menu-outline': menuOutline,
      'chevron-up-outline': chevronUpOutline,
      'alert-circle': alertCircleOutline
    });
  }

  ngOnInit() {
    this.loadTestQuestions();
  }

  logout(): void {
    void this.authService.logout();
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

    // On utilise getAllQuestions pour être sûr de voir ce qui existe en base
    this.questionService.getAllQuestions()
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
        // On filtre : soit type 'test', soit les questions qui n'ont pas de notionId (notionId null ou -1)
        const testQuestions = questions.filter(q =>
          q.type === 'test' || (q as any).notionId === null || (q as any).notion_id === null || (q as any).notionId === -1
        );

        if (testQuestions.length > 0) {
          this.questions = testQuestions;
          this.startTimer();
        } else if (questions.length > 0) {
          // Si on n'a rien trouvé de spécifique, on prend les premières questions pour ne pas bloquer l'utilisateur
          this.questions = questions.slice(0, 10);
          this.startTimer();
        } else {
          this.error = 'Aucune question disponible dans la base de données.';
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
   * Helper pour parser les images (string JSON ou tableau)
   */
  currentAnswersAsArray(data: string[] | string | undefined): string[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [];
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
    if (this.currentQuestion && !this.showFeedback) {
      this.userAnswers[this.currentQuestion.id] = answer;
    }
  }

  /**
   * Passe à la question suivante ou valide la réponse
   */
  nextQuestion() {
    if (!this.showFeedback) {
      // Étape 1 : On affiche la correction
      this.showFeedback = true;
      if (this.timerInterval) clearInterval(this.timerInterval);
      return;
    }

    // Étape 2 : On passe à la suite
    this.showFeedback = false;
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
    } else {
      // Quiz terminé
      this.completeQuiz();
    }
  }

  /**
   * Calcule le pourcentage de temps restant (pour la barre verte/rouge)
   */
  getTimePercentage(): number {
    return (this.remainingTime / 30) * 100;
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
  async completeQuiz() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Calcul des résultats
    this.correctAnswersCount = 0;
    const resultsBySubject: Record<string, { total: number, correct: number }> = {};

    this.questions.forEach(q => {
      // Normalisation du nom de la matière pour le calcul
      const subjectName = this.normalizeSubjectName(q.matiere || '');

      if (!resultsBySubject[subjectName]) {
        resultsBySubject[subjectName] = { total: 0, correct: 0 };
      }
      resultsBySubject[subjectName].total++;

      const userAns = this.userAnswers[q.id];
      const correctAns = q.correctAnswer || q.correct_answer;
      if (userAns === correctAns) {
        this.correctAnswersCount++;
        resultsBySubject[subjectName].correct++;
      }
    });

    this.scoreGlobal = Math.round((this.correctAnswersCount / this.questions.length) * 100);

    // Évaluation par matière
    this.notionsMasteredCount = 0;
    this.subjectsProgress.forEach(subject => {
      const normalizedKey = this.normalizeSubjectName(subject.name);
      const res = resultsBySubject[normalizedKey];

      if (res && res.total > 0) {
        subject.total = res.total;
        subject.correct = res.correct;
        subject.percent = Math.round((res.correct / res.total) * 100);

        if (subject.percent >= 70) {
          subject.status = 'Maîtrisé';
          this.notionsMasteredCount++;
        } else {
          subject.status = 'À renforcer';
        }
      } else {
        subject.total = 0;
        subject.correct = 0;
        subject.percent = 0;
        subject.status = 'Non évaluée';
      }
    });

    await this.markCurrentUserAsNotNew();
    this.showResults = true;
  }

  private async markCurrentUserAsNotNew(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return;
    }

    try {
      await firstValueFrom(
        this.http.put(
          `${environment.apiUrl}/api/auth/profile/new-user`,
          { isNewUser: false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      const userJson = localStorage.getItem('user');
      if (userJson) {
        const currentUser = JSON.parse(userJson);
        currentUser.is_new_user = false;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    } catch (error) {
      console.error('Erreur mise à jour statut nouvel utilisateur :', error);
    }
  }

  private normalizeSubjectName(name: string): string {
    return name.trim()
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Retire les accents (ex: Géographie -> geographie)
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.showFeedback = false;
    this.showResults = false;
    this.startTimer();
  }

  openFullscreen(index: number): void {
    this.activeImageIndex = index;
    this.isImageFullscreen = true;

    // Attendre que le DOM soit rendu pour scroller
    setTimeout(() => {
      const element = document.getElementById('fs-img-' + index);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      }
    }, 50);
  }

  closeFullscreen(): void {
    this.isImageFullscreen = false;
  }

  /**
   * Peut avancer vers la prochaine question
   */
  canGoNext(): boolean {
    return this.currentQuestionIndex < this.questions.length - 1;
  }
}
