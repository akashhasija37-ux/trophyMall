"use client"

import { useEffect, useState } from "react"
import AddProductModal from "../../components/AddProductModal"
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
export default function ProductsPage() {

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  return (
   

    <div className="flex min-h-screen bg-black">

  <Sidebar />

  <div className="flex-1 flex flex-col">

    <Topbar />

    <div className="p-8">
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">

        <table className="w-full text-left">

          <thead className="bg-zinc-800 text-gray-300 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800 transition"
                >
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 text-green-400">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      p.stock > 10
                        ? "bg-green-900 text-green-400"
                        : "bg-red-900 text-red-400"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>

  </div>

</div>
  )
}