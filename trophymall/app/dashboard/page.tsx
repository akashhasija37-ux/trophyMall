"use client"

import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"

import {
Box,
Truck,
DollarSign,
AlertTriangle,
Printer,
Users
} from "lucide-react"

import {
ResponsiveContainer,
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
BarChart,
Bar
} from "recharts"



const revenueData = [
{month:"Jan",revenue:42000},
{month:"Feb",revenue:47000},
{month:"Mar",revenue:51000},
{month:"Apr",revenue:61000},
{month:"May",revenue:56000},
{month:"Jun",revenue:68000},
{month:"Jul",revenue:72000}
]

const departmentData = [
{name:"Sales",score:94},
{name:"Design",score:88},
{name:"Printing",score:85},
{name:"Manufacturing",score:91},
{name:"Dispatch",score:89}
]

const workflow = [
{stage:"Sales",value:45,color:"bg-green-600"},
{stage:"Design",value:32,color:"bg-teal-500"},
{stage:"Printing",value:28,color:"bg-blue-500"},
{stage:"Manufacturing",value:24,color:"bg-purple-500"},
{stage:"Packing",value:18,color:"bg-orange-500"},
{stage:"Dispatch",value:15,color:"bg-cyan-500"},
{stage:"Feedback",value:12,color:"bg-pink-500"}
]

const orders = [
{id:"ORD-2501",customer:"Acme Corp",status:"Paid",amount:"₹12,500",date:"Today"},
{id:"ORD-2502",customer:"Tech Solutions",status:"Pending",amount:"₹8,900",date:"Today"},
{id:"ORD-2503",customer:"Global Traders",status:"Overdue",amount:"₹15,200",date:"Yesterday"},
{id:"ORD-2504",customer:"Prime Industries",status:"Paid",amount:"₹22,100",date:"Yesterday"},
{id:"ORD-2505",customer:"Metro Supplies",status:"Pending",amount:"₹6,750",date:"2 days ago"}
]

export default function DashboardPage(){

const statusColor:any={
Paid:"text-green-400 bg-green-500/20",
Pending:"text-yellow-400 bg-yellow-500/20",
Overdue:"text-red-400 bg-red-500/20"
}

return(

<div className="flex min-h-screen bg-black">

<Sidebar/>

<div className="flex-1">

<Topbar/>

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

<span className="text-gray-400 text-sm">
Last updated: 2 minutes ago
</span>

</div>


{/* KPI CARDS */}

<div className="grid grid-cols-4 gap-6">

<Card icon={<Box/>} title="Total Orders Today" value="47" change="+12%"/>

<Card icon={<Truck/>} title="Pending Dispatch" value="23" change="-5%"/>

<Card icon={<DollarSign/>} title="Outstanding Payments" value="₹1.2L" change="+8%"/>

<Card icon={<AlertTriangle/>} title="Low Stock Alerts" value="12" change="+3"/>

</div>


{/* JOBS + LEADS */}

<div className="grid grid-cols-2 gap-6">

<SummaryCard
icon={<Printer/>}
title="Active Printing Jobs"
value="18"
sub="+4 from yesterday"
/>

<SummaryCard
icon={<Users/>}
title="Total Leads"
value="34"
sub="+12 from last week"
/>

</div>


{/* REVENUE CHART */}

<div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">

<div className="flex justify-between mb-4">

<h3 className="text-white font-semibold">
Revenue & Orders
</h3>

<select className="bg-zinc-800 px-3 py-2 rounded text-white">
<option>Last 7 Months</option>
</select>

</div>

<ResponsiveContainer width="100%" height={300}>

<AreaChart data={revenueData}>

<CartesianGrid stroke="#333"/>

<XAxis dataKey="month" stroke="#aaa"/>

<YAxis stroke="#aaa"/>

<Tooltip/>

<Area
type="monotone"
dataKey="revenue"
stroke="#22c55e"
fill="#14532d"
/>

</AreaChart>

</ResponsiveContainer>

</div>


{/* WORKFLOW + PERFORMANCE */}

<div className="grid grid-cols-2 gap-6">

{/* WORKFLOW */}

<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

<h3 className="text-white font-semibold mb-4">
Workflow Pipeline
</h3>

<div className="space-y-4">

{workflow.map((w,i)=>(
<div key={i} className="flex items-center gap-3">

<span className="w-28 text-gray-300">
{w.stage}
</span>

<div className="flex-1 bg-zinc-800 h-2 rounded">

<div
className={`${w.color} h-2 rounded`}
style={{width:`${w.value}%`}}
/>

</div>

<span className="text-white w-8 text-right">
{w.value}
</span>

</div>
))}

</div>

</div>


{/* DEPARTMENT PERFORMANCE */}

<div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">

<h3 className="text-white font-semibold mb-4">
Department Performance
</h3>

<ResponsiveContainer width="100%" height={260}>

<BarChart data={departmentData}>

<CartesianGrid stroke="#333"/>

<XAxis dataKey="name" stroke="#aaa"/>

<YAxis stroke="#aaa"/>

<Tooltip/>

<Bar dataKey="score" fill="#16a34a"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>


{/* RECENT ORDERS */}

<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

<div className="flex justify-between mb-4">

<h3 className="text-white font-semibold">
Recent Orders
</h3>

<button className="text-green-400 text-sm">
View All Orders →
</button>

</div>

<table className="w-full">

<thead className="text-gray-400 text-sm">

<tr>

<th className="text-left">Order ID</th>
<th className="text-left">Customer</th>
<th className="text-left">Status</th>
<th className="text-left">Amount</th>
<th className="text-left">Date</th>

</tr>

</thead>

<tbody>

{orders.map((o,i)=>(
<tr key={i} className="border-t border-zinc-800">

<td className="py-4 text-blue-400">{o.id}</td>

<td className="text-white">{o.customer}</td>

<td>

<span className={`px-3 py-1 rounded text-xs ${statusColor[o.status]}`}>
{o.status}
</span>

</td>

<td className="text-white">{o.amount}</td>

<td className="text-gray-300">{o.date}</td>

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



function Card({icon,title,value,change}:any){

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
{change}
</p>

</div>

)

}


function SummaryCard({icon,title,value,sub}:any){

return(

<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between items-center">

<div className="flex items-center gap-4">

<div className="text-green-500">
{icon}
</div>

<div>

<p className="text-white font-medium">
{title}
</p>

<p className="text-gray-400 text-sm">
{sub}
</p>

</div>

</div>

<h2 className="text-3xl text-white font-bold">
{value}
</h2>

</div>
)

}