import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query("SELECT 1")
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.error(" DB ERROR:", err.message));

export default pool;
