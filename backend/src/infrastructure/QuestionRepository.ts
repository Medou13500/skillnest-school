import { Pool } from "pg";
import { CreateQuestionInput } from "../type/QuestionTypes";

export default class QuestionRepository {
  constructor(private pool: Pool) {}

  async createQuestion(data: CreateQuestionInput) {
    const query = `
      INSERT INTO questions
      (notion_id, content, answers, correct_answer, type, difficulty)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      data.notionId,
      data.content,
      JSON.stringify(data.answers),
      data.correctAnswer,
      data.type,
      data.difficulty,
    ];

    const result = await this.pool.query(query, values);

    return result.rows[0];
  }
}