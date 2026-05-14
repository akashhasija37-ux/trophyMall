"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import DispatchStats from "./components/DispatchStats";
import DispatchTable from "./components/DispatchTable";
import CreateDispatchModal from "../../components/CreateDispatchModal";
import { Plus, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function DispatchPage() {
  const [openDispatch, setOpenDispatch] = useState(false);

  const [dispatchList, setDispatchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // 📄 PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // 👁 VIEW MODAL
  const [selected, setSelected] = useState<any>(null);

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

  useEffect(() => {
    fetchDispatch();
  }, []);

  // 🔥 FORMAT DATA
  const formattedData = dispatchList.map((item) => ({
    dispatchId: item.dispatch_id,
    orderId: item.order_id,
    customer: item.customer_name,
    courier: item.courier_partner,
    tracking: item.tracking_number,
    status: item.delivery_status,
    delivery: item.dispatch_date,
    raw: item,
  }));

  // 🔍 FILTER LOGIC
  const filteredData = formattedData.filter((item) => {
    const matchSearch =
      item.customer?.toLowerCase().includes(search.toLowerCase()) ||
      item.orderId?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || item.status === statusFilter;

    const matchDate =
      !dateFilter ||
      new Date(item.delivery).toISOString().slice(0, 10) === dateFilter;

    return matchSearch && matchStatus && matchDate;
  });

  // 📄 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // 📦 SEND TRACKING TO CUSTOMER
  const sendTracking = async (item: any) => {
    try {
      await fetch("/api/dispatch/send-tracking", {
        method: "POST",
        body: JSON.stringify(item.raw),
      });

      //alert("Tracking sent to customer ✅");
      toast.success("Tracking sent to customer ✅");
    } catch (err) {
      toast.error("Failed to send tracking ❌");
    }
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

            <CreateDispatchModal
              open={openDispatch}
              setOpen={setOpenDispatch}
              refresh={fetchDispatch}
            />
          </div>

          {/* STATS (PASS DATA) */}
          <DispatchStats data={dispatchList} />

          {/* FILTER BAR */}
          <div className="flex gap-4 flex-wrap">
            <input
              placeholder="Search order / customer..."
              className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Pending</option>
            </select>

            <input
              type="date"
              className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-gray-400">Loading dispatch data...</div>
          ) : (
            <DispatchTable
              data={paginatedData}
              onView={(item: any) => setSelected(item)}
              onSend={sendTracking}
            />
          )}

          {/* PAGINATION */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-zinc-800 text-gray-500"
                    : "bg-green-600 text-white"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-green-600 text-white"
                      : "bg-zinc-800 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-zinc-800 text-gray-500"
                    : "bg-green-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* VIEW MODAL */}
          {selected && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-zinc-900 p-6 rounded-xl w-[500px] border border-zinc-800">
                <h2 className="text-xl text-white mb-4">Dispatch Details</h2>

                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <b>Order ID:</b> {selected.orderId}
                  </p>
                  <p>
                    <b>Customer:</b> {selected.customer}
                  </p>
                  <p>
                    <b>Courier:</b> {selected.courier}
                  </p>
                  <p>
                    <b>Tracking:</b> {selected.tracking}
                  </p>
                  <p>
                    <b>Status:</b> {selected.status}
                  </p>
                  <p>
                    <b>Date:</b>{" "}
                    {new Date(selected.delivery).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setSelected(null)}
                    className="bg-zinc-700 px-4 py-2 rounded text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredData.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No dispatch records found 🚚
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
