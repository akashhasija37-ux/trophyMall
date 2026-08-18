"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Printer, FileText, Download, ChevronDown } from "lucide-react";

type QuotationRecord = {
  id: string;
  date: string;
  quotationNo: string;
  customer: string;
  items: number;
  value: number;
  validTill: string;
  status: "Sent" | "Converted" | "Expired" | "Draft";
  converted: "Yes" | "No";
};

const initialQuotations: QuotationRecord[] = [
  {
    id: "1",
    date: "2026-06-12",
    quotationNo: "QTN-2026-0089",
    customer: "Delhi Sports Club",
    items: 5,
    value: 45000,
    validTill: "2026-06-19",
    status: "Sent",
    converted: "No",
  },
  {
    id: "2",
    date: "2026-06-11",
    quotationNo: "QTN-2026-0088",
    customer: "IIM Ahmedabad",
    items: 3,
    value: 120000,
    validTill: "2026-06-18",
    status: "Converted",
    converted: "Yes",
  },
  {
    id: "3",
    date: "2026-06-10",
    quotationNo: "QTN-2026-0087",
    customer: "St. Xavier School",
    items: 8,
    value: 34500,
    validTill: "2026-06-17",
    status: "Expired",
    converted: "No",
  },
  {
    id: "4",
    date: "2026-06-09",
    quotationNo: "QTN-2026-0086",
    customer: "Pune FC",
    items: 12,
    value: 78000,
    validTill: "2026-06-16",
    status: "Sent",
    converted: "No",
  },
];

export default function QuotationRegisterPage() {
  const [records, setRecords] = useState<QuotationRecord[]>(initialQuotations);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<"Today" | "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "Custom">("Monthly");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [salespersonFilter, setSalespersonFilter] = useState("All Salespersons");

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar relative">
          
          {/* TOP BREADCRUMB HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Reports / <span className="text-zinc-300">Quotation Register</span>
              </p>
              <h1 className="text-xl font-bold text-white">Quotation Register</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER & EXPORT BUTTONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Quotation Register</h2>
                <p className="text-zinc-400 text-sm">All quotations with conversion status</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <Printer size={16} /> Print
                </button>
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <FileText size={16} /> PDF
                </button>
                <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm">
                  <Download size={16} /> Export Excel
                </button>
              </div>
            </div>

            {/* FILTERS & SEARCH CONTAINER */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
              
              {/* TOP FILTER BAR: TIME TABS & SEARCH */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["Today", "Weekly", "Monthly", "Quarterly", "Yearly", "Custom"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTimeFilter(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        timeFilter === tab
                          ? "bg-green-700 text-white"
                          : "bg-[#1a1a1c] text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
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

              {/* SECONDARY DROPDOWN FILTERS */}
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Sent">Sent</option>
                  <option value="Converted">Converted</option>
                  <option value="Expired">Expired</option>
                </select>

                <select
                  value={salespersonFilter}
                  onChange={(e) => setSalespersonFilter(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="All Salespersons">All Salespersons</option>
                  <option value="Manoj Nagdev">Manoj Nagdev</option>
                  <option value="Rajesh Kumar">Rajesh Kumar</option>
                </select>
              </div>

            </div>

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-3.5 px-6 font-semibold">Date</th>
                      <th className="py-3.5 px-6 font-semibold">Quotation No</th>
                      <th className="py-3.5 px-6 font-semibold">Customer</th>
                      <th className="py-3.5 px-6 font-semibold">Items</th>
                      <th className="py-3.5 px-6 font-semibold">Value</th>
                      <th className="py-3.5 px-6 font-semibold">Valid Till</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                      <th className="py-3.5 px-6 font-semibold">Converted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{record.date}</td>
                          <td className="py-4 px-6 font-mono text-xs font-semibold text-white">{record.quotationNo}</td>
                          <td className="py-4 px-6 font-semibold text-white">{record.customer}</td>
                          <td className="py-4 px-6 text-zinc-300 text-center">{record.items}</td>
                          <td className="py-4 px-6 font-bold text-white">{formatCurrency(record.value)}</td>
                          <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{record.validTill}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              record.status === "Converted" 
                                ? "bg-green-950/60 text-green-400 border border-green-800/50" 
                                : record.status === "Expired"
                                ? "bg-red-950/60 text-red-400 border border-red-800/50"
                                : "bg-blue-950/60 text-blue-400 border border-blue-800/50"
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`font-semibold text-xs ${record.converted === "Yes" ? "text-green-400" : "text-zinc-500"}`}>
                              {record.converted}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                          No quotation register records found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER / RECORD COUNT */}
              <div className="bg-[#18181a] px-6 py-3 border-t border-zinc-800 text-xs text-zinc-400">
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