import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_DATABASE_URL no está definida en las variables de entorno");
}

export const tursoClient = createClient({
  url,
  authToken,
});

export async function initDb() {
  await tursoClient.execute(`
    CREATE TABLE IF NOT EXISTS consultas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      edad INTEGER,
      sexo TEXT,
      otros_datos TEXT,
      lat REAL,
      lng REAL,
      resumen TEXT,
      diagnostico TEXT,
      clasificacion TEXT,
      fecha TEXT
    )
  `);
}

