import db from "@/backend/config/db"

// ✅ GET ALL PRODUCTS
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC")
    return Response.json(rows)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// ✅ CREATE PRODUCT
export async function POST(req) {
  try {
    const body = await req.json()

    const { name, category, price, stock, image, description } = body

    const [result] = await db.query(
      `INSERT INTO products 
      (name, category, price, stock, image, description) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [name, category, price, stock, image, description]
    )

    return Response.json({ success: true, id: result.insertId })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}