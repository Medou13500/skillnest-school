// src/infrastructure/QuestionRepository.ts

import { Pool } from "pg";
import {
  CreateQuestionInput,
  QuestionEntity,
  UpdateQuestionInput,
} from "../type/QuestionTypes";

export default class QuestionRepository {
  constructor(private pool: Pool) {}

  
  async createQuestion(
    data: CreateQuestionInput
  ): Promise<QuestionEntity> {
    const result = await this.pool.query(
      `
      INSERT INTO questions (notion_id, content, answers, correct_answer, type, difficulty)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        data.notionId,
        data.content,
        JSON.stringify(data.answers),
        data.correctAnswer,
        data.type,
        data.difficulty,
      ]
    );

    return result.rows[0];
  }

  // ================= GET ALL =================
  async findAll(): Promise<QuestionEntity[]> {
    const result = await this.pool.query(`
      SELECT * FROM questions
      ORDER BY id DESC;
    `);

    return result.rows as QuestionEntity[];
  }

  // ================= GET BY ID =================
  async findById(id: number): Promise<QuestionEntity | null> {
    const result = await this.pool.query(
      `
      SELECT * FROM questions
      WHERE id = $1;
      `,
      [id]
    );

    if (result.rowCount === 0) return null;

    return result.rows[0];
  }

async updateQuestion(
  id: number,
  data: Partial<CreateQuestionInput>
): Promise<QuestionEntity | null> {

  const result = await this.pool.query(
    `
    UPDATE questions
    SET
      notion_id = COALESCE($1, notion_id),
      content = COALESCE($2, content),
      answers = COALESCE($3, answers),
      correct_answer = COALESCE($4, correct_answer),
      type = COALESCE($5, type),
      difficulty = COALESCE($6, difficulty),
      updated_at = NOW()
    WHERE id = $7
    RETURNING *
    `,
    [
      data.notionId ?? null,
      data.content ?? null,
      data.answers ? JSON.stringify(data.answers) : null,
      data.correctAnswer ?? null,
      data.type ?? null,
      data.difficulty ?? null,
      id,
    ]
  );

  if (result.rowCount === 0) return null;

  return result.rows[0];
}
  
  async deleteById(id: number) {
  const result = await this.pool.query(
    `DELETE FROM questions WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
}
}