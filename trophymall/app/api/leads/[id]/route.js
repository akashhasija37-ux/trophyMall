import db from "../../../../backend/config/db";
import { NextResponse } from "next/server";

// ✅ UPDATE LEAD (Awaiting params and updating database)
export async function PUT(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    const {
      lead_name,
      contact_number,
      email,
      company_name,
      lead_source,
      interested_product,
      assigned_employee,
      lead_status,
      lost_reason,
    } = body;

    await db.query(
      `UPDATE leads 
      SET lead_name = ?, contact_number = ?, email = ?, company_name = ?, lead_source = ?, interested_product = ?, assigned_employee = ?, lead_status = ?, lost_reason = ?
      WHERE id = ?`,
      [
        lead_name,
        contact_number,
        email,
        company_name,
        lead_source,
        interested_product,
        assigned_employee,
        lead_status,
        lost_reason || null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: "Lead updated successfully" });
  } catch (err) {
    console.error("Lead Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}