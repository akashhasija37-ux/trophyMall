"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddStockItemModal from "@/app/components/AddStockItemModal";
import EditStockModal from "@/app/components/EditStockModal";
import Image from "next/image";
import {
  AlertTriangle,
  Package,
  TrendingDown,
  Warehouse,
  Archive,
  Plus,
  Download,
  Eye,
  Pencil,
  Filter,
  History,
  Search,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  supplier: string;
  stock_status: string;
  notes?: string;
  
  featured_image?: string;
  gallery_images?: string;
  discount?: number;
  badge?: string;
};

export default function InventoryPage() {
  const [openStock, setOpenStock] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [openEditStock, setOpenEditStock] = useState(false);

  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchInventory = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStockStatus = (qty: number) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= 5) return "Low Stock";
    return "In Stock";
  };

  // ✅ SEARCH + FILTER COMBINED
  const filteredInventory = (inventory || []).filter((item) => {
    const status = getStockStatus(item.quantity);

    const searchText = search.toLowerCase();

    // 🔍 SAFE SEARCH (no crash)
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchText) ||
      (item.sku || "").toLowerCase().includes(searchText) ||
      //(item.tm_code || "").toLowerCase().includes(searchText) ||
      (item.category || "").toLowerCase().includes(searchText) ||
      (item.supplier || "").toLowerCase().includes(searchText);

    if (!matchesSearch) return false;

    // 📦 STOCK FILTER
    if (filter === "low" && status !== "Low Stock") return false;
    if (filter === "out" && status !== "Out of Stock") return false;

    // 🏷 CATEGORY FILTER (case-safe)
    if (
      categoryFilter !== "all" &&
      (item.category || "").toLowerCase() !== categoryFilter.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const handleDelete = async (id: number) => {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    const res = await fetch("/api/inventory", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Deleted successfully");
      fetchInventory(); // refresh list
    } else {
      alert(data.error || "Delete failed");
    }

  } catch (err) {
    console.error(err);
    toast.error("Server error");
  }
};

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log(paginatedInventory);

  // ✅ EXPORT CSV
  const exportData = () => {
    const headers = [
      "featured_image",
      "SKU",
      "Name",
      "Category",
      "Quantity",
      "Supplier",
      "Status",
    ];

    const rows = filteredInventory.map((i) => [
      i.featured_image,
      i.sku,
      i.name,
      i.category,
      i.quantity,
      i.supplier,
      getStockStatus(i.quantity),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-8 space-y-8">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Stock & Inventory Management
              </h1>
              <p className="text-gray-400 text-sm">
                Track and manage inventory across all warehouses
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white"
              >
                <Download size={18} />
                Export Data
              </button>

              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
                onClick={() => setOpenStock(true)}
              >
                <Plus size={18} />
                Add Stock
              </button>

              <AddStockItemModal
                open={openStock}
                setOpen={setOpenStock}
                refresh={fetchInventory}
                item={selectedItem}
              />

              {openEditStock && selectedItem && (
                <EditStockModal
                  product={{
                    id: selectedItem.id,
                    name: selectedItem.name,
                    quantity: selectedItem.quantity,
                  }}
                  onClose={() => {
                    setOpenEditStock(false);
                    setSelectedItem(null);
                  }}
                  onSuccess={fetchInventory}
                />
              )}
            </div>
          </div>

          {/* WARNING */}
          {inventory.filter((i) => i.quantity <= 5).length > 0 && (
            <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-600/30 p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-400" />
                <p className="text-yellow-400">
                  {inventory.filter((i) => i.quantity <= 5).length} items
                  running low
                </p>
              </div>
            </div>
          )}

          {/* 🔍 SEARCH + FILTERS */}
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded">
                <Search size={16} />
                <input
                  placeholder="Search..."
                  className="bg-transparent outline-none text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded ${
                  filter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("low")}
                className={`px-3 py-1 rounded ${
                  filter === "low"
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                Low
              </button>

              <button
                onClick={() => setFilter("out")}
                className={`px-3 py-1 rounded ${
                  filter === "out"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                Out
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCategoryFilter("all")}
                className="px-3 py-1 bg-zinc-800 rounded text-white"
              >
                All
              </button>
              <button
                onClick={() => setCategoryFilter("Finished Goods")}
                className="px-3 py-1 bg-zinc-800 rounded text-white"
              >
                Finished
              </button>
              <button
                onClick={() => setCategoryFilter("Raw Material")}
                className="px-3 py-1 bg-zinc-800 rounded text-white"
              >
                Raw
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <table className="w-full table-fixed border-collapse">
              <thead className="text-gray-400 text-sm border-b border-zinc-800">
                <tr>
                  <th className="text-left py-3 w-[120px]">Image</th>
                  <th className="text-left py-3 w-[120px]">SKU</th>
                  <th className="text-left w-[220px]">Name</th>
                  <th className="text-left w-[160px]">Category</th>
                  <th className="text-center w-[100px]">Stock</th>
                  <th className="text-left w-[180px]">Supplier</th>
                  <th className="text-center w-[120px]">Status</th>
                  <th className="text-right w-[120px]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedInventory.map((item, i) => {
                  const status = getStockStatus(item.quantity);

                  return (
                    <tr
                      key={i}
                      className="border-b border-zinc-800 hover:bg-zinc-800/40"
                    >
                      <td className="py-3">
                        {item.featured_image ? (
                          <img
                            src={`/uploads/${item.featured_image}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="py-3 text-blue-400">{item.sku}</td>

                      <td className="text-white truncate">{item.name}</td>

                      <td className="text-gray-300">{item.category}</td>

                      <td className="text-center text-white font-medium">
                        {item.quantity}
                      </td>

                      <td className="text-gray-300">{item.supplier || "-"}</td>

                      <td className="text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            status === "In Stock"
                              ? "bg-green-500/20 text-green-400"
                              : status === "Low Stock"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-3">
                          <Pencil
                            size={18}
                            className="text-green-400 hover:text-green-300 cursor-pointer"
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenEditStock(true);
                            }}
                          />

                          <Trash2
                            size={18}
                            className="text-red-400 hover:text-red-300 cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-40"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-green-600 text-white"
                        : "bg-zinc-800 text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODAL */}
          {selectedItem && !openEditStock && (
            <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
              <div className="bg-zinc-900 p-6 rounded-xl">
                <h2 className="text-white text-lg mb-4">{selectedItem.name}</h2>
                <p className="text-gray-400">SKU: {selectedItem.sku}</p>
                <p className="text-gray-400">Stock: {selectedItem.quantity}</p>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-4 bg-zinc-700 px-4 py-2 rounded text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
