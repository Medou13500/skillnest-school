import { Pool } from "pg";

class UserLoginRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string) {
    const result = await this.pool.query(
      "SELECT id, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0] ?? null;
  }
}

export default UserLoginRepository;
