import { Pool } from "pg";

// Vérification temporaire (tu peux laisser ou enlever après)
console.log("DB CONFIG USED:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, //  OBLIGATOIRE
});

// Test de connexion
pool
  .query("SELECT 1")
  .then(() => console.log(" DB CONNECTED"))
  .catch((err) => console.error(" DB ERROR:", err.message));

export default pool;

