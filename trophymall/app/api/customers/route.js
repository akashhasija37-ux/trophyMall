import db from "../../../backend/config/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

// 👉 GET ALL CUSTOMERS
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM customers ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// 👉 POST (HANDLE BOTH SINGLE + EXCEL IMPORT)
export async function POST(req) {
  try {

    // 🔥 CHECK CONTENT TYPE
    const contentType = req.headers.get("content-type");

    // ==============================
    // ✅ EXCEL IMPORT (FormData)
    // ==============================
    if (contentType && contentType.includes("multipart/form-data")) {

      const formData = await req.formData();
      const file = formData.get("file");

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      // 🔥 READ FILE BUFFER
      const buffer = Buffer.from(await file.arrayBuffer());

      // 🔥 PARSE EXCEL
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(sheet);

      if (!data.length) {
        return NextResponse.json({ error: "Empty file" }, { status: 400 });
      }

      // 🔥 INSERT ALL ROWS
      for (const row of data) {

        const name = row.name || "";
        const email = row.email || "";
        const phone = row.phone || "";
        const company = row.company || "";

        if (!name) continue; // skip invalid rows

        await db.query(
          "INSERT INTO customers (name, email, phone, company) VALUES (?, ?, ?, ?)",
          [name, email, phone, company]
        );
      }

      return NextResponse.json({
        message: "Customers imported successfully",
        count: data.length
      });
    }

    // ==============================
    // ✅ NORMAL ADD CUSTOMER (JSON)
    // ==============================
    const body = await req.json();

    const { name, email, phone, company } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO customers (name, email, phone, company) VALUES (?, ?, ?, ?)",
      [name, email, phone, company]
    );

    return NextResponse.json({ message: "Customer added" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}