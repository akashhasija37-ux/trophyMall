"use client"

import { useState } from "react"

export default function AddProductModal({ onClose, onSuccess }: any) {

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: ""
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {

    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(form)
    })

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

      <div className="bg-zinc-900 p-8 rounded-xl w-[500px]">

        <h2 className="text-xl mb-6">Add Product</h2>

        <input name="name" placeholder="Product name" onChange={handleChange} className="input"/>
        <input name="category" placeholder="Category" onChange={handleChange} className="input"/>
        <input name="price" placeholder="Price" onChange={handleChange} className="input"/>
        <input name="stock" placeholder="Stock" onChange={handleChange} className="input"/>

        <textarea name="description" placeholder="Description" onChange={handleChange} className="input"/>

        <div className="flex gap-3 mt-4">
          <button onClick={handleSubmit} className="btn-green">Save</button>
          <button onClick={onClose} className="btn-gray">Cancel</button>
        </div>

      </div>
    </div>
  )
}