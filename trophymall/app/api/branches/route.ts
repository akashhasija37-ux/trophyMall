import { NextResponse } from "next/server";
import db from "../../../backend/config/db";

// ✅ GET ALL BRANCHES
export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM branches ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET Branch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}


// ✅ CREATE BRANCH
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      location,
      manager,
      staff_count = 0,
      total_orders = 0,
      revenue = 0,
      performance = 0,
      status = "Active",
    } = body;

    // 🔴 VALIDATION
    if (!name) {
      return NextResponse.json(
        { error: "Branch name is required" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `INSERT INTO branches 
      (name, location, manager, staff_count, total_orders, revenue, performance, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        location || "",
        manager || "",
        staff_count,
        total_orders,
        revenue,
        performance,
        status,
      ]
    );

    return NextResponse.json({
      message: "Branch created successfully",
      id: result.insertId,
    });

  } catch (error) {
    console.error("POST Branch Error:", error);
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  }
}