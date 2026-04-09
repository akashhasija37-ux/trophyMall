"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import AddCustomerModal from "@/app/components/AddCustomerModal";
import ImportCustomersModal from "@/app/components/ImportCustomer";

import {
  Search,
  Filter,
  Eye,
  Pencil,
  MoreVertical,
  Users,
  ShoppingCart,
  IndianRupee,
  UserCheck,
} from "lucide-react";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [viewCustomer, setViewCustomer] = useState<any>(null);
  const [editCustomer, setEditCustomer] = useState<any>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      setCustomers([]);
      setLoading(false);
    }
  };

  // ✅ SEARCH FILTER (FIXED)
  const filteredCustomers = customers.filter((c) => {
    return (
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const badge: any = {
    Active: "bg-green-500/20 text-green-400",
    Inactive: "bg-red-500/20 text-red-400",
  };

  // ✅ STATS
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (c) => (c.status || "Active") === "Active"
  ).length;

  const totalOrders = customers.reduce(
    (sum, c) => sum + Number(c.orders || 0),
    0
  );

  const totalRevenue = customers.reduce(
    (sum, c) => sum + Number(c.spent || 0),
    0
  );

  // ✅ EXPORT (FIXED)
  const exportData = () => {
    const csv = [
      ["Name", "Email", "Phone", "Orders", "Spent"],
      ...filteredCustomers.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.orders || 0,
        c.spent || 0,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  // ✅ DATE FORMAT
  const formatDate = (date: any) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
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
                Customer Database
              </h1>
              <p className="text-gray-400 text-sm">
                View and manage customer information
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => setShowImportModal(true)}
                className="bg-green-600 px-4 py-2 rounded-lg text-sm"
              >
                ⬆ Import Excel
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 px-4 py-2 rounded-lg text-sm"
              >
                + Add Customer
              </button>

              <button
                onClick={exportData}
                className="bg-green-600 px-4 py-2 rounded-lg text-sm"
              >
                ⬇ Export Data
              </button>

            </div>
          </div>

          {/* STATS WITH ICONS */}
          <div className="grid grid-cols-4 gap-6">

            <StatCard icon={<Users />} title="Total Customers" value={totalCustomers} />

            <StatCard icon={<UserCheck />} title="Active Customers" value={activeCustomers} color="text-green-400" />

            <StatCard icon={<ShoppingCart />} title="Total Orders" value={totalOrders} />

            <StatCard icon={<IndianRupee />} title="Total Revenue" value={`₹${totalRevenue}`} color="text-green-400" />

          </div>

          {/* SEARCH */}
          <div className="flex gap-4">

            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 w-full">
              <Search size={18} className="text-gray-400" />
              <input
                placeholder="Search customers..."
                className="bg-transparent outline-none text-white ml-3 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <Filter size={16} />
              Filters
            </button>

          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full table-fixed">

              <thead className="text-gray-400 text-sm border-b border-zinc-800">
                <tr>
                  <th className="text-left p-4 w-[140px]">Customer ID</th>
                  <th className="text-left w-[220px]">Customer</th>
                  <th className="text-left w-[220px]">Contact</th>
                  <th className="text-center w-[120px]">Orders</th>
                  <th className="text-center w-[140px]">Spent</th>
                  <th className="text-center w-[160px]">Last Order</th>
                  <th className="text-center w-[120px]">Status</th>
                  <th className="text-right pr-6 w-[120px]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c: any, i: number) => (
                    <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800/40">

                      <td className="p-4 text-blue-400 font-medium">
                        CUST-{c.id}
                      </td>

                      <td>
                        <p className="text-white">{c.name}</p>
                        <p className="text-gray-400 text-sm">{c.company || "-"}</p>
                      </td>

                      <td>
                        <p className="text-white">{c.email}</p>
                        <p className="text-gray-400 text-sm">{c.phone}</p>
                      </td>

                      <td className="text-center text-white">
                        {c.orders || 0}
                      </td>

                      <td className="text-center text-green-400">
                        ₹{c.spent || 0}
                      </td>

                      <td className="text-center text-gray-300">
                        {formatDate(c.last_order)}
                      </td>

                      <td className="text-center">
                        <span className={`px-3 py-1 rounded text-xs ${badge[c.status || "Active"]}`}>
                          {c.status || "Active"}
                        </span>
                      </td>

                      <td>
                        <div className="flex justify-end gap-3 pr-4 text-gray-400">

                          <Eye
                            size={18}
                            className="cursor-pointer hover:text-white"
                            onClick={() => setViewCustomer(c)}
                          />

                          <Pencil
                            size={18}
                            className="cursor-pointer hover:text-white"
                            onClick={() => setEditCustomer(c)}
                          />

                          <MoreVertical size={18} className="cursor-pointer hover:text-white" />

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-[400px]">
            <h2 className="text-white text-lg mb-4">{viewCustomer.name}</h2>

            <p className="text-gray-400">Email: {viewCustomer.email}</p>
            <p className="text-gray-400">Phone: {viewCustomer.phone}</p>
            <p className="text-gray-400">Orders: {viewCustomer.orders}</p>
            <p className="text-gray-400">Spent: ₹{viewCustomer.spent}</p>

            <button
              onClick={() => setViewCustomer(null)}
              className="mt-4 bg-zinc-700 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT */}
      {editCustomer && (
        <AddCustomerModal
          editData={editCustomer}
          onClose={() => setEditCustomer(null)}
          onSuccess={fetchCustomers}
        />
      )}

      {/* ADD */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCustomers}
        />
      )}

      {/* IMPORT */}
      {showImportModal && (
        <ImportCustomersModal
          onClose={() => setShowImportModal(false)}
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color = "" }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-4">
      <div className={`${color || "text-blue-400"}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-white text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );
}