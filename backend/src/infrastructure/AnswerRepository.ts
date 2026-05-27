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

  async findByUserWithDetails(userId: number) {
    const query = `
      SELECT
        a.id, a.is_correct, a.created_at,
        q.matiere, q.type as question_type
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async findSessionsByUser(userId: number) {
    const query = `
      SELECT
        DATE_TRUNC('minute', created_at) as session_date,
        COUNT(*) as total_questions,
        COUNT(CASE WHEN is_correct THEN 1 END) as correct_answers,
        MAX(created_at) as last_activity
      FROM answers
      WHERE user_id = $1
      GROUP BY session_date
      ORDER BY last_activity DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async findDistinctActivityDays(userId: number) {
    const query = `
      SELECT DISTINCT DATE_TRUNC('day', created_at) as activity_day
      FROM answers
      WHERE user_id = $1
      ORDER BY activity_day DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(r => new Date(r.activity_day));
  }

  async findPerformanceHistory(userId: number, days: number) {
    const query = `
      SELECT
        DATE_TRUNC('day', created_at) as day,
        AVG(CASE WHEN is_correct THEN 100 ELSE 0 END) as average_score
      FROM answers
      WHERE user_id = $1 AND created_at >= NOW() - interval '1 day' * $2
      GROUP BY day
      ORDER BY day ASC
    `;
    const result = await this.pool.query(query, [userId, days]);
    return result.rows;
  }

  async deleteByUserId(userId: number): Promise<void> {
    const query = `DELETE FROM public.answers WHERE user_id = $1`;
    await this.pool.query(query, [userId]);
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
