"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "antd";

export default function EditInvoiceModal({ invoice, onClose, refresh }: any) {

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD ITEMS
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(`/api/invoice-items?invoice_id=${invoice.id}`);
    const data = await res.json();
    setItems(data);
  };

  // ➕ ADD ITEM
  const addItem = () => {
    setItems([...items, { product_name: "", quantity: 1, price: 0 }]);
  };

  // ❌ REMOVE
  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // 🔄 UPDATE FIELD
  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // 💰 TOTAL
  const total = items.reduce(
    (sum, i) => sum + (i.quantity || 0) * (i.price || 0),
    0
  );

  // 💾 SAVE
  const handleSave = async () => {
    try {
      setLoading(true);

      await fetch("/api/invoices/update", {
        method: "POST",
        body: JSON.stringify({
          invoice_id: invoice.id,
          items,
          total,
        }),
      });

      refresh();
      onClose();

    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl w-[700px] border border-zinc-800">

        <h2 className="text-white text-xl mb-4">Edit Invoice</h2>

        {/* ITEMS */}
        <div className="space-y-3">

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-3">

              <Input
                value={item.product_name}
                onChange={(e) =>
                  updateItem(i, "product_name", e.target.value)
                }
                placeholder="Product"
              />

              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(i, "quantity", Number(e.target.value))
                }
              />

              <Input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(i, "price", Number(e.target.value))
                }
              />

              <Button danger onClick={() => removeItem(i)}>
                Remove
              </Button>
            </div>
          ))}

        </div>

        {/* ADD ITEM */}
        <button
          onClick={addItem}
          className="text-green-400 mt-4"
        >
          + Add Product
        </button>

        {/* TOTAL */}
        <div className="mt-4 text-white">
          Total: ₹{total}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save Changes
          </Button>
        </div>

      </div>
    </div>
  );
}