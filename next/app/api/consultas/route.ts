import { NextResponse } from "next/server";
import { tursoClient, initDb } from "../../../lib/turso";

export async function GET() {
  try {
    await initDb();

    const result = await tursoClient.execute(
      "SELECT * FROM consultas ORDER BY fecha DESC"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los registros" },
      { status: 500 }
    );
  }
}

