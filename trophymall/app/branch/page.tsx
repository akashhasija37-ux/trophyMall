"use client"

import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"

import {
  Building2,
  MapPin,
  Eye,
  Plus,
  Truck
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts"

const branches = [
  {
    name: "Mumbai HQ",
    location: "Andheri East, Mumbai",
    manager: "Rajesh Kumar",
    orders: 1247,
    revenue: "₹3.2L",
    staff: 45,
    performance: 94
  },
  {
    name: "Delhi Branch",
    location: "Connaught Place, Delhi",
    manager: "Priya Sharma",
    orders: 892,
    revenue: "₹2.4L",
    staff: 32,
    performance: 89
  },
  {
    name: "Bangalore Branch",
    location: "Koramangala, Bangalore",
    manager: "Amit Patel",
    orders: 756,
    revenue: "₹1.9L",
    staff: 28,
    performance: 87
  },
  {
    name: "Pune Branch",
    location: "Hinjewadi, Pune",
    manager: "Neha Singh",
    orders: 634,
    revenue: "₹1.6L",
    staff: 24,
    performance: 85
  }
]

const revenueData = [
  { month: "Sep", mumbai: 280000, delhi: 220000, bangalore: 180000, pune: 150000 },
  { month: "Oct", mumbai: 300000, delhi: 240000, bangalore: 190000, pune: 160000 },
  { month: "Nov", mumbai: 320000, delhi: 250000, bangalore: 200000, pune: 170000 },
  { month: "Dec", mumbai: 340000, delhi: 255000, bangalore: 210000, pune: 175000 },
  { month: "Jan", mumbai: 320000, delhi: 240000, bangalore: 195000, pune: 168000 },
  { month: "Feb", mumbai: 340000, delhi: 270000, bangalore: 215000, pune: 180000 }
]

const ordersData = [
  { month: "Sep", mumbai: 190, delhi: 140, bangalore: 120, pune: 95 },
  { month: "Oct", mumbai: 210, delhi: 150, bangalore: 130, pune: 105 },
  { month: "Nov", mumbai: 220, delhi: 160, bangalore: 135, pune: 110 },
  { month: "Dec", mumbai: 230, delhi: 170, bangalore: 140, pune: 115 },
  { month: "Jan", mumbai: 225, delhi: 165, bangalore: 138, pune: 112 },
  { month: "Feb", mumbai: 240, delhi: 175, bangalore: 145, pune: 120 }
]

const staff = [
  { name: "Rajesh Kumar", role: "Branch Manager", dept: "Management", status: "Active", initials: "RK" },
  { name: "Sneha Verma", role: "Sales Lead", dept: "Sales", status: "Active", initials: "SV" },
  { name: "Arun Joshi", role: "Production Head", dept: "Manufacturing", status: "Active", initials: "AJ" },
  { name: "Kavita Reddy", role: "Designer", dept: "Design", status: "Active", initials: "KR" },
  { name: "Vikram Shah", role: "Dispatch Manager", dept: "Logistics", status: "Active", initials: "VS" }
]

export default function BranchPage() {

  return (

    <div className="flex min-h-screen bg-black">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Topbar />

        <div className="p-8 space-y-10">

          {/* HEADER */}

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold text-white">Branch Management</h1>
              <p className="text-gray-400 text-sm">
                Monitor and manage all branch operations
              </p>
            </div>

            <button className="flex items-center gap-2 bg-green-600 px-5 py-2 rounded-lg text-white">
              <Plus size={18} />
              Add New Branch
            </button>

          </div>


          {/* BRANCH CARDS */}

          <div className="grid grid-cols-4 gap-6">

            {branches.map((b, i) => (

              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">

                <div className="flex justify-between">
                  <Building2 className="text-green-500" />
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs">
                    Active
                  </span>
                </div>

                <h3 className="text-white font-semibold text-lg">
                  {b.name}
                </h3>

                <div className="flex items-center text-gray-400 text-sm gap-1">
                  <MapPin size={14} />
                  {b.location}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">

                  <p className="text-gray-400">Manager</p>
                  <p className="text-white">{b.manager}</p>

                  <p className="text-gray-400">Total Orders</p>
                  <p className="text-white">{b.orders}</p>

                  <p className="text-gray-400">Revenue</p>
                  <p className="text-green-400">{b.revenue}</p>

                  <p className="text-gray-400">Active Staff</p>
                  <p className="text-white">{b.staff}</p>

                </div>

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


          {/* REVENUE CHART */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <h3 className="text-white font-semibold mb-4">
              Revenue Comparison
            </h3>

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={revenueData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />

                <Line type="monotone" dataKey="mumbai" stroke="#22c55e" />
                <Line type="monotone" dataKey="delhi" stroke="#14b8a6" />
                <Line type="monotone" dataKey="bangalore" stroke="#3b82f6" />
                <Line type="monotone" dataKey="pune" stroke="#8b5cf6" />

              </LineChart>

            </ResponsiveContainer>

          </div>


          {/* ORDERS CHART */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <h3 className="text-white font-semibold mb-4">
              Orders by Branch
            </h3>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={ordersData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Legend />

                <Bar dataKey="mumbai" fill="#166534" />
                <Bar dataKey="delhi" fill="#10b981" />
                <Bar dataKey="bangalore" fill="#3b82f6" />
                <Bar dataKey="pune" fill="#8b5cf6" />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* STAFF TABLE */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <h3 className="text-white font-semibold mb-4">
              Staff List - Mumbai HQ
            </h3>

            <table className="w-full">

              <thead className="text-gray-400 text-sm">
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Department</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>

              <tbody>

                {staff.map((s, i) => (

                  <tr key={i} className="border-t border-zinc-800">

                    <td className="py-4 flex items-center gap-3">

                      <div className="bg-green-700 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs">
                        {s.initials}
                      </div>

                      <span className="text-white">{s.name}</span>

                    </td>

                    <td className="text-white">{s.role}</td>

                    <td className="text-gray-300">{s.dept}</td>

                    <td>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs">
                        {s.status}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ON TIME CARDS */}

          <div className="grid grid-cols-4 gap-6">

            {branches.map((b, i) => (

              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Truck size={18}/>
                  {b.name}
                </div>

                <p className="text-gray-400 text-sm mt-1">On-Time %</p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {b.performance}%
                </h2>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}