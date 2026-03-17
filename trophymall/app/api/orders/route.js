import db from "../../../../backend/config/db";
import { NextResponse } from "next/server";

// 👉 GET all orders
export async function GET() {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM orders ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// 👉 POST new order
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      customer_name,
      contact_details,
      product_name,
      quantity,
      price,
      payment_status,
      order_status,
      order_date,
      notes,
    } = body;

    // 🔥 Auto generate order id
    const order_id = `ORD-${Date.now()}`;

    const sql = `
      INSERT INTO orders 
      (order_id, customer_name, contact_details, product_name, quantity, price, payment_status, order_status, order_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.promise().query(sql, [
      order_id,
      customer_name,
      contact_details,
      product_name,
      quantity,
      price,
      payment_status,
      order_status,
      order_date,
      notes,
    ]);

    return NextResponse.json({ message: "Order created", order_id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}