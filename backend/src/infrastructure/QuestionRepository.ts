import { Pool } from "pg";
import {
  CreateQuestionInput,
  UpdateQuestionInput,
  GetQuestionsFilters,
} from "../type/QuestionTypes";

export default class QuestionRepository {
  constructor(private pool: Pool) {}

  // ================= CREATE =================
  async createQuestion(data: CreateQuestionInput) {
    const result = await this.pool.query(
      `
      INSERT INTO questions (notion_id, matiere, content, answers, correct_answer, type, difficulty, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        data.notionId,
        data.matiere,
        data.content,
        JSON.stringify(data.answers),
        data.correctAnswer,
        data.type,
        data.difficulty,
        data.images !== undefined ? JSON.stringify(data.images) : null,
      ]
    );

    return result.rows[0];
  }

  // ================= GET ALL =================
  async findAll() {
    const result = await this.pool.query(`
      SELECT * FROM questions
      ORDER BY id DESC
    `);

    return result.rows;
  }

  // ================= GET WITH FILTERS =================
  async findAllWithFilters(filters: GetQuestionsFilters) {
    let query = "SELECT * FROM questions WHERE 1=1";
    const values: any[] = [];

    if (filters.type) {
      values.push(filters.type);
      query += ` AND type = $${values.length}`;
    }

    if (filters.notionId) {
      values.push(filters.notionId);
      query += ` AND notion_id = $${values.length}`;
    }

    query += " ORDER BY id DESC";

    const result = await this.pool.query(query, values);

    return result.rows;
  }

  // ================= GET BY ID =================
async findById(id: number) {
  console.log("ID RECHERCHÉ :", id);

  const result = await this.pool.query(
    `SELECT * FROM questions WHERE id = $1`,
    [id]
  );

  console.log("RESULT DB :", result.rows);

  return result.rows[0] || null;
}

  // ================= UPDATE =================
  async updateQuestion(id: number, data: UpdateQuestionInput) {
    const result = await this.pool.query(
      `
      UPDATE questions
      SET
        notion_id = COALESCE($1, notion_id),
        matiere = COALESCE($2, matiere),
        content = COALESCE($3, content),
        answers = COALESCE($4, answers),
        correct_answer = COALESCE($5, correct_answer),
        type = COALESCE($6, type),
        difficulty = COALESCE($7, difficulty),
        images = COALESCE($8, images),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
      `,
      [
        data.notionId ?? null,
        data.matiere ?? null,
        data.content ?? null,
        data.answers !== undefined ? JSON.stringify(data.answers) : null,
        data.correctAnswer ?? null,
        data.type ?? null,
        data.difficulty ?? null,
        data.images !== undefined ? JSON.stringify(data.images) : null,
        id,
      ],
    );

    if ((result.rowCount ?? 0) === 0) return null;

    return result.rows[0];
  }

  // ================= DELETE =================
  async deleteById(id: number): Promise<boolean> {
    const result = await this.pool.query(
      `
      DELETE FROM questions
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
