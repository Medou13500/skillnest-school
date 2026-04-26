// src/service/QuestionService.ts

import NotionRepository from "../infrastructure/NotionRepository";
import QuestionRepository from "../infrastructure/QuestionRepository";
import { CreateQuestionInput, QuestionOutput, UpdateQuestionInput } from "../type/QuestionTypes";

export default class QuestionService {
  constructor(private repo: QuestionRepository, private notionRepository:NotionRepository) {}

  async createQuestion(data: CreateQuestionInput): Promise<QuestionOutput> {
    if (!data.notionId) throw new Error("notionId requis");
    if (!data.content) throw new Error("content requis");
    if (!data.answers?.length) throw new Error("answers requis");

    if (!data.answers.includes(data.correctAnswer)) {
      throw new Error("correctAnswer invalide");
    }

    const question = await this.repo.createQuestion(data);

    return this.mapToOutput(question);
  }

  async getAllQuestions(): Promise<QuestionOutput[]> {
    const questions = await this.repo.findAll();

    return questions.map((q) => this.mapToOutput(q));
  }

  async getQuestionById(id: number): Promise<QuestionOutput> {
    const question = await this.repo.findById(id);

    if (!question) {
      throw new Error("QUESTION_NOT_FOUND");
    }

    return this.mapToOutput(question);
  }

async updateQuestion(
  id: number,
  data: Partial<CreateQuestionInput>
): Promise<QuestionOutput> {

  // 1. Vérifier que la question existe
  const existing = await this.repo.findById(id);

  if (!existing) {
    throw new Error("QUESTION_NOT_FOUND");
  }

  // 2. Vérifier la notion UNIQUEMENT si fournie
  if (data.notionId !== undefined) {
    const notion = await this.notionRepository.findById(data.notionId);

    if (!notion) {
      throw new Error("NOTION_NOT_FOUND");
    }
  }

  // 3. Validation UPDATE (souple)

  if (data.answers && data.answers.length === 0) {
    throw new Error("answers requis");
  }

  if (data.answers && data.correctAnswer) {
    if (!data.answers.includes(data.correctAnswer)) {
      throw new Error("correctAnswer invalide");
    }
  }

  // 4. Update DB
  const updated = await this.repo.updateQuestion(id, data);

  if (!updated) {
    throw new Error("UPDATE_FAILED");
  }

  // 5. Mapping
  return this.mapToOutput(updated);
}
async deleteQuestion(id: number): Promise<void> {
  const deleted = await this.repo.deleteById(id);

  if (!deleted) {
    throw new Error("QUESTION_NOT_FOUND");
  }
}
  private mapToOutput(question: any): QuestionOutput {
    return {
      id: question.id,
      notionId: question.notion_id,
      content: question.content,
      answers:
        typeof question.answers === "string"
          ? JSON.parse(question.answers)
          : question.answers,
      correctAnswer: question.correct_answer,
      type: question.type,
      difficulty: question.difficulty,
      createdAt: question.created_at,
      updatedAt: question.updated_at,
    };
  }
}
