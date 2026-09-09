"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download } from "lucide-react";
import Link from "next/link";

type SaleRecord = {
  id: string;
  date: string;
  invoice: string;
  customer: string;
  category: string;
  type: string;
  calcType: string;
  paymentType: string;
  salesperson: string;
  gross: number;
  disc: number;
  gst: number;
  net: number;
  status: "Paid" | "Pending" | "Overdue";
  packing: string;
  reconStatus: string;
};

export default function SaleRegisterPage() {
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [salespersonFilter, setSalespersonFilter] = useState("All Salespersons");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    fetchSalesRegister();
  }, []);

  const fetchSalesRegister = async () => {
    try {
      const res = await fetch("/api/reports/sales-register");
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.map((item: any) => ({
          id: String(item.id),
          date: item.date ? item.date.split("T")[0] : "2026-09-09",
          invoice: item.invoice,
          customer: item.customer || "Walk-in Customer",
          category: "General",
          type: item.type || "GST Invoice",
          calcType: "Taxable Exclusive",
          paymentType: item.paymentType || "Final Payment",
          salesperson: item.salesperson || "Unassigned",
          gross: Number(item.gross || 0),
          disc: Number(item.disc || 0),
          gst: Number(item.gst || 0),
          net: Number(item.net || 0),
          status: item.status || "Paid",
          packing: "Dispatched",
          reconStatus: "Reconciled",
        }));
        setSalesRecords(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch sales register", err);
    }
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = salesRecords.filter((item) => {
    const matchesSearch =
      item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.salesperson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSalesperson = salespersonFilter === "All Salespersons" || item.salesperson === salespersonFilter;
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;

    return matchesSearch && matchesSalesperson && matchesType && matchesCategory;
  });

  const totalGross = filteredRecords.reduce((sum, r) => sum + r.gross, 0);
  const totalDisc = filteredRecords.reduce((sum, r) => sum + r.disc, 0);
  const totalGst = filteredRecords.reduce((sum, r) => sum + r.gst, 0);
  const totalNet = filteredRecords.reduce((sum, r) => sum + r.net, 0);

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/65">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Sale Register</span>
              </p>
              <h1 className="text-xl font-bold text-white">Sale Register</h1>
            </div>
            <Link href="/dashboard/create-invoice">
              <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
                <Plus size={16} /> New Invoice
              </button>
            </Link>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Sale Register</h2>
                <p className="text-zinc-400 text-sm">Complete live sales transaction log from database</p>
              </div>
              
              <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                <Download size={16} /> Export Excel
              </button>
            </div>

            {/* FILTERS BAR */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
              <div className="flex flex-wrap items-center gap-2">
                {["Today", "Weekly", "Monthly", "Quarterly", "Yearly", "Custom"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDateRange(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      dateRange === tab
                        ? "bg-zinc-700 text-white"
                        : "bg-[#1a1a1c] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <select
                  value={salespersonFilter}
                  onChange={(e) => setSalespersonFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Salespersons</option>
                  {Array.from(new Set(salesRecords.map(s => s.salesperson))).map(sp => (
                    <option key={sp}>{sp}</option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Types</option>
                  <option>GST Invoice</option>
                  <option>Non-GST Invoice</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Categories</option>
                  <option>General</option>
                </select>

                <select className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                  <option>All Payment Types</option>
                  <option>Final Payment</option>
                  <option>Credit</option>
                  <option>Advance</option>
                </select>

                <select className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                  <option>All Packing Status</option>
                  <option>Dispatched</option>
                </select>

                <select className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                  <option>All Recon Status</option>
                  <option>Reconciled</option>
                </select>
              </div>

              <div className="relative w-full md:w-80">
                <input 
                  type="text"
                  placeholder="Search invoice, customer, salesperson..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              </div>
            </div>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Gross Sales</span>
                <span className="text-2xl font-bold text-white mt-2">{formatCurrency(totalGross)}</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Total Discount</span>
                <span className="text-2xl font-bold text-red-500 mt-2">{formatCurrency(totalDisc)}</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Total GST</span>
                <span className="text-2xl font-bold text-blue-400 mt-2">{formatCurrency(totalGst)}</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Net Collection</span>
                <span className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(totalNet)}</span>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-4 px-4 font-semibold">Date</th>
                      <th className="py-4 px-4 font-semibold">Invoice</th>
                      <th className="py-4 px-4 font-semibold">Customer</th>
                      <th className="py-4 px-4 font-semibold">Category</th>
                      <th className="py-4 px-4 font-semibold">Type</th>
                      <th className="py-4 px-4 font-semibold">Calc Type</th>
                      <th className="py-4 px-4 font-semibold">Payment Type</th>
                      <th className="py-4 px-4 font-semibold">Salesperson</th>
                      <th className="py-4 px-4 font-semibold">Gross</th>
                      <th className="py-4 px-4 font-semibold">Disc</th>
                      <th className="py-4 px-4 font-semibold">GST</th>
                      <th className="py-4 px-4 font-semibold">Net</th>
                      <th className="py-4 px-4 font-semibold">Status</th>
                      <th className="py-4 px-4 font-semibold">Packing</th>
                      <th className="py-4 px-4 font-semibold">Recon Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-xs">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-4 px-4 text-zinc-400">{record.date}</td>
                          <td className="py-4 px-4 font-semibold text-white">{record.invoice}</td>
                          <td className="py-4 px-4 text-zinc-200 font-medium">{record.customer}</td>
                          <td className="py-4 px-4 text-zinc-400">{record.category}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold text-[11px]">
                              {record.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-md font-medium text-[11px] bg-zinc-800 text-zinc-300">
                              {record.calcType}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-md font-medium text-[11px] bg-green-950/60 text-green-400 border border-green-800/40">
                              {record.paymentType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-zinc-300">{record.salesperson}</td>
                          <td className="py-4 px-4 font-semibold text-white">{formatCurrency(record.gross)}</td>
                          <td className="py-4 px-4 font-semibold text-red-400">-₹{Math.abs(record.disc)}</td>
                          <td className="py-4 px-4 font-semibold text-blue-400">₹{record.gst}</td>
                          <td className="py-4 px-4 font-bold text-white">{formatCurrency(record.net)}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                              record.status === "Paid"
                                ? "bg-green-950/60 text-green-400 border border-green-800/40"
                                : record.status === "Pending"
                                ? "bg-yellow-950/60 text-yellow-400 border border-yellow-800/40"
                                : "bg-red-950/60 text-red-400 border border-red-800/40"
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-medium">
                              {record.packing}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-green-950/40 text-green-400 border border-green-900/40">
                              {record.reconStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={15} className="py-12 text-center text-zinc-500">
                          No matching sales records found from database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#18181a] border-t border-zinc-800 text-xs font-bold text-white">
                      <td colSpan={8} className="py-4 px-4 text-right">Totals:</td>
                      <td className="py-4 px-4">{formatCurrency(totalGross)}</td>
                      <td className="py-4 px-4 text-red-500">-₹{Math.abs(totalDisc)}</td>
                      <td className="py-4 px-4 text-blue-400">₹{totalGst.toFixed(2)}</td>
                      <td className="py-4 px-4 text-green-400">{formatCurrency(totalNet)}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}