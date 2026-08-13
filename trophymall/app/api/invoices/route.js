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

// ✅ CREATE INVOICE WITH DUPLICATE PROTECTION
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      invoice_no,
      invoice_type = "GST Invoice",
      customer_id,
      customer_name,
      invoice_date,
      due_date,
      payment_status = "Pending",
      payment_method = "Cash",
      items = [],
      discount = 0,
      gst = 0,
      cgst = 0,
      sgst = 0,
      freight = 0,
      otherCharges = 0,
      deposit = 0,
      roundOff = 0,
      notes = "",
      salesperson_id,
      assigned_to,
    } = body;

    const invoice_id = invoice_no || `INV-${Date.now()}`;

    // 🔥 PREVENT DUPLICATE INVOICE NUMBER ENTRY
    const [existingInvoice] = await db.query(
      "SELECT id FROM invoices WHERE invoice_id = ?",
      [invoice_id]
    );

    if (existingInvoice.length > 0) {
      return Response.json(
        { error: `Invoice number ${invoice_id} already exists in the system. Please generate a new invoice number or create a new tab.` },
        { status: 400 }
      );
    }

    // ✅ RESOLVE CUSTOMER NAME
    let resolved_customer_name = customer_name || null;

    if (customer_id && !resolved_customer_name) {
      const [customerRows] = await db.query(
        "SELECT name FROM customers WHERE id = ?",
        [customer_id]
      );

      if (customerRows.length > 0) {
        resolved_customer_name = customerRows[0].name;
      }
    }

    if (!resolved_customer_name) {
      resolved_customer_name = "Walk-in Customer";
    }

    // 🔥 CALCULATE TOTALS
    let subtotal = 0;
    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      subtotal += qty * price;
    });

    const discountAmount = Number(discount) || 0;
    const netAmountBeforeGst = subtotal - discountAmount;
    const taxAmount = (Number(cgst) + Number(sgst)) > 0 
      ? Number(cgst) + Number(sgst) 
      : netAmountBeforeGst * (Number(gst) / 100);

    const finalAmount = netAmountBeforeGst + taxAmount + Number(freight || 0) + Number(otherCharges || 0) - Number(deposit || 0) + Number(roundOff || 0);

    // ✅ INSERT INVOICE
    await db.query(
      `INSERT INTO invoices 
      (invoice_id, customer_id, customer_name, invoice_date, due_date, payment_status, subtotal, discount, tax, deposit, total_amount, notes, salesperson_id, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_id,
        customer_id || null,
        resolved_customer_name,
        invoice_date || null,
        due_date || null,
        payment_status,
        subtotal,
        discountAmount,
        taxAmount,
        Number(deposit) || 0,
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
          item.product || "General Item",
          qty,
          price,
          item.total || (qty * price),
        ]
      );
    }

    // 🔥 CREATE PRINTING JOB IF ASSIGNED
    if (assigned_to) {
      let employeeName = null;
      const [empRows] = await db.query(
        "SELECT name FROM employees WHERE id = ?",
        [assigned_to]
      );

      if (empRows.length > 0) {
        employeeName = empRows[0].name;
      }

      const firstItem = items[0]?.product || "Custom Job";
      const jobTitle = `${firstItem} Print`;

      await db.query(
        `INSERT INTO printing_jobs
        (job_title, customer_name, order_reference, assigned_employee, priority_level, start_date, deadline, job_status, job_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          jobTitle,
          resolved_customer_name,
          invoice_id,
          employeeName,
          "Medium Priority",
          invoice_date || null,
          due_date || null,
          "Pending",
          notes || `Print job for ${resolved_customer_name}`,
        ]
      );
    }

    return Response.json({
      success: true,
      invoice_id,
      subtotal,
      finalAmount,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ UPDATE INVOICE
export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      invoice_id,
      items = [],
      discount = 0,
      gst = 0,
      cgst = 0,
      sgst = 0,
      freight = 0,
      otherCharges = 0,
      deposit = 0,
      roundOff = 0,
      payment_status,
      notes = "",
      salesperson_id,
      assigned_to,
    } = body;

    let subtotal = 0;
    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      subtotal += qty * price;
    });

    const discountAmount = Number(discount) || 0;
    const netAmountBeforeGst = subtotal - discountAmount;
    const taxAmount = (Number(cgst) + Number(sgst)) > 0 
      ? Number(cgst) + Number(sgst) 
      : netAmountBeforeGst * (Number(gst) / 100);

    const finalAmount = netAmountBeforeGst + taxAmount + Number(freight || 0) + Number(otherCharges || 0) - Number(deposit || 0) + Number(roundOff || 0);

    await db.query(
      `UPDATE invoices SET
        payment_status = ?,
        subtotal = ?,
        discount = ?,
        tax = ?,
        deposit = ?,
        total_amount = ?,
        notes = ?,
        salesperson_id = ?,
        assigned_to = ?
      WHERE invoice_id = ?`,
      [
        payment_status || "Pending",
        subtotal,
        discountAmount,
        taxAmount,
        Number(deposit) || 0,
        finalAmount,
        notes,
        salesperson_id || null,
        assigned_to || null,
        invoice_id,
      ]
    );

    await db.query("DELETE FROM invoice_items WHERE invoice_id = ?", [invoice_id]);

    for (const item of items) {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;

      await db.query(
        `INSERT INTO invoice_items 
        (invoice_id, product_name, quantity, price, total)
        VALUES (?, ?, ?, ?, ?)`,
        [
          invoice_id,
          item.product || "General Item",
          qty,
          price,
          item.total || (qty * price),
        ]
      );
    }

    return Response.json({
      success: true,
      total: finalAmount,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}