"use client"
import { useState } from "react"
import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"
import CreateInvoiceModal from "../components/CreateInvoiceModal"
import {
  Plus,
  Download,
  Barcode,
  Filter,
  Eye,
  Pencil,
  Send,
  Calendar,
   DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp
} from "lucide-react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const chartData = [
  { month: "Aug", revenue: 180000 },
  { month: "Sep", revenue: 220000 },
  { month: "Oct", revenue: 200000 },
  { month: "Nov", revenue: 250000 },
  { month: "Dec", revenue: 270000 },
  { month: "Jan", revenue: 290000 },
  { month: "Feb", revenue: 310000 }
]

const invoices = [
  {
    id: "INV-2025-0891",
    customer: "Acme Corporation",
    branch: "Mumbai HQ",
    amount: "₹45,600",
    status: "Paid",
    date: "Feb 20, 2026",
    salesperson: "Rajesh Kumar"
  },
  {
    id: "INV-2025-0892",
    customer: "Tech Solutions Ltd",
    branch: "Delhi Branch",
    amount: "₹32,800",
    status: "Pending",
    date: "Feb 28, 2026",
    salesperson: "Priya Sharma"
  },
  {
    id: "INV-2025-0893",
    customer: "Global Enterprises",
    branch: "Bangalore Branch",
    amount: "₹78,900",
    status: "Overdue",
    date: "Feb 10, 2026",
    salesperson: "Amit Patel"
  },
   {
    id: "INV-2025-0894",
    customer: "Acme Corporation",
    branch: "Mumbai HQ",
    amount: "₹45,600",
    status: "Paid",
    date: "Feb 20, 2026",
    salesperson: "Rajesh Kumar"
  },
  {
    id: "INV-2025-0895",
    customer: "Tech Solutions Ltd",
    branch: "Delhi Branch",
    amount: "₹42,800",
    status: "out of delivery",
    date: "Feb 28, 2026",
    salesperson: "Priya Sharma"
  },
  {
    id: "INV-2025-0896",
    customer: "Global Enterprises",
    branch: "Bangalore Branch",
    amount: "₹78,900",
    status: "Overdue",
    date: "Feb 10, 2026",
    salesperson: "Amit Patel"
  }
]

export default function BillingPage() {
const [openinvoice,setopeninvoice] =useState(false)
  const badge: any = {
    Paid: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Overdue: "bg-red-500/20 text-red-400"
  }

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
                Billing Management
              </h1>

              <p className="text-gray-400 text-sm">
                Manage invoices, payments, and revenue tracking
              </p>
            </div>

            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
            onClick={()=>setopeninvoice(true)}
            >

              <Plus size={18} />

              Create Invoice

            </button>
         <CreateInvoiceModal open={openinvoice} setOpen={setopeninvoice} />
          </div>


          {/* STATS */}

         {/* STATS */}

<div className="grid grid-cols-3 gap-6">

  {/* TOTAL REVENUE */}

  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">

    <div className="space-y-2">

      <div className="bg-green-500/10 p-3 rounded-lg w-fit">
        <DollarSign className="text-green-400" size={20} />
      </div>

      <p className="text-gray-400 text-sm">Total Revenue</p>

      <h2 className="text-3xl font-bold text-white">₹8.4L</h2>

      <p className="text-green-400 text-sm">+12.5%</p>

    </div>

    <TrendingUp className="text-green-400 opacity-70" />

  </div>


  {/* OUTSTANDING PAYMENTS */}

  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">

    <div className="space-y-2">

      <div className="bg-yellow-500/10 p-3 rounded-lg w-fit">
        <FileText className="text-yellow-400" size={20} />
      </div>

      <p className="text-gray-400 text-sm">Outstanding Payments</p>

      <h2 className="text-3xl font-bold text-white">₹2.1L</h2>

      <p className="text-yellow-400 text-sm">24 invoices</p>

    </div>

    <AlertTriangle className="text-yellow-400 opacity-70" />

  </div>


  {/* OVERDUE INVOICES */}

  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">

    <div className="space-y-2">

      <div className="bg-red-500/10 p-3 rounded-lg w-fit">
        <AlertTriangle className="text-red-400" size={20} />
      </div>

      <p className="text-gray-400 text-sm">Overdue Invoices</p>

      <h2 className="text-3xl font-bold text-white">12</h2>

      <p className="text-red-400 text-sm">₹1.2L pending</p>

    </div>

    <AlertTriangle className="text-red-400 opacity-70" />

  </div>

</div>


          {/* CHART */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <div className="flex justify-between mb-6">

              <div>
                <h3 className="text-white font-semibold">
                  Monthly Revenue Trend
                </h3>

                <p className="text-gray-400 text-sm">
                  Last 7 months performance
                </p>
              </div>

              <select className="bg-zinc-800 px-3 py-2 rounded text-white">
                <option>Last 7 Months</option>
              </select>

            </div>

            <ResponsiveContainer width="100%" height={300}>

              <AreaChart data={chartData}>

                <XAxis dataKey="month" stroke="#aaa" />

                <YAxis stroke="#aaa" />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  fill="#22c55e33"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>


          {/* MAIN GRID */}

          <div className="grid grid-cols-12 gap-6">

            {/* LEFT PANEL */}

            <div className="col-span-3 space-y-6">

              {/* QUICK ACTIONS */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">

                <h3 className="text-white font-semibold">Quick Actions</h3>

                <button className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg">

                  <Plus size={18} />

                  Create Invoice

                </button>

                <button className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg">

                  <Download size={18} />

                  Export Data

                </button>

              </div>


              {/* AUTO REMINDER */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

  <div className="flex justify-between items-center mb-3">

    <h3 className="text-white font-semibold">
      Auto Reminder
    </h3>

    {/* Toggle */}

    <label className="relative inline-flex items-center cursor-pointer">

      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked
      />

      <div className="w-11 h-6 bg-zinc-700 rounded-full peer 
      peer-checked:bg-green-600 
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:border after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-full">
      </div>

    </label>

  </div>

  <p className="text-gray-400 text-sm">
    Automatically send payment reminders 15 days before due date
  </p>

</div>


              {/* TRACK ORDER */}

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

                <h3 className="text-white font-semibold mb-4">
                  Track Order
                </h3>

                <div className="relative">

                  <Barcode
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    placeholder="Enter barcode..."
                    className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg"
                  />

                </div>

              </div>

            </div>


            {/* RIGHT PANEL */}

            <div className="col-span-9 bg-zinc-900 border border-zinc-800 rounded-xl p-6">

              {/* FILTERS */}

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-white font-semibold">
                  All Invoices
                </h3>

                <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">

                  <Filter size={16} />

                  Filters

                </button>

              </div>


              {/* FILTER ROW */}

              <div className="flex gap-4 mb-6">

                <input
                  type="date"
                  className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
                />

                <span className="text-gray-400 self-center">to</span>

                <input
                  type="date"
                  className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
                />

                <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
                  <option>All Branches</option>
                </select>

                <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
                  <option>All Status</option>
                </select>

              </div>


              {/* TABLE */}

              <table className="w-full">

                <thead className="text-gray-400 text-sm">

                  <tr>

                    <th className="text-left pb-3">Invoice ID</th>
                    <th className="text-left">Customer</th>
                    <th className="text-left">Branch</th>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Due Date</th>
                    <th className="text-left">Salesperson</th>
                    <th className="text-right">Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {invoices.map((i, idx) => (

                    <tr key={idx} className="border-t border-zinc-800">

                      <td className="py-4 text-blue-400">{i.id}</td>

                      <td className="text-white">{i.customer}</td>

                      <td className="text-white">{i.branch}</td>

                      <td className="text-white">{i.amount}</td>

                      <td>

                        <span className={`px-3 py-1 rounded text-xs ${badge[i.status]}`}>
                          {i.status}
                        </span>

                      </td>

                      <td className="text-white flex items-center gap-2">

                        <Calendar size={14} />

                        {i.date}

                      </td>

                      <td className="text-white">{i.salesperson}</td>

                      <td className="flex justify-end gap-3 text-gray-400">

                        <Eye size={18} />
                        <Pencil size={18} />
                        <Download size={18} />
                        <Send size={18} />

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}