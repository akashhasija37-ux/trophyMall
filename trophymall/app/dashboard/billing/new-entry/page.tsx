"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, ArrowLeft, Trash2, Save, Check } from "lucide-react";

type LedgerEntry = {
  id: string;
  account: string;
  type: "Debit" | "Credit";
  amount: number;
  narration: string;
};

export default function NewJournalEntryPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    {
      id: "1",
      account: "Cash Account",
      type: "Debit",
      amount: 0,
      narration: "",
    },
    {
      id: "2",
      account: "Cash Account",
      type: "Credit",
      amount: 0,
      narration: "",
    },
  ]);

  const handleAddRow = () => {
    setEntries([
      ...entries,
      {
        id: crypto.randomUUID(),
        account: "Cash Account",
        type: "Debit",
        amount: 0,
        narration: "",
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (entries.length > 2) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof LedgerEntry, value: any) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const totalDebit = entries
    .filter((e) => e.type === "Debit")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
  const totalCredit = entries
    .filter((e) => e.type === "Credit")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const isBalanced = totalDebit === totalCredit;

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          
          {/* HEADER SECTION */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Journal Entry</span>
              </p>
              <h1 className="text-xl font-bold text-white">Journal Entry</h1>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium border border-green-700 shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            
            {/* SUB HEADER */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
              <ArrowLeft size={16} className="cursor-pointer hover:text-white transition-colors" />
              <span className="cursor-pointer hover:text-white transition-colors">Journal Entry</span>
              <span>›</span>
              <span className="text-zinc-200">New Entry</span>
            </div>

            {/* ENTRY DETAILS */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
              <h3 className="text-base font-semibold text-white mb-5">Entry Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium ml-1">Voucher No</label>
                  <input 
                    value="JV-2026-0022" 
                    readOnly
                    className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium ml-1">
                    Entry Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none transition-colors appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium ml-1">Reference No</label>
                  <input 
                    placeholder="Optional"
                    className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-xs text-zinc-400 font-medium ml-1">Voucher Type</label>
                  <select className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer">
                    <option>Journal</option>
                    <option>Contra</option>
                    <option>Credit Note</option>
                    <option>Debit Note</option>
                  </select>
                </div>
              </div>
            </div>

            {/* LEDGER ENTRIES */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-zinc-800/50">
                <h3 className="text-base font-semibold text-white">Ledger Entries</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-zinc-400 bg-[#161618] border-b border-zinc-800/80">
                    <tr>
                      <th className="font-medium py-3 px-5">Account</th>
                      <th className="font-medium py-3 px-2 w-40">Type</th>
                      <th className="font-medium py-3 px-2 w-48">Amount (₹)</th>
                      <th className="font-medium py-3 px-2">Narration</th>
                      <th className="font-medium py-3 px-5 w-16 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-zinc-800/20 transition-colors group">
                        <td className="py-4 px-5">
                          <select 
                            value={entry.account}
                            onChange={(e) => updateEntry(entry.id, 'account', e.target.value)}
                            className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none cursor-pointer"
                          >
                            <option>Cash Account</option>
                            <option>Bank Account</option>
                            <option>Sales Account</option>
                            <option>Purchase Account</option>
                          </select>
                        </td>
                        <td className="py-4 px-2">
                          <select 
                            value={entry.type}
                            onChange={(e) => updateEntry(entry.id, 'type', e.target.value)}
                            className={`w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer font-medium ${
                              entry.type === 'Debit' ? 'text-red-400' : 'text-green-500'
                            }`}
                          >
                            <option value="Debit" className="text-red-400">Debit</option>
                            <option value="Credit" className="text-green-500">Credit</option>
                          </select>
                        </td>
                        <td className="py-4 px-2">
                          <input 
                            type="number" 
                            value={entry.amount === 0 ? '' : entry.amount}
                            placeholder="0"
                            onChange={(e) => updateEntry(entry.id, 'amount', Number(e.target.value))}
                            className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none" 
                          />
                        </td>
                        <td className="py-4 px-2">
                          <input 
                            placeholder="Narration..." 
                            value={entry.narration}
                            onChange={(e) => updateEntry(entry.id, 'narration', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent focus:border-zinc-500 outline-none text-zinc-200 placeholder-zinc-600 py-1"
                          />
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button 
                            onClick={() => handleRemoveRow(entry.id)}
                            className="text-zinc-500 hover:text-red-500 transition-colors opacity-50 hover:opacity-100"
                            disabled={entries.length <= 2}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTALS ROW */}
              <div className="flex items-center justify-between p-5 bg-[#161618] border-t border-zinc-800/80">
                <div className="w-[180px] text-zinc-400 text-sm font-medium">
                  Totals
                </div>
                
                <div className="flex-1 flex items-center justify-center gap-12">
                  <div className="flex flex-col text-sm font-medium">
                    <span className="text-red-400">Dr: ₹{totalDebit}</span>
                    <span className="text-green-500">Cr: ₹{totalCredit}</span>
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    {isBalanced ? (
                      <span className="inline-flex items-center gap-1.5 border border-green-800/80 text-green-500 bg-green-900/10 px-3 py-1 rounded-md text-xs font-medium">
                        <Check size={14} /> Balanced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 border border-red-800/80 text-red-500 bg-red-900/10 px-3 py-1 rounded-md text-xs font-medium">
                        Unbalanced
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-[100px]"></div>
              </div>
              
              {/* ADD ROW BUTTON */}
              <div className="p-4 border-t border-zinc-800/80 bg-[#161618]">
                <button 
                  onClick={handleAddRow} 
                  className="text-green-600 hover:text-green-500 font-medium text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={16} /> Add Row
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end items-center gap-4 pt-4 pb-10">
              <button className="bg-[#1a1a1c] hover:bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                Cancel
              </button>
              <button className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border shadow-sm ${
                isBalanced 
                  ? 'bg-green-800 hover:bg-green-700 text-white border-green-700' 
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
              }`}>
                <Save size={16} /> Post Entry
              </button>
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