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

    if (!answers.includes(data.selectedAnswer)) {
      throw new Error("INVALID_ANSWER");
    }

    const isCorrect = question.correct_answer === data.selectedAnswer;

    await this.answerRepo.create({
      userId,
      questionId,
      selectedAnswer: data.selectedAnswer,
      isCorrect,
    });

    return {
      isCorrect,
    };
  }
}