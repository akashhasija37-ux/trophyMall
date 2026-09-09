import db from "../../../backend/config/db";
import { NextResponse } from "next/server";

// ==============================
// ✅ GET ALL INVOICES
// ==============================
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

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET Invoices Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ==============================
// ✅ CREATE INVOICE (GST / Non-GST, Printing Ticket & Ledger Integration)
// ==============================
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
      eway_bill_no,
    } = body;

    const invoice_id = invoice_no || `INV-${Date.now()}`;

    // 🔥 PREVENT DUPLICATE INVOICE NUMBER ENTRY
    const [existingInvoice] = await db.query(
      "SELECT id FROM invoices WHERE invoice_id = ?",
      [invoice_id]
    );

    if (existingInvoice.length > 0) {
      return NextResponse.json(
        { error: `Invoice number ${invoice_id} already exists in the system.` },
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
    
    // Non-GST invoices force 0 tax
    const taxAmount = invoice_type === "Non-GST Invoice" ? 0 : ((Number(cgst) + Number(sgst)) > 0 
      ? Number(cgst) + Number(sgst) 
      : netAmountBeforeGst * (Number(gst) / 100));

    const finalAmount = netAmountBeforeGst + taxAmount + Number(freight || 0) + Number(otherCharges || 0) - Number(deposit || 0) + Number(roundOff || 0);

    // ✅ INSERT INVOICE
    await db.query(
      `INSERT INTO invoices 
      (invoice_id, invoice_type, customer_id, customer_name, invoice_date, due_date, payment_status, payment_method, subtotal, discount, tax, deposit, total_amount, notes, salesperson_id, assigned_to, eway_bill_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_id,
        invoice_type,
        customer_id || null,
        resolved_customer_name,
        invoice_date || null,
        due_date || null,
        payment_status,
        payment_method,
        subtotal,
        discountAmount,
        taxAmount,
        Number(deposit) || 0,
        finalAmount,
        notes,
        salesperson_id || null,
        assigned_to || null,
        eway_bill_no || null,
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

    // 🔥 CREATE AUTOMATIC PRINTING TICKET ON PRINTING BOARD
    let employeeName = null;
    if (assigned_to) {
      const [empRows] = await db.query(
        "SELECT name FROM employees WHERE id = ?",
        [assigned_to]
      );
      if (empRows.length > 0) {
        employeeName = empRows[0].name;
      }
    }

    const firstItem = items[0]?.product || "Custom Order Item";
    const jobTitle = `${firstItem} (${items.length} items)`;

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
        notes || `Automated ticket created from invoice ${invoice_id}`,
      ]
    );

    return NextResponse.json({
      success: true,
      invoice_id,
      subtotal,
      finalAmount,
    });

  } catch (err) {
    console.error("POST Invoice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ==============================
// ✅ UPDATE INVOICE
// ==============================
export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      invoice_id,
      invoice_type = "GST Invoice",
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
      payment_method,
      notes = "",
      salesperson_id,
      assigned_to,
      eway_bill_no,
    } = body;

    let subtotal = 0;
    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      subtotal += qty * price;
    });

    const discountAmount = Number(discount) || 0;
    const netAmountBeforeGst = subtotal - discountAmount;
    
    const taxAmount = invoice_type === "Non-GST Invoice" ? 0 : ((Number(cgst) + Number(sgst)) > 0 
      ? Number(cgst) + Number(sgst) 
      : netAmountBeforeGst * (Number(gst) / 100));

    const finalAmount = netAmountBeforeGst + taxAmount + Number(freight || 0) + Number(otherCharges || 0) - Number(deposit || 0) + Number(roundOff || 0);

    await db.query(
      `UPDATE invoices SET
        invoice_type = ?,
        payment_status = ?,
        payment_method = ?,
        subtotal = ?,
        discount = ?,
        tax = ?,
        deposit = ?,
        total_amount = ?,
        notes = ?,
        salesperson_id = ?,
        assigned_to = ?,
        eway_bill_no = ?
      WHERE invoice_id = ?`,
      [
        invoice_type,
        payment_status || "Pending",
        payment_method || "Cash",
        subtotal,
        discountAmount,
        taxAmount,
        Number(deposit) || 0,
        finalAmount,
        notes,
        salesperson_id || null,
        assigned_to || null,
        eway_bill_no || null,
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

    return NextResponse.json({
      success: true,
      total: finalAmount,
    });

  } catch (err) {
    console.error("PUT Invoice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}