"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Download, RefreshCw, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

type ReconRecord = {
  id: string;
  txnDate: string;
  voucherDate: string;
  voucherNo: string;
  narration: string;
  amount: number;
  bankReflectionDate: string;
  status: "Reconciled" | "Pending";
  bankAccount: string;
};

const initialReconRecords: ReconRecord[] = [
  {
    id: "1",
    txnDate: "2026-06-12",
    voucherDate: "2026-06-12",
    voucherNo: "BNK-2026-0102",
    narration: "INV-0901 — Delhi Sports Club",
    amount: 45150,
    bankReflectionDate: "2026-06-13",
    status: "Reconciled",
    bankAccount: "HDFC Bank - Current A/C",
  },
  {
    id: "2",
    txnDate: "2026-06-12",
    voucherDate: "2026-06-12",
    voucherNo: "BPY-2026-0021",
    narration: "Raj Metals payment",
    amount: 34500,
    bankReflectionDate: "Not reflected",
    status: "Pending",
    bankAccount: "HDFC Bank - Current A/C",
  },
  {
    id: "3",
    txnDate: "2026-06-11",
    voucherDate: "2026-06-11",
    voucherNo: "BNK-2026-0101",
    narration: "INV-0898 — IIM Ahmedabad",
    amount: 113400,
    bankReflectionDate: "2026-06-12",
    status: "Reconciled",
    bankAccount: "HDFC Bank - Current A/C",
  },
  {
    id: "4",
    txnDate: "2026-06-10",
    voucherDate: "2026-06-10",
    voucherNo: "BPY-2026-0020",
    narration: "DTDC courier charges",
    amount: 2400,
    bankReflectionDate: "Not reflected",
    status: "Pending",
    bankAccount: "HDFC Bank - Current A/C",
  },
  {
    id: "5",
    txnDate: "2026-06-09",
    voucherDate: "2026-06-09",
    voucherNo: "BNK-2026-0100",
    narration: "INV-0895 — St. Xavier School",
    amount: 34650,
    bankReflectionDate: "2026-06-10",
    status: "Reconciled",
    bankAccount: "HDFC Bank - Current A/C",
  },
];

export default function BankReconciliationPage() {
  const [records, setRecords] = useState<ReconRecord[]>(initialReconRecords);
  const [selectedBank, setSelectedBank] = useState("HDFC Bank - Current A/C");
  const [statusTab, setStatusTab] = useState<"All" | "Reconciled" | "Pending">("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = records.filter((item) => {
    const matchesBank = item.bankAccount === selectedBank;
    const matchesStatus = statusTab === "All" || item.status === statusTab;
    return matchesBank && matchesStatus;
  });

  const totalEntries = filteredRecords.length;
  const reconciledCount = filteredRecords.filter((r) => r.status === "Reconciled").length;
  const pendingCount = filteredRecords.filter((r) => r.status === "Pending").length;
  const unmatchedAmtSum = filteredRecords
    .filter((r) => r.status === "Pending")
    .reduce((sum, r) => sum + r.amount, 0);

  const toggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newStatus = r.status === "Reconciled" ? "Pending" : "Reconciled";
          return {
            ...r,
            status: newStatus,
            bankReflectionDate: newStatus === "Reconciled" ? dayjs().format("YYYY-MM-DD") : "Not reflected",
          };
        }
        return r;
      })
    );
  };

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
                Ledger / <span className="text-zinc-300">Bank Recon</span>
              </p>
              <h1 className="text-xl font-bold text-white">Bank Recon</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1700px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER & BUTTONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Bank Reconciliation</h2>
                <p className="text-zinc-400 text-sm">Match voucher entries with bank statement</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[#18181c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm">
                  <RefreshCw size={15} /> Start Reconciliation
                </button>
                <button className="bg-[#18181c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm">
                  <Download size={15} /> Export
                </button>
              </div>
            </div>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                <span className="text-xs text-zinc-400 block mb-1">Total Entries</span>
                <span className="text-2xl font-black text-white">{totalEntries}</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                <span className="text-xs text-zinc-400 block mb-1">Reconciled</span>
                <span className="text-2xl font-black text-green-400">{reconciledCount}</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                <span className="text-xs text-zinc-400 block mb-1">Pending</span>
                <span className="text-2xl font-black text-red-400">{pendingCount}</span>
              </div>
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                <span className="text-xs text-zinc-400 block mb-1">Unmatched Amt</span>
                <span className="text-2xl font-black text-yellow-400">{formatCurrency(unmatchedAmtSum)}</span>
              </div>
            </div>

            {/* FILTERS CONTAINER */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-200 text-xs rounded-xl px-3.5 py-2.5 outline-none cursor-pointer font-medium"
                >
                  <option value="HDFC Bank - Current A/C">HDFC Bank - Current A/C</option>
                  <option value="SBI Bank - Cash Credit">SBI Bank - Cash Credit</option>
                </select>

                <div className="flex bg-[#18181c] border border-zinc-800 rounded-xl p-1">
                  {(["All", "Reconciled", "Pending"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        statusTab === tab
                          ? "bg-green-700 text-white"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
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

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-3.5 px-6 font-semibold">Txn Date</th>
                      <th className="py-3.5 px-6 font-semibold">Voucher Date</th>
                      <th className="py-3.5 px-6 font-semibold">Voucher No</th>
                      <th className="py-3.5 px-6 font-semibold">Narration</th>
                      <th className="py-3.5 px-6 font-semibold">Amount</th>
                      <th className="py-3.5 px-6 font-semibold">Bank Reflection Date</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                      <th className="py-3.5 px-6 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{record.txnDate}</td>
                          <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{record.voucherDate}</td>
                          <td className="py-4 px-6 font-mono text-xs font-semibold text-white">{record.voucherNo}</td>
                          <td className="py-4 px-6 text-zinc-200 font-medium">{record.narration}</td>
                          <td className="py-4 px-6 font-bold text-white">{formatCurrency(record.amount)}</td>
                          <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                            <span className={record.bankReflectionDate === "Not reflected" ? "text-red-400 font-medium" : "text-zinc-200"}>
                              {record.bankReflectionDate}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === "Reconciled"
                                ? "bg-green-950/60 text-green-400 border border-green-800/50"
                                : "bg-red-950/60 text-red-400 border border-red-800/50"
                            }`}>
                              {record.status === "Reconciled" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                              {record.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => toggleStatus(record.id)}
                              className="text-xs bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                          No reconciliation entries found matching current filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER / RECORD COUNT */}
              <div className="bg-[#18181a] px-6 py-3 border-t border-zinc-800 text-xs text-zinc-400">
                {filteredRecords.length} entries
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