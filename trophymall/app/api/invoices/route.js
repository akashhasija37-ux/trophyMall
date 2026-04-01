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
      customer_id,
      invoice_date,
      due_date,
      payment_status,
      items = [],
      discount = 0,
      gst = 0,
      deposit = 0, // ✅ NEW
      notes = "",
    } = body;

    // 🔥 Generate invoice ID
    const invoice_id = `INV-${Date.now()}`;

    // ✅ GET CUSTOMER DETAILS FROM DB
    let customer_name = null;

    if (customer_id) {
      const [customerRows] = await db.query(
        "SELECT name FROM customers WHERE id = ?",
        [customer_id]
      );

      if (customerRows.length > 0) {
        customer_name = customerRows[0].name;
      }
    }

    if (!customer_name) {
      return Response.json(
        { error: "Customer not found" },
        { status: 400 }
      );
    }

    // 🔥 SAFE subtotal calculation
    let subtotal = 0;

    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      subtotal += qty * price;
    });

    const discountAmount = subtotal * (Number(discount) / 100);
    const gstAmount = (subtotal - discountAmount) * (Number(gst) / 100);

    const total = subtotal - discountAmount + gstAmount;

    // ✅ FINAL AFTER DEPOSIT
    const finalAmount = total - Number(deposit || 0);

    // 👉 INSERT INVOICE
    await db.query(
      `INSERT INTO invoices 
      (invoice_id, customer_id, customer_name, invoice_date, due_date, payment_status, subtotal, discount, tax, deposit, total_amount, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_id,
        customer_id,
        customer_name,
        invoice_date,
        due_date,
        payment_status,
        subtotal,
        discountAmount,
        gstAmount,
        deposit,
        finalAmount,
        notes,
      ]
    );

    // 👉 INSERT ITEMS
    for (const item of items) {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;

      await db.query(
        `INSERT INTO invoice_items 
        (invoice_id, product_name, quantity, price, total)
        VALUES (?, ?, ?, ?, ?)`,
        [
          invoice_id,
          item.product || "",
          qty,
          price,
          qty * price,
        ]
      );
    }

    return Response.json({
      success: true,
      invoice_id,
      subtotal,
      total,
      finalAmount,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}