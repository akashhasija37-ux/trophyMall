"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download } from "lucide-react";

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

const mockSalesRecords: SaleRecord[] = [
  {
    id: "1",
    date: "2026-06-12",
    invoice: "INV-2026-0901",
    customer: "Delhi Sports Club",
    category: "Cricket",
    type: "B2B",
    calcType: "Taxable Exclusive",
    paymentType: "Final Payment",
    salesperson: "Rajesh Kumar",
    gross: 45000,
    disc: -2000,
    gst: 2150,
    net: 45150,
    status: "Paid",
    packing: "Packed",
    reconStatus: "Reconciled",
  },
  {
    id: "2",
    date: "2026-06-12",
    invoice: "INV-2026-0902",
    customer: "Walk-in Customer",
    category: "Other",
    type: "B2C",
    calcType: "Taxable Inclusive",
    paymentType: "Final Payment",
    salesperson: "Priya Sharma",
    gross: 12000,
    disc: 0,
    gst: 600,
    net: 12600,
    status: "Paid",
    packing: "Delivered",
    reconStatus: "Reconciled",
  },
  {
    id: "3",
    date: "2026-06-11",
    invoice: "INV-2026-0899",
    customer: "Pune FC",
    category: "Football",
    type: "B2B",
    calcType: "Taxable Exclusive",
    paymentType: "Credit Customer",
    salesperson: "Amit Patel",
    gross: 78000,
    disc: -5000,
    gst: 3650,
    net: 76650,
    status: "Pending",
    packing: "Ready For Dispatch",
    reconStatus: "Pending Collection",
  },
  {
    id: "4",
    date: "2026-06-11",
    invoice: "INV-2026-0898",
    customer: "St. Xavier School",
    category: "School",
    type: "B2B",
    calcType: "Taxable Exclusive",
    paymentType: "Advance Payment",
    salesperson: "Neha Singh",
    gross: 34500,
    disc: -1500,
    gst: 1650,
    net: 34650,
    status: "Paid",
    packing: "Dispatched",
    reconStatus: "Bank Reflected",
  },
  {
    id: "5",
    date: "2026-06-10",
    invoice: "INV-2026-0895",
    customer: "Retail Walk-in",
    category: "Other",
    type: "B2C",
    calcType: "Non-Taxable",
    paymentType: "Final Payment",
    salesperson: "Vikram Joshi",
    gross: 8500,
    disc: -500,
    gst: 400,
    net: 8400,
    status: "Paid",
    packing: "Delivered",
    reconStatus: "Reconciled",
  },
  {
    id: "6",
    date: "2026-06-10",
    invoice: "INV-2026-0894",
    customer: "Apex University",
    category: "College",
    type: "Wholesaler",
    calcType: "Taxable Exclusive",
    paymentType: "Credit Customer",
    salesperson: "Anjali Mehta",
    gross: 120000,
    disc: -12000,
    gst: 5400,
    net: 113400,
    status: "Pending",
    packing: "Packing Started",
    reconStatus: "Pending Collection",
  },
  {
    id: "7",
    date: "2026-06-09",
    invoice: "INV-2026-0890",
    customer: "City Municipal",
    category: "Politician",
    type: "B2B",
    calcType: "Taxable Exclusive",
    paymentType: "Credit Customer",
    salesperson: "Rohit Verma",
    gross: 67000,
    disc: -3000,
    gst: 3200,
    net: 67200,
    status: "Overdue",
    packing: "Pending Packing",
    reconStatus: "Pending Collection",
  },
];

export default function SaleRegisterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [salespersonFilter, setSalespersonFilter] = useState("All Salespersons");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = mockSalesRecords.filter((item) => {
    const matchesSearch =
      item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.salesperson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSalesperson = salespersonFilter === "All Salespersons" || item.salesperson === salespersonFilter;
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;

    return matchesSearch && matchesSalesperson && matchesType && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          
          {/* TOP BREADCRUMB HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/65">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Sale Register</span>
              </p>
              <h1 className="text-xl font-bold text-white">Sale Register</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            {/* TITLE & EXPORT HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Sale Register</h2>
                <p className="text-zinc-400 text-sm">Complete sales transaction log with reconciliation tracking</p>
              </div>
              
              <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                <Download size={16} /> Export Excel
              </button>
            </div>

            {/* FILTER TABS & DROPDOWNS BAR */}
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
                  <option>Rajesh Kumar</option>
                  <option>Priya Sharma</option>
                  <option>Amit Patel</option>
                  <option>Neha Singh</option>
                  <option>Vikram Joshi</option>
                  <option>Anjali Mehta</option>
                  <option>Rohit Verma</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Types</option>
                  <option>B2B</option>
                  <option>B2C</option>
                  <option>Wholesaler</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Categories</option>
                  <option>Cricket</option>
                  <option>Football</option>
                  <option>School</option>
                  <option>College</option>
                  <option>Politician</option>
                  <option>Other</option>
                </select>

                <select className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                  <option>All Payment Types</option>
                  <option>Final Payment</option>
                  <option>Credit Customer</option>
                  <option>Advance Payment</option>
                </select>

                <select className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                  <option>All Packing Status</option>
                  <option>Packed</option>
                  <option>Delivered</option>
                  <option>Dispatched</option>
                  <option>Ready For Dispatch</option>
                </select>

                <select className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                  <option>All Recon Status</option>
                  <option>Reconciled</option>
                  <option>Pending Collection</option>
                  <option>Bank Reflected</option>
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
                <span className="text-2xl font-bold text-white mt-2">₹365,000</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Total Discount</span>
                <span className="text-2xl font-bold text-red-500 mt-2">₹24,000</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Total GST</span>
                <span className="text-2xl font-bold text-blue-400 mt-2">₹17,050</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <span className="text-xs font-medium text-zinc-400">Net Collection</span>
                <span className="text-2xl font-bold text-green-400 mt-2">₹358,050</span>
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
                            <span className={`px-2.5 py-1 rounded-md font-medium text-[11px] ${
                              record.calcType === "Taxable Inclusive" 
                                ? "bg-purple-950/60 text-purple-400 border border-purple-800/40"
                                : record.calcType === "Non-Taxable"
                                ? "bg-orange-950/60 text-orange-400 border border-orange-800/40"
                                : "bg-zinc-800 text-zinc-300"
                            }`}>
                              {record.calcType}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-md font-medium text-[11px] ${
                              record.paymentType === "Final Payment"
                                ? "bg-green-950/60 text-green-400 border border-green-800/40"
                                : record.paymentType === "Credit Customer"
                                ? "bg-yellow-950/60 text-yellow-400 border border-yellow-800/40"
                                : "bg-blue-950/60 text-blue-400 border border-blue-800/40"
                            }`}>
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
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                              record.reconStatus === "Reconciled" || record.reconStatus === "Bank Reflected"
                                ? "bg-green-950/40 text-green-400 border border-green-900/40"
                                : "bg-red-950/40 text-red-400 border border-red-900/40"
                            }`}>
                              {record.reconStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={15} className="py-12 text-center text-zinc-500">
                          No matching sales records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {/* Table Footer Totals */}
                  <tfoot>
                    <tr className="bg-[#18181a] border-t border-zinc-800 text-xs font-bold text-white">
                      <td colSpan={8} className="py-4 px-4 text-right">Totals:</td>
                      <td className="py-4 px-4">₹365,000</td>
                      <td className="py-4 px-4 text-red-500">-₹24,000</td>
                      <td className="py-4 px-4 text-blue-400">₹17,050</td>
                      <td className="py-4 px-4 text-green-400">₹358,050</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="h-8 bg-[#0a0a0a] border-t border-zinc-900 flex justify-between items-center px-4 text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div> Open Invoices: 0</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Draft Invoices: 0</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Pending Printing: 5</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Pending Dispatch: 8</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Outstanding Collection: <span className="text-red-400 font-medium">₹2,10,000</span></span>
          </div>
          <div className="flex items-center gap-4 opacity-75">
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">F5</kbd> Save</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">F6</kbd> Print</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">Ctrl+W</kbd> WhatsApp</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">Esc</kbd> Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
}