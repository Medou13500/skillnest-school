import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, createOutline, trashOutline } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import {
  ApiQuestion,
  QuestionDifficulty,
  QuestionService,
  SaveQuestionPayload
} from '../../../core/services/question.service';

interface QuizQuestion {
  id: number;
  coursId: number;
  coursTitre: string;
  theme: string;
  quiz: string;
  matiere: string;
  niveau: string;
  enonce: string;
  options: string[];
  bonneReponse: number;
  images?: string[];
  type?: 'quiz' | 'test';
  openAnswer?: string;
  openAnswers?: string[];
}

interface CourseQuizLink {
  id: number;
  theme: string;
  chapitre: string;
  coursTitre: string;
  quizTitre: string;
  matiere: string;
}

@Component({
  selector: 'app-admin-quiz-questions',
  templateUrl: './admin-quiz-questions.page.html',
  styleUrls: ['./admin-quiz-questions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminQuizQuestionsPage implements OnInit {
  editingId: number | null = null;
  isLoading = false;
  isSaving = false;
  loadingError = '';
  readonly matieres = ['Geographie', 'Maths', 'Anglais', 'Francais', 'Sciences', 'SVT', 'Algorithmique'];

  availableCourseQuizzes: CourseQuizLink[] = [
    {
      id: 1,
      theme: 'Notion 1',
      chapitre: 'Quiz',
      coursTitre: 'Notion 1',
      quizTitre: 'Quiz notion 1',
      matiere: 'Geographie'
    },
    {
      id: 2,
      theme: 'Theme 1',
      chapitre: 'Variables & Types',
      coursTitre: 'Introduction aux variables',
      quizTitre: 'Quiz Variables & Types',
      matiere: 'Algorithmique'
    },
    {
      id: 4,
      theme: 'Theme 2',
      chapitre: 'Conditions & Boucles',
      coursTitre: 'Conditions simples',
      quizTitre: 'Quiz Conditions',
      matiere: 'Algorithmique'
    },
    {
      id: 6,
      theme: 'Theme 3',
      chapitre: 'Fonctions & Tableaux',
      coursTitre: 'Premieres fonctions',
      quizTitre: 'Quiz Fonctions',
      matiere: 'Algorithmique'
    }
  ];

  questions: QuizQuestion[] = [];

  form: QuizQuestion = this.createEmptyQuestion();
  newOpenKeyword = '';

  constructor(
    public router: Router,
    private toastController: ToastController,
    private questionService: QuestionService
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline
    });
  }

  ngOnInit(): void {
    void this.loadQuestions();
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get totalQuiz(): number {
    return new Set(this.questions.map((question) => question.quiz)).size;
  }

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  get selectedCourseQuiz(): CourseQuizLink | undefined {
    return this.availableCourseQuizzes.find((courseQuiz) => courseQuiz.id === Number(this.form.coursId));
  }

  onCourseQuizChange(coursId: number): void {
    const selectedCourseQuiz = this.availableCourseQuizzes.find((courseQuiz) => courseQuiz.id === Number(coursId));

    if (!selectedCourseQuiz) {
      return;
    }

    this.form.coursId = selectedCourseQuiz.id;
    this.form.coursTitre = selectedCourseQuiz.coursTitre;
    this.form.theme = `${selectedCourseQuiz.theme} - ${selectedCourseQuiz.chapitre}`;
    this.form.quiz = selectedCourseQuiz.quizTitre;
    this.form.matiere = selectedCourseQuiz.matiere;
  }

  onManualNotionChange(notionId: number): void {
    const parsedNotionId = Number(notionId);

    if (!parsedNotionId || parsedNotionId < 1) {
      this.form.coursId = 0;
      return;
    }

    const selectedCourseQuiz = this.availableCourseQuizzes.find((courseQuiz) => courseQuiz.id === parsedNotionId);

    if (selectedCourseQuiz) {
      this.onCourseQuizChange(parsedNotionId);
      return;
    }

    this.form.coursId = parsedNotionId;
    this.form.coursTitre = `Notion ${parsedNotionId}`;
    this.form.theme = `Notion ${parsedNotionId}`;
    this.form.quiz = `Quiz notion ${parsedNotionId}`;
    this.form.matiere = this.matieres[0];
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    const readPromises: Promise<string>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      readPromises.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ''));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      );
    }

    void Promise.all(readPromises)
      .then((results) => {
        this.form.images = [...(this.form.images || []), ...results];
        // Clear file input so selecting the same file again will trigger change
        try {
          const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
          if (fileInput) fileInput.value = '';
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // ignore read errors
      });
  }

  async loadQuestions(): Promise<void> {
    this.isLoading = true;
    this.loadingError = '';

    try {
      const apiQuestions = await firstValueFrom(this.questionService.getAllQuestions());
      this.questions = apiQuestions.map((question) => this.mapApiQuestionToQuizQuestion(question));
      this.syncAvailableCourseQuizzes();
    } catch {
      this.loadingError = 'Impossible de charger les questions quiz.';
      await this.presentToast('Impossible de charger les questions quiz.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async saveQuestion(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    if (!this.isFormValid()) {
      void this.presentToast('Complete la question, les 4 reponses et la bonne reponse.');
      return;
    }

    const payload: SaveQuestionPayload = {
      notionId: Number(this.form.coursId),
      matiere: this.form.matiere,
      content: this.form.enonce.trim(),
      answers:
        this.form.type === 'quiz' ? this.form.options.map((option) => option.trim()) : (this.form.openAnswers && this.form.openAnswers.length ? this.form.openAnswers.map((k) => k.trim()) : [(this.form.openAnswer || '').trim()]),
      // backend expects a single `correctAnswer` for validation; send the first openAnswer as canonical
      correctAnswer:
        this.form.type === 'quiz' ? this.form.options[this.form.bonneReponse].trim() : ((this.form.openAnswers && this.form.openAnswers[0]) || (this.form.openAnswer || '')).trim(),
      type: this.form.type === 'test' ? 'test' : 'quiz',
      difficulty: this.mapNiveauToDifficulty(this.form.niveau)
    };

    if (this.form.images && this.form.images.length) {
      (payload as any).images = this.form.images;
    }

    this.isSaving = true;

    try {
      if (this.editingId === null) {
        const createdQuestion = await firstValueFrom(this.questionService.createQuestion(payload));
        this.questions = [this.mapApiQuestionToQuizQuestion(createdQuestion), ...this.questions];
        await this.presentToast('Question ajoutee.', 'success');
      } else {
        const updatedQuestion = await firstValueFrom(this.questionService.updateQuestion(this.editingId, payload));
        const mappedQuestion = this.mapApiQuestionToQuizQuestion(updatedQuestion);
        this.questions = this.questions.map((question) =>
          question.id === this.editingId ? mappedQuestion : question
        );
        await this.presentToast('Question modifiee.', 'success');
      }

      this.resetForm();
    } catch {
      await this.presentToast('Enregistrement impossible. Verifie ton compte admin et la notion choisie.', 'danger');
    } finally {
      this.isSaving = false;
    }
  }

  editQuestion(question: QuizQuestion): void {
    this.editingId = question.id;
    this.form = {
      ...question,
      options: [...(question.options || [])],
      images: question.images ? [...question.images] : [],
      type: (question as any).type ?? 'quiz',
      openAnswer: (question as any).type === 'test' ? ((question as any).correctAnswer ?? '') : '',
      openAnswers: (question as any).type === 'test'
        ? (question.openAnswers && question.openAnswers.length ? [...question.openAnswers] : ((question as any).answers ? this.parseAnswers((question as any).answers) : []))
        : []
    };
  }

  async deleteQuestion(questionId: number): Promise<void> {
    if (!confirm('Supprimer cette question ?')) {
      return;
    }

    try {
      await firstValueFrom(this.questionService.deleteQuestion(questionId));
      this.questions = this.questions.filter((question) => question.id !== questionId);

      if (this.editingId === questionId) {
        this.resetForm();
      }

      await this.presentToast('Question supprimee.', 'success');
    } catch {
      await this.presentToast('Suppression impossible. Verifie ton compte admin.', 'danger');
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.form = this.createEmptyQuestion();
    // Clear file input value to avoid stale file remaining in the DOM
    try {
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch {
      // ignore in non-browser environments
    }
  }

  trackByQuestionId(_index: number, question: QuizQuestion): number {
    return question.id;
  }

  trackByAnswerIndex(index: number): number {
    return index;
  }

  private createEmptyQuestion(): QuizQuestion {
    return {
      id: 0,
      coursId: 0,
      coursTitre: '',
      theme: '',
      quiz: '',
      matiere: this.matieres[0],
      niveau: 'Debutant',
      enonce: '',
      options: ['', '', '', ''],
      bonneReponse: 0,
      images: [],
      type: 'quiz',
      openAnswer: '',
      openAnswers: []
    };
  }

  private isFormValid(): boolean {
    const base = Boolean(
      this.form.coursId &&
      this.form.coursTitre.trim() &&
      this.form.quiz.trim() &&
      this.form.matiere.trim() &&
      this.form.enonce.trim()
    );

    if (!base) return false;

    if (this.form.type === 'test') {
      return Boolean((this.form.openAnswers && this.form.openAnswers.length > 0) || (this.form.openAnswer || '').trim());
    }

    // default: quiz (QCM)
    return (
      this.form.options.every((option) => option.trim()) &&
      this.form.bonneReponse >= 0 &&
      this.form.bonneReponse < this.form.options.length
    );
  }

  private mapApiQuestionToQuizQuestion(question: ApiQuestion): QuizQuestion {
    const answers = this.parseAnswers(question.answers);
    const correctAnswer = question.correctAnswer ?? question.correct_answer ?? '';
    const notionId = question.notionId ?? question.notion_id ?? 0;
    const courseQuiz = this.availableCourseQuizzes.find((item) => item.id === notionId);

    return {
      id: question.id,
      coursId: notionId,
      coursTitre: courseQuiz?.coursTitre ?? `Notion ${notionId}`,
      theme: courseQuiz ? `${courseQuiz.theme} - ${courseQuiz.chapitre}` : `Notion ${notionId}`,
      quiz: courseQuiz?.quizTitre ?? `Quiz notion ${notionId}`,
      matiere: question.matiere ?? courseQuiz?.matiere ?? this.matieres[0],
      niveau: this.mapDifficultyToNiveau(question.difficulty),
      enonce: question.content,
      options: question.type === 'quiz' ? (answers && answers.length ? answers : ['', '', '', '']) : [],
      bonneReponse: question.type === 'quiz' ? Math.max(0, answers.findIndex((answer) => answer === correctAnswer)) : 0,
      images: (question as any).images
        ? (Array.isArray((question as any).images) ? (question as any).images : JSON.parse((question as any).images))
        : [],
      type: question.type ?? 'quiz',
      openAnswer: question.type === 'test' ? (correctAnswer ?? '') : '',
      openAnswers: question.type === 'test' ? (Array.isArray(this.parseAnswers((question as any).answers)) ? this.parseAnswers((question as any).answers).filter((a) => typeof a === 'string' && a.trim().length > 0) : []) : []
    };
  }

  private parseAnswers(answers: string[] | string): string[] {
    if (Array.isArray(answers)) {
      return answers.filter((s) => typeof s === 'string' && s.trim().length > 0);
    }

    if (typeof answers === 'string') {
      try {
        const parsedAnswers = JSON.parse(answers);
        if (Array.isArray(parsedAnswers)) return parsedAnswers;
      } catch {
        // ignore
      }

      if (answers.includes(',')) {
        return answers
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
    }

    return [];
  }

  removeImageAt(index: number): void {
    if (!this.form.images) return;
    this.form.images = this.form.images.filter((_, i) => i !== index);
  }

  addOpenKeyword(): void {
    const kw = (this.newOpenKeyword || '').trim();
    if (!kw) return;
    this.form.openAnswers = [...(this.form.openAnswers || []), kw];
    this.newOpenKeyword = '';
  }

  removeOpenKeyword(index: number): void {
    if (!this.form.openAnswers) return;
    this.form.openAnswers = this.form.openAnswers.filter((_, i) => i !== index);
  }

  private mapNiveauToDifficulty(niveau: string): QuestionDifficulty {
    if (niveau === 'Intermediaire') {
      return 'moyen';
    }

    if (niveau === 'Avance') {
      return 'difficile';
    }

    return 'facile';
  }

  private mapDifficultyToNiveau(difficulty: QuestionDifficulty): string {
    if (difficulty === 'moyen') {
      return 'Intermediaire';
    }

    if (difficulty === 'difficile') {
      return 'Avance';
    }

    return 'Debutant';
  }

  private syncAvailableCourseQuizzes(): void {
    const existingIds = new Set(this.availableCourseQuizzes.map((courseQuiz) => courseQuiz.id));
    const missingNotionIds = Array.from(new Set(this.questions.map((question) => question.coursId)))
      .filter((notionId) => notionId && !existingIds.has(notionId));

    this.availableCourseQuizzes = [
      ...this.availableCourseQuizzes,
      ...missingNotionIds.map((notionId) => ({
        id: notionId,
        theme: `Notion ${notionId}`,
        chapitre: 'Quiz',
        coursTitre: `Notion ${notionId}`,
        quizTitre: `Quiz notion ${notionId}`,
        matiere: this.matieres[0]
      }))
    ];
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'medium' = 'medium'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      position: 'top',
      color
    });
    await toast.present();
  }
}
