import db from "../config/db.js";

// GET all items
export const getInventory = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM inventory");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD item
export const addInventory = async (req, res) => {
  const { name, quantity, price } = req.body;

  try {
    await db.query(
      "INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)",
      [name, quantity, price]
    );
    res.json({ message: "Item added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE item
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM inventory WHERE id = ?", [id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};