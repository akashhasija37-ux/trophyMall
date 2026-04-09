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
  TrendingUp,
  Search,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [editInvoice, setEditInvoice] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  // ✅ NEW STATES
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
    const res = await fetch("/api/invoices");
    const data = await res.json();
    setInvoiceList(data);
  };

  const fetchRevenue = async () => {
    const res = await fetch("/api/revenue");
    const data = await res.json();

    const formatted = data.map((d: any) => ({
      month: d.month,
      revenue: Number(d.revenue || 0),
    }));

    setChartData(formatted);
  };

  const handleEdit = async (invoice: any) => {
    const res = await fetch(
      `/api/invoice-items?invoice_id=${invoice.invoice_id}`,
    );
    const items = await res.json();

    setEditInvoice({ ...invoice, items });
    setOpenEditModal(true);
  };

  // FORMAT
  const formattedInvoices = invoiceList.map((i: any) => ({
    id: i.invoice_id,
    customer: i.customer_name,
    amount: `₹${Number(i.total_amount)}`,
    status: i.payment_status,
    date: i.due_date ? new Date(i.due_date).toLocaleDateString() : "-",
    salesperson: i.salesperson_name,
    raw: i,
  }));

  // ✅ FILTER LOGIC
  const filteredInvoices = formattedInvoices.filter((i) => {
    const matchesSearch =
      i.customer.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // STATS
  const totalRevenue = invoiceList.reduce(
    (sum, i: any) => sum + Number(i.total_amount || 0),
    0,
  );

  const pendingAmount = invoiceList
    .filter((i: any) => i.payment_status === "Pending")
    .reduce((sum, i: any) => sum + Number(i.total_amount || 0), 0);

  const overdueCount = invoiceList.filter(
    (i: any) => i.payment_status === "Overdue",
  ).length;

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
            <StatCard
              icon={<DollarSign className="text-green-400" />}
              title="Total Revenue"
              value={`₹${totalRevenue}`}
              color="green"
            />
            <StatCard
              icon={<FileText className="text-yellow-400" />}
              title="Outstanding"
              value={`₹${pendingAmount}`}
              color="yellow"
            />
            <StatCard
              icon={<AlertTriangle className="text-red-400" />}
              title="Overdue"
              value={overdueCount}
              color="red"
            />
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {/* 🔍 SEARCH + FILTER */}
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-3 bg-zinc-800 px-3 py-2 rounded-lg w-[300px]">
                <Search size={16} className="text-gray-400" />
                <input
                  placeholder="Search invoice..."
                  className="bg-transparent outline-none text-white w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="bg-zinc-800 px-3 py-2 rounded text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
            </div>

            <h3 className="text-white font-semibold mb-4">All Invoices</h3>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                {/* HEADER */}
                <thead className="text-gray-400 text-sm border-b border-zinc-800">
                  <tr>
                    <th className="text-left py-3 w-[180px]">Invoice ID</th>
                    <th className="text-left w-[180px]">Customer</th>
                    <th className="text-right w-[120px]">Amount</th>
                    <th className="text-center w-[120px]">Status</th>
                    <th className="text-center w-[140px]">Due Date</th>
                    <th className="text-left w-[160px]">Salesperson</th>
                    <th className="text-right w-[120px]">Actions</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {paginatedInvoices.map((i, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-zinc-800 hover:bg-zinc-800/40 transition"
                    >
                      <td
                        className="py-4 text-blue-400 cursor-pointer truncate"
                        onClick={() => setViewInvoice(i)}
                      >
                        {i.id}
                      </td>

                      <td className="text-white truncate">{i.customer}</td>

                      {/* ✅ RIGHT ALIGN MONEY */}
                      <td className="text-white text-right font-medium">
                        {i.amount}
                      </td>

                      {/* ✅ CENTER STATUS */}
                      <td className="text-center">
                        <span
                          className={`px-3 py-1 rounded text-xs ${badge[i.status]}`}
                        >
                          {i.status}
                        </span>
                      </td>

                      <td className="text-white text-center">{i.date}</td>

                      <td className="text-white truncate">{i.salesperson}</td>

                      {/* ✅ ACTIONS FIX */}
                      <td className="text-right">
                        <div className="flex justify-end gap-3">
                          <Eye
                            className="text-blue-400 hover:text-blue-300 cursor-pointer"
                            size={18}
                            onClick={() => setViewInvoice(i)}
                          />
                          <Pencil
                            className="text-green-400 hover:text-green-300 cursor-pointer"
                            size={18}
                            onClick={() => handleEdit(i.raw)}
                          />
                          <Download
                            className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                            size={18}
                            onClick={() => downloadInvoicePDF(i)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-6">
                <p className="text-gray-400 text-sm">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-green-600 text-white"
                          : "bg-zinc-800 text-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 📊 CHART MOVED BELOW TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Monthly Revenue Trend
            </h3>

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

          {/* MODALS SAME AS BEFORE */}
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
      </div>
    </div>
  );
}

// 🔥 CLEAN STAT CARD COMPONENT
const StatCard = ({ icon, title, value, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between">
    <div>
      <div className="mb-2">{icon}</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
    </div>
  </div>
);
