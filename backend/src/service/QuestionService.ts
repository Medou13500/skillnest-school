import QuestionRepository from "../infrastructure/QuestionRepository";
import { CreateQuestionInput } from "../type/QuestionTypes";

export default class QuestionService {
  constructor(private repo: QuestionRepository) {}

  async createQuestion(data: CreateQuestionInput) {
    if (!data.notionId) throw new Error("notionId requis");
    if (!data.content) throw new Error("content requis");
    if (!data.answers?.length) throw new Error("answers requis");

    if (!data.answers.includes(data.correctAnswer))
      throw new Error("correctAnswer invalide");

    const question = await this.repo.createQuestion(data);

    const answersParsed =
      typeof question.answers === "string"
        ? JSON.parse(question.answers)
        : question.answers;

    return {
      id: question.id,
      notionId: question.notion_id,
      content: question.content,
      answers: answersParsed,
      correctAnswer: question.correct_answer,
      type: question.type,
      difficulty: question.difficulty,
      createdAt: question.created_at,
      updatedAt: question.updated_at,
    };
  }
async getAllQuestions() {
  return await this.repo.findAll();
}
async getQuestionById(id: number) {
  if (!id) throw new Error("ID requis");

  return this.repo.findById(id);
}
}
