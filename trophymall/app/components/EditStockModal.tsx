"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  product: {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    selling_price: number;
    purchase_price?: number;
    discount?: number;
    category?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStockModal({
  product,
  onClose,
  onSuccess,
}: Props) {
  const [sellingPrice, setSellingPrice] = useState<number>(product.selling_price || 0);
  const [discount, setDiscount] = useState<number>(product.discount || 0);
  
  const [value, setValue] = useState<number>(0);
  const [type, setType] = useState<"RESTOCK" | "REDUCE">("RESTOCK");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setSellingPrice(product.selling_price || 0);
      setDiscount(product.discount || 0);
    }
  }, [product]);

  const change = type === "RESTOCK" ? value : -value;
  const previewStock = product.quantity + change;

  const handleSubmit = async () => {
    if (!product?.id) {
      toast.error("Invalid product");
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
        selling_price: Number(sellingPrice),
        discount: Number(discount),
        change,
        type,
        note,
      });

      toast.success("Product updated successfully ✅");

      onSuccess(); 
      onClose();   
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="w-full sm:w-[520px] bg-[#121212] border border-zinc-800 text-gray-200 rounded-2xl p-6 shadow-2xl animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-white">Edit Product & Adjust Stock</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Non-Editable identifiers & Current Info Overview */}
        <div className="grid grid-cols-2 gap-4 mb-4 bg-[#18181c] p-3.5 rounded-xl border border-zinc-800">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Product Name</label>
            <p className="text-sm font-semibold text-white">{product.name}</p>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">SKU / TM Code (Locked)</label>
            <p className="text-sm font-mono text-blue-400 font-semibold">{product.sku || "N/A"}</p>
          </div>
        </div>

        {/* Current Details Display Box */}
        <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl mb-4 text-xs">
          <div>
            <span className="text-zinc-500">Current Price: </span>
            <span className="text-white font-bold">₹{product.selling_price || 0}</span>
          </div>
          <div>
            <span className="text-zinc-500">Current Discount: </span>
            <span className="text-red-400 font-bold">{product.discount || 0}%</span>
          </div>
          <div>
            <span className="text-zinc-500">Stock Qty: </span>
            <span className="text-green-400 font-bold">{product.quantity}</span>
          </div>
        </div>

        {/* Editable Pricing & Discounts */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1 font-medium">Update Selling Price (₹)</label>
            <input
              type="number"
              className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-green-500 rounded-xl p-2.5 text-xs text-white outline-none"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1 font-medium">Update Discount (%)</label>
            <input
              type="number"
              className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-green-500 rounded-xl p-2.5 text-xs text-white outline-none"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Stock Management Section */}
        <div className="border-t border-zinc-800 pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400 font-medium">Manage Quantity</span>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setType("RESTOCK")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                type === "RESTOCK"
                  ? "bg-green-600 text-white shadow-lg shadow-green-950/50"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              + Add Stock
            </button>

            <button
              type="button"
              onClick={() => setType("REDUCE")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                type === "REDUCE"
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              - Reduce Stock
            </button>
          </div>

          <input
            type="number"
            placeholder="Enter quantity to adjust"
            className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-green-500 rounded-xl p-2.5 text-xs text-white outline-none mb-2"
            value={value || ""}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
          />

          <div className="text-xs flex justify-between items-center bg-[#18181c] px-3 py-2 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Resulting Stock Level: </span>
            <span
              className={`font-bold text-sm ${
                previewStock < 0 ? "text-red-500" : "text-green-400"
              }`}
            >
              {previewStock}
            </span>
          </div>
        </div>

        <textarea
          placeholder="Optional note regarding update..."
          className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-green-500 rounded-xl p-2.5 text-xs text-white outline-none mb-5 resize-none h-16"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition shadow-lg shadow-green-950/40 disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}