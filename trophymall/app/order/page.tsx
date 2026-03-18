"use client";
import { useState, useEffect } from "react";
import StatusBadge from "./components/Statusbadge";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddWebsiteOrderModal from "../components/AddWebsiteOrderModal";

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

  // 🔥 Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <div className="p-8 space-y-8">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Website Orders
              </h1>
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

            {/* ✅ Modal with refresh */}
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
              color="text-red-500"
            />

            <Card
              title="Processing"
              value={
                orders.filter((o) => o.order_status === "Processing").length
              }
              color="text-blue-500"
            />

            <Card
              title="Shipped"
              value={
                orders.filter((o) => o.order_status === "Shipped").length
              }
              color="text-purple-500"
            />

            <Card
              title="Revenue"
              value={`₹${orders.reduce(
                (sum, o) => sum + o.price * o.quantity,
                0
              )}`}
              color="text-green-500"
            />
          </div>

          {/* FILTER BAR */}
          <div className="flex justify-between items-center">
            <input
              placeholder="Search order, customer..."
              className="bg-zinc-900 px-4 py-2 rounded-lg w-80 border border-zinc-700 text-white"
            />

            <div className="flex gap-3">
              <select className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-white">
                <option>All Status</option>
                <option>Processing</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Shipped</option>
              </select>

              <select className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-white">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/60 transition"
                  >
                    <td className="p-4 font-semibold text-blue-400">
                      {order.order_id}
                    </td>

                    <td className="text-white">
                      {order.customer_name}
                    </td>

                    <td className="text-white">
                      {order.product_name}
                    </td>

                    <td className="text-center text-white">
                      {order.quantity}
                    </td>

                    <td className="pl-8 font-medium text-white">
                      ₹{order.price * order.quantity}
                    </td>

                    <td>
                      <StatusBadge status={order.order_status} />
                    </td>

                    <td className="text-white">
                      {order.contact_details}
                    </td>

                    <td className="text-right pr-6 text-white">
                        {order.order_date}
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

function Card({ title, value, color = "" }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}