import db from "../../../backend/config/db";

// ✅ GET all dispatch
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM dispatch ORDER BY id DESC"
    );

    return Response.json(rows);

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ✅ CREATE dispatch
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      order_id,
      customer_name,
      courier_partner,
      tracking_number,
      dispatch_date,
      delivery_status,
      assigned_staff,
      notes,
    } = body;

    // 🔥 Auto generate dispatch id
    const dispatch_id = `DSP-${Date.now()}`;

    await db.query(
      `INSERT INTO dispatch 
      (dispatch_id, order_id, customer_name, courier_partner, tracking_number, dispatch_date, delivery_status, assigned_staff, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dispatch_id,
        order_id,
        customer_name,
        courier_partner,
        tracking_number,
        dispatch_date,
        delivery_status,
        assigned_staff,
        notes,
      ]
    );

    return Response.json({
      success: true,
      dispatch_id,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}