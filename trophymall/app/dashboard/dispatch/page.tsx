"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import DispatchStats from "./components/DispatchStats";
import DispatchTable from "./components/DispatchTable";
import CreateDispatchModal from "../../components/CreateDispatchModal";
import { Plus, Filter } from "lucide-react";

export default function DispatchPage() {

  const [openDispatch, setOpenDispatch] = useState(false);

  // 🔥 STATE
  const [dispatchList, setDispatchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  const fetchDispatch = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/dispatch");
      const data = await res.json();

      setDispatchList(data);

    } catch (err) {
      console.error("Dispatch API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchDispatch();
  }, []);

  // 🔥 FORMAT DATA (DB → UI)
  const formattedData = dispatchList.map((item) => ({
    dispatchId: item.dispatch_id,
    orderId: item.order_id,
    customer: item.customer_name,
    items: "-", // keep (future feature)
    destination: "-", // keep (future feature)
    courier: item.courier_partner,
    tracking: item.tracking_number,
    status: item.delivery_status,
    delivery: item.dispatch_date
      ? new Date(item.dispatch_date).toLocaleDateString()
      : "-",
  }));

  return (
    <div className="flex min-h-screen bg-black">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE */}
        <div className="p-8 space-y-8">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold text-white">
                Dispatch Tracking
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor and manage all dispatch activities
              </p>
            </div>

            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
              onClick={() => setOpenDispatch(true)}
            >
              <Plus size={18} />
              Create Dispatch
            </button>

            {/* MODAL */}
            <CreateDispatchModal
              open={openDispatch}
              setOpen={setOpenDispatch}
              refresh={fetchDispatch} // 🔥 auto refresh after create
            />

          </div>

          {/* STATS */}
          <DispatchStats />

          {/* FILTER BAR */}
          <div className="flex gap-4">

            <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <Filter size={16} />
              Filters
            </button>

            <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <option>All Status</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Pending</option>
            </select>

            <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <option>All Branches</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
            </select>

            <input
              type="date"
              className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
            />

          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-gray-400">Loading dispatch data...</div>
          ) : (
            <DispatchTable
              data={formattedData}
            />
          )}

          {/* EMPTY STATE */}
          {!loading && formattedData.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No dispatch records found 🚚
            </div>
          )}

        </div>
      </div>
    </div>
  );
}