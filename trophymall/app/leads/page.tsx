"use client"
import { useState } from "react"
import {
  TrendingUp,
  Filter,
  Mail,
  Phone,
  Calendar,
  Plus
} from "lucide-react"

import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"
import AddLeadModal from "../components/AddLeadModal"

export default function LeadsTracking() {
const [open,setOpen] = useState(false)

  return (

    <div className="flex bg-black text-white min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Topbar */}
        <Topbar />

        <div className="p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-semibold">
                Leads Tracking
              </h1>

              <p className="text-gray-400 text-sm">
                Manage and track all your sales leads
              </p>
            </div>

            <button className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2" 
            onClick={()=>setOpen(true)}
            >
              <Plus size={18} />
              Add Lead
            </button>

            <AddLeadModal open={open} setOpen={setOpen}/>

          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <StatCard title="Total Leads" value="156" color="text-white" />

            <StatCard title="Hot Leads" value="42" color="text-red-500" />

            <StatCard title="Conversion Rate" value="68%" color="text-green-500" />

            <StatCard title="Total Value" value="₹4.2L" color="text-white" />

          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">

            <button className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Filter size={16} />
              Filters
            </button>

            <select className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg">
              <option>All Status</option>
            </select>

            <select className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg">
              <option>All Sources</option>
            </select>

          </div>

          {/* Table */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gray-800 rounded-xl p-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead className="text-gray-400 text-sm border-b border-gray-800">

                <tr>
                  <th className="pb-4">Lead ID</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Value</th>
                  <th>Assigned</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody className="text-sm">

                <LeadRow
                  id="LEAD-301"
                  name="Robert Johnson"
                  email="robert@innovationlabs.com"
                  phone="+91 98765 43210"
                  company="Innovation Labs"
                  status="Hot"
                  source="Website"
                  value="₹45,000"
                  assigned="Sales Team A"
                  date="Feb 24, 2026"
                />

                <LeadRow
                  id="LEAD-302"
                  name="Emily Chen"
                  email="emily@futuretech.com"
                  phone="+91 98765 43211"
                  company="Future Tech"
                  status="Warm"
                  source="Referral"
                  value="₹32,000"
                  assigned="Sales Team B"
                  date="Feb 23, 2026"
                />

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  )
}

function StatCard({ title, value, color }: any) {

  return (

    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gray-800 rounded-xl p-6 flex justify-between">

      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className={`text-2xl font-semibold mt-2 ${color}`}>
          {value}
        </h3>
      </div>

      <TrendingUp className="text-green-500" />

    </div>

  )
}

function LeadRow({
  id,
  name,
  email,
  phone,
  company,
  status,
  source,
  value,
  assigned,
  date
}: any) {

  const statusColor =
    status === "Hot"
      ? "bg-red-900 text-red-400"
      : "bg-yellow-900 text-yellow-400"

  return (

    <tr className="border-b border-gray-800">

      <td className="py-5 text-blue-400">{id}</td>

      <td>
        <p>{name}</p>

        <div className="text-gray-400 text-xs flex items-center gap-2 mt-1">
          <Mail size={14} /> {email}
        </div>

        <div className="text-gray-400 text-xs flex items-center gap-2">
          <Phone size={14} /> {phone}
        </div>
      </td>

      <td>{company}</td>

      <td>
        <span className={`px-2 py-1 text-xs rounded ${statusColor}`}>
          {status}
        </span>
      </td>

      <td>{source}</td>

      <td>{value}</td>

      <td>{assigned}</td>

      <td className="flex items-center gap-2">
        <Calendar size={14} />
        {date}
      </td>

      <td className="text-green-500 cursor-pointer">
        View
      </td>

    </tr>

  )
}