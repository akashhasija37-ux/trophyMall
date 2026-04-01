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
} from "lucide-react";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // FETCH DATA
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customers");
      const data = await res.json();

      setCustomers(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const badge: any = {
    Active: "bg-green-500/20 text-green-400",
    Inactive: "bg-red-500/20 text-red-400",
  };

  // ✅ STATS
  const totalCustomers = customers.length;
  const activeCustomers = customers.length;
  const totalOrders = customers.reduce(
    (sum, c) => sum + (c.orders || 0),
    0
  );
  const totalRevenue = customers.reduce(
    (sum, c) => sum + (parseFloat(c.spent || 0) || 0),
    0
  );

  return (
    <div className="flex min-h-screen bg-black">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
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
              {/* IMPORT */}
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm "
              >
                ⬆ Import Excel
              </button>

              {/* ADD */}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Add Customer
              </button>

              {/* EXPORT */}
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm">
                ⬇ Export Data
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard title="Total Customers" value={totalCustomers} />

            <StatCard
              title="Active Customers"
              value={activeCustomers}
              color="text-green-400"
            />

            <StatCard title="Total Orders" value={totalOrders} />

            <StatCard
              title="Total Revenue"
              value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
            />
          </div>

          {/* SEARCH */}
          <div className="flex gap-4">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 w-full">
              <Search size={18} className="text-gray-400" />
              <input
                placeholder="Search customers by name, email, or company..."
                className="bg-transparent outline-none text-white ml-3 w-full"
              />
            </div>

            <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="text-gray-400 text-sm bg-zinc-900">
                <tr>
                  <th className="text-left p-4">Customer ID</th>
                  <th className="text-left">Customer Name</th>
                  <th className="text-left">Contact Details</th>
                  <th className="text-left">Order History</th>
                  <th className="text-left">Total Spent</th>
                  <th className="text-left">Last Order</th>
                  <th className="text-left">Status</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((c: any, i: number) => (
                    <tr
                      key={i}
                      className="border-t border-zinc-800 hover:bg-zinc-800/40"
                    >
                      <td className="p-4 text-blue-400 font-medium">
                        CUST-{c.id}
                      </td>

                      <td>
                        <p className="text-white">{c.name}</p>
                        <p className="text-gray-400 text-sm">
                          {c.company || "-"}
                        </p>
                      </td>

                      <td>
                        <p className="text-white">{c.email}</p>
                        <p className="text-gray-400 text-sm">{c.phone}</p>
                      </td>

                      <td className="text-white">
                        {c.orders || 0} orders
                      </td>

                      <td className="text-white font-medium">
                        ₹{c.spent || 0}
                      </td>

                      <td className="text-gray-300">
                        {c.last_order || "-"}
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded text-xs ${
                            badge[c.status || "Active"]
                          }`}
                        >
                          {c.status || "Active"}
                        </span>
                      </td>

                      <td className="flex justify-end gap-3 p-4 text-gray-400">
                        <Eye size={18} className="cursor-pointer hover:text-white" />
                        <Pencil size={18} className="cursor-pointer hover:text-white" />
                        <MoreVertical size={18} className="cursor-pointer hover:text-white" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ MODALS */}

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCustomers}
        />
      )}

      {showImportModal && (
        <ImportCustomersModal
          onClose={() => setShowImportModal(false)}
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, color = "" }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold text-white mt-1 ${color}`}>
        {value}
      </h2>
    </div>
  );
}