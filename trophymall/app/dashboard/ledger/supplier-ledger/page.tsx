"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download, Calendar } from "lucide-react";

type SupplierSummary = {
  id: string;
  name: string;
  phone: string;
  location: string;
  code: string;
  outstanding: number;
  overdueText?: string;
  isClear?: boolean;
  creditLimit: number;
  lastPurchase: string;
  totalPurchase: number;
};

type SupplierTransaction = {
  id: string;
  date: string;
  type: "Purchase" | "Payment";
  reference: string;
  purchaseAmt: number | null;
  paymentAmt: number | null;
  balance: number;
  status: "Pending" | "Paid";
};

const suppliersData: SupplierSummary[] = [
  {
    id: "1",
    name: "Raj Metals Pvt Ltd",
    phone: "9876543210",
    location: "Mumbai",
    code: "S001",
    outstanding: 34500,
    creditLimit: 200000,
    lastPurchase: "2026-06-11",
    totalPurchase: 485000,
  },
  {
    id: "2",
    name: "Delhi Trophy House",
    phone: "9876504321",
    location: "Delhi",
    code: "S002",
    outstanding: 18200,
    overdueText: "5d overdue",
    creditLimit: 100000,
    lastPurchase: "2026-06-05",
    totalPurchase: 195000,
  },
  {
    id: "3",
    name: "Acrylic World",
    phone: "9876509876",
    location: "Bangalore",
    code: "S003",
    outstanding: 0,
    isClear: true,
    creditLimit: 75000,
    lastPurchase: "2026-05-28",
    totalPurchase: 120000,
  },
];

const supplierTransactions: Record<string, SupplierTransaction[]> = {
  "1": [
    { id: "st1", date: "2026-06-11", type: "Purchase", reference: "PUR-2026-0041", purchaseAmt: 34500, paymentAmt: null, balance: 34500, status: "Pending" },
    { id: "st2", date: "2026-06-01", type: "Payment", reference: "BPY-2026-0019", purchaseAmt: null, paymentAmt: 50000, balance: 0, status: "Paid" },
    { id: "st3", date: "2026-05-22", type: "Purchase", reference: "PUR-2026-0038", purchaseAmt: 50000, paymentAmt: null, balance: 50000, status: "Paid" },
    { id: "st4", date: "2026-05-15", type: "Payment", reference: "BPY-2026-0018", purchaseAmt: null, paymentAmt: 80000, balance: 0, status: "Paid" },
  ],
  "2": [
    { id: "st20", date: "2026-06-05", type: "Purchase", reference: "PUR-2026-0035", purchaseAmt: 18200, paymentAmt: null, balance: 18200, status: "Pending" },
  ],
  "3": [
    { id: "st30", date: "2026-05-28", type: "Payment", reference: "BPY-2026-0010", purchaseAmt: null, paymentAmt: 25000, balance: 0, status: "Paid" },
  ],
};

export default function SupplierLedgerPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierSummary>(suppliersData[0]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredSuppliers = suppliersData.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  const transactions = supplierTransactions[selectedSupplier.id] || [];

  const totalPurchaseSum = transactions.reduce((acc, t) => acc + (t.purchaseAmt || 0), 0);
  const totalPaymentSum = transactions.reduce((acc, t) => acc + (t.paymentAmt || 0), 0);

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
                Reports / <span className="text-zinc-300">Supplier Ledger</span>
              </p>
              <h1 className="text-xl font-bold text-white">Supplier Ledger</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1700px] mx-auto flex flex-col space-y-6">
            
            {/* SPLIT LAYOUT: SUPPLIER LIST (LEFT) & SELECTED PROFILE/TRANSACTIONS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: SUPPLIERS LIST & SEARCH */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                
                {/* SEARCH BOX */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-zinc-500 shadow-lg"
                  />
                  <Search size={15} className="absolute left-3.5 top-3 text-zinc-500" />
                </div>

                {/* SUPPLIERS CARDS LIST */}
                <div className="flex flex-col space-y-3">
                  {filteredSuppliers.map((sup) => {
                    const isSelected = selectedSupplier.id === sup.id;
                    return (
                      <div
                        key={sup.id}
                        onClick={() => setSelectedSupplier(sup)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-[#18181c] border-green-700 shadow-xl"
                            : "bg-[#121212] border-zinc-800/80 hover:bg-[#161619]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-white font-bold text-sm">{sup.name}</h4>
                          {sup.isClear ? (
                            <span className="text-xs font-semibold text-green-400">Clear</span>
                          ) : (
                            <span className="text-sm font-bold text-red-400">{formatCurrency(sup.outstanding)}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                          <span>{sup.phone} • {sup.location}</span>
                          {sup.overdueText && <span className="text-red-400 font-semibold">{sup.overdueText}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* RIGHT COLUMN: SELECTED SUPPLIER DETAILS & TRANSACTIONS */}
              <div className="lg:col-span-8 flex flex-col space-y-6">
                
                {/* SUPPLIER BANNER CARD */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedSupplier.name}</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {selectedSupplier.phone} • {selectedSupplier.code} • {selectedSupplier.location}
                      </p>
                    </div>

                    <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium">
                      <Download size={15} /> Export
                    </button>
                  </div>

                  {/* METRICS GRID */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Outstanding</span>
                      <span className="text-lg font-bold text-red-400">{formatCurrency(selectedSupplier.outstanding)}</span>
                    </div>
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Credit Limit</span>
                      <span className="text-lg font-bold text-white">{formatCurrency(selectedSupplier.creditLimit)}</span>
                    </div>
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Last Purchase</span>
                      <span className="text-sm font-semibold text-white font-mono">{selectedSupplier.lastPurchase}</span>
                    </div>
                    <div className="bg-[#18181c] border border-zinc-800/60 rounded-xl p-4">
                      <span className="text-xs text-zinc-400 block mb-1">Total Purchase</span>
                      <span className="text-lg font-bold text-green-400">{formatCurrency(selectedSupplier.totalPurchase)}</span>
                    </div>
                  </div>

                </div>

                {/* TRANSACTION HISTORY SECTION */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-base font-bold text-white">Transaction History</h3>

                    <div className="flex items-center gap-3 flex-wrap">
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

                  {/* TABLE */}
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                          <th className="py-3.5 px-4 font-semibold">Date</th>
                          <th className="py-3.5 px-4 font-semibold">Type</th>
                          <th className="py-3.5 px-4 font-semibold">Reference</th>
                          <th className="py-3.5 px-4 font-semibold">Purchase Amt</th>
                          <th className="py-3.5 px-4 font-semibold">Payment Amt</th>
                          <th className="py-3.5 px-4 font-semibold">Balance</th>
                          <th className="py-3.5 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-sm">
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-[#18181c] transition-colors">
                              <td className="py-4 px-4 text-zinc-400 font-mono text-xs">{tx.date}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                                  tx.type === "Purchase"
                                    ? "bg-blue-950/60 text-blue-400 border border-blue-800/50"
                                    : "bg-green-950/60 text-green-400 border border-green-800/50"
                                }`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono text-xs font-semibold text-white">{tx.reference}</td>
                              <td className="py-4 px-4 font-semibold text-red-400">{formatCurrency(tx.purchaseAmt)}</td>
                              <td className="py-4 px-4 font-semibold text-green-400">{formatCurrency(tx.paymentAmt)}</td>
                              <td className="py-4 px-4 font-bold text-white">{formatCurrency(tx.balance)}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  tx.status === "Pending"
                                    ? "bg-yellow-950/60 text-yellow-400 border border-yellow-800/50"
                                    : "bg-green-950/60 text-green-400 border border-green-800/50"
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-zinc-500">
                              No transaction history available for this supplier.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#18181a] border-t border-zinc-800 text-sm font-bold text-white">
                          <td colSpan={3} className="py-3.5 px-4 text-zinc-400">Outstanding Payable</td>
                          <td className="py-3.5 px-4 text-red-400">{formatCurrency(totalPurchaseSum)}</td>
                          <td className="py-3.5 px-4 text-green-400">{formatCurrency(totalPaymentSum)}</td>
                          <td colSpan={2} className="py-3.5 px-4 text-white">{formatCurrency(selectedSupplier.outstanding)}</td>
                        </tr>
                      </tfoot>
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