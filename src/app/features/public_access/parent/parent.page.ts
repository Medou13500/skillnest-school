import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface QuizMistake {
  question: string;
  chosenAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface StudentQuizResult {
  id: number;
  titre: string;
  matiere: string;
  date: string;
  score: number;
  totalQuestions: number;
  status: 'reussi' | 'echoue';
  mistakes: QuizMistake[];
}

@Component({
  selector: 'app-parent',
  templateUrl: './parent.page.html',
  styleUrls: ['./parent.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ParentPage {
  student = {
    nom: 'Emma Dubois',
    classe: 'Seconde 1',
    email: 'emma.dubois@lycee.fr',
    niveau: 'Intermédiaire',
    avatar: 'ED'
  };

  quizHistory: StudentQuizResult[] = [
    {
      id: 1,
      titre: 'Test de positionnement - Français',
      matiere: 'Français',
      date: '2026-05-05',
      score: 6,
      totalQuestions: 10,
      status: 'echoue',
      mistakes: [
        {
          question: 'Quel est le féminin de "acteur" ?',
          chosenAnswer: 'Acteuse',
          correctAnswer: 'Actrice',
          explanation: 'Le féminin correct est « actrice ».',
        },
        {
          question: 'Une phrase se termine généralement par :',
          chosenAnswer: 'Une virgule',
          correctAnswer: 'Un point',
          explanation: 'Une phrase complète se termine par un point.',
        },
        {
          question: 'Quel terme désigne le résultat d’une addition ?',
          chosenAnswer: 'Différence',
          correctAnswer: 'Somme',
          explanation: 'Le résultat d’une addition s’appelle une somme.',
        }
      ]
    },
    {
      id: 2,
      titre: 'Quiz Géographie',
      matiere: 'Géographie',
      date: '2026-05-03',
      score: 8,
      totalQuestions: 10,
      status: 'reussi',
      mistakes: [
        {
          question: 'Quel continent se trouve au sud de l’Europe ?',
          chosenAnswer: 'L’Asie',
          correctAnswer: 'L’Afrique',
          explanation: 'L’Afrique est au sud de l’Europe.',
        }
      ]
    },
    {
      id: 3,
      titre: 'Quiz Maths',
      matiere: 'Maths',
      date: '2026-05-01',
      score: 7,
      totalQuestions: 10,
      status: 'reussi',
      mistakes: [
        {
          question: 'Combien vaut 7 × 8 ?',
          chosenAnswer: '54',
          correctAnswer: '56',
          explanation: '7 multiplié par 8 égale 56.',
        }
      ]
    }
  ];

  selectedQuiz: StudentQuizResult = this.quizHistory[0];

  get totalQuizzes(): number {
    return this.quizHistory.length;
  }

  get averageScore(): string {
    const totalScore = this.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
    const totalQuestions = this.quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    return totalQuestions === 0 ? '0 %' : `${Math.round((totalScore / totalQuestions) * 100)} %`;
  }

  get totalErrors(): number {
    return this.quizHistory.reduce((sum, quiz) => sum + quiz.mistakes.length, 0);
  }

  get selectedQuizPercent(): number {
    return Math.round((this.selectedQuiz.score / this.selectedQuiz.totalQuestions) * 100);
  }

  selectQuiz(quiz: StudentQuizResult): void {
    this.selectedQuiz = quiz;
  }
}
