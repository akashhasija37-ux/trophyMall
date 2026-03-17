import db from "../../../backend/config/db";

// GET all inventory
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM inventory ORDER BY id DESC");

    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ADD inventory
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      sku,
      category,
      quantity,
      purchase_price,
      selling_price,
      supplier,
      stock_status,
      notes
    } = body;

    await db.query(
      `INSERT INTO inventory 
      (name, sku, category, quantity, purchase_price, selling_price, supplier, stock_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, category, quantity, purchase_price, selling_price, supplier, stock_status, notes]
    );

    return Response.json({ message: "Product added successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}