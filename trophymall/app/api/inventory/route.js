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

// ✅ UPDATE / RESTOCK INVENTORY
export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      id,
      change,   // +10 or -5
      type,     // "RESTOCK" | "REDUCE"
      note
    } = body;

    if (!id || change === undefined) {
      return Response.json(
        { error: "ID and change are required" },
        { status: 400 }
      );
    }

    // 🔍 Get current stock
    const [rows] = await db.query(
      "SELECT quantity FROM inventory WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const currentStock = rows[0].quantity;
    const newStock = currentStock + change;

    // ❌ Prevent negative stock
    if (newStock < 0) {
      return Response.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    // 📊 Auto stock status logic
    let stock_status = "In Stock";
    if (newStock === 0) stock_status = "Out of Stock";
    else if (newStock <= 5) stock_status = "Low Stock";

    // 🔄 Update inventory
    await db.query(
      `UPDATE inventory 
       SET quantity = ?, stock_status = ?
       WHERE id = ?`,
      [newStock, stock_status, id]
    );

    // 🧾 OPTIONAL: inventory log (recommended)
    // await db.query(
    //   `INSERT INTO inventory_logs (product_id, change_value, type, note)
    //    VALUES (?, ?, ?, ?)`,
    //   [id, change, type || "UPDATE", note || null]
    // );

    return Response.json({
      message: "Inventory updated successfully",
      newStock,
      stock_status
    });

  } catch (err) {
    console.error("PUT INVENTORY ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}