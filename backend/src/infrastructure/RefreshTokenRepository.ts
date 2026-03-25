import { Pool } from "pg";

export default class RefreshTokenRepository {
  constructor(private pool: Pool) {}

  async save(
    userId: number,
    tokenHash: string,
    expiresAt: Date
  ) {
    await this.pool.query(
      `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [userId, tokenHash, expiresAt]
    );
  }

  async findValid(tokenHash: string) {
    const { rows } = await this.pool.query(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1
        AND expires_at > NOW()
      `,
      [tokenHash]
    );

    return rows[0] || null;
  }

  async deleteByUser(userId: number) {
    await this.pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE user_id = $1
      `,
      [userId]
    );
  }

  async deleteByHash(tokenHash: string): Promise<void> {
    await this.pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE token_hash = $1
      `,
      [tokenHash]
    );
  }

  async deleteByToken(tokenHash: string) {
    await this.pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE token_hash = $1
      `,
      [tokenHash]
    );
  }
  
}
