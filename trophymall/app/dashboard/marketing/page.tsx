"use client"

import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"

import {
  Send,
  MessageCircle,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Pencil,
  Pause,
  Play
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"


const engagementData = [
  { month: "Sep", email: 3200, whatsapp: 2800, conversions: 650 },
  { month: "Oct", email: 3500, whatsapp: 3100, conversions: 700 },
  { month: "Nov", email: 3800, whatsapp: 3400, conversions: 820 },
  { month: "Dec", email: 4200, whatsapp: 3800, conversions: 980 },
  { month: "Jan", email: 4500, whatsapp: 4200, conversions: 1100 },
  { month: "Feb", email: 4800, whatsapp: 4600, conversions: 1250 }
]

const campaigns = [
  {
    id: "CMP-001",
    name: "New Year Trophy Sale",
    audience: "Corporate Clients",
    branch: "All Branches",
    sent: 1247,
    open: 68,
    conversion: 24,
    status: "Active"
  },
  {
    id: "CMP-002",
    name: "Sports Season Promotion",
    audience: "Sports Clubs",
    branch: "Mumbai HQ",
    sent: 892,
    open: 72,
    conversion: 28,
    status: "Active"
  },
  {
    id: "CMP-003",
    name: "Bulk Order Discount",
    audience: "Schools & Colleges",
    branch: "Delhi Branch",
    sent: 645,
    open: 65,
    conversion: 22,
    status: "Completed"
  },
  {
    id: "CMP-004",
    name: "Corporate Awards Campaign",
    audience: "Enterprise",
    branch: "Bangalore Branch",
    sent: 523,
    open: 58,
    conversion: 19,
    status: "Scheduled"
  }
]

const segments = [
  { name: "Corporate Clients", count: 1247 },
  { name: "Sports Clubs", count: 892 },
  { name: "Schools & Colleges", count: 645 },
  { name: "Enterprise", count: 523 },
  { name: "Repeat Customers", count: 1580 },
  { name: "New Leads", count: 380 }
]


export default function MarketingPage() {

  const badge:any = {
    Active:"bg-green-500/20 text-green-400",
    Completed:"bg-blue-500/20 text-blue-400",
    Scheduled:"bg-yellow-500/20 text-yellow-400"
  }

  return (

    <div className="flex min-h-screen bg-black">

      <Sidebar/>

      <div className="flex flex-col flex-1">

        <Topbar/>

        <div className="p-8 space-y-8">

          {/* HEADER */}

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold text-white">
                Marketing Automation
              </h1>

              <p className="text-gray-400 text-sm">
                Manage campaigns, audience segments, and customer engagement
              </p>
            </div>

            <button className="flex items-center gap-2 bg-green-600 px-5 py-2 rounded-lg text-white">

              <Plus size={18}/>
              Create Campaign

            </button>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-4 gap-6">

            <StatCard icon={<Send/>} title="Active Campaigns" value="12" sub="+3 this month"/>

            <StatCard icon={<MessageCircle/>} title="WhatsApp Delivery" value="94%" sub="Optimal rate"/>

            <StatCard icon={<Users/>} title="Engagement Rate" value="72%" sub="Above average"/>

            <StatCard icon={<TrendingUp/>} title="Repeat Customers" value="45%" sub="Growing steadily"/>

          </div>


          {/* ENGAGEMENT CHART */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <div className="flex justify-between mb-4">

              <h3 className="text-white font-semibold">
                Customer Engagement Trends
              </h3>

              <select className="bg-zinc-800 px-3 py-2 rounded text-white">
                <option>Last 6 Months</option>
              </select>

            </div>

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={engagementData}>

                <CartesianGrid stroke="#333" strokeDasharray="3 3"/>

                <XAxis dataKey="month" stroke="#aaa"/>

                <YAxis stroke="#aaa"/>

                <Tooltip/>

                <Line type="monotone" dataKey="email" stroke="#3b82f6"/>

                <Line type="monotone" dataKey="whatsapp" stroke="#10b981"/>

                <Line type="monotone" dataKey="conversions" stroke="#22c55e"/>

              </LineChart>

            </ResponsiveContainer>

          </div>



          {/* SEGMENTS */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <div className="flex justify-between mb-4">

              <h3 className="text-white font-semibold">
                Audience Segmentation
              </h3>

              <button className="bg-zinc-800 px-4 py-2 rounded text-white">
                Filters
              </button>

            </div>

            <div className="grid grid-cols-3 gap-6">

              {segments.map((s,i)=>(
                <div key={i} className="bg-zinc-800 rounded-lg p-5">

                  <h4 className="text-white font-medium">
                    {s.name}
                  </h4>

                  <p className="text-2xl font-bold text-green-400 mt-2">
                    {s.count}
                  </p>

                  <p className="text-gray-400 text-sm">
                    contacts in segment
                  </p>

                </div>
              ))}

            </div>

          </div>



          {/* CAMPAIGNS */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <h3 className="text-white font-semibold mb-4">
              All Campaigns
            </h3>

            <table className="w-full">

              <thead className="text-gray-400 text-sm">

                <tr>

                  <th className="text-left">Campaign ID</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Target Audience</th>
                  <th className="text-left">Branch</th>
                  <th className="text-left">Sent Count</th>
                  <th className="text-left">Open Rate</th>
                  <th className="text-left">Conversion</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Actions</th>

                </tr>

              </thead>

              <tbody>

                {campaigns.map((c,i)=>(

                  <tr key={i} className="border-t border-zinc-800">

                    <td className="py-4 text-blue-400">{c.id}</td>

                    <td className="text-white">{c.name}</td>

                    <td className="text-gray-300">{c.audience}</td>

                    <td className="text-gray-300">{c.branch}</td>

                    <td className="text-white">{c.sent}</td>

                    <td className="w-40">

                      <div className="flex items-center gap-2">

                        <div className="bg-zinc-700 h-2 w-full rounded">

                          <div
                            className="bg-blue-500 h-2 rounded"
                            style={{width:`${c.open}%`}}
                          />

                        </div>

                        <span className="text-white text-sm">
                          {c.open}%
                        </span>

                      </div>

                    </td>

                    <td className="text-green-400 font-medium">
                      {c.conversion}%
                    </td>

                    <td>

                      <span className={`px-3 py-1 rounded text-xs ${badge[c.status]}`}>
                        {c.status}
                      </span>

                    </td>

                    <td className="flex justify-end gap-3 text-gray-400">

                      <Eye size={18}/>
                      <Pencil size={18}/>
                      {c.status==="Active"?<Pause size={18}/>:<Play size={18}/>}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>



          {/* BOTTOM PANELS */}

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

              <h3 className="text-white font-semibold mb-4">
                Scheduled Broadcasts
              </h3>

              <div className="space-y-3">

                <Broadcast title="Summer Collection Launch" date="Mar 15, 2026"/>

                <Broadcast title="Easter Special Offer" date="Mar 20, 2026"/>

              </div>

            </div>


            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

              <h3 className="text-white font-semibold mb-4">
                Offer Automation
              </h3>

              <Automation name="Birthday Wishes" status="Active"/>

              <Automation name="Abandoned Cart" status="Active"/>

              <Automation name="Win-back Campaign" status="Paused"/>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}



function StatCard({icon,title,value,sub}:any){

  return(

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">

      <div className="text-green-500">
        {icon}
      </div>

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-white">
        {value}
      </h2>

      <p className="text-green-400 text-sm">
        {sub}
      </p>

    </div>

  )

}


function Broadcast({title,date}:any){

  return(

    <div className="flex justify-between bg-zinc-800 p-4 rounded-lg">

      <div>

        <p className="text-white">{title}</p>

        <p className="text-gray-400 text-sm">{date}</p>

      </div>

      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-xs">
        Scheduled
      </span>

    </div>

  )

}


function Automation({name,status}:any){

  const color=status==="Active"
    ?"text-green-400"
    :"text-gray-400"

  return(

    <div className="flex justify-between py-2">

      <span className="text-white">
        {name}
      </span>

      <span className={color}>
        {status}
      </span>

    </div>

  )

}