"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/app/components/sidebar"
import Topbar from "@/app/components/topbar"
import CreateInvoiceModal from "../../components/CreateInvoiceModal"
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


export default function BillingPage() {

const [openinvoice,setopeninvoice] =useState(false)

// ✅ NEW STATE
const [invoiceList,setInvoiceList] = useState<any[]>([])
const [chartData, setChartData] = useState<any[]>([]);

  const badge: any = {
    Paid: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Overdue: "bg-red-500/20 text-red-400"
  }

   useEffect(()=>{
    fetchInvoices()
    fetchRevenue();
  },[])

  // ✅ FETCH API
  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices")
      const data = await res.json()
      setInvoiceList(data)
    } catch (err) {
      console.error("Invoice API Error:", err)
    }
  }

const fetchRevenue = async () => {
  try {
    const res = await fetch("/api/revenue");
    const data = await res.json();

    // ensure number format
    const formatted = data.map((d: any) => ({
      month: d.month,
      revenue: Number(d.revenue || 0),
    }));

    setChartData(formatted);

  } catch (err) {
    console.error("Revenue fetch error:", err);
  }
};
 

  // ✅ FORMAT DATA
  console.log(invoiceList)
  const formattedInvoices = invoiceList.map((i:any)=>({
    id: i.invoice_id,
    customer: i.customer_name,
    branch: "-",
    amount: `₹${Number(i.total_amount)}`,
    status: i.payment_status,
    date: i.due_date ? new Date(i.due_date).toLocaleDateString() : "-",
    salesperson: i.salesperson_name
  }))

  // ✅ STATS CALCULATION
 const totalRevenue = invoiceList.reduce(
  (sum, i: any) => sum + Number(i.total_amount || 0),
  0
);

const formattedRevenue = totalRevenue.toFixed(2);

  const pendingAmount = invoiceList
    .filter((i:any)=>i.payment_status==="Pending")
    .reduce((sum,i:any)=>sum+Number(i.total_amount || 0),0)

  const overdueCount = invoiceList.filter(
    (i:any)=>i.payment_status==="Overdue"
  ).length

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

            <CreateInvoiceModal 
              open={openinvoice} 
              setOpen={setopeninvoice}
              refresh={fetchInvoices} // ✅ added
            />

          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">
              <div className="space-y-2">
                <div className="bg-green-500/10 p-3 rounded-lg w-fit">
                  <DollarSign className="text-green-400" size={20} />
                </div>

                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h2 className="text-3xl font-bold text-white">₹{formattedRevenue}</h2>
                <p className="text-green-400 text-sm">+12.5%</p>
              </div>

              <TrendingUp className="text-green-400 opacity-70" />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">
              <div className="space-y-2">
                <div className="bg-yellow-500/10 p-3 rounded-lg w-fit">
                  <FileText className="text-yellow-400" size={20} />
                </div>

                <p className="text-gray-400 text-sm">Outstanding Payments</p>
                <h2 className="text-3xl font-bold text-white">₹{pendingAmount}</h2>
                <p className="text-yellow-400 text-sm">{invoiceList.length} invoices</p>
              </div>

              <AlertTriangle className="text-yellow-400 opacity-70" />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">
              <div className="space-y-2">
                <div className="bg-red-500/10 p-3 rounded-lg w-fit">
                  <AlertTriangle className="text-red-400" size={20} />
                </div>

                <p className="text-gray-400 text-sm">Overdue Invoices</p>
                <h2 className="text-3xl font-bold text-white">{overdueCount}</h2>
                <p className="text-red-400 text-sm">Pending</p>
              </div>

              <AlertTriangle className="text-red-400 opacity-70" />
            </div>

          </div>

          {/* CHART (UNCHANGED) */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold">Monthly Revenue Trend</h3>
                <p className="text-gray-400 text-sm">Last 7 months performance</p>
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
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* TABLE */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
               <h3 className="text-white font-semibold mb-6">All Invoices</h3>
         
               <table className="w-full">
                 <thead className="text-gray-400 text-sm">
                   <tr>
                     <th className="text-left pb-3">Invoice ID</th>
                     <th className="text-left">Customer</th>
                     {/* <th className="text-left">Branch</th> */}
                     <th className="text-left">Amount</th>
                     <th className="text-left">Status</th>
                     <th className="text-left">Due Date</th>
                     <th className="text-left">Salesperson</th>
                     <th className="text-right">Actions</th>
                   </tr>
                 </thead>
         
                 <tbody >
                   {formattedInvoices.map((i, idx) => (
                     <tr key={idx} className="border-t border-zinc-800">
                       <td className="py-4 text-blue-400">{i.id}</td>
                       <td className="text-white">{i.customer}</td>
                       {/* <td className="text-white">{i.branch}</td> */}
                       <td className="text-white">{i.amount}</td>
         
                       <td>
                         <span
                           className={`px-3 py-1 rounded text-xs ${badge[i.status]}`}
                         >
                           {i.status}
                         </span>
                       </td>
         
                       <td className="text-white">{i.date}</td>
         
                       <td className="text-white">{i.salesperson}</td>
         
                       <td className="flex justify-end gap-3 text-gray-400 mt-5">
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
  )
}