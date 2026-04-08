"use client";

import { useState, useEffect } from "react";
import StatusBadge from "./components/Statusbadge";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddWebsiteOrderModal from "../../components/AddWebsiteOrderModal";
import dayjs from "dayjs";
import { ShoppingCart, Clock, Truck, IndianRupee } from "lucide-react";

type Order = {
  id: number;
  order_id: string;
  customer_name: string;
  contact_details: string;
  product_name: string;
  quantity: number;
  price: number;
  payment_status: string;
  order_status: string;
  order_date: string;
  notes?: string;
};

export default function OrdersPage() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const itemsPerPage = 5;

  // 🔥 Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FILTER + SEARCH
  const processedOrders = orders.filter((o) => {
    const searchMatch =
      o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.contact_details?.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" || o.order_status === statusFilter;

    let dateMatch = true;

    if (dateFilter === "7") {
      dateMatch = dayjs(o.order_date).isAfter(dayjs().subtract(7, "day"));
    } else if (dateFilter === "30") {
      dateMatch = dayjs(o.order_date).isAfter(dayjs().subtract(30, "day"));
    }

    return searchMatch && statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);

  const paginatedOrders = processedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-8 space-y-8">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Website Orders</h1>
              <p className="text-gray-400 text-sm">
                Track and manage all online orders
              </p>
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium text-white"
              onClick={() => setOpen(true)}
            >
              + New Order
            </button>

            <AddWebsiteOrderModal
              open={open}
              setOpen={setOpen}
              refresh={fetchOrders}
            />
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6">
            <Card
              title="Total Orders"
              value={orders.length}
              color="text-green-500"
              icon={<ShoppingCart />}
            />

            <Card
              title="Processing"
              value={
                orders.filter((o) => o.order_status === "Processing").length
              }
              color="text-yellow-500"
              icon={<Clock />}
            />

            <Card
              title="Shipped"
              value={orders.filter((o) => o.order_status === "Shipped").length}
              color="text-blue-500"
              icon={<Truck />}
            />

            <Card
              title="Revenue"
              value={`₹${orders.reduce(
                (sum, o) => sum + o.price * o.quantity,
                0,
              )}`}
              color="text-green-400"
              icon={<IndianRupee />}
            />
          </div>

          {/* FILTER BAR */}
          <div className="flex justify-between items-center">
            <input
              placeholder="Search order, customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-900 px-4 py-2 rounded-lg w-80 border border-zinc-700 text-white"
            />

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-white"
              >
                <option value="All">All Status</option>
                <option>Processing</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-white"
              >
                <option value="All">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="text-gray-400 text-sm">
                <tr className="text-left">
                  <th className="p-4">Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th className="text-center w-24">Qty</th>
                  <th className="pl-8">Amount</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th className="text-right pr-6">Date</th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/60 transition"
                  >
                    <td
                      className="p-4 font-semibold text-blue-400 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {order.order_id}
                    </td>

                    <td className="text-white">{order.customer_name}</td>
                    <td className="text-white">{order.product_name}</td>

                    <td className="text-center text-white">{order.quantity}</td>

                    <td className="pl-8 font-medium text-white">
                      ₹{order.price * order.quantity}
                    </td>

                    <td>
                      <StatusBadge status={order.order_status} />
                    </td>

                    <td className="text-white">{order.contact_details}</td>

                    <td className="text-right pr-6 text-white">
                      {dayjs(order.order_date).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-green-600" : "bg-zinc-800"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>

          {/* VIEW MODAL */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-[500px] relative">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-3 right-3 text-white"
                >
                  ✕
                </button>

                <h2 className="text-lg font-semibold mb-4 text-white">Order Details</h2>

                <Info label="Order ID" value={selectedOrder.order_id} />
                <Info label="Customer" value={selectedOrder.customer_name} />
                <Info label="Product" value={selectedOrder.product_name} />
                <Info label="Qty" value={selectedOrder.quantity} />
                <Info
                  label="Amount"
                  value={`₹${selectedOrder.price * selectedOrder.quantity}`}
                />
                <Info label="Status" value={selectedOrder.order_status} />
                <Info label="Payment" value={selectedOrder.payment_status} />
                <Info label="Contact" value={selectedOrder.contact_details} />
                <Info
                  label="Date"
                  value={dayjs(selectedOrder.order_date).format("DD MMM YYYY")}
                />
                <Info label="Notes" value={selectedOrder.notes} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function Card({ title, value, color = "text-white", icon }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>

        <h2 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h2>
      </div>

      {/* KEEP ICON SUPPORT */}
      {icon && <div className="text-gray-500">{icon}</div>}
    </div>
  );
}

const Info = ({ label, value }: any) => (
  <div className="mb-2">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white">{value || "-"}</p>
  </div>
);
