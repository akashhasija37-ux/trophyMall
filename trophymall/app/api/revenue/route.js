import db from "../../../backend/config/db";
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(invoice_date, '%b') as month,
        SUM(total_amount) as revenue
      FROM invoices
      GROUP BY MONTH(invoice_date)
      ORDER BY MONTH(invoice_date)
    `);

    return Response.json(rows);

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}