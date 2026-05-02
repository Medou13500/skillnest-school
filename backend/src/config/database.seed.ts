import argon2 from "argon2";
import { Pool } from "pg";

export async function seedTestAccount(pool: Pool): Promise<void> {
  const enabled = (process.env.SEED_TEST_ACCOUNT ?? "true").toLowerCase() !== "false";
  if (!enabled) {
    return;
  }

  await seedAccount(pool, {
    email: process.env.TEST_ACCOUNT_EMAIL ?? "test@gmail.com",
    password: process.env.TEST_ACCOUNT_PASSWORD ?? "test1234",
    role: process.env.TEST_ACCOUNT_ROLE ?? "USER",
    label: "Test account",
  });

  await seedAccount(pool, {
    email: process.env.TEST_ADMIN_EMAIL ?? "test_admin@gmail.com",
    password: process.env.TEST_ADMIN_PASSWORD ?? "admin1234",
    role: "admin",
    label: "Test admin account",
  });
}

async function seedAccount(
  pool: Pool,
  account: {
    email: string;
    password: string;
    role: string;
    label: string;
  }
): Promise<void> {
  const existing = await pool.query(
    `
    SELECT id
    FROM public.users
    WHERE email = $1
    LIMIT 1
    `,
    [account.email]
  );

  if (existing.rows.length > 0) {
    console.log(` ${account.label} already exists: ${account.email}`);
    return;
  }

  const passwordHash = await argon2.hash(account.password);

  await pool.query(
    `
    INSERT INTO public.users (email, password_hash, role)
    VALUES ($1, $2, $3)
    `,
    [account.email, passwordHash, account.role]
  );

  console.log(` ${account.label} created: ${account.email}`);
}
