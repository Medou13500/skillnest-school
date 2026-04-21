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

  async findAll() {
  const result = await this.pool.query("SELECT * FROM questions");
  return result.rows;
}
async findById(id: number) {
  const result = await this.pool.query(
    "SELECT * FROM questions WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
}
}