"use client";

import React from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus } from "lucide-react";

type ReturnRecord = {
  id: string;
  creditNote: string;
  invoiceRef: string;
  customer: string;
  amount: string;
  status: "Adjusted" | "Pending";
};

const recentReturns: ReturnRecord[] = [
  {
    id: "1",
    creditNote: "CN-2026-0020",
    invoiceRef: "INV-0885",
    customer: "Walk-in",
    amount: "₹3,500",
    status: "Adjusted",
  },
  {
    id: "2",
    creditNote: "CN-2026-0019",
    invoiceRef: "INV-0878",
    customer: "St. Xavier School",
    amount: "₹8,200",
    status: "Pending",
  },
  {
    id: "3",
    creditNote: "CN-2026-0018",
    invoiceRef: "INV-0865",
    customer: "Pune FC",
    amount: "₹12,000",
    status: "Adjusted",
  },
];

export default function SaleReturnPage() {
  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar flex flex-col">
          
          {/* TOP BREADCRUMB HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Sale Return</span>
              </p>
              <h1 className="text-xl font-bold text-white">Sale Return</h1>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm border border-green-700">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] flex-1 flex flex-col space-y-6">
            
            {/* ACTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Sale Return</h2>
                <p className="text-zinc-400 text-sm">Process credit notes and returns against invoices</p>
              </div>
              
              <div className="flex items-center">
                <button className="bg-green-900/30 hover:bg-green-900/50 text-green-500 border border-green-800 text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium">
                  <Plus size={16} /> New Return
                </button>
              </div>
            </div>

            {/* TWO COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
              
              {/* LEFT COLUMN - NEW CREDIT NOTE FORM */}
              <div className="bg-[#161618] border border-zinc-800/80 rounded-xl p-5 flex flex-col">
                <h3 className="text-base font-semibold text-white mb-6">New Credit Note</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Credit Note No</label>
                    <input 
                      value="CN-2026-0021" 
                      readOnly 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Original Invoice No</label>
                    <input 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Customer Name</label>
                    <input 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Return Date</label>
                    <input 
                      type="date"
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Return Reason</label>
                    <select className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer">
                      <option>Quality Issue</option>
                      <option>Damaged in Transit</option>
                      <option>Wrong Item Dispatched</option>
                      <option>Customer Request</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                    Create Credit Note
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN - RECENT RETURNS */}
              <div className="bg-[#161618] border border-zinc-800/80 rounded-xl p-5 flex flex-col">
                <h3 className="text-base font-semibold text-white mb-6">Recent Returns</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-zinc-400">
                      <tr>
                        <th className="font-medium pb-3 border-b border-zinc-800">Credit Note</th>
                        <th className="font-medium pb-3 border-b border-zinc-800">Invoice Ref</th>
                        <th className="font-medium pb-3 border-b border-zinc-800">Customer</th>
                        <th className="font-medium pb-3 border-b border-zinc-800 text-right">Amount</th>
                        <th className="font-medium pb-3 border-b border-zinc-800 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {recentReturns.map((record) => (
                        <tr key={record.id} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="py-4 text-zinc-300">{record.creditNote}</td>
                          <td className="py-4 text-zinc-400">{record.invoiceRef}</td>
                          <td className="py-4 text-zinc-300">{record.customer}</td>
                          <td className="py-4 text-right text-red-500 font-medium">{record.amount}</td>
                          <td className="py-4 text-center">
                            {record.status === "Adjusted" ? (
                              <span className="inline-flex items-center justify-center border border-green-800/80 text-green-500 bg-green-900/10 px-2 py-0.5 rounded text-xs font-medium min-w-[70px]">
                                Adjusted
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center border border-yellow-700/80 text-yellow-500 bg-yellow-900/10 px-2 py-0.5 rounded text-xs font-medium min-w-[70px]">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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