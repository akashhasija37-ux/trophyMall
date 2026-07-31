"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download, Printer, FileText } from "lucide-react";

type PurchaseRecord = {
  id: string;
  date: string;
  voucherNo: string;
  supplier: string;
  supplierInvNo: string;
  grossAmount: number;
  gst: number;
  netAmount: number;
  status: "Received" | "Partial" | "Pending";
};

const mockPurchaseRecords: PurchaseRecord[] = [
  {
    id: "1",
    date: "2026-06-12",
    voucherNo: "PUR-2026-0042",
    supplier: "Raj Metals Pvt Ltd",
    supplierInvNo: "RM-2026-445",
    grossAmount: 34500,
    gst: 1725,
    netAmount: 36225,
    status: "Received",
  },
  {
    id: "2",
    date: "2026-06-10",
    voucherNo: "PUR-2026-0041",
    supplier: "Delhi Trophy House",
    supplierInvNo: "DTH-2026-112",
    grossAmount: 18200,
    gst: 910,
    netAmount: 19110,
    status: "Partial",
  },
  {
    id: "3",
    date: "2026-06-07",
    voucherNo: "PUR-2026-0040",
    supplier: "Acrylic World",
    supplierInvNo: "AW-2026-389",
    grossAmount: 52800,
    gst: 2640,
    netAmount: 55440,
    status: "Received",
  },
  {
    id: "4",
    date: "2026-06-05",
    voucherNo: "PUR-2026-0039",
    supplier: "Raj Metals Pvt Ltd",
    supplierInvNo: "RM-2026-441",
    grossAmount: 28900,
    gst: 1445,
    netAmount: 30345,
    status: "Pending",
  },
];

export default function PurchaseRegisterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Monthly");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = mockPurchaseRecords.filter((item) => {
    const matchesSearch =
      item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplierInvNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSupplier =
      supplierFilter === "All Suppliers" || item.supplier === supplierFilter;
    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesSupplier && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          
          {/* TOP BREADCRUMB HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Purchase Register</span>
              </p>
              <h1 className="text-xl font-bold text-white">Purchase Register</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER & EXPORT ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Purchase Register</h2>
                <p className="text-zinc-400 text-sm">All purchase transactions with supplier details</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <Printer size={16} /> Print
                </button>
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <FileText size={16} /> PDF
                </button>
                <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm">
                  <Download size={16} /> Export Excel
                </button>
              </div>
            </div>

            {/* FILTERS & SEARCH CONTAINER */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* DATE RANGE TABS */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {["Today", "Weekly", "Monthly", "Quarterly", "Yearly", "Custom"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDateRange(tab)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        dateRange === tab
                          ? "bg-green-700 text-white"
                          : "bg-[#1a1a1c] text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* DROPDOWNS */}
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Suppliers</option>
                  <option>Raj Metals Pvt Ltd</option>
                  <option>Delhi Trophy House</option>
                  <option>Acrylic World</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Received</option>
                  <option>Partial</option>
                  <option>Pending</option>
                </select>
              </div>

              {/* SEARCH BAR */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-3.5 px-6 font-semibold">Date</th>
                      <th className="py-3.5 px-6 font-semibold">Voucher No</th>
                      <th className="py-3.5 px-6 font-semibold">Supplier</th>
                      <th className="py-3.5 px-6 font-semibold">Supplier Inv No</th>
                      <th className="py-3.5 px-6 font-semibold">Gross Amount</th>
                      <th className="py-3.5 px-6 font-semibold">GST</th>
                      <th className="py-3.5 px-6 font-semibold">Net Amount</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-xs">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-4 px-6 text-zinc-400">{record.date}</td>
                          <td className="py-4 px-6 font-semibold text-white">{record.voucherNo}</td>
                          <td className="py-4 px-6 text-zinc-200 font-medium">{record.supplier}</td>
                          <td className="py-4 px-6 text-zinc-400">{record.supplierInvNo}</td>
                          <td className="py-4 px-6 font-semibold text-white">{formatCurrency(record.grossAmount)}</td>
                          <td className="py-4 px-6 text-zinc-300">{formatCurrency(record.gst)}</td>
                          <td className="py-4 px-6 font-bold text-white">{formatCurrency(record.netAmount)}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                                record.status === "Received"
                                  ? "bg-green-950/60 text-green-400 border border-green-800/40"
                                  : record.status === "Partial"
                                  ? "bg-yellow-950/60 text-yellow-400 border border-yellow-800/40"
                                  : "bg-zinc-800 text-zinc-300"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                          No purchase records found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* RECORD COUNT FOOTER */}
              <div className="p-4 border-t border-zinc-800/60 text-xs text-zinc-400">
                {filteredRecords.length} records
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