"use client";

import { useState, useEffect, useRef } from "react";
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
  Trash2,
  Barcode,
  Printer,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

type InventoryItem = {
  id: number;
  name: string;
  tm_code?: string;
  sku: string;
  category: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  supplier: string;
  stock_status: string;
  notes?: string;
  product_size?: string;
  product_height_inches?: string | number;

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

  // Barcode / QR Modal State
  const [barcodeItem, setBarcodeItem] = useState<InventoryItem | null>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

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

    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchText) ||
      (item.tm_code || "").toLowerCase().includes(searchText) ||
      (item.sku || "").toLowerCase().includes(searchText) ||
      (item.category || "").toLowerCase().includes(searchText) ||
      (item.supplier || "").toLowerCase().includes(searchText);

    if (!matchesSearch) return false;

    if (filter === "low" && status !== "Low Stock") return false;
    if (filter === "out" && status !== "Out of Stock") return false;

    if (
      categoryFilter !== "all" &&
      (item.category || "").toLowerCase() !== categoryFilter.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?",
    );
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
        fetchInventory();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ PRINT BARCODE / QR LABEL
  const handlePrintBarcode = () => {
    const printContent = barcodeRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "", "width=600,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Label - TrophyMall</title>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; }
              .label-card { border: 2px dashed #333; padding: 20px; text-align: center; width: 320px; border-radius: 12px; background: #fff; }
              .logo { font-size: 16px; font-weight: 900; letter-spacing: 2px; margin-bottom: 2px; }
              .tagline { font-size: 9px; font-weight: bold; color: #16a34a; margin-bottom: 8px; }
              .prod-img { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; margin: 0 auto 8px auto; border: 1px solid #ddd; }
              .prod-name { font-size: 13px; font-weight: bold; margin-bottom: 4px; }
              .meta { font-size: 11px; color: #555; margin-bottom: 8px; }
              .barcode-img { width: 100%; height: 50px; object-fit: contain; margin-bottom: 4px; }
              .tm-code { font-family: monospace; font-size: 12px; font-weight: bold; }
              .price { font-size: 15px; font-weight: 900; color: #000; margin-top: 4px; }
            </style>
          </head>
          <body>
            <div class="label-card">${printContent}</div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const exportData = () => {
    const headers = [
      "featured_image",
      "TM_Code",
      "Name",
      "Category",
      "Quantity",
      "Supplier",
      "Status",
    ];

    const rows = filteredInventory.map((i) => [
      i.featured_image,
      i.tm_code || i.sku,
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
                    sku: selectedItem.sku,
                    quantity: selectedItem.quantity,
                    selling_price: selectedItem.selling_price,
                    discount: selectedItem.discount,
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
                  placeholder="Search by TM Code, Name..."
                  className="bg-transparent outline-none text-white text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded text-xs ${
                  filter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("low")}
                className={`px-3 py-1 rounded text-xs ${
                  filter === "low"
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                Low
              </button>

              <button
                onClick={() => setFilter("out")}
                className={`px-3 py-1 rounded text-xs ${
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
                className="px-3 py-1 bg-zinc-800 rounded text-xs text-white"
              >
                All
              </button>
              <button
                onClick={() => setCategoryFilter("Finished Goods")}
                className="px-3 py-1 bg-zinc-800 rounded text-xs text-white"
              >
                Finished
              </button>
              <button
                onClick={() => setCategoryFilter("Raw Material")}
                className="px-3 py-1 bg-zinc-800 rounded text-xs text-white"
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
                  <th className="text-left py-3 w-[90px]">Image</th>
                  <th className="text-left py-3 w-[120px]">TM Code</th>
                  <th className="text-left w-[180px]">Name</th>
                  <th className="text-left w-[130px]">Category</th>
                  <th className="text-center w-[80px]">Height</th>
                  <th className="text-center w-[80px]">Stock</th>
                  <th className="text-left w-[140px]">Supplier</th>
                  <th className="text-center w-[100px]">Status</th>
                  <th className="text-right w-[140px]">Actions</th>
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
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </td>
                      <td className="py-3 text-blue-400 text-xs font-mono">
                        {item.tm_code || item.sku || `TM-${item.id}`}
                      </td>

                      <td className="text-white truncate text-sm">{item.name}</td>

                      <td className="text-gray-300 text-xs">{item.category}</td>

                      <td className="text-center text-gray-300 text-xs">
                        {item.product_height_inches ? `${item.product_height_inches}"` : "-"}
                      </td>

                      <td className="text-center text-white font-medium text-xs">
                        {item.quantity}
                      </td>

                      <td className="text-gray-300 text-xs truncate">{item.supplier || "-"}</td>

                      <td className="text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] ${
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
                        <div className="flex justify-end gap-2.5 items-center">
                          {/* 🏷 BARCODE / QR SCANNER LABEL BUTTON */}
                          <Barcode
                            size={18}
                            className="text-amber-400 hover:text-amber-300 cursor-pointer"
                            //title="Generate Scanner Label"
                            onClick={() => setBarcodeItem(item)}
                          />

                          <Pencil
                            size={16}
                            className="text-green-400 hover:text-green-300 cursor-pointer"
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenEditStock(true);
                            }}
                          />

                          <Trash2
                            size={16}
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
                  className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-40 text-xs"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded text-xs ${
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
                  className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-40 text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* 🏷 BARCODE SCANNER LABEL & DETAILS PREVIEW MODAL */}
          {barcodeItem && (
            <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-[400px] relative shadow-2xl">
                <button
                  onClick={() => setBarcodeItem(null)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>

                <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Barcode className="text-green-500" size={20} /> Scanner Label & Details Preview
                </h3>

                {/* Printable Label Card matching exact specs (No category, height in inches, product image, TM Code for scanner) */}
                <div
                  ref={barcodeRef}
                  className="bg-white text-black p-4 rounded-xl border-2 border-dashed border-zinc-400 text-center flex flex-col items-center shadow-inner"
                >
                  <h4 className="font-black text-sm tracking-widest uppercase m-0">TROPHY MALL</h4>
                  <p className="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-2">CRAFTED FOR LEGENDS</p>
                  
                  {/* Product Image */}
                  {barcodeItem.featured_image ? (
                    <img
                      src={`/uploads/${barcodeItem.featured_image}`}
                      alt={barcodeItem.name}
                      className="w-16 h-16 object-cover rounded-lg mb-2 border border-zinc-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}

                  <p className="font-bold text-xs text-zinc-900 mb-1 line-clamp-1">{barcodeItem.name}</p>
                  
                  <p className="text-[10px] text-zinc-600 mb-2">
                    Height: <span className="font-semibold">{barcodeItem.product_height_inches ? `${barcodeItem.product_height_inches} inches` : "Standard"}</span>
                  </p>

                  {/* Barcode Graphic generated from TM Code for scanner */}
                  <div className="w-full bg-white py-1 flex flex-col items-center my-1">
                    <img
                      src={`https://barcodeapi.org/api/128/${barcodeItem.tm_code || barcodeItem.sku || `TM-${barcodeItem.id}`}`}
                      alt="Scanner Barcode"
                      className="w-full h-12 object-contain"
                    />
                    <span className="font-mono font-bold text-xs tracking-widest mt-1 text-black">
                      {barcodeItem.tm_code || barcodeItem.sku || `TM-${barcodeItem.id}`}
                    </span>
                  </div>

                  <p className="font-extrabold text-sm text-zinc-900 mt-2">
                    MRP: ₹{barcodeItem.selling_price || 0}
                  </p>
                </div>

                {/* Scan Simulator / Details Inspection */}
                <div className="bg-[#18181c] p-3 rounded-xl border border-zinc-800 mt-4 text-xs space-y-1">
                  <p className="text-zinc-400 font-semibold mb-1">🔍 Scanner Inspection Preview:</p>
                  <p className="text-zinc-300">Name: <span className="text-white font-medium">{barcodeItem.name}</span></p>
                  <p className="text-zinc-300">TM Code: <span className="text-blue-400 font-mono font-bold">{barcodeItem.tm_code || barcodeItem.sku}</span></p>
                  <p className="text-zinc-300">Height: <span className="text-white font-medium">{barcodeItem.product_height_inches || "-"} inches</span></p>
                  <p className="text-zinc-300">Price: <span className="text-green-400 font-bold">₹{barcodeItem.selling_price}</span></p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handlePrintBarcode}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Printer size={15} /> Print / Download Label
                  </button>
                  <button
                    onClick={() => setBarcodeItem(null)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}