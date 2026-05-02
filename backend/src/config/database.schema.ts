import { Pool } from "pg";

export async function initializeDatabaseSchema(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER',
      first_name TEXT,
      last_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Vérifier si les colonnes first_name et last_name existent déjà
  const columnsExist = await pool.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name IN ('first_name', 'last_name')
  `);

  if (columnsExist.rows.length === 0) {
    await pool.query(`
      ALTER TABLE public.users 
      ADD COLUMN IF NOT EXISTS first_name TEXT,
      ADD COLUMN IF NOT EXISTS last_name TEXT
    `);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.reset_password (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      date_expiration TIMESTAMPTZ NOT NULL,
      status BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
      ON public.refresh_tokens(user_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_reset_password_user_id
      ON public.reset_password(user_id);
  `);
}
