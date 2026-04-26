// src/infrastructure/NotionRepository.ts

import { Pool } from "pg";

export default class NotionRepository {
  constructor(private pool: Pool) {}

  async findById(id: number) {
    const result = await this.pool.query(
      `
      SELECT *
      FROM notions
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  async findAll() {
    const result = await this.pool.query(`
      SELECT *
      FROM notions
      ORDER BY id ASC
    `);

    return result.rows;
  }
}