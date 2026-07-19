"use client";

import React from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, ArrowLeft, Save } from "lucide-react";

export default function NewPurchaseReturnPage() {
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
                Billing Management / <span className="text-zinc-300">Purchase Return</span>
              </p>
              <h1 className="text-xl font-bold text-white">Purchase Return</h1>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium border border-green-700 shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            
            {/* SUB HEADER */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
              <ArrowLeft size={16} className="cursor-pointer hover:text-white transition-colors" />
              <span className="cursor-pointer hover:text-white transition-colors">Purchase Return</span>
              <span>›</span>
              <span className="text-zinc-200">New Return</span>
            </div>

            {/* TWO COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* LEFT COLUMN - RETURN DETAILS */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
                <h3 className="text-base font-semibold text-white mb-5">Return Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">
                      Original Purchase Ref <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        placeholder="PUR-2026-XXXX" 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-3 pr-9 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                      />
                      <Search size={16} className="absolute right-3 top-2.5 text-zinc-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">
                        Supplier Name
                      </label>
                      <input 
                        placeholder="Auto-filled from purchase" 
                        readOnly
                        className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-500 outline-none cursor-not-allowed placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">
                        Return Date <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="date"
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none transition-colors appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">
                      Return Reason <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer">
                      <option>Quality Issue</option>
                      <option>Damaged Item</option>
                      <option>Wrong Item Received</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - RETURN ITEMS */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
                <h3 className="text-base font-semibold text-white mb-5">Return Items</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Qty Purchased</label>
                    <input 
                      defaultValue="0" 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Qty Returned</label>
                    <input 
                      defaultValue="0" 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Unit</label>
                    <input 
                      defaultValue="0" 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Purchase Rate (₹)</label>
                    <input 
                      defaultValue="0" 
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end items-center gap-4 pt-4 pb-10">
              <button className="bg-[#1a1a1c] hover:bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                Cancel
              </button>
              <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-green-700 shadow-sm">
                <Save size={16} /> Save Return
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