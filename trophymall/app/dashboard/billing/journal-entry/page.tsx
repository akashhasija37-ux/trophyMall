"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download, Eye, Edit } from "lucide-react";
import Link from "next/link";

type JournalEntry = {
  id: string;
  refNo: string;
  party: string;
  date: string;
  amount: string;
  status: "Posted" | "Draft";
};

const mockEntries: JournalEntry[] = [
  {
    id: "1",
    refNo: "JV-2026-0021",
    party: "Adjustment Entry",
    date: "2026-06-11",
    amount: "₹15,000",
    status: "Posted",
  },
  {
    id: "2",
    refNo: "JV-2026-0020",
    party: "Bank Transfer",
    date: "2026-06-09",
    amount: "₹50,000",
    status: "Posted",
  },
];

export default function JournalEntryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Posted":
        return (
          <span className="inline-flex items-center justify-center border border-green-800/80 text-green-500 bg-green-900/10 px-2.5 py-0.5 rounded text-xs font-medium min-w-[70px]">
            Posted
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center justify-center border border-yellow-700/80 text-yellow-500 bg-yellow-900/10 px-2.5 py-0.5 rounded text-xs font-medium min-w-[70px]">
            Draft
          </span>
        );
      default:
        return null;
    }
  };

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
                Billing Management / <span className="text-zinc-300">Journal Entry</span>
              </p>
              <h1 className="text-xl font-bold text-white">Journal Entry</h1>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm border border-green-700">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Journal Entry</h2>
                <p className="text-zinc-400 text-sm">2 records</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input 
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-zinc-500" />
                </div>
                
                <div className="relative">
                  <input 
                    type="date"
                    className="bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none transition-colors appearance-none cursor-pointer w-40"
                  />
                </div>

                <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-md border border-zinc-700 flex items-center gap-2 transition-colors font-medium">
                  <Download size={16} /> Export
                </button>
                <Link href="/dashboard/billing/new-entry">
                <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium border border-green-700">
                  <Plus size={16} /> New
                </button>
                </Link>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-zinc-400 bg-[#161618] border-b border-zinc-800/80">
                    <tr>
                      <th className="font-medium py-4 px-6 w-48">Ref No</th>
                      <th className="font-medium py-4 px-6">Party</th>
                      <th className="font-medium py-4 px-6 w-40">Date</th>
                      <th className="font-medium py-4 px-6 w-40">Amount</th>
                      <th className="font-medium py-4 px-6 w-32">Status</th>
                      <th className="font-medium py-4 px-6 w-24 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {mockEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4 px-6 text-white font-medium">{entry.refNo}</td>
                        <td className="py-4 px-6 text-zinc-300">{entry.party}</td>
                        <td className="py-4 px-6 text-zinc-400">{entry.date}</td>
                        <td className="py-4 px-6 text-white font-medium">{entry.amount}</td>
                        <td className="py-4 px-6">
                          {getStatusBadge(entry.status)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-3 text-zinc-400">
                            <button className="hover:text-zinc-200 transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="hover:text-zinc-200 transition-colors">
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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