import { Pool } from "pg";
import { AnswerEntity } from "../contracts/AnswerContract";

export default class AnswerRepository {
  constructor(private pool: Pool) {}

  
  async create(data: {
    userId: number;
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
  }): Promise<AnswerEntity> {
    const result = await this.pool.query(
      `
      INSERT INTO answers (user_id, question_id, selected_answer, is_correct)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [data.userId, data.questionId, data.selectedAnswer, data.isCorrect],
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: number) {
    console.log("QUERY ID:", id);

    const result = await this.pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [id],
    );

    console.log("RESULT:", result.rows);

    return result.rows[0];
  }

  async findByQuestion(questionId: number): Promise<AnswerEntity[]> {
    const result = await this.pool.query(
      `
      SELECT * FROM answers
      WHERE question_id = $1
      `,
      [questionId],
    );

    return result.rows.map(this.mapToEntity);
  }

 
  private mapToEntity(row: any): AnswerEntity {
    return {
      id: row.id,
      userId: row.user_id,
      questionId: row.question_id,
      selectedAnswer: row.selected_answer,
      isCorrect: row.is_correct,
      createdAt: row.created_at,
    };
  }
}
