"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"
import DispatchStats from "./components/DispatchStats"
import DispatchTable from "./components/DispatchTable"
import CreateDispatchModal from "../components/CreateDispatchModal"
import { Plus, Filter } from "lucide-react"

const dispatchData = [
  {
    dispatchId: "DSP-2026-0145",
    orderId: "ORD-2501",
    customer: "Acme Corporation",
    items: "5 items",
    destination: "Andheri, Mumbai",
    courier: "BlueDart",
    tracking: "BD12345678",
    status: "In Transit",
    delivery: "Feb 26, 2026"
  },
  {
    dispatchId: "DSP-2026-0146",
    orderId: "ORD-2502",
    customer: "Tech Solutions Ltd",
    items: "8 items",
    destination: "Connaught Place, Delhi",
    courier: "DTDC",
    tracking: "DT98765432",
    status: "Delivered",
    delivery: "Feb 24, 2026"
  },
  {
    dispatchId: "DSP-2026-0147",
    orderId: "ORD-2503",
    customer: "Global Enterprises",
    items: "2 items",
    destination: "Koramangala, Bangalore",
    courier: "FedEx",
    tracking: "FX45612378",
    status: "Pending",
    delivery: "Feb 27, 2026"
  }
]

export default function DispatchPage() {

  const [openDispatch,setOpenDispatch] = useState(false)

  // 🔥 NEW STATE FOR API DATA
  const [dispatchList, setDispatchList] = useState<any[]>([])

  // 🔥 FETCH DATA FROM API
  const fetchDispatch = async () => {
    try {
      const res = await fetch("/api/dispatch")
      const data = await res.json()

      setDispatchList(data)
    } catch (err) {
      console.error("Dispatch API Error:", err)
    }
  }

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchDispatch()
  }, [])

  // 🔥 MAP DB → UI FORMAT
  const formattedData = dispatchList.map((item) => ({
    dispatchId: item.dispatch_id,
    orderId: item.order_id,
    customer: item.customer_name,
    items: "-", // optional (not in DB)
    destination: "-", // optional (not in DB yet)
    courier: item.courier_partner,
    tracking: item.tracking_number,
    status: item.delivery_status,
    delivery: item.dispatch_date
      ? new Date(item.dispatch_date).toLocaleDateString()
      : "-"
  }))

  return (

    <div className="flex min-h-screen bg-black">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
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
              onClick={()=>setOpenDispatch(true)}
            >
              <Plus size={18} />
              Create Dispatch
            </button>

            <CreateDispatchModal
              open={openDispatch}
              setOpen={setOpenDispatch}
              refresh={fetchDispatch}   // 🔥 AUTO REFRESH
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
          <DispatchTable
            data={formattedData.length ? formattedData : dispatchData}
          />

        </div>

      </div>

    </div>

  )
}