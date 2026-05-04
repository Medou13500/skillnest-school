import { Pool } from "pg";

export default class ResetPasswordRepository {
  constructor(private pool: Pool) {}

  async findByToken(token: string) {
    const result = await this.pool.query(
      `
      SELECT * FROM reset_password WHERE token = $1;
      `,
      [token],
    );
    return result.rows[0] ?? null;
  }
  async deleteToken(token: string) {
       await this.pool.query(
      `
      DELETE FROM reset_password WHERE token = $1;
      `,
      [token],
    );
    
  }
}
