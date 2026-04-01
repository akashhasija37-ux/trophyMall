"use client";

import { useState } from "react";

export default function AddCustomerModal({ onClose, onSuccess }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/customers", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert("Error adding customer");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 text-white">

      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-lg border border-zinc-800">

        <h2 className="text-xl font-semibold mb-4">Add Customer</h2>

        <div className="space-y-4">

          <input
            placeholder="Customer Name"
            className="w-full p-3 bg-black border border-zinc-700 rounded-lg text-white"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="w-full p-3 bg-black border border-zinc-700 rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Phone"
            className="w-full p-3 bg-black border border-zinc-700 rounded-lg"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            placeholder="Company"
            className="w-full p-3 bg-black border border-zinc-700 rounded-lg"
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}