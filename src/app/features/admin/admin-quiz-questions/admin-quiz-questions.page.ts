import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, createOutline, trashOutline } from 'ionicons/icons';

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
  explication: string;
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
export class AdminQuizQuestionsPage {
  editingId: number | null = null;

  availableCourseQuizzes: CourseQuizLink[] = [
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

  questions: QuizQuestion[] = [
    {
      id: 1,
      coursId: 2,
      coursTitre: 'Introduction aux variables',
      theme: 'Theme 1 - Variables & Types',
      quiz: 'Quiz Variables & Types',
      matiere: 'Algorithmique',
      niveau: 'Intermediaire',
      enonce: 'Quel mot-cle permet de declarer une variable en JavaScript moderne ?',
      options: ['var', 'let', 'define', 'set'],
      bonneReponse: 1,
      explication: 'let permet de declarer une variable avec une portee de bloc.'
    },
    {
      id: 2,
      coursId: 4,
      coursTitre: 'Conditions simples',
      theme: 'Theme 2 - Conditions & Boucles',
      quiz: 'Quiz Conditions',
      matiere: 'Algorithmique',
      niveau: 'Debutant',
      enonce: 'Quelle structure permet de tester une condition ?',
      options: ['if', 'for', 'return', 'class'],
      bonneReponse: 0,
      explication: 'if execute un bloc de code seulement si la condition est vraie.'
    }
  ];

  form: QuizQuestion = this.createEmptyQuestion();

  constructor(
    public router: Router,
    private toastController: ToastController
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline
    });
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

  saveQuestion(): void {
    if (!this.isFormValid()) {
      void this.presentToast('Complete la question, les 4 reponses et la bonne reponse.');
      return;
    }

    const payload: QuizQuestion = {
      ...this.form,
      options: this.form.options.map((option) => option.trim())
    };

    if (this.editingId === null) {
      this.questions = [
        {
          ...payload,
          id: Date.now()
        },
        ...this.questions
      ];
      void this.presentToast('Question ajoutee.');
    } else {
      this.questions = this.questions.map((question) =>
        question.id === this.editingId ? { ...payload, id: question.id } : question
      );
      void this.presentToast('Question modifiee.');
    }

    this.resetForm();
  }

  editQuestion(question: QuizQuestion): void {
    this.editingId = question.id;
    this.form = {
      ...question,
      options: [...question.options]
    };
  }

  deleteQuestion(questionId: number): void {
    this.questions = this.questions.filter((question) => question.id !== questionId);

    if (this.editingId === questionId) {
      this.resetForm();
    }

    void this.presentToast('Question supprimee.');
  }

  resetForm(): void {
    this.editingId = null;
    this.form = this.createEmptyQuestion();
  }

  trackByQuestionId(_index: number, question: QuizQuestion): number {
    return question.id;
  }

  private createEmptyQuestion(): QuizQuestion {
    return {
      id: 0,
      coursId: 0,
      coursTitre: '',
      theme: '',
      quiz: '',
      matiere: '',
      niveau: 'Debutant',
      enonce: '',
      options: ['', '', '', ''],
      bonneReponse: 0,
      explication: ''
    };
  }

  private isFormValid(): boolean {
    return Boolean(
      this.form.coursId &&
      this.form.coursTitre.trim() &&
      this.form.quiz.trim() &&
      this.form.matiere.trim() &&
      this.form.enonce.trim() &&
      this.form.options.every((option) => option.trim()) &&
      this.form.bonneReponse >= 0 &&
      this.form.bonneReponse < this.form.options.length
    );
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      position: 'top',
      color: 'medium'
    });
    await toast.present();
  }
}
