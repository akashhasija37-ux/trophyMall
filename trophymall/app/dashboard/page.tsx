"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import {
  Box,
  Truck,
  DollarSign,
  AlertTriangle,
  Printer,
  Users,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    orders: [],
    employees: [],
    inventory: [],
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [workflow, setWorkflow] = useState<any[]>([]);

  const statusColor: any = {
    Delivered: "text-green-400 bg-green-500/20",
    Processing: "text-blue-400 bg-blue-500/20",
    Pending: "text-yellow-400 bg-yellow-500/20",
    Cancelled: "text-red-400 bg-red-500/20",
    Shipped: "text-purple-400 bg-purple-500/20",
  };

  // 🔥 FETCH
  const fetchDashboard = async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();

    setData(json);

    generateRevenue(json.orders);
    generateDepartment(json.employees);
    generateWorkflow(json.orders);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔥 REVENUE
 const generateRevenue = (orders: any[]) => {
  const map: any = {};

  orders.forEach((o) => {
    // ✅ fallback to order_date if created_at missing
    const dateValue = o.created_at || o.order_date;

    if (!dateValue) return;

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return;

    const month = date.toLocaleString("default", {
      month: "short",
    });

    const amount = Number(o.price || 0);

    map[month] = (map[month] || 0) + amount;
  });

  const result = Object.keys(map).map((key) => ({
    month: key,
    revenue: map[key],
  }));

  setRevenueData(result);
};

  // 🔥 DEPARTMENT
  const generateDepartment = (employees: any[]) => {
    const map: any = {};

    employees.forEach((e) => {
      map[e.department] =
        (map[e.department] || 0) + (e.performance || 70);
    });

    setDepartmentData(
      Object.keys(map).map((key) => ({
        name: key,
        score: Math.round(map[key] / 5),
      }))
    );
  };

  // 🔥 WORKFLOW
  const generateWorkflow = (orders: any[]) => {
    const map: any = {};

    orders.forEach((o) => {
      const status = o.order_status || "Unknown";
      map[status] = (map[status] || 0) + 1;
    });

    const max = Math.max(...Object.values(map), 1);

    const colors = [
      "bg-green-600",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
    ];

    setWorkflow(
      Object.keys(map).map((key, i) => ({
        stage: key,
        value: map[key],
        width: (map[key] / max) * 100,
        color: colors[i % colors.length],
      }))
    );
  };

  // 🔥 KPIs
  const totalOrders = data.orders.length;

  const pendingDispatch = data.orders.filter(
    (o: any) => o.order_status === "Pending"
  ).length;

  const totalRevenue = data.orders.reduce(
    (sum: number, o: any) => sum + Number(o.price || 0),
    0
  );

  const lowStock = data.inventory.filter(
    (i: any) => i.quantity <= 5
  ).length;

  const activePrintingJobs = data.orders.filter(
    (o: any) => o.order_status === "Processing"
  ).length;

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8 space-y-8">
          {/* HEADER */}
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dashboard Overview
              </h1>
              <p className="text-gray-400 text-sm">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <span className="text-gray-400 text-sm">Live Data</span>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-4 gap-6">
            <Card icon={<Box />} title="Total Orders Today" value={totalOrders} />
            <Card icon={<Truck />} title="Pending Dispatch" value={pendingDispatch} />
            <Card icon={<DollarSign />} title="Total Revenue" value={`₹${totalRevenue}`} />
            <Card icon={<AlertTriangle />} title="Low Stock Alerts" value={lowStock} />
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-6">
            <SummaryCard
              icon={<Printer />}
              title="Active Printing Jobs"
              value={activePrintingJobs}
              sub="From Orders"
            />

            <SummaryCard
              icon={<Users />}
              title="Total Employees"
              value={data.employees.length}
              sub="From DB"
            />
          </div>

          {/* REVENUE */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-white font-semibold mb-4">
              Revenue & Orders
            </h3>

            {revenueData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="month" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    fill="#14532d"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No revenue data</p>
            )}
          </div>

          {/* WORKFLOW + PERFORMANCE */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-white mb-4">Workflow</h3>

              {workflow.map((w, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <span className="w-28 text-gray-300">{w.stage}</span>

                  <div className="flex-1 bg-zinc-800 h-2 rounded">
                    <div
                      className={`${w.color} h-2 rounded`}
                      style={{ width: `${w.width}%` }}
                    />
                  </div>

                  <span className="text-white w-6 text-right">{w.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-white mb-4">
                Department Performance
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={departmentData}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ORDERS */}
          <div className="bg-zinc-900 p-6 rounded-xl">
            <h3 className="text-white mb-4">Recent Orders</h3>

            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-zinc-800">
                  <th className="text-left py-3 px-2">Order ID</th>
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.orders.slice(0, 5).map((o: any, i: number) => (
                  <tr key={i} className="border-b border-zinc-800">
                    <td className="py-3 px-2 text-blue-400">{o.order_id}</td>

                    <td className="py-3 px-2 text-white">
                      {o.customer_name}
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          statusColor[o.order_status]
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-white">
                      ₹{o.price}
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

// COMPONENTS

function Card({ icon, title, value }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="text-green-500">{icon}</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-white">{value}</h2>
      <p className="text-green-400 text-sm">Live</p>
    </div>
  );
}

function SummaryCard({ icon, title, value, sub }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 flex justify-between">
      <div className="flex gap-4">
        <div className="text-green-500">{icon}</div>
        <div>
          <p className="text-white">{title}</p>
          <p className="text-gray-400 text-sm">{sub}</p>
        </div>
      </div>
      <h2 className="text-white text-3xl">{value}</h2>
    </div>
  );
}