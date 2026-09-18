"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddStockItemModal from "@/app/components/AddStockItemModal";
import EditStockModal from "@/app/components/EditStockModal";
import Image from "next/image";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  AlertTriangle,
  Package,
  TrendingDown,
  Warehouse,
  Archive,
  Plus,
  Download,
  Upload,
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
  height?: string | number;
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
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

// ✅ MULTI-TAB CATEGORY-WISE INVENTORY UPLOAD PARSER
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Processing multi-tab product catalog...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        let importedCount = 0;
        let skippedCount = 0;

        // Loop through every tab (Category) in the workbook
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          
          if (rawRows.length === 0) continue;

          for (const row of rawRows) {
            const cleanRow: any = {};
            Object.keys(row).forEach(key => {
              cleanRow[key.trim()] = row[key];
            });

            // 1. Extract Fields with Flexible Lookups
            const tmCode = String(
              cleanRow["TM Code"] || 
              cleanRow["Reference Model No."] || 
              cleanRow["SKU"] || ""
            ).trim();

            const prodName = String(
              cleanRow["Product Name (Title)"] || 
              cleanRow["Product Name"] || 
              cleanRow["Name"] || 
              tmCode
            ).trim();

            // Use Sheet Name as Category if category column is blank
            const category = String(
              cleanRow["Category"] || 
              sheetName
            ).trim();

            const prodSize = String(
              cleanRow["Product Size"] || 
              cleanRow["Size"] || 
              cleanRow["Height"] || 
              cleanRow["Base Dimensions"] || ""
            ).trim();

            const prodImage = String(
              cleanRow["Product Image"] || 
              cleanRow["Image"] || 
              cleanRow["featured_image"] || ""
            ).trim();

            const parsedDiscount = Number(
              cleanRow["Discount"] || 
              cleanRow["Discount to be allowed"] || 
              cleanRow["discount"] || 0
            );
            const discountVal = isNaN(parsedDiscount) ? 0 : parsedDiscount;

            const parsedQty = Number(
              cleanRow["Available Quantity (Pc)"] || 
              cleanRow["Quantity"] || 10
            );
            const qtyVal = isNaN(parsedQty) ? 10 : parsedQty;

            let rawMrp = String(cleanRow["MRP"] || cleanRow["Selling Price"] || "0");
            let sellingPrice = Number(rawMrp.replace(/[^0-9.]/g, "")) || 0;
            if (isNaN(sellingPrice)) sellingPrice = 0;

            // Extract numeric height digits (e.g. "54 Inch" -> 54)
            const numericHeight = parseFloat(prodSize.replace(/[^0-9.]/g, "")) || 0;

            // 2. Strict Validation: Skip header rows, templates, or rows missing required fields
            if (
              !tmCode || 
              tmCode === "TM / L" || 
              tmCode.includes("GST Calculated") || 
              !prodName || 
              !category || 
              !prodSize || 
              sellingPrice <= 0
            ) {
              skippedCount++;
              continue;
            }

            const productPayload = {
              name: prodName,
              tm_code: tmCode,
              sku: String(cleanRow["SKU"] || tmCode).trim(),
              category: category,
              quantity: qtyVal,
              purchase_price: Math.round(sellingPrice * 0.6),
              selling_price: sellingPrice,
              supplier: String(cleanRow["Supplier"] || "Default Supplier").trim(),
              height: numericHeight,
              width: 0,
              weight: 0,
              image: prodImage === "nan" || !prodImage ? "" : prodImage,
              discount: discountVal,
              stock_status: qtyVal === 0 ? "Out of Stock" : qtyVal <= 5 ? "Low Stock" : "In Stock",
              notes: "",
            };

            const formBody = new URLSearchParams();
            Object.keys(productPayload).forEach((key) => {
              const val = (productPayload as any)[key];
              const safeVal = val === undefined || val === null || Number.isNaN(val) ? "" : String(val);
              formBody.append(key, safeVal);
            });

            const res = await fetch("/api/inventory", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: formBody.toString(),
            });

            if (res.ok) {
              importedCount++;
            } else {
              skippedCount++;
            }
          }
        }

        toast.success(`Imported ${importedCount} products across all tabs successfully! (Skipped ${skippedCount} placeholder rows)`, { id: toastId });
        fetchInventory();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to parse multi-tab catalog ❌", { id: toastId });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
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

  // ✅ FIXED PAGINATION WINDOW (Show 5 page numbers at a time)
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

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
                Track and manage inventory across all warehouses & bulk imports
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white text-sm transition"
              >
                <Upload size={16} /> Upload Excel
              </button>

              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white text-sm transition"
              >
                <Download size={18} />
                Export Data
              </button>

              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white text-sm transition"
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
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded">
                <Search size={16} />
                <input
                  placeholder="Search by TM Code, Name..."
                  className="bg-transparent outline-none text-white text-xs"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <button
                onClick={() => { setFilter("all"); setCurrentPage(1); }}
                className={`px-3 py-1 rounded text-xs ${
                  filter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                All
              </button>

              <button
                onClick={() => { setFilter("low"); setCurrentPage(1); }}
                className={`px-3 py-1 rounded text-xs ${
                  filter === "low"
                    ? "bg-yellow-500 text-black font-semibold"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                Low
              </button>

              <button
                onClick={() => { setFilter("out"); setCurrentPage(1); }}
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
                onClick={() => { setCategoryFilter("all"); setCurrentPage(1); }}
                className={`px-3 py-1 rounded text-xs ${categoryFilter === "all" ? "bg-zinc-700 text-white font-semibold" : "bg-zinc-800 text-gray-300"}`}
              >
                All
              </button>
              <button
                onClick={() => { setCategoryFilter("Finished Goods"); setCurrentPage(1); }}
                className={`px-3 py-1 rounded text-xs ${categoryFilter === "Finished Goods" ? "bg-zinc-700 text-white font-semibold" : "bg-zinc-800 text-gray-300"}`}
              >
                Finished
              </button>
              <button
                onClick={() => { setCategoryFilter("Raw Material"); setCurrentPage(1); }}
                className={`px-3 py-1 rounded text-xs ${categoryFilter === "Raw Material" ? "bg-zinc-700 text-white font-semibold" : "bg-zinc-800 text-gray-300"}`}
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
                {paginatedInventory.length > 0 ? (
                  paginatedInventory.map((item, i) => {
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
                          {item.height ? `${item.height}"` : "-"}
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
                            <Barcode
                              size={18}
                              className="text-amber-400 hover:text-amber-300 cursor-pointer"
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
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500 text-sm">
                      No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ FIXED PAGINATION (5 PAGES AT A TIME WINDOW) */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages || 1}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm disabled:opacity-40 transition"
                >
                  Prev
                </button>

                {startPage > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-3.5 py-1.5 rounded-md text-sm bg-zinc-800 hover:bg-zinc-700 text-gray-300 transition"
                    >
                      1
                    </button>
                    {startPage > 2 && <span className="text-gray-500 px-1">...</span>}
                  </>
                )}

                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3.5 py-1.5 rounded-md text-sm transition ${
                      currentPage === num
                        ? "bg-green-600 text-white font-semibold"
                        : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && <span className="text-gray-500 px-1">...</span>}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3.5 py-1.5 rounded-md text-sm bg-zinc-800 hover:bg-zinc-700 text-gray-300 transition"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* 🏷 BARCODE SCANNER LABEL & DETAILS PREVIEW MODAL */}
  {barcodeItem && (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
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

        {/* Printable Label Card with strict dimensions */}
        <div
          ref={barcodeRef}
          style={{ width: "280px", margin: "0 auto" }}
          className="bg-white text-black p-4 rounded-xl border-2 border-dashed border-zinc-400 text-center flex flex-col items-center shadow-inner"
        >
          <h4 style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "1.5px", margin: "0 0 2px 0" }}>TROPHY MALL</h4>
          <p style={{ fontSize: "8px", fontWeight: "bold", color: "#16a34a", textTransform: "uppercase", marginBottom: "8px" }}>CRAFTED FOR LEGENDS</p>
          
          {/* Constrained Product Image */}
          {barcodeItem.featured_image || barcodeItem.featured_image ? (
            <img
              src={`/uploads/${barcodeItem.featured_image || barcodeItem.featured_image}`}
              alt={barcodeItem.name}
              style={{ width: "55px", height: "55px", objectFit: "contain", borderRadius: "6px", marginBottom: "6px", border: "1px solid #eee" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}

          <p style={{ fontSize: "11px", fontWeight: "bold", color: "#111", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
            {barcodeItem.name}
          </p>
          
          <p style={{ fontSize: "9px", color: "#555", marginBottom: "6px" }}>
            Height: <span style={{ fontWeight: 600 }}>{barcodeItem.height || barcodeItem.height ? `${barcodeItem.height || barcodeItem.height} inches` : "Standard"}</span>
          </p>

          {/* Barcode Graphic */}
          <div style={{ width: "100%", background: "#fff", padding: "2px 0", display: "flex", flexDirection: "column", alignItems: "center", margin: "2px 0" }}>
            <img
              src={`https://barcodeapi.org/api/128/${barcodeItem.tm_code || barcodeItem.sku || `TM-${barcodeItem.id}`}`}
              alt="Scanner Barcode"
              style={{ width: "100%", height: "40px", objectFit: "contain" }}
            />
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", marginTop: "2px", color: "#000" }}>
              {barcodeItem.tm_code || barcodeItem.sku || `TM-${barcodeItem.id}`}
            </span>
          </div>

          <p style={{ fontSize: "13px", fontWeight: 900, color: "#000", marginTop: "6px" }}>
            MRP: ₹{barcodeItem.selling_price || 0}
          </p>
        </div>

        {/* Print Function with Clean Page Styles */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => {
              const printContent = barcodeRef.current?.innerHTML;
              if (!printContent) return;

              const printWindow = window.open("", "", "width=500,height=600");
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Print Label - TrophyMall</title>
                      <style>
                        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; }
                        .label-card { border: 2px dashed #333; padding: 16px; text-align: center; width: 260px; border-radius: 10px; background: #fff; }
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
            }}
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