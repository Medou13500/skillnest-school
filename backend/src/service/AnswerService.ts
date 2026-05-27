import AnswerRepository from "../infrastructure/AnswerRepository";
import QuestionRepository from "../infrastructure/QuestionRepository";

import {
  SubmitAnswerInput,
  SubmitAnswerOutput,
} from "../contracts/AnswerContract";

export default class AnswerService {
  constructor(
    private answerRepo: AnswerRepository,
    private questionRepo: QuestionRepository
  ) {}

  async submitAnswer(
    userId: number,
    data: SubmitAnswerInput
  ): Promise<SubmitAnswerOutput> {

    const questionId = Number(data.questionId);

    const question = await this.questionRepo.findById(questionId);

    if (!question) {
      throw new Error("QUESTION_NOT_FOUND");
    }

    const answers =
      typeof question.answers === "string"
        ? JSON.parse(question.answers)
        : question.answers;

    // Pour les questions de type quiz, on vérifie que la réponse est bien dans les choix
    const isQuizQuestion = question.type === 'quiz';
    if (data.selectedAnswer !== "" && isQuizQuestion && !answers.includes(data.selectedAnswer)) {
      throw new Error("INVALID_ANSWER");
    }

    const normalizedUserAnswer = this.normalizeAnswer(data.selectedAnswer);
    const normalizedCorrectAnswer = this.normalizeAnswer(question.correct_answer);
    const isCorrect = normalizedUserAnswer !== '' && normalizedUserAnswer === normalizedCorrectAnswer;

    await this.answerRepo.create({
      userId,
      questionId,
      selectedAnswer: data.selectedAnswer || '', // Autorise le vide
      isCorrect,
    });

    return {
      isCorrect,
    };
  }

  private normalizeAnswer(value: string | undefined | null): string {
    if (!value) return '';
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  async getUserStats(userId: number) {
    const answers = await this.answerRepo.findByUserWithDetails(userId);
    const sessions = await this.answerRepo.findSessionsByUser(userId);
    const activityDays = await this.answerRepo.findDistinctActivityDays(userId);

    const total = answers.length;
    const correct = answers.filter((a: any) => a.is_correct).length;
    const averageScore = total > 0 ? Math.round((correct / total) * 100) : 0;
    const totalQuizzes = sessions.length;

    // Calcul de la série (streak)
    let streak = 0;
    if (activityDays.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastActivity = new Date(activityDays[0]);
      lastActivity.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Si la dernière activité date d'aujourd'hui ou d'hier, on compte la série
      if (diffDays <= 1) {
        streak = 1;
        for (let i = 0; i < activityDays.length - 1; i++) {
          const current = new Date(activityDays[i]);
          current.setHours(0, 0, 0, 0);
          const next = new Date(activityDays[i + 1]);
          next.setHours(0, 0, 0, 0);

          const diff = Math.abs(current.getTime() - next.getTime());
          const daysBetween = Math.ceil(diff / (1000 * 60 * 60 * 24));

          if (daysBetween === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    const subjectsMap: Record<string, { total: number, correct: number }> = {};
    answers.forEach((a: any) => {
      const sub = a.matiere || 'Inconnue';
      if (!subjectsMap[sub]) subjectsMap[sub] = { total: 0, correct: 0 };
      subjectsMap[sub].total++;
      if (a.is_correct) subjectsMap[sub].correct++;
    });

    const subjects = Object.entries(subjectsMap).map(([name, stats]) => ({
      name,
      score: Math.round((stats.correct / stats.total) * 100)
    }));

    return {
      global: {
        totalAnswers: total,
        correctAnswers: correct,
        averageScore: averageScore,
        totalQuizzes: totalQuizzes,
        streak: streak
      },
      subjects
    };
  }

  async getPerformanceHistory(userId: number, period: string) {
    const days = period === '30' ? 30 : 7;
    const history = await this.answerRepo.findPerformanceHistory(userId, days);

    return history.map((h: any) => ({
      day: new Date(h.day).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }),
      score: Math.round(parseFloat(h.average_score))
    }));
  }

  async getUserHistory(userId: number) {
    const sessions = await this.answerRepo.findSessionsByUser(userId);
    return sessions.map((s: any) => {
      const dateObj = new Date(s.session_date);
      const now = new Date();

      let dateLabel = '';
      const isToday = dateObj.toDateString() === now.toDateString();
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = dateObj.toDateString() === yesterday.toDateString();

      if (isToday) {
        dateLabel = "Aujourd'hui";
      } else if (isYesterday) {
        dateLabel = "Hier";
      } else {
        dateLabel = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      }

      const timeLabel = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      return {
        id: s.session_date,
        titre: 'Test de positionnement',
        categorie: 'Évaluation globale',
        date: `${dateLabel}, ${timeLabel}`,
        duree: '30 min', // Temps estimé pour le test de positionnement
        score: parseInt(s.correct_answers),
        total: parseInt(s.total_questions),
        pourcentage: Math.round((s.correct_answers / s.total_questions) * 100),
        icon: '🎯',
        statusColor: (s.correct_answers / s.total_questions) >= 0.5 ? 'green' : 'red'
      };
    });
  }

  async resetUserHistory(userId: number): Promise<void> {
    await this.answerRepo.deleteByUserId(userId);
  }
}
