"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  product: {
    id: number;
    name: string;
    quantity: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStockModal({
  product,
  onClose,
  onSuccess,
}: Props) {
  const [value, setValue] = useState<number>(0);
  const [type, setType] = useState<"RESTOCK" | "REDUCE">("RESTOCK");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const change = type === "RESTOCK" ? value : -value;
  const previewStock = product.quantity + change;

  const handleSubmit = async () => {
    if (!product?.id) {
      toast.error("Invalid product");
      return;
    }

    const num = Number(value);
    if (!num || num <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    if (previewStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    setLoading(true);

    try {
      await axios.put("/api/inventory", {
        id: product.id,
        change,
        type,
        note,
      });

      toast.success("Stock updated successfully ✅");

      onSuccess(); // refresh table
      onClose();   // close modal
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      
      <div className="w-full sm:w-[420px] bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Stock</h2>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        {/* Product */}
        <div className="mb-4">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">
            Current: {product.quantity}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType("RESTOCK")}
            className={`flex-1 py-2 rounded-xl ${
              type === "RESTOCK"
                ? "bg-green-500 text-white"
                : "bg-gray-100"
            }`}
          >
            + Add
          </button>

          <button
            onClick={() => setType("REDUCE")}
            className={`flex-1 py-2 rounded-xl ${
              type === "REDUCE"
                ? "bg-red-500 text-white"
                : "bg-gray-100"
            }`}
          >
            - Reduce
          </button>
        </div>

        {/* Input */}
        <input
          type="number"
          placeholder="Enter quantity"
          className="w-full border rounded-xl p-3 mb-3"
          value={value}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
        />

        {/* Preview */}
        <div className="mb-4 text-sm">
          <span className="text-gray-500">New Stock: </span>
          <span
            className={`font-semibold ${
              previewStock < 0 ? "text-red-500" : "text-black"
            }`}
          >
            {previewStock}
          </span>
        </div>

        {/* Note */}
        <textarea
          placeholder="Optional note"
          className="w-full border rounded-xl p-3 mb-4"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-black text-white"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}