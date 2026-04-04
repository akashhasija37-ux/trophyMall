import db from "../../../backend/config/db";

export async function GET() {
  try {
    const [orders] = await db.query("SELECT * FROM orders");
    const [employees] = await db.query("SELECT * FROM employees");
    const [inventory] = await db.query("SELECT * FROM inventory");

    return Response.json({
      orders,
      employees,
      inventory,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}