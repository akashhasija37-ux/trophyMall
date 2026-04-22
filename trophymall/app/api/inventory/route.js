import db from "../../../backend/config/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// ==========================
// ✅ GET ALL INVENTORY
// ==========================
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM inventory ORDER BY id DESC"
    );
    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ==========================
// ✅ ADD INVENTORY (UPDATED)
export async function POST(req) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 🔥 Convert Web Request → Node Request
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  return new Promise(async (resolve) => {
    try {
      const data = await req.formData();

      // ==========================
      // 🔥 HANDLE FILES (CORRECT WAY)
      // ==========================

      let featuredImageName = null;
      const gallery = [];

      const featuredFile = data.get("featured_image");

      if (featuredFile && typeof featuredFile === "object") {
        const buffer = Buffer.from(await featuredFile.arrayBuffer());

        const ext = path.extname(featuredFile.name) || ".jpg";
        const fileName = `${Date.now()}${ext}`;

        fs.writeFileSync(
          path.join(uploadDir, fileName),
          buffer
        );

        featuredImageName = fileName;
      }

      const galleryFiles = data.getAll("gallery_images");

      for (let file of galleryFiles) {
        if (file && typeof file === "object") {
          const buffer = Buffer.from(await file.arrayBuffer());

          const ext = path.extname(file.name) || ".jpg";
          const fileName = `${Date.now()}-${Math.random()}${ext}`;

          fs.writeFileSync(
            path.join(uploadDir, fileName),
            buffer
          );

          gallery.push(fileName);
        }
      }

      // ==========================
      // 🔥 HANDLE FIELDS
      // ==========================

      const fields = Object.fromEntries(data.entries());

      await db.query(
        `INSERT INTO inventory 
        (name, sku, tm_code, category, quantity, purchase_price, selling_price, discount,
         height, width, weight, badge, featured_image, gallery_images, supplier, stock_status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fields.name,
          fields.sku,
          fields.tm_code,
          fields.category,
          Number(fields.quantity || 0),
          Number(fields.purchase_price || 0),
          Number(fields.selling_price || 0),
          Number(fields.discount || 0),
          Number(fields.height || 0),
          Number(fields.width || 0),
          Number(fields.weight || 0),
          fields.badge,
          featuredImageName,
          JSON.stringify(gallery),
          fields.supplier,
          fields.stock_status,
          fields.notes,
        ]
      );

      resolve(Response.json({ message: "Saved successfully" }));
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      resolve(Response.json({ error: err.message }, { status: 500 }));
    }
  });
}

// ==========================
// ✅ UPDATE / RESTOCK
// ==========================
export async function PUT(req) {
  try {
    const body = await req.json();

    const { id, change, type, note } = body;

    if (!id || change === undefined) {
      return Response.json(
        { error: "ID and change are required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT quantity FROM inventory WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const currentStock = rows[0].quantity;
    const newStock = currentStock + change;

    if (newStock < 0) {
      return Response.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    // 🔥 AUTO STATUS
    let stock_status = "In Stock";
    if (newStock === 0) stock_status = "Out of Stock";
    else if (newStock <= 5) stock_status = "Low Stock";

    await db.query(
      `UPDATE inventory 
       SET quantity = ?, stock_status = ?
       WHERE id = ?`,
      [newStock, stock_status, id]
    );

    return Response.json({
      message: "Inventory updated successfully",
      newStock,
      stock_status,
    });

  } catch (err) {
    console.error("PUT INVENTORY ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ==========================
// ✅ DELETE INVENTORY (FULL CLEANUP)
// ==========================
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // 🔍 Get product first
    const [rows] = await db.query(
      "SELECT featured_image, gallery_images FROM inventory WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = rows[0];

    const uploadDir = path.join(process.cwd(), "public/uploads");

    // ==========================
    // 🔥 DELETE FEATURED IMAGE
    // ==========================
    if (product.featured_image) {
      const filePath = path.join(uploadDir, product.featured_image);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // ==========================
    // 🔥 DELETE GALLERY IMAGES
    // ==========================
    if (product.gallery_images) {
      try {
        const images = JSON.parse(product.gallery_images);

        for (let img of images) {
          const filePath = path.join(uploadDir, img);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (e) {
        console.warn("Gallery parse failed");
      }
    }

    // ==========================
    // 🧾 DELETE FROM DB
    // ==========================
    await db.query("DELETE FROM inventory WHERE id = ?", [id]);

    return Response.json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}