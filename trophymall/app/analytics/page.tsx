"use client";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";

import { DollarSign, Box, Users, Award, Download } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "Jul", revenue: 350000, target: 350000 },
  { month: "Aug", revenue: 370000, target: 370000 },
  { month: "Sep", revenue: 390000, target: 390000 },
  { month: "Oct", revenue: 410000, target: 410000 },
  { month: "Nov", revenue: 430000, target: 430000 },
  { month: "Dec", revenue: 450000, target: 450000 },
  { month: "Jan", revenue: 470000, target: 470000 },
  { month: "Feb", revenue: 500000, target: 500000 },
];

const branchRevenue = [
  { name: "Mumbai", value: 33 },
  { name: "Delhi", value: 27 },
  { name: "Bangalore", value: 22 },
  { name: "Pune", value: 18 },
];

const completionData = [
  { stage: "Order Received", days: 1 },
  { stage: "Production", days: 5 },
  { stage: "Quality Check", days: 6 },
  { stage: "Packing", days: 7 },
  { stage: "Dispatch", days: 8 },
  { stage: "Delivery", days: 10 },
];

const slaData = [
  { month: "Sep", ontime: 88, delayed: 12 },
  { month: "Oct", ontime: 90, delayed: 10 },
  { month: "Nov", ontime: 92, delayed: 8 },
  { month: "Dec", ontime: 89, delayed: 11 },
  { month: "Jan", ontime: 94, delayed: 6 },
  { month: "Feb", ontime: 96, delayed: 4 },
];

const retentionData = [
  { month: "Jul", new: 140, returning: 90 },
  { month: "Aug", new: 160, returning: 100 },
  { month: "Sep", new: 170, returning: 120 },
  { month: "Oct", new: 180, returning: 130 },
  { month: "Nov", new: 190, returning: 150 },
  { month: "Dec", new: 200, returning: 160 },
  { month: "Jan", new: 215, returning: 175 },
  { month: "Feb", new: 225, returning: 190 },
];

const products = [
  { name: "Crystal Trophies", units: 1847, revenue: "₹892K" },
  { name: "Gold Medals", units: 2234, revenue: "₹745K" },
  { name: "Wooden Plaques", units: 1523, revenue: "₹612K" },
  { name: "Glass Awards", units: 1189, revenue: "₹567K" },
  { name: "Acrylic Trophies", units: 956, revenue: "₹423K" },
];

const sales = [
  {
    rank: 1,
    name: "Rajesh Kumar",
    orders: 247,
    revenue: "₹12.45L",
    target: "₹12L",
    percent: 103,
  },
  {
    rank: 2,
    name: "Priya Sharma",
    orders: 232,
    revenue: "₹11.8L",
    target: "₹11.5L",
    percent: 102,
  },
  {
    rank: 3,
    name: "Amit Patel",
    orders: 218,
    revenue: "₹10.9L",
    target: "₹11L",
    percent: 99,
  },
  {
    rank: 4,
    name: "Neha Singh",
    orders: 205,
    revenue: "₹10.45L",
    target: "₹10.5L",
    percent: 99,
  },
  {
    rank: 5,
    name: "Vikram Joshi",
    orders: 198,
    revenue: "₹9.87L",
    target: "₹10L",
    percent: 98,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8 space-y-8">
          {/* HEADER */}

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Analytics & Reports
              </h1>
              <p className="text-gray-400 text-sm">
                Comprehensive business intelligence and performance metrics
              </p>
            </div>

            <div className="flex gap-3">
              <select className="bg-zinc-800 px-4 py-2 rounded text-white">
                <option>All Branches</option>
              </select>

              <select className="bg-zinc-800 px-4 py-2 rounded text-white">
                <option>All Departments</option>
              </select>

              <input
                type="date"
                className="bg-zinc-800 px-4 py-2 rounded text-white"
              />

              <button className="bg-green-600 px-4 py-2 rounded text-white flex gap-2 items-center">
                <Download size={16} /> Export PDF
              </button>
            </div>
          </div>

          {/* KPI CARDS */}

          <div className="grid grid-cols-4 gap-6">
            <Card
              icon={<DollarSign />}
              title="Total Revenue (MTD)"
              value="₹51.8L"
              sub="+15.2% vs last month"
            />

            <Card
              icon={<Box />}
              title="Orders Completed"
              value="2,847"
              sub="92% on-time delivery"
            />

            <Card
              icon={<Users />}
              title="Customer Retention"
              value="85%"
              sub="+8% improvement"
            />

            <Card
              icon={<Award />}
              title="Avg. Completion Time"
              value="10 days"
              sub="-2 days vs target"
            />
          </div>

          {/* REVENUE CHART */}

          <div className="bg-zinc-900 p-6 rounded-xl">
            <h3 className="text-white mb-4 font-semibold">
              Revenue Trend vs Target
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid stroke="#333" />

                <XAxis dataKey="month" stroke="#aaa" />

                <YAxis stroke="#aaa" />

                <Tooltip />

                <Line dataKey="revenue" stroke="#22c55e" strokeWidth={3} />

                <Line dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PRODUCTS + PIE */}

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-white mb-4 font-semibold">
                Most Demanding Products
              </h3>

              {products.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between py-3 border-b border-zinc-800"
                >
                  <div>
                    <p className="text-white">
                      {i + 1}. {p.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {p.units} units sold
                    </p>
                  </div>

                  <span className="text-white font-medium">{p.revenue}</span>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-white mb-4 font-semibold">
                Branch Revenue Distribution
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={branchRevenue}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {branchRevenue.map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SALES TABLE */}

          <div className="bg-zinc-900 rounded-xl p-6">
            <h3 className="text-white mb-4 font-semibold">
              Salesperson Performance Leaderboard
            </h3>

            <table className="w-full">
              <thead className="text-gray-400 text-sm">
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Target</th>
                  <th>Achievement</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((s, i) => (
                  <tr key={i} className="border-t border-zinc-800">
                    <td className="py-4 text-yellow-400">{s.rank}</td>

                    <td className="text-white">{s.name}</td>

                    <td className="text-gray-300">{s.orders}</td>

                    <td className="text-white">{s.revenue}</td>

                    <td className="text-gray-300">{s.target}</td>

                    <td className="w-56">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-zinc-700 h-2 rounded">
                          <div
                            className="bg-green-500 h-2 rounded"
                            style={{ width: `${s.percent}%` }}
                          />
                        </div>

                        <span className="text-green-400 text-sm">
                          {s.percent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CHARTS */}

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-white mb-4 font-semibold">
                Customer Retention Rate
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={retentionData}>
                  <CartesianGrid stroke="#333" />

                  <XAxis dataKey="month" stroke="#aaa" />

                  <YAxis stroke="#aaa" />

                  <Tooltip />

                  <Line dataKey="new" stroke="#3b82f6" />

                  <Line dataKey="returning" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-white mb-4 font-semibold">
                Average Order Completion Time
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={completionData}>
                  <XAxis dataKey="stage" stroke="#aaa" />

                  <YAxis stroke="#aaa" />

                  <Tooltip />

                  <Bar dataKey="days" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLA */}

          <div className="bg-zinc-900 p-6 rounded-xl">
            <h3 className="text-white mb-4 font-semibold">
              Dispatch SLA Performance
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={slaData} stackOffset="expand">
                <XAxis dataKey="month" stroke="#aaa" />

                <YAxis stroke="#aaa" />

                <Tooltip />

                <Bar dataKey="ontime" stackId="a" fill="#10b981" />

                <Bar dataKey="delayed" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value, sub }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl space-y-2">
      <div className="text-green-500">{icon}</div>

      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold text-white">{value}</h2>

      <p className="text-green-400 text-sm">{sub}</p>
    </div>
  );
}
