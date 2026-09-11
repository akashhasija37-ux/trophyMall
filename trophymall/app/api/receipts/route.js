import db from "../../../backend/config/db";
import { NextResponse } from "next/server";

// ==============================
// ✅ GET RECEIPTS BY PAYMENT METHOD (Maps UPI and Cheque under Bank stream, or queries exact method)
// ==============================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method"); // e.g., 'Cash' or 'Bank'

    let query = "SELECT * FROM receipts";
    let params = [];

    if (method && method !== "All") {
      if (method === "Bank") {
        // Bank includes records stored as 'Bank', 'UPI', or 'Cheque'
        query += " WHERE payment_method = ? OR payment_method = 'UPI' OR payment_method = 'Cheque' OR payment_method LIKE ?";
        params.push(method, `%${method}%`);
      } else {
        query += " WHERE payment_method = ? OR payment_method LIKE ?";
        params.push(method, `%${method}%`);
      }
    }

    query += " ORDER BY id DESC";

    const [rows] = await db.query(query, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET Receipts Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ==============================
// ✅ CREATE RECEIPT MANUALLY OR FROM INVOICES
// ==============================
export async function POST(req) {
  try {
    const body = await req.json();
    const { invoice_id, party_name, payment_method, amount, receipt_date, status } = body;

    const receipt_no = `RCP-${Math.floor(100000 + Math.random() * 900000)}`;

    // Normalize UPI and Cheque to Bank category for unified dual-stream tracking
    let normalizedMethod = payment_method || "Cash";
    if (normalizedMethod === "UPI" || normalizedMethod === "Cheque") {
      normalizedMethod = "Bank";
    }

    await db.query(
      `INSERT INTO receipts (receipt_no, invoice_id, party_name, payment_method, amount, receipt_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        receipt_no,
        invoice_id || `MANUAL-${Date.now()}`,
        party_name || "Walk-in Customer",
        normalizedMethod,
        amount || 0,
        receipt_date || new Date(),
        status || (normalizedMethod === "Bank" ? "Transferred" : "Pending"),
      ]
    );

    return NextResponse.json({ success: true, receipt_no });
  } catch (err) {
    console.error("POST Receipt Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}