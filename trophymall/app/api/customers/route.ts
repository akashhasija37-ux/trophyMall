import db from "../../../backend/config/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

// ==============================
// ✅ GET CUSTOMERS (WITH ORDERS)
// ==============================
export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.company,
        c.created_at,
        COUNT(o.id) as orders,
        COALESCE(SUM(o.price), 0) as spent,
        MAX(o.created_at) as last_order
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.name, c.email, c.phone, c.company, c.created_at
      ORDER BY c.id DESC
    `);

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Customer API Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ==============================
// ✅ POST (ADD + IMPORT)
// ==============================
export async function POST(req: any) {
  try {
    const contentType = req.headers.get("content-type");

    // ==========================
    // 📥 EXCEL IMPORT
    // ==========================
    if (contentType?.includes("multipart/form-data")) {

      const formData = await req.formData();
      const file: any = formData.get("file");

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!data.length) {
        return NextResponse.json({ error: "Empty file" }, { status: 400 });
      }

      // ✅ BULK INSERT (FAST)
      const values = data
        .map((row: any) => {
          const name = (row.name || row.Name || "").trim();
          const email = (row.email || row.Email || "").trim();
          const phone = (row.phone || row.Phone || "").trim();
          const company = (row.company || row.Company || "").trim();

          if (!name) return null;

          return [name, email, phone, company];
        })
        .filter(Boolean);

      if (!values.length) {
        return NextResponse.json({ error: "No valid rows found" }, { status: 400 });
      }

      await db.query(
        "INSERT INTO customers (name, email, phone, company) VALUES ?",
        [values]
      );

      return NextResponse.json({
        message: "Customers imported successfully",
        count: values.length,
      });
    }

    // ==========================
    // ➕ ADD SINGLE CUSTOMER
    // ==========================
    const body = await req.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const company = (body.company || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "INSERT INTO customers (name, email, phone, company) VALUES (?, ?, ?, ?)",
      [name, email, phone, company]
    );

    return NextResponse.json({
      message: "Customer added",
      id: result.insertId,
    });

  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}