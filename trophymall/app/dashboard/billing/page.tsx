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
  DollarSign,
  FileText,
  AlertTriangle,
  Search,
  X,
  Printer
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function BillingPage() {
  const [openinvoice, setopeninvoice] = useState(false);
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editInvoice, setEditInvoice] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
      setInvoiceList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch("/api/revenue");
      const data = await res.json();
      const formatted = (Array.isArray(data) ? data : []).map((d: any) => ({
        month: d.month,
        revenue: Number(d.revenue || 0),
      }));
      setChartData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (invoice: any) => {
    try {
      const res = await fetch(`/api/invoice-items?invoice_id=${invoice.invoice_id}`);
      console.log(res)
      const items = await res.json();
      console.log(items)
      setEditInvoice({ ...invoice, items: Array.isArray(items) ? items : [] });
      setOpenEditModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const formattedInvoices = invoiceList.map((i: any) => ({
    id: i.invoice_id,
    customer: i.customer_name || "Walk-in Customer",
    amount: `₹${Number(i.total_amount || 0)}`,
    status: i.payment_status || "Pending",
    date: i.due_date ? new Date(i.due_date).toLocaleDateString() : "-",
    salesperson: i.salesperson_name || "Admin",
    raw: i,
  }));

  const filteredInvoices = formattedInvoices.filter((i) => {
    const matchesSearch =
      i.customer.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoiceList.reduce(
    (sum, i: any) => sum + Number(i.total_amount || 0),
    0
  );

  const pendingAmount = invoiceList
    .filter((i: any) => i.payment_status === "Pending")
    .reduce((sum, i: any) => sum + Number(i.total_amount || 0), 0);

  const overdueCount = invoiceList.filter(
    (i: any) => i.payment_status === "Overdue"
  ).length;

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
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
            <Link href="/dashboard/create-invoice">
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition">
                <Plus size={16} />
                Create Invoice
              </button>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              icon={<DollarSign className="text-green-400" />}
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            />
            <StatCard
              icon={<FileText className="text-yellow-400" />}
              title="Outstanding"
              value={`₹${pendingAmount.toLocaleString("en-IN")}`}
            />
            <StatCard
              icon={<AlertTriangle className="text-red-400" />}
              title="Overdue"
              value={overdueCount}
            />
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-3 bg-zinc-800/80 border border-zinc-700 px-3.5 py-2 rounded-xl w-[320px]">
                <Search size={16} className="text-gray-400" />
                <input
                  placeholder="Search invoice ID or customer..."
                  className="bg-transparent outline-none text-white text-xs w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-xl text-xs text-white outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <h3 className="text-white font-semibold mb-4 text-sm">All Invoices</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead className="text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="text-left py-3 px-4">Invoice ID</th>
                    <th className="text-left px-4">Customer</th>
                    <th className="text-right px-4">Amount</th>
                    <th className="text-center px-4">Status</th>
                    <th className="text-center px-4">Due Date</th>
                    <th className="text-left px-4">Salesperson</th>
                    <th className="text-right px-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800">
                  {paginatedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-500">
                        No invoices found.
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((i, idx) => (
                      <tr key={idx} className="hover:bg-zinc-800/40 transition">
                        <td
                          className="py-4 px-4 font-mono text-blue-400 font-bold cursor-pointer"
                          onClick={() => setViewInvoice(i)}
                        >
                          {i.id}
                        </td>
                        <td className="px-4 text-white font-semibold">{i.customer}</td>
                        <td className="px-4 text-white text-right font-black">{i.amount}</td>
                        <td className="px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badge[i.status]}`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="px-4 text-white text-center">{i.date}</td>
                        <td className="px-4 text-zinc-300">{i.salesperson}</td>
                        <td className="px-4 text-right">
                          <div className="flex justify-end gap-3">
                            <Eye
                              className="text-blue-400 hover:text-blue-300 cursor-pointer"
                              size={16}
                              onClick={() => setViewInvoice(i)}
                            />
                            <Pencil
                              className="text-green-400 hover:text-green-300 cursor-pointer"
                              size={16}
                              onClick={() => handleEdit(i.raw)}
                            />
                            <Download
                              className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                              size={16}
                              onClick={() => downloadInvoicePDF(i)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs">
                  Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 📊 CHART */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 text-sm">
              Monthly Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  fill="#22c55e22"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ✅ INVOICE VIEW MODAL */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#141416] border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-white font-bold text-base">Invoice Details: <span className="text-blue-400">{viewInvoice.id}</span></h3>
              <button onClick={() => setViewInvoice(null)} className="text-zinc-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-3 text-xs bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <div className="flex justify-between"><span className="text-zinc-500">Customer Name:</span> <span className="text-white font-semibold">{viewInvoice.customer}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Total Amount:</span> <span className="text-white font-bold">{viewInvoice.amount}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Payment Status:</span> <span className="text-green-400 font-bold">{viewInvoice.status}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Due Date:</span> <span className="text-white">{viewInvoice.date}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Salesperson:</span> <span className="text-white">{viewInvoice.salesperson}</span></div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => downloadInvoicePDF(viewInvoice)}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer size={15} /> Download PDF
              </button>
              <button
                onClick={() => setViewInvoice(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
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
        setOpen={(v: any) => {
          setOpenEditModal(v);
          if (!v) setEditInvoice(null);
        }}
        refresh={fetchInvoices}
        editData={editInvoice}
      />
    </div>
  );
}

const StatCard = ({ icon, title, value }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
    <div>
      <p className="text-zinc-500 text-xs uppercase font-semibold mb-1">{title}</p>
      <h2 className="text-2xl font-black text-white">{value}</h2>
    </div>
    <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center">
      {icon}
    </div>
  </div>
);