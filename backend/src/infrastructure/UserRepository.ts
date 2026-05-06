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

  async updateProfile(userId: number, firstName: string, lastName: string, email: string) {
    await this.pool.query(
      `
    UPDATE users
    SET first_name = $1, last_name = $2, email = $3
    WHERE id = $4
    `,
      [firstName, lastName, email, userId],
    );
  }

  async findByIdWithDetails(id: number) {
    const result = await this.pool.query(
      `
      SELECT id, email, role, first_name, last_name, created_at
      FROM users WHERE id = $1;
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
