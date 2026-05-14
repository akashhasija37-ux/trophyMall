"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddBranchModal from "@/app/components/AddBranchModal";
import { Building2, MapPin, Eye, Plus, Truck } from "lucide-react";

export default function BranchPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // 🔥 FETCH
  const fetchBranches = async () => {
    const res = await fetch("/api/branches");
    const data = await res.json();
    setBranches(data);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // 🔥 STATS
  const totalBranches = branches.length;
  const totalRevenue = branches.reduce((s, b) => s + Number(b.revenue || 0), 0);
  const totalOrders = branches.reduce(
    (s, b) => s + Number(b.total_orders || 0),
    0,
  );
  const totalStaff = branches.reduce(
    (s, b) => s + Number(b.staff_count || 0),
    0,
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-8 space-y-10">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Branch Management
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor and manage all branch operations
              </p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-green-600 px-5 py-2 rounded-lg text-white"
            >
              <Plus size={18} />
              Add New Branch
            </button>

            <AddBranchModal
              open={open}
              setOpen={setOpen}
              refresh={fetchBranches}
            />
          </div>

          {/* 🔥 STATS */}
          <div className="grid grid-cols-4 gap-6">
            <Stat title="Total Branches" value={totalBranches} />
            <Stat title="Total Revenue" value={`₹${totalRevenue}`} />
            <Stat title="Total Orders" value={totalOrders} />
            <Stat title="Total Staff" value={totalStaff} />
          </div>

          {/* 🔥 BRANCH CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {branches.map((b, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
              >
                <div className="flex justify-between">
                  <Building2 className="text-green-500" />
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs">
                    {b.status || "Active"}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-lg">{b.name}</h3>

                <div className="flex items-center text-gray-400 text-sm gap-1">
                  <MapPin size={14} />
                  {b.location}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-400">Manager</p>
                  <p className="text-white">{b.manager}</p>

                  <p className="text-gray-400">Orders</p>
                  <p className="text-white">{b.total_orders}</p>

                  <p className="text-gray-400">Revenue</p>
                  <p className="text-green-400">₹{b.revenue}</p>

                  <p className="text-gray-400">Staff</p>
                  <p className="text-white">{b.staff_count}</p>
                </div>

                {/* PERFORMANCE */}
                <div>
                  <p className="text-gray-400 text-sm">Performance</p>

                  <div className="bg-zinc-800 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${b.performance}%` }}
                    />
                  </div>

                  <p className="text-right text-white text-sm mt-1">
                    {b.performance}%
                  </p>
                </div>

                <button className="w-full flex justify-center items-center gap-2 bg-zinc-800 py-2 rounded-lg text-white">
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* KEEP YOUR CHARTS + STAFF (UNCHANGED BELOW) */}
        </div>
        <div className="grid grid-cols-1 gap-1 p-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white mb-4 font-semibold">All Branches</h3>

            <table className="w-full table-fixed">
              <thead className="text-gray-400 text-sm border-b border-zinc-800">
                <tr>
                  <th className="text-left">Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Staff</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {branches.map((b, i) => (
                  <tr key={i} className="border-b border-zinc-800">
                    <td className="text-white py-3">{b.name}</td>
                    <td className="text-gray-300">{b.location}</td>
                    <td className="text-gray-300 text-center">{b.manager}</td>
                    <td className="text-center text-white">{b.total_orders}</td>
                    <td className="text-green-400 text-center">₹{b.revenue}</td>
                    <td className="text-center text-white">{b.staff_count}</td>

                    <td className="text-center">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 STAT CARD
function Stat({ title, value }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-white">{value}</h2>
    </div>
  );
}
