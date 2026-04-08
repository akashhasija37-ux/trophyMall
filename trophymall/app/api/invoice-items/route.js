import db from "../../../backend/config/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const invoice_id = searchParams.get("invoice_id");

    if (!invoice_id) {
      return Response.json({ error: "invoice_id required" }, { status: 400 });
    }

    const [rows] = await db.query(
      "SELECT * FROM invoice_items WHERE invoice_id = ?",
      [invoice_id]
    );

    return Response.json(rows);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}