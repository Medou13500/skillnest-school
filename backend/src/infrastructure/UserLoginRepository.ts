import { Pool } from "pg";

export default class UserLoginRepository {
  constructor(private pool: Pool) {}

  async findByEmail(email: string) {
    const query = `
      SELECT id, email, role, password_hash
      FROM public.users
      WHERE email = $1
      LIMIT 1
    `;

    const result = await this.pool.query(query, [email]);
    return result.rows[0] ?? null;
  }
}
