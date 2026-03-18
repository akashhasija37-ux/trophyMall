import db from "../../../backend/config/db";

// ✅ GET all jobs
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM printing_jobs ORDER BY id DESC"
    );

    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ CREATE job
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      job_title,
      customer_name,
      order_reference,
      assigned_employee,
      priority_level,
      start_date,
      deadline,
      job_status,
      job_description,
    } = body;

    await db.query(
      `INSERT INTO printing_jobs
      (job_title, customer_name, order_reference, assigned_employee, priority_level, start_date, deadline, job_status, job_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job_title,
        customer_name,
        order_reference,
        assigned_employee,
        priority_level,
        start_date,
        deadline,
        job_status,
        job_description,
      ]
    );

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}