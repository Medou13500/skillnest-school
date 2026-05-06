import pool from "../config/database.config";

class UserRegistrationRepository {
  async findByEmail(email: string) {
    const query = `
      SELECT id, email, role, password_hash
      FROM public.users
      WHERE email = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [email]);
    return result.rows[0] ?? null;
  }

  async createUser(
    email: string,
    passwordHash: string,
    role: string
  ) {
    const query = `
      INSERT INTO public.users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role
    `;

    const result = await pool.query(query, [
      email,
      passwordHash,
      role,
    ]);

    return result.rows[0];
  }
}

export default UserRegistrationRepository;
