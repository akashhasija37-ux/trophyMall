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
      joiningDate,
      permissions = [],
      email,
      password,
    } = body;

    let hashedPassword = null;

    if (email && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      `INSERT INTO employees 
      (name, contact, role, department, branch, joining_date, permissions, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        contact,
        role,
        department,
        branch,
        joiningDate,
        JSON.stringify(permissions),
        email || null,
        hashedPassword,
      ]
    );

    return Response.json({ message: "Employee created" });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
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