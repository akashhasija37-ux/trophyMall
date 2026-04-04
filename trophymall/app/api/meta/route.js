import db from "../../../backend/config/db";

export async function GET() {
  try {
    const [departments] = await db.query("SELECT * FROM departments");
    const [branches] = await db.query("SELECT * FROM branches");

    return Response.json({
      departments,
      branches,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}