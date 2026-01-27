import { NextResponse } from "next/server";
import { tursoClient, initDb } from "../../../lib/turso";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      edad,
      sexo,
      otros_datos,
      lat,
      lng,
      resumen,
      diagnostico,
      clasificacion,
    } = body;

    await initDb();

    const result = await tursoClient.execute({
      sql: `
        INSERT INTO consultas (
          nombre, edad, sexo, otros_datos,
          lat, lng, resumen, diagnostico,
          clasificacion, fecha
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        nombre,
        edad,
        sexo,
        otros_datos,
        lat,
        lng,
        resumen,
        diagnostico,
        clasificacion,
        new Date().toISOString(),
      ],
    });

    // @ts-expect-error libsql client expone lastInsertRowid
    const id = result.lastInsertRowid ?? null;

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al guardar el diagnóstico" },
      { status: 500 }
    );
  }
}

