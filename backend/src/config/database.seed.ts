import argon2 from "argon2";
import { Pool } from "pg";

export async function seedTestAccount(pool: Pool): Promise<void> {
  const enabled = (process.env.SEED_TEST_ACCOUNT ?? "true").toLowerCase() !== "false";
  if (!enabled) {
    return;
  }

  const email = process.env.TEST_ACCOUNT_EMAIL ?? "test@gmail.com";
  const password = process.env.TEST_ACCOUNT_PASSWORD ?? "test1234";
  const role = process.env.TEST_ACCOUNT_ROLE ?? "USER";

  const existing = await pool.query(
    `
    SELECT id
    FROM public.users
    WHERE email = $1
    LIMIT 1
    `,
    [email]
  );

  if (existing.rows.length > 0) {
    console.log(` Test account already exists: ${email}`);
    return;
  }

  const passwordHash = await argon2.hash(password);

  await pool.query(
    `
    INSERT INTO public.users (email, password_hash, role)
    VALUES ($1, $2, $3)
    `,
    [email, passwordHash, role]
  );

  console.log(` Test account created: ${email}`);
}
