import db from "../../../../backend/config/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const [rows] = await db.query(
      "SELECT * FROM employees WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        permissions: JSON.parse(user.permissions || "[]"),
      },
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}