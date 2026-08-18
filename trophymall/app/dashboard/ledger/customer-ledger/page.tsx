"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download, Calendar } from "lucide-react";

type CustomerSummary = {
  id: string;
  name: string;
  phone: string;
  code: string;
  outstanding: number;
  overdueText?: string;
  isClear?: boolean;
  creditLimit: number;
  lastPurchase: string;
  totalPurchase: number;
  creditUtilization: number;
};

type TransactionEntry = {
  id: string;
  invoiceDate: string;
  type: "Invoice" | "Payment";
  paymentType: string;
  reference: string;
  debit: number | null;
  credit: number | null;
  paymentReceived: string;
  bankReflected: string;
};

const customersData: CustomerSummary[] = [
  {
    id: "1",
    name: "Delhi Sports Club",
    phone: "9876501234",
    code: "C001",
    outstanding: 34500,
    creditLimit: 100000,
    lastPurchase: "2026-06-10",
    totalPurchase: 245000,
    creditUtilization: 35,
  },
  {
    id: "2",
    name: "Maharashtra Cricket Assoc",
    phone: "9876502345",
    code: "C002",
    outstanding: 18200,
    overdueText: "5d overdue",
    creditLimit: 50000,
    lastPurchase: "2026-06-05",
    totalPurchase: 110000,
    creditUtilization: 36,
  },
  {
    id: "3",
    name: "St. Xavier School",
    phone: "9876503456",
    code: "C003",
    outstanding: 0,
    isClear: true,
    creditLimit: 75000,
    lastPurchase: "2026-05-28",
    totalPurchase: 95000,
    creditUtilization: 0,
  },
  {
    id: "4",
    name: "Pune FC",
    phone: "9876504567",
    code: "C004",
    outstanding: 45600,
    overdueText: "12d overdue",
    creditLimit: 150000,
    lastPurchase: "2026-05-20",
    totalPurchase: 320000,
    creditUtilization: 30,
  },
  {
    id: "5",
    name: "IIM Ahmedabad",
    phone: "9876505678",
    code: "C005",
    outstanding: 31400,
    creditLimit: 200000,
    lastPurchase: "2026-06-11",
    totalPurchase: 410000,
    creditUtilization: 15,
  },
];

const customerTransactions: Record<string, TransactionEntry[]> = {
  "1": [
    { id: "t1", invoiceDate: "2026-06-10", type: "Invoice", paymentType: "Credit Customer", reference: "INV-2026-0891", debit: 34500, credit: null, paymentReceived: "Not Received", bankReflected: "Pending" },
    { id: "t2", invoiceDate: "2026-06-01", type: "Payment", paymentType: "Final Payment", reference: "RCP-2026-0211", debit: null, credit: 50000, paymentReceived: "2026-06-01", bankReflected: "2026-06-02" },
    { id: "t3", invoiceDate: "2026-05-25", type: "Invoice", paymentType: "Advance Payment", reference: "INV-2026-0872", debit: 50000, credit: null, paymentReceived: "2026-05-25", bankReflected: "Pending" },
    { id: "t4", invoiceDate: "2026-05-10", type: "Payment", paymentType: "Final Payment", reference: "RCP-2026-0198", debit: null, credit: 80000, paymentReceived: "2026-05-10", bankReflected: "2026-05-11" },
  ],
  "2": [
    { id: "t20", invoiceDate: "2026-06-05", type: "Invoice", paymentType: "Credit Customer", reference: "INV-2026-0880", debit: 18200, credit: null, paymentReceived: "Not Received", bankReflected: "Pending" },
  ],
  "3": [
    { id: "t30", invoiceDate: "2026-05-28", type: "Payment", paymentType: "Final Payment", reference: "RCP-2026-0180", debit: null, credit: 34650, paymentReceived: "2026-05-28", bankReflected: "2026-05-29" },
  ],
  "4": [
    { id: "t40", invoiceDate: "2026-05-20", type: "Invoice", paymentType: "Credit Customer", reference: "INV-2026-0850", debit: 45600, credit: null, paymentReceived: "Not Received", bankReflected: "Pending" },
  ],
  "5": [
    { id: "t50", invoiceDate: "2026-06-11", type: "Invoice", paymentType: "Bank Transfer", reference: "INV-2026-0898", debit: 31400, credit: null, paymentReceived: "2026-06-11", bankReflected: "2026-06-11" },
  ],
};

export default function CustomerLedgerPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary>(customersData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatCurrency = (val: number | null): string => {
    if (val === null || val === undefined) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredCustomers = customersData.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const transactions = customerTransactions[selectedCustomer.id] || [];

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
                Reports / <span className="text-zinc-300">Customer Ledger</span>
              </p>
              <h1 className="text-xl font-bold text-white">Customer Ledger</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1700px] mx-auto flex flex-col space-y-6">
            
            {/* SPLIT LAYOUT: CUSTOMER LIST (LEFT) & SELECTED PROFILE/TRANSACTIONS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: CUSTOMERS LIST & SEARCH */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                
                {/* SEARCH BOX */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-zinc-500 shadow-lg"
                  />
                  <Search size={15} className="absolute left-3.5 top-3 text-zinc-500" />
                </div>

                {/* CUSTOMERS CARDS LIST */}
                <div className="flex flex-col space-y-3">
                  {filteredCustomers.map((cust) => {
                    const isSelected = selectedCustomer.id === cust.id;
                    return (
                      <div
                        key={cust.id}
                        onClick={() => setSelectedCustomer(cust)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-[#18181c] border-green-700 shadow-xl"
                            : "bg-[#121212] border-zinc-800/80 hover:bg-[#161619]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-white font-bold text-sm">{cust.name}</h4>
                          {cust.isClear ? (
                            <span className="text-xs font-semibold text-green-400">Clear</span>
                          ) : (
                            <span className="text-sm font-bold text-yellow-500">{formatCurrency(cust.outstanding)}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                          <span>{cust.phone}</span>
                          {cust.overdueText && <span className="text-red-400 font-semibold">{cust.overdueText}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* RIGHT COLUMN: SELECTED CUSTOMER DETAILS & TRANSACTIONS */}
              <div className="lg:col-span-8 flex flex-col space-y-6">
                
                {/* CUSTOMER BANNER CARD */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCustomer.name}</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {selectedCustomer.phone} • {selectedCustomer.code}
                      </p>
                    </div>

                    <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium">
                      <Download size={15} /> Export Ledger
                    </button>
                  </div>

                  {/* METRICS GRID */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Outstanding</span>
                      <span className="text-lg font-bold text-yellow-400">{formatCurrency(selectedCustomer.outstanding)}</span>
                    </div>
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Credit Limit</span>
                      <span className="text-lg font-bold text-white">{formatCurrency(selectedCustomer.creditLimit)}</span>
                    </div>
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Last Purchase</span>
                      <span className="text-sm font-semibold text-white font-mono">{selectedCustomer.lastPurchase}</span>
                    </div>
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Total Purchase</span>
                      <span className="text-lg font-bold text-green-400">{formatCurrency(selectedCustomer.totalPurchase)}</span>
                    </div>
                  </div>

                  {/* CREDIT UTILIZATION BAR */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Credit Utilization</span>
                      <span className="text-zinc-200 font-bold">{selectedCustomer.creditUtilization}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-green-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${selectedCustomer.creditUtilization}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* TRANSACTION HISTORY SECTION */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-base font-bold text-white">Transaction History</h3>

                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-xs rounded-xl px-3.5 py-2 outline-none cursor-pointer"
                      >
                        <option value="All Status">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Received">Received</option>
                      </select>

                      <div className="flex items-center bg-[#1a1a1c] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-300 gap-2">
                        <Calendar size={13} className="text-zinc-500" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent text-white outline-none cursor-pointer"
                        />
                      </div>
                      <span className="text-xs text-zinc-500">to</span>
                      <div className="flex items-center bg-[#1a1a1c] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-300 gap-2">
                        <Calendar size={13} className="text-zinc-500" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent text-white outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STATUS PILLS BADGES ROW */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="bg-red-950/60 text-red-400 border border-red-900/50 px-3 py-1 rounded-lg text-xs font-semibold">Pending Collection</span>
                    <span className="bg-blue-950/60 text-blue-400 border border-blue-900/50 px-3 py-1 rounded-lg text-xs font-semibold">Payment Received</span>
                    <span className="bg-amber-950/60 text-amber-400 border border-amber-900/50 px-3 py-1 rounded-lg text-xs font-semibold">Deposit Pending</span>
                    <span className="bg-purple-950/60 text-purple-400 border border-purple-900/50 px-3 py-1 rounded-lg text-xs font-semibold">Bank Reflected</span>
                    <span className="bg-green-950/60 text-green-400 border border-green-900/50 px-3 py-1 rounded-lg text-xs font-semibold">Reconciled</span>
                  </div>

                  {/* TABLE */}
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                          <th className="py-3.5 px-4 font-semibold">Invoice Date</th>
                          <th className="py-3.5 px-4 font-semibold">Type</th>
                          <th className="py-3.5 px-4 font-semibold">Payment Type</th>
                          <th className="py-3.5 px-4 font-semibold">Reference</th>
                          <th className="py-3.5 px-4 font-semibold">Debit</th>
                          <th className="py-3.5 px-4 font-semibold">Credit</th>
                          <th className="py-3.5 px-4 font-semibold">Payment Received</th>
                          <th className="py-3.5 px-4 font-semibold">Bank Reflected</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-sm">
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-[#18181c] transition-colors">
                              <td className="py-4 px-4 text-zinc-400 font-mono text-xs">{tx.invoiceDate}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                                  tx.type === "Invoice"
                                    ? "bg-blue-950/60 text-blue-400 border border-blue-800/50"
                                    : "bg-green-950/60 text-green-400 border border-green-800/50"
                                }`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-xs">
                                <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md font-medium border border-zinc-700">
                                  {tx.paymentType}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono text-xs font-semibold text-white">{tx.reference}</td>
                              <td className="py-4 px-4 font-semibold text-red-400">{formatCurrency(tx.debit)}</td>
                              <td className="py-4 px-4 font-semibold text-green-400">{formatCurrency(tx.credit)}</td>
                              <td className="py-4 px-4 text-xs font-medium text-zinc-300">
                                <span className={tx.paymentReceived === "Not Received" ? "text-red-400" : "text-green-400"}>
                                  {tx.paymentReceived}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-xs font-medium text-zinc-400">{tx.bankReflected}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-zinc-500">
                              No transaction logs available for this customer.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

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