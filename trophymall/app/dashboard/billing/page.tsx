"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import CreateInvoiceModal from "../../components/CreateInvoiceModal";
import { downloadInvoicePDF } from "@/utils/downloadInvoicePDF";

import {
  Plus,
  Download,
  Eye,
  Pencil,
  Send,
  DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BillingPage() {
  const [openinvoice, setopeninvoice] = useState(false);

  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewInvoice, setViewInvoice] = useState<any>(null);

  // ✅ EDIT STATES
  const [editInvoice, setEditInvoice] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const badge: any = {
    Paid: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Overdue: "bg-red-500/20 text-red-400",
  };

  useEffect(() => {
    fetchInvoices();
    fetchRevenue();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoiceList(data);
    } catch (err) {
      console.error("Invoice API Error:", err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch("/api/revenue");
      const data = await res.json();

      const formatted = data.map((d: any) => ({
        month: d.month,
        revenue: Number(d.revenue || 0),
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Revenue fetch error:", err);
    }
  };

  // ✅ FIXED EDIT HANDLER
  const handleEdit = async (invoice: any) => {
    try {
      const res = await fetch(
        `/api/invoice-items?invoice_id=${invoice.invoice_id}`
      );
      const items = await res.json();

      setEditInvoice({
        ...invoice,
        items,
      });

      setOpenEditModal(true);
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  // FORMAT DATA
  const formattedInvoices = invoiceList.map((i: any) => ({
    id: i.invoice_id,
    customer: i.customer_name,
    branch: "-",
    amount: `₹${Number(i.total_amount)}`,
    status: i.payment_status,
    date: i.due_date
      ? new Date(i.due_date).toLocaleDateString()
      : "-",
    salesperson: i.salesperson_name,
    raw: i, // ✅ keep original
  }));

  // STATS
  const totalRevenue = invoiceList.reduce(
    (sum, i: any) => sum + Number(i.total_amount || 0),
    0
  );

  const formattedRevenue = totalRevenue.toFixed(2);

  const pendingAmount = invoiceList
    .filter((i: any) => i.payment_status === "Pending")
    .reduce((sum, i: any) => sum + Number(i.total_amount || 0), 0);

  const overdueCount = invoiceList.filter(
    (i: any) => i.payment_status === "Overdue"
  ).length;

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

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

            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
              onClick={() => setopeninvoice(true)}
            >
              <Plus size={18} />
              Create Invoice
            </button>

            <CreateInvoiceModal
              open={openinvoice}
              setOpen={setopeninvoice}
              refresh={fetchInvoices}
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
                <h2 className="text-3xl font-bold text-white">
                  ₹{formattedRevenue}
                </h2>
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
                <h2 className="text-3xl font-bold text-white">
                  ₹{pendingAmount}
                </h2>
                <p className="text-yellow-400 text-sm">
                  {invoiceList.length} invoices
                </p>
              </div>
              <AlertTriangle className="text-yellow-400 opacity-70" />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">
              <div className="space-y-2">
                <div className="bg-red-500/10 p-3 rounded-lg w-fit">
                  <AlertTriangle className="text-red-400" size={20} />
                </div>
                <p className="text-gray-400 text-sm">Overdue Invoices</p>
                <h2 className="text-3xl font-bold text-white">
                  {overdueCount}
                </h2>
                <p className="text-red-400 text-sm">Pending</p>
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

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-6">All Invoices</h3>

            <table className="w-full">
              <thead className="text-gray-400 text-sm">
                <tr>
                  <th className="text-left pb-3">Invoice ID</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Due Date</th>
                  <th className="text-left">Salesperson</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {formattedInvoices.map((i, idx) => (
                  <tr key={idx} className="border-t border-zinc-800">
                    <td className="py-4 text-blue-400">{i.id}</td>
                    <td className="text-white">{i.customer}</td>
                    <td className="text-white">{i.amount}</td>

                    <td>
                      <span className={`px-3 py-1 rounded text-xs ${badge[i.status]}`}>
                        {i.status}
                      </span>
                    </td>

                    <td className="text-white">{i.date}</td>
                    <td className="text-white">{i.salesperson}</td>

                    <td className="text-right">
                      <div className="flex justify-end gap-3 text-gray-400">

                        <button onClick={() => setViewInvoice(i)}>
                          <Eye size={18} />
                        </button>

                        {/* ✅ FIXED */}
                        <button onClick={() => handleEdit(i.raw)}>
                          <Pencil size={18} className="hover:text-green-400" />
                        </button>
<button onClick={() => downloadInvoicePDF(i)}>
                        <Download size={18}  /></button>
                        <Send size={18} />

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* VIEW MODAL */}
            {viewInvoice && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-zinc-900 p-6 rounded-xl w-[600px] border border-zinc-800">
                  <h2 className="text-xl text-white mb-4">Invoice Details</h2>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p><b>ID:</b> {viewInvoice.id}</p>
                    <p><b>Customer:</b> {viewInvoice.customer}</p>
                    <p><b>Amount:</b> {viewInvoice.amount}</p>
                    <p><b>Status:</b> {viewInvoice.status}</p>
                    <p><b>Due Date:</b> {viewInvoice.date}</p>
                    <p><b>Salesperson:</b> {viewInvoice.salesperson}</p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setViewInvoice(null)}
                      className="bg-zinc-700 px-4 py-2 rounded text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT MODAL */}
            <CreateInvoiceModal
              open={openEditModal}
              setOpen={(v:any) => {
                setOpenEditModal(v);
                if (!v) setEditInvoice(null);
              }}
              refresh={fetchInvoices}
              editData={editInvoice}
            />

          </div>
        </div>
      </div>
    </div>
  );
}