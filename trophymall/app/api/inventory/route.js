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

/// ==========================
// ✅ ADD INVENTORY (UPDATED WITH NaN PROTECTION)
// ==========================
export async function POST(req) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise(async (resolve) => {
    try {
      const data = await req.formData();

      let featuredImageName = null;
      const gallery = [];

      const featuredFile = data.get("featured_image");

      if (featuredFile && typeof featuredFile === "object") {
        const buffer = Buffer.from(await featuredFile.arrayBuffer());
        const ext = path.extname(featuredFile.name) || ".jpg";
        const fileName = `${Date.now()}${ext}`;

        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        featuredImageName = fileName;
      }

      const fields = Object.fromEntries(data.entries());

      // Fallback image from fields if sent as text string name from excel upload
      const finalImage = featuredImageName || fields.image || null;

      // Safely parse numbers with NaN protection
      const qty = Number(fields.quantity);
      const purchasePrice = Number(fields.purchase_price);
      const sellingPrice = Number(fields.selling_price);
      const discount = Number(fields.discount);
      const height = Number(fields.height);
      const width = Number(fields.width);
      const weight = Number(fields.weight);

      await db.query(
        `INSERT INTO inventory 
        (name, sku, tm_code, category, quantity, purchase_price, selling_price, discount,
         height, width, weight, badge, featured_image, gallery_images, supplier, stock_status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fields.name || "",
          fields.sku || "",
          fields.tm_code || "",
          fields.category || "",
          isNaN(qty) ? 0 : qty,
          isNaN(purchasePrice) ? 0 : purchasePrice,
          isNaN(sellingPrice) ? 0 : sellingPrice,
          isNaN(discount) ? 0 : discount,
          isNaN(height) ? 0 : height,
          isNaN(width) ? 0 : width,
          isNaN(weight) ? 0 : weight,
          fields.badge || null,
          finalImage,
          JSON.stringify(gallery),
          fields.supplier || "Default Supplier",
          fields.stock_status || "In Stock",
          fields.notes || null,
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
// ✅ UPDATE / RESTOCK (UPDATED FOR FORMDATA & IMAGES)
// ==========================
export async function PUT(req) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise(async (resolve) => {
    try {
      const data = await req.formData();
      const fields = Object.fromEntries(data.entries());

      const id = fields.id;
      const change = Number(fields.change || 0);
      const sellingPrice = Number(fields.selling_price || 0);
      const discount = Number(fields.discount || 0);

      if (!id) {
        return resolve(
          Response.json({ error: "ID is required" }, { status: 400 })
        );
      }

      // Handle featured image upload if provided
      let featuredImageName = null;
      const featuredFile = data.get("featured_image");

      if (featuredFile && typeof featuredFile === "object" && featuredFile.size > 0) {
        const buffer = Buffer.from(await featuredFile.arrayBuffer());
        const ext = path.extname(featuredFile.name) || ".jpg";
        const fileName = `${Date.now()}${ext}`;

        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        featuredImageName = fileName;
      }

      const [rows] = await db.query(
        "SELECT quantity, featured_image FROM inventory WHERE id = ?",
        [id]
      );

      if (!rows.length) {
        return resolve(
          Response.json({ error: "Product not found" }, { status: 404 })
        );
      }

      const currentStock = rows[0].quantity;
      const newStock = currentStock + change;

      if (newStock < 0) {
        return resolve(
          Response.json({ error: "Stock cannot be negative" }, { status: 400 })
        );
      }

      let stock_status = "In Stock";
      if (newStock === 0) stock_status = "Out of Stock";
      else if (newStock <= 5) stock_status = "Low Stock";

      // Update query dynamically based on whether a new image was uploaded
      if (featuredImageName) {
        await db.query(
          `UPDATE inventory 
           SET quantity = ?, stock_status = ?, selling_price = ?, discount = ?, featured_image = ?
           WHERE id = ?`,
          [newStock, stock_status, sellingPrice, discount, featuredImageName, id]
        );
      } else {
        await db.query(
          `UPDATE inventory 
           SET quantity = ?, stock_status = ?, selling_price = ?, discount = ?
           WHERE id = ?`,
          [newStock, stock_status, sellingPrice, discount, id]
        );
      }

      resolve(
        Response.json({
          message: "Inventory updated successfully",
          newStock,
          stock_status,
        })
      );
    } catch (err) {
      console.error("PUT INVENTORY ERROR:", err);
      resolve(Response.json({ error: err.message }, { status: 500 }));
    }
  });
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