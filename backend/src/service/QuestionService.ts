import NotionRepository from "../infrastructure/NotionRepository";
import QuestionRepository from "../infrastructure/QuestionRepository";

import {
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionOutput,
  GetQuestionsFilters,
} from "../type/QuestionTypes";

export default class QuestionService {
  constructor(
    private repo: QuestionRepository,
    private notionRepository: NotionRepository
  ) {}

 
  async createQuestion(data: CreateQuestionInput): Promise<QuestionOutput> {
    if (!data.notionId) throw new Error("notionId requis");
    if (!data.matiere) throw new Error("matiere requise");
    if (!data.content) throw new Error("content requis");
    if (!data.answers?.length) throw new Error("answers requis");

    if (!data.answers.includes(data.correctAnswer)) {
      throw new Error("correctAnswer invalide");
    }

    const notion = await this.notionRepository.findById(data.notionId);
    if (!notion) throw new Error("NOTION_NOT_FOUND");

    const question = await this.repo.createQuestion(data);

    return this.mapToOutput(question);
  }


  async getAllQuestions(filters: GetQuestionsFilters) {
    return this.repo.findAllWithFilters(filters);
  }


  async getQuestionById(id: number): Promise<QuestionOutput> {
    const question = await this.repo.findById(id);

    if (!question) throw new Error("QUESTION_NOT_FOUND");

    return this.mapToOutput(question);
  }


  async updateQuestion(
    id: number,
    data: UpdateQuestionInput
  ): Promise<QuestionOutput> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error("QUESTION_NOT_FOUND");

    // vérifier notion si fournie
    if (data.notionId !== undefined) {
      const notion = await this.notionRepository.findById(data.notionId);
      if (!notion) throw new Error("NOTION_NOT_FOUND");
    }

    // validation answers
    if (data.answers && data.answers.length === 0) {
      throw new Error("answers empty");
    }

    if (data.answers && data.correctAnswer) {
      if (!data.answers.includes(data.correctAnswer)) {
        throw new Error("correctAnswer invalide");
      }
    }

    // validation type
    if (data.type && !["test", "quiz"].includes(data.type)) {
      throw new Error("INVALID_TYPE");
    }

    const updated = await this.repo.updateQuestion(id, data);

    if (!updated) throw new Error("UPDATE_FAILED");

    return this.mapToOutput(updated);
  }


  async deleteQuestion(id: number): Promise<void> {
    const deleted = await this.repo.deleteById(id);

    if (!deleted) throw new Error("QUESTION_NOT_FOUND");
  }

  
  private mapToOutput(question: any): QuestionOutput {
    return {
      id: question.id,
      notionId: question.notion_id,
      matiere: question.matiere,
      content: question.content,
      answers:
        typeof question.answers === "string"
          ? JSON.parse(question.answers)
          : question.answers,
      correctAnswer: question.correct_answer,
      type: question.type,
      difficulty: question.difficulty,
      images:
        typeof question.images === "string"
          ? JSON.parse(question.images)
          : question.images ?? [],
      createdAt: question.created_at,
      updatedAt: question.updated_at,
    };
  }
}
