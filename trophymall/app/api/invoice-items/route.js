import db from "../../../backend/config/db";

// ✅ GET ITEMS & INVOICE DETAILS JOINED BY INVOICE ID
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
        ii.id,
        ii.invoice_id,
        ii.product_name,
        ii.quantity,
        ii.price,
        ii.total,
        0 AS discount,
        0 AS tax,
        inv.tm_code AS tm_code,
        i.customer_name,
        i.invoice_date,
        i.due_date,
        i.payment_status,
        i.salesperson_id AS salesperson
      FROM invoice_items ii
      LEFT JOIN invoices i ON ii.invoice_id = i.invoice_id
      LEFT JOIN inventory inv ON ii.product_name = inv.name
      WHERE ii.invoice_id = ?`,
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

// ✅ ADD ITEMS
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
      const qty = Number(item.qty || item.quantity) || 0;
      const price = Number(item.price) || 0;
      const total = Number(item.total) || (qty * price);
      
      // Prevent [object Object] error by safely extracting product name string
      let productName = item.product || item.product_name || "";
      if (typeof productName === "object") {
        productName = productName.name || productName.title || JSON.stringify(productName);
      }

      await db.query(
        `INSERT INTO invoice_items 
        (invoice_id, product_name, quantity, price, total)
        VALUES (?, ?, ?, ?, ?)`,
        [invoice_id, productName, qty, price, total]
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
      const qty = Number(item.qty || item.quantity) || 0;
      const price = Number(item.price) || 0;
      const total = Number(item.total) || (qty * price);

      let productName = item.product || item.product_name || "";
      if (typeof productName === "object") {
        productName = productName.name || productName.title || JSON.stringify(productName);
      }

      await db.query(
        `INSERT INTO invoice_items 
        (invoice_id, product_name, quantity, price, total)
        VALUES (?, ?, ?, ?, ?)`,
        [invoice_id, productName, qty, price, total]
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

// ✅ DELETE ALL ITEMS
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