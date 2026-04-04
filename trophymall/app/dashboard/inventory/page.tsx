"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddStockItemModal from "@/app/components/AddStockItemModal";
import EditStockModal from "@/app/components/EditStockModal";
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
} from "lucide-react";

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
};

export default function InventoryPage() {
  const [openStock, setOpenStock] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [openEditStock, setOpenEditStock] = useState(false);
  // 🔥 NEW STATES
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 🔥 FETCH
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🔥 SMART STATUS
  const getStockStatus = (qty: number) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= 5) return "Low Stock";
    return "In Stock";
  };

  // 🔥 FILTER LOGIC
  const filteredInventory = inventory.filter((item) => {
    const status = getStockStatus(item.quantity);

    if (filter === "low" && status !== "Low Stock") return false;
    if (filter === "out" && status !== "Out of Stock") return false;

    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;

    return true;
  });

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
              <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
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
                item={selectedItem} // 🔥 pass for edit
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
          <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-600/30 p-5 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">
                  {inventory.filter((i) => i.quantity <= 5).length} items are
                  running low or critical
                </p>
                <p className="text-yellow-300/80 text-sm">
                  Review inventory levels and place reorder requests
                </p>
              </div>
            </div>

            <button
              onClick={() => setFilter("low")}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
            >
              Review Items
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              value={inventory.length}
              note="Across all categories"
              icon={<Package className="text-blue-400" />}
              onClick={() => setFilter("all")}
            />

            <StatCard
              title="Low Stock Items"
              value={
                inventory.filter((i) => i.quantity <= 5 && i.quantity > 0)
                  .length
              }
              note="Requires attention"
              icon={<TrendingDown className="text-yellow-400" />}
              onClick={() => setFilter("low")}
            />

            <StatCard
              title="Raw Materials"
              value={
                inventory.filter((i) => i.category === "Raw Material").length
              }
              note="Available materials"
              icon={<Warehouse className="text-purple-400" />}
              onClick={() => setCategoryFilter("Raw Material")}
            />

            <StatCard
              title="Out of Stock"
              value={inventory.filter((i) => i.quantity === 0).length}
              note="Needs restock"
              icon={<Archive className="text-red-400" />}
              onClick={() => setFilter("out")}
            />
          </div>

          {/* FILTERS */}
          <div className="flex justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-4 py-2 rounded-lg ${
                  categoryFilter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                All Items
              </button>

              <button
                onClick={() => setCategoryFilter("Finished Goods")}
                className={`px-4 py-2 rounded-lg ${
                  categoryFilter === "Finished Goods"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                Finished Goods
              </button>

              <button
                onClick={() => setCategoryFilter("Raw Material")}
                className={`px-4 py-2 rounded-lg ${
                  categoryFilter === "Raw Material"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-300"
                }`}
              >
                Raw Materials
              </button>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
                <History size={16} />
                Movement History
              </button>

              <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <table className="w-full">
              <thead className="text-gray-400 text-sm">
                <tr>
                  <th className="text-left pb-3">SKU Code</th>
                  <th className="text-left">Product Name</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Current Stock</th>
                  <th className="text-left">Supplier</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInventory.map((item, i) => {
                  const status = getStockStatus(item.quantity);

                  return (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="py-4 text-blue-400">{item.sku}</td>
                      <td className="text-white">{item.name}</td>
                      <td className="text-gray-300">{item.category}</td>
                      <td className="text-white font-semibold">
                        {item.quantity}
                      </td>

                      <td className="text-gray-300">{item.supplier || "-"}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded text-xs ${
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

                      <td className="flex justify-end gap-3 text-gray-400">
                        <Eye
                          size={18}
                          className="cursor-pointer hover:text-white"
                          onClick={() => alert(`Viewing ${item.name}`)}
                        />

                        <Pencil
                          size={18}
                          className="cursor-pointer hover:text-green-400"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenEditStock(true);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, note, icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-4 cursor-pointer hover:border-green-500"
    >
      <div className="bg-zinc-800 p-3 rounded-lg">{icon}</div>

      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-white">{value}</h2>
        <p className="text-gray-400 text-sm">{note}</p>
      </div>
    </div>
  );
}
