import { NextResponse } from "next/server";
import { tursoClient, initDb } from "../../../lib/turso";

export async function GET() {
  try {
    await initDb();

    const result = await tursoClient.execute(
      "SELECT * FROM consultas ORDER BY fecha DESC"
    );
    const rows = Array.isArray(result.rows) ? result.rows : [];
    return NextResponse.json(rows);
  } catch (error) {
    console.error("API Error (consultas):", error);
    return NextResponse.json(
      { error: "Error al obtener los registros" },
      { status: 500 }
    );
  }
}

