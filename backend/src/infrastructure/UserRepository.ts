import { Pool } from "pg";

export default class UserRepository {
  constructor(private pool: Pool) {}

  async findById(id: number) {
    const result = await this.pool.query(
      `
      SELECT * FROM users WHERE id = $1;
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findByEmail(email: string) {
    const result = await this.pool.query(
      `
      SELECT * FROM users WHERE email = $1;
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async updatePassword(user_Id: number, passwordHash: string) {
    await this.pool.query(
      `
    UPDATE users
    SET password_hash = $1
    WHERE id = $2
    `,
      [passwordHash, user_Id],
    );
  }
}
