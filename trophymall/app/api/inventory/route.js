import db from "../../../backend/config/db"; // adjust path

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM inventory");
    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { name, quantity, price } = body;

  try {
    await db.query(
      "INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)",
      [name, quantity, price]
    );

    return Response.json({ message: "Item added" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}