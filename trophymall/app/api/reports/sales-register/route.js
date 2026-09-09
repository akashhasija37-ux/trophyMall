import db from "../../../../backend/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.id,
        i.invoice_date as date,
        i.invoice_id as invoice,
        i.customer_name as customer,
        COALESCE(i.invoice_type, 'B2B') as type,
        COALESCE(i.payment_method, 'Final Payment') as paymentType,
        COALESCE(i.payment_status, 'Paid') as status,
        e.name as salesperson,
        i.subtotal as gross,
        i.discount as disc,
        i.tax as gst,
        i.total_amount as net
      FROM invoices i
      LEFT JOIN employees e ON i.salesperson_id = e.id
      ORDER BY i.id DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Sales Register API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}