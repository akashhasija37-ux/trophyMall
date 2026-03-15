"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const data = [
  { month: "Aug", revenue: 180000 },
  { month: "Sep", revenue: 220000 },
  { month: "Oct", revenue: 200000 },
  { month: "Nov", revenue: 250000 },
  { month: "Dec", revenue: 270000 },
  { month: "Jan", revenue: 290000 },
  { month: "Feb", revenue: 310000 }
]

export default function RevenueChart() {

  return (

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

        <AreaChart data={data}>

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

  )
}