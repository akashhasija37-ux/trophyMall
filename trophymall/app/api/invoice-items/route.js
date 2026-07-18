import db from "../../../backend/config/db";

// ✅ GET ITEMS BY INVOICE ID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const invoice_id = searchParams.get("invoice_id");

    if (!invoice_id) {
      return Response.json(
        { error: "invoice_id is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `SELECT 
        id,
        invoice_id,
        product_name,
        quantity,
        price,
        total
      FROM invoice_items
      WHERE invoice_id = ?`,
      [invoice_id]
    );

    return Response.json(rows);

  } catch (err) {
    console.error("GET invoice-items error:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ✅ ADD ITEMS (OPTIONAL - if needed standalone)
export async function POST(req) {
  try {
    const body = await req.json();

    const { invoice_id, items = [] } = body;

    if (!invoice_id || !items.length) {
      return Response.json(
        { error: "invoice_id and items are required" },
        { status: 400 }
      );
    }

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

    return Response.json({ success: true });

  } catch (err) {
    console.error("POST invoice-items error:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE ITEMS (REPLACE ALL)
export async function PUT(req) {
  try {
    const body = await req.json();

    const { invoice_id, items = [] } = body;

    if (!invoice_id) {
      return Response.json(
        { error: "invoice_id is required" },
        { status: 400 }
      );
    }

    // 🔥 DELETE OLD ITEMS
    await db.query(
      "DELETE FROM invoice_items WHERE invoice_id = ?",
      [invoice_id]
    );

    // 🔥 INSERT NEW ITEMS
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

    return Response.json({ success: true });

  } catch (err) {
    console.error("PUT invoice-items error:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE ALL ITEMS (OPTIONAL)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const invoice_id = searchParams.get("invoice_id");

    if (!invoice_id) {
      return Response.json(
        { error: "invoice_id is required" },
        { status: 400 }
      );
    }

    await db.query(
      "DELETE FROM invoice_items WHERE invoice_id = ?",
      [invoice_id]
    );

    return Response.json({ success: true });

  } catch (err) {
    console.error("DELETE invoice-items error:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}