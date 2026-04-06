import db from "../../../backend/config/db";

// ✅ GET ALL INVOICES
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
  invoices.*,
  employees.name AS salesperson_name
FROM invoices
LEFT JOIN employees 
  ON invoices.salesperson_id = employees.id
ORDER BY invoices.id DESC
    `);

    return Response.json(rows);

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ CREATE INVOICE + PRINTING JOB
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
      deposit = 0,
      notes = "",
      salesperson_id,   // ✅ NEW
      assigned_to,      // ✅ NEW
    } = body;

    // 🔥 Generate invoice ID
    const invoice_id = `INV-${Date.now()}`;

    // ✅ GET CUSTOMER NAME
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

    // 🔥 CALCULATE TOTALS
    let subtotal = 0;

    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      subtotal += qty * price;
    });

    const discountAmount = subtotal * (Number(discount) / 100);
    const gstAmount = (subtotal - discountAmount) * (Number(gst) / 100);
    const total = subtotal - discountAmount + gstAmount;
    const finalAmount = total - Number(deposit || 0);

    // ✅ INSERT INVOICE (UPDATED)
    await db.query(
      `INSERT INTO invoices 
      (invoice_id, customer_id, customer_name, invoice_date, due_date, payment_status, subtotal, discount, tax, deposit, total_amount, notes, salesperson_id, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        salesperson_id || null,
        assigned_to || null,
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

    // 🔥 CREATE PRINTING JOB (IMPORTANT)
    if (assigned_to) {
      // 👉 get employee name
      let employeeName = null;

      const [empRows] = await db.query(
        "SELECT name FROM employees WHERE id = ?",
        [assigned_to]
      );

      if (empRows.length > 0) {
        employeeName = empRows[0].name;
      }

      // 👉 create job title from first product
      const firstItem = items[0]?.product || "Custom Job";

      const jobTitle = `${firstItem} Print`;

      await db.query(
        `INSERT INTO printing_jobs
        (job_title, customer_name, order_reference, assigned_employee, priority_level, start_date, deadline, job_status, job_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

        [
          jobTitle,
          customer_name,
          invoice_id,
          employeeName,
          "Medium Priority",
          invoice_date,
          due_date,
          "Pending",
          notes || `Print job for ${customer_name}`,
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