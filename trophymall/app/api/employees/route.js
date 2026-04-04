import db from "../../../backend/config/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      contact,
      role,
      department,
      branch,
      joining_date,
      permissions,
    } = body;

    if (!name || !contact || !role || !department || !branch) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO employees 
      (name, contact, role, department, branch, joining_date, permissions)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        contact,
        role,
        department,
        branch,
        joining_date,
        JSON.stringify(permissions),
      ]
    );

    return Response.json({ message: "Employee created successfully" });

  } catch (err) {
    console.error("EMPLOYEE CREATE ERROR:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [employees] = await db.query("SELECT * FROM employees");

    return Response.json(employees);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}