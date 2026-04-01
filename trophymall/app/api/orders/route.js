import db from "../../../backend/config/db";
import { NextResponse } from "next/server";

// 👉 GET all orders
export async function GET() {
  try {
    const [rows] = await db.query(
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
      customer_id,
      product_id,
      quantity,
      payment_status,
      order_status,
      order_date,
      notes,
    } = body;

    // 🔥 Validate required fields
    if (!customer_id || !product_id || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 Auto generate order id
    const order_id = `ORD-${Date.now()}`;

    // ==============================
    // ✅ FETCH CUSTOMER FROM LEADS
    // ==============================
    const [customerRows] = await db.query(
  "SELECT name, phone FROM customers WHERE id = ?",
  [customer_id]
);

    const customer = customerRows[0];

    if (!customer) {
      return NextResponse.json(
        { error: "Invalid customer" },
        { status: 400 }
      );
    }

    // ==============================
    // ✅ FETCH PRODUCT FROM INVENTORY
    // ==============================
    const [productRows] = await db.query(
      "SELECT name, selling_price, quantity FROM inventory WHERE id = ?",
      [product_id]
    );

    const product = productRows[0];

    if (!product) {
      return NextResponse.json(
        { error: "Invalid product" },
        { status: 400 }
      );
    }

    // ==============================
    // ✅ STOCK VALIDATION
    // ==============================
    if (quantity > product.quantity) {
      return NextResponse.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    // ==============================
    // ✅ CALCULATE TOTAL PRICE
    // ==============================
    const totalPrice = quantity * product.selling_price;

    // ==============================
    // ✅ INSERT ORDER
    // ==============================
    await db.query(
      `INSERT INTO orders 
      (
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
        customer_id,
        product_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        customer.name,        // ✅ from DB
        customer.phone,   // ✅ from DB
        product.name,              // ✅ from DB
        quantity,
        totalPrice,                // ✅ calculated
        payment_status,
        order_status,
        order_date,
        notes,
        customer_id,               // ✅ relation
        product_id,                // ✅ relation
      ]
    );

    // ==============================
    // ✅ UPDATE STOCK (AUTO REDUCE)
    // ==============================
    await db.query(
      "UPDATE inventory SET quantity = quantity - ? WHERE id = ?",
      [quantity, product_id]
    );

    return NextResponse.json({
      message: "Order created successfully",
      order_id,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}