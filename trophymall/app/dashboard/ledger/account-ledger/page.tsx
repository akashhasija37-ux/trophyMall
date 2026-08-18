"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Download, Calendar } from "lucide-react";

type LedgerEntry = {
  id: string;
  date: string;
  narration: string;
  debit: number | null;
  credit: number | null;
  balance: number;
};

type AccountData = {
  closingBalance: number;
  entries: LedgerEntry[];
};

const chartOfAccountsData: Record<string, AccountData> = {
  Cash: {
    closingBalance: 67300,
    entries: [
      { id: "1", date: "2026-06-12", narration: "Cash Sales — INV-2026-0902", debit: 12600, credit: null, balance: 12600 },
      { id: "2", date: "2026-06-12", narration: "Cash Receipt — RCP-2026-0215", debit: 50000, credit: null, balance: 62600 },
      { id: "3", date: "2026-06-11", narration: "Petty Cash Expense", debit: null, credit: 2500, balance: 60100 },
      { id: "4", date: "2026-06-10", narration: "Cash Sales — INV-2026-0895", debit: 8400, credit: null, balance: 68500 },
      { id: "5", date: "2026-06-09", narration: "Freight paid — DTDC", debit: null, credit: 1200, balance: 67300 },
    ],
  },
  "HDFC Bank": {
    closingBalance: 495150,
    entries: [
      { id: "1", date: "2026-06-12", narration: "INV-0901 payment from Delhi Sports Club", debit: 45150, credit: null, balance: 495150 },
      { id: "2", date: "2026-06-12", narration: "Supplier payment — Raj Metals", debit: null, credit: 34500, balance: 460650 },
      { id: "3", date: "2026-06-11", narration: "INV-0898 payment from IIM Ahmedabad", debit: 113400, credit: null, balance: 495000 },
      { id: "4", date: "2026-06-10", narration: "DTDC freight charges", debit: null, credit: 2400, balance: 381600 },
    ],
  },
  "SBI Bank": {
    closingBalance: 125000,
    entries: [
      { id: "1", date: "2026-06-10", narration: "Cheque deposit — St. Xavier School", debit: 34650, credit: null, balance: 125000 },
    ],
  },
  "Sales A/C": {
    closingBalance: 450000,
    entries: [
      { id: "1", date: "2026-06-12", narration: "Total monthly sales recorded", debit: null, credit: 450000, balance: 450000 },
    ],
  },
  "Purchase A/C": {
    closingBalance: 180000,
    entries: [
      { id: "1", date: "2026-06-10", narration: "Raw materials purchase from Raj Metals", debit: 180000, credit: null, balance: 180000 },
    ],
  },
  "GST Payable": {
    closingBalance: 24500,
    entries: [
      { id: "1", date: "2026-06-12", narration: "Output GST collected on invoices", debit: null, credit: 24500, balance: 24500 },
    ],
  },
};

export default function AccountLedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("Cash");
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

  const currentAccountData = chartOfAccountsData[selectedAccount] || { closingBalance: 0, entries: [] };

  const accountsList = Object.keys(chartOfAccountsData);

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
                Billing Management / <span className="text-zinc-300">Account Ledger</span>
              </p>
              <h1 className="text-xl font-bold text-white">Account Ledger</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1700px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER & EXPORT BUTTON */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Account Ledger</h2>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* SPLIT LAYOUT: CHART OF ACCOUNTS (LEFT) & LEDGER DETAILS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* LEFT COLUMN: CHART OF ACCOUNTS */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4 flex flex-col space-y-2 shadow-xl lg:col-span-1">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">
                  Chart of Accounts
                </h3>
                <div className="flex flex-col space-y-1">
                  {accountsList.map((accName) => {
                    const isSelected = selectedAccount === accName;
                    return (
                      <button
                        key={accName}
                        onClick={() => setSelectedAccount(accName)}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-green-700 text-white shadow-md shadow-green-950/50"
                            : "bg-[#18181a] text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/60"
                        }`}
                      >
                        {accName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: LEDGER STATEMENT & TABLE */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl lg:col-span-3 flex flex-col">
                
                {/* ACCOUNT HEADER & DATE FILTER BAR */}
                <div className="p-6 border-b border-zinc-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#151518]">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedAccount}</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Closing Balance: <span className="text-green-400 font-bold">{formatCurrency(currentAccountData.closingBalance)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 gap-2">
                      <Calendar size={13} className="text-zinc-500" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent text-white outline-none cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-zinc-500">to</span>
                    <div className="flex items-center bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 gap-2">
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

                {/* LEDGER ENTRIES TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                        <th className="py-3.5 px-6 font-semibold">Date</th>
                        <th className="py-3.5 px-6 font-semibold">Narration</th>
                        <th className="py-3.5 px-6 font-semibold">Debit</th>
                        <th className="py-3.5 px-6 font-semibold">Credit</th>
                        <th className="py-3.5 px-6 font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-sm">
                      {currentAccountData.entries.length > 0 ? (
                        currentAccountData.entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-[#1a1a1c] transition-colors">
                            <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{entry.date}</td>
                            <td className="py-4 px-6 font-medium text-white">{entry.narration}</td>
                            <td className="py-4 px-6 font-semibold text-green-400">{formatCurrency(entry.debit)}</td>
                            <td className="py-4 px-6 font-semibold text-red-400">{formatCurrency(entry.credit)}</td>
                            <td className="py-4 px-6 font-bold text-white">{formatCurrency(entry.balance)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-zinc-500">
                            No ledger transactions recorded for this account.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TABLE FOOTER */}
                <div className="bg-[#18181a] px-6 py-3 border-t border-zinc-800 text-xs text-zinc-400">
                  {currentAccountData.entries.length} transactions recorded
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