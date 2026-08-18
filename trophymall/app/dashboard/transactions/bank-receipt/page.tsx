"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus } from "lucide-react";

type PendingInvoice = {
  id: string;
  invNo: string;
  dueDate: string;
  amount: number;
};

const mockInvoices: PendingInvoice[] = [
  { id: "1", invNo: "INV-2026-0901", dueDate: "Jun 20", amount: 45150 },
  { id: "2", invNo: "INV-2026-0895", dueDate: "Jun 15", amount: 34650 },
  { id: "3", invNo: "INV-2026-0888", dueDate: "Jun 10", amount: 22800 },
];

export default function BankReceiptPage() {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [bankAccount, setBankAccount] = useState("HDFC Bank — Current A/C");

  const toggleInvoice = (id: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedTotal = mockInvoices
    .filter((inv) => selectedInvoices.includes(inv.id))
    .reduce((sum, inv) => sum + inv.amount, 0);

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
                Billing Management / <span className="text-zinc-300">Bank Receipt</span>
              </p>
              <h1 className="text-xl font-bold text-white">Bank Receipt</h1>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm border border-green-700">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Bank Receipt</h2>
                <p className="text-zinc-400 text-sm">Record incoming payment against outstanding invoices</p>
              </div>
              
              <div className="flex items-center">
                <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium border border-green-700 shadow-sm">
                  <Plus size={16} /> New Receipt
                </button>
              </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* LEFT COLUMN - FORM */}
                <div className="flex flex-col space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Receipt No</label>
                    <input 
                      value="RCP-2026-0215" 
                      readOnly 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-400 outline-none cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Receipt Date</label>
                    <input 
                      type="date"
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-400 outline-none transition-colors appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Customer Name</label>
                    <input 
                      placeholder="Search customer..." 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Amount Received</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-zinc-500 text-sm">₹</span>
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-8 pr-4 py-3 text-sm text-zinc-200 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Bank Account</label>
                    <select 
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option>HDFC Bank — Current A/C</option>
                      <option>SBI Bank — Current A/C</option>
                      <option>ICICI Bank — OD A/C</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">UTR / Transaction Ref</label>
                    <input 
                      placeholder="UTR / NEFT Ref..." 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Remarks</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none transition-colors resize-none h-24"
                    />
                  </div>

                  <button className="w-full bg-green-800 hover:bg-green-700 text-white py-3.5 rounded-lg text-sm font-semibold transition-colors mt-4">
                    Save Receipt
                  </button>
                </div>

                {/* RIGHT COLUMN - PENDING INVOICES */}
                <div className="flex flex-col h-full border border-zinc-800/50 rounded-xl p-6 bg-[#161618]">
                  <h3 className="text-sm font-semibold text-white mb-5">Pending Invoices to Settle</h3>
                  
                  <div className="space-y-3 flex-1">
                    {mockInvoices.map((invoice) => (
                      <label 
                        key={invoice.id} 
                        className="flex items-center justify-between bg-[#1a1a1c] hover:bg-zinc-800/50 border border-zinc-800 rounded-lg p-4 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox"
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={() => toggleInvoice(invoice.id)}
                              className="appearance-none w-4 h-4 rounded border border-zinc-600 bg-zinc-900 checked:bg-green-600 checked:border-green-600 outline-none transition-colors cursor-pointer"
                            />
                            {selectedInvoices.includes(invoice.id) && (
                              <svg className="w-2.5 h-2.5 absolute text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{invoice.invNo}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Due: {invoice.dueDate}</p>
                          </div>
                        </div>
                        <span className="text-yellow-500 font-medium text-sm">
                          ₹{invoice.amount.toLocaleString()}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-5 border-t border-zinc-800/80">
                    <span className="text-zinc-400 text-sm font-medium">Selected Total</span>
                    <span className="text-white text-lg font-bold">₹{selectedTotal.toLocaleString()}</span>
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