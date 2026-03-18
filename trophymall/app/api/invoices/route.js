import db from "../../../backend/config/db";

// ✅ GET ALL INVOICES
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT * FROM invoices ORDER BY id DESC
    `);

    return Response.json(rows);

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ CREATE INVOICE
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      customer_name,
      invoice_date,
      due_date,
      payment_status,
      items,
      discount,
      tax,
      notes,
    } = body;

    // 🔥 Generate invoice ID
    const invoice_id = `INV-${Date.now()}`;

    // 🔥 Calculate totals
    let subtotal = 0;

    items.forEach((item) => {
      subtotal += item.quantity * item.price;
    });

    const discountAmount = (subtotal * (discount || 0)) / 100;
    const taxAmount = ((subtotal - discountAmount) * (tax || 0)) / 100;
    const total = subtotal - discountAmount + taxAmount;

    // 👉 Insert invoice
    await db.query(
      `INSERT INTO invoices 
      (invoice_id, customer_name, invoice_date, due_date, payment_status, subtotal, discount, tax, total_amount, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_id,
        customer_name,
        invoice_date,
        due_date,
        payment_status,
        subtotal,
        discountAmount,
        taxAmount,
        total,
        notes,
      ]
    );

    // 👉 Insert items
    for (const item of items) {
      await db.query(
        `INSERT INTO invoice_items 
        (invoice_id, product_name, quantity, price, total)
        VALUES (?, ?, ?, ?, ?)`,
        [
          invoice_id,
          item.name,
          item.quantity,
          item.price,
          item.quantity * item.price,
        ]
      );
    }

    return Response.json({
      success: true,
      invoice_id,
      total,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}