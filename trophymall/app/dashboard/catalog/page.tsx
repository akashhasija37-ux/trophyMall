"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // ✅ PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  // ✅ UNIQUE CATEGORIES
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category || "Others")),
  ];

  // ✅ FILTER
  const filtered = products.filter((p) => {
    const matchCategory = category === "All" || p.category === category;

    const matchSearch = (p.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ✅ PAGINATION LOGIC
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-8 space-y-6">
          {/* HEADER */}
          <h1 className="text-3xl font-bold text-white">Product Catalog</h1>

          {/* SEARCH */}
          <input
            placeholder="Search products..."
            className="bg-zinc-900 text-white px-4 py-2 rounded w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {/* CATEGORY */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded ${
                  category === cat
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-4 gap-6">
            {paginated.map((item, i) => {
              // ✅ FIXED PRICE LOGIC
              const price = Number(item.selling_price || 0);
              const discount = Number(item.discount || 0);

              const discountPrice =
                discount > 0 ? price - (price * discount) / 100 : price;

              return (
                <div
                  key={i}
                  onClick={() => setSelectedProduct(item)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:scale-105 transition"
                >
                  {/* IMAGE */}
                  <div className="relative">
                    <img
                      src={`/uploads/${item.featured_image}`}
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/no-image.png";
                      }}
                    />

                    {/* BADGE */}
                    {item.badge && (
                      <span className="absolute top-2 left-2 bg-green-600 text-xs px-2 py-1 rounded">
                        {item.badge}
                      </span>
                    )}

                    {/* DISCOUNT */}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="mt-3">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {item.name}
                    </h3>

                    <p className="text-gray-400 text-xs">{item.category}</p>

                    {/* PRICE */}
                    <div className="mt-1">
                      {discount > 0 && (
                        <span className="text-gray-400 line-through text-xs mr-2">
                          ₹{price}
                        </span>
                      )}

                      <span className="text-green-400 font-bold">
                        ₹{discountPrice.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-[700px]">
            <h2 className="text-white text-xl mb-4">{selectedProduct.name}</h2>

            {/* IMAGE */}
            <img
              src={`/uploads/${selectedProduct.featured_image}`}
              className="w-full h-60 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "/no-image.png";
              }}
            />

            {/* GALLERY */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {selectedProduct.gallery_images &&
                JSON.parse(selectedProduct.gallery_images || "[]").map(
                  (img: string, i: number) => (
                    <img
                      key={i}
                      src={`/uploads/${img}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ),
                )}
            </div>

            {/* DETAILS */}
            <div className="mt-4 text-gray-300 text-sm space-y-1">
              <p>Category: {selectedProduct.category}</p>
              <p>SKU: {selectedProduct.sku}</p>
              <p>Stock: {selectedProduct.quantity}</p>
              <p>Supplier: {selectedProduct.supplier}</p>
            </div>

            {/* PRICE */}
            {(() => {
              const price = Number(selectedProduct.selling_price || 0);
              const discount = Number(selectedProduct.discount || 0);

              const finalPrice =
                discount > 0 ? price - (price * discount) / 100 : price;

              return (
                <div className="mt-3 text-lg">
                  {discount > 0 && (
                    <span className="line-through text-gray-400 mr-2">
                      ₹{price}
                    </span>
                  )}

                  <span className="text-green-400 font-bold">
                    ₹{finalPrice.toFixed(0)}
                  </span>
                </div>
              );
            })()}

            {/* CLOSE */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 bg-zinc-700 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
