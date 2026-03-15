"use client"

import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"

import {
  Search,
  Filter,
  Download,
  Eye,
  Pencil,
  MoreVertical
} from "lucide-react"

const customers = [
  {
    id: "CUST-001",
    name: "Acme Corporation",
    company: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "+91 98765 43210",
    orders: 24,
    spent: "₹4,56,000",
    last: "Feb 20, 2026",
    status: "Active"
  },
  {
    id: "CUST-002",
    name: "Tech Solutions Ltd",
    company: "Tech Solutions Ltd",
    email: "info@techsolutions.com",
    phone: "+91 98765 43211",
    orders: 18,
    spent: "₹3,21,000",
    last: "Feb 18, 2026",
    status: "Active"
  },
  {
    id: "CUST-003",
    name: "Global Enterprises",
    company: "Global Enterprises",
    email: "orders@globalent.com",
    phone: "+91 98765 43212",
    orders: 32,
    spent: "₹7,89,000",
    last: "Feb 22, 2026",
    status: "Active"
  },
  {
    id: "CUST-004",
    name: "Prime Industries",
    company: "Prime Industries",
    email: "purchase@primeindustries.com",
    phone: "+91 98765 43213",
    orders: 15,
    spent: "₹2,67,000",
    last: "Feb 15, 2026",
    status: "Active"
  }
]

export default function CustomerPage() {

  const badge: any = {
    Active: "bg-green-500/20 text-green-400",
    Inactive: "bg-red-500/20 text-red-400"
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
                Customer Database
              </h1>

              <p className="text-gray-400 text-sm">
                View and manage customer information
              </p>
            </div>

            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white">
              <Download size={18}/>
              Export Data
            </button>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-4 gap-6">

            <StatCard title="Total Customers" value="8" />

            <StatCard title="Active Customers" value="7" color="text-green-400" />

            <StatCard title="Total Orders" value="155" />

            <StatCard title="Total Revenue" value="₹28.4L" />

          </div>


          {/* SEARCH */}

          <div className="flex gap-4">

            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 w-full">

              <Search size={18} className="text-gray-400"/>

              <input
                placeholder="Search customers by name, email, or company..."
                className="bg-transparent outline-none text-white ml-3 w-full"
              />

            </div>

            <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <Filter size={16}/>
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

                {customers.map((c, i) => (

                  <tr
                    key={i}
                    className="border-t border-zinc-800 hover:bg-zinc-800/40"
                  >

                    <td className="p-4 text-blue-400 font-medium">
                      {c.id}
                    </td>

                    <td>

                      <p className="text-white">{c.name}</p>

                      <p className="text-gray-400 text-sm">
                        {c.company}
                      </p>

                    </td>

                    <td>

                      <p className="text-white">{c.email}</p>

                      <p className="text-gray-400 text-sm">
                        {c.phone}
                      </p>

                    </td>

                    <td className="text-white">
                      {c.orders} orders
                    </td>

                    <td className="text-white font-medium">
                      {c.spent}
                    </td>

                    <td className="text-gray-300">
                      {c.last}
                    </td>

                    <td>

                      <span className={`px-3 py-1 rounded text-xs ${badge[c.status]}`}>
                        {c.status}
                      </span>

                    </td>

                    <td className="flex justify-end gap-3 p-4 text-gray-400">

                      <Eye size={18} className="cursor-pointer hover:text-white"/>

                      <Pencil size={18} className="cursor-pointer hover:text-white"/>

                      <MoreVertical size={18} className="cursor-pointer hover:text-white"/>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  )
}



function StatCard({ title, value, color="" }: any) {

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className={`text-3xl font-bold text-white mt-1 ${color}`}>
        {value}
      </h2>

    </div>

  )

}