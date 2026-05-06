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
    role: string,
    firstName?: string,
    lastName?: string
  ) {
    const query = `
      INSERT INTO public.users (email, password_hash, role, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, role
    `;

    const result = await pool.query(query, [
      email,
      passwordHash,
      role,
      firstName ?? null,
      lastName ?? null,
    ]);

    return result.rows[0];
  }

  async createParentStudentLink(parentUserId: number, studentEmail: string) {
    const student = await this.findByEmail(studentEmail);
    if (!student) {
      throw new Error('STUDENT_NOT_FOUND');
    }

    const query = `
      INSERT INTO public.parent_student_links (parent_user_id, student_user_id)
      VALUES ($1, $2)
      ON CONFLICT (parent_user_id, student_user_id) DO NOTHING
    `;

    await pool.query(query, [parentUserId, student.id]);
  }
}

export default UserRegistrationRepository;
