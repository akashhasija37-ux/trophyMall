import db from "@/backend/config/db";

// ✅ GET all leads
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM leads ORDER BY id DESC"
    );

    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ ADD new lead
export async function POST(req) {
  try {
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
      created_at,
    } = body;

    await db.query(
      `INSERT INTO leads 
      (lead_name, contact_number, email, company_name, lead_source, interested_product, assigned_employee, lead_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead_name,
        contact_number,
        email,
        company_name,
        lead_source,
        interested_product,
        assigned_employee,
        lead_status,
        created_at,
      ]
    );

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}