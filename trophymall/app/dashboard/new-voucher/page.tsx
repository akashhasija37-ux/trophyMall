"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, ArrowLeft, Trash2, Save } from "lucide-react";

type ProductItem = {
  id: string;
  productName: string;
  qty: number;
  unit: string;
  rate: number;
  gst: string;
  amount: number;
};

export default function NewPurchaseVoucherPage() {
  const [items, setItems] = useState<ProductItem[]>([
    {
      id: "1",
      productName: "",
      qty: 1,
      unit: "Pcs",
      rate: 0,
      gst: "0%",
      amount: 0,
    }
  ]);

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        productName: "",
        qty: 1,
        unit: "Pcs",
        rate: 0,
        gst: "0%",
        amount: 0,
      }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

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
                Billing Management / <span className="text-zinc-300">Purchase Voucher</span>
              </p>
              <h1 className="text-xl font-bold text-white">Purchase Voucher</h1>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium border border-green-700">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            
            {/* SUB HEADER */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
              <ArrowLeft size={16} className="cursor-pointer hover:text-white transition-colors" />
              <span className="cursor-pointer hover:text-white transition-colors">Purchase Voucher</span>
              <span>›</span>
              <span className="text-zinc-200">New Purchase Voucher</span>
            </div>

            {/* TOP CARDS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SUPPLIER DETAILS */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
                <h3 className="text-base font-semibold text-white mb-5">Supplier Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">
                      Supplier Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        placeholder="Search supplier..." 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-3 pr-9 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                      />
                      <Search size={16} className="absolute right-3 top-2.5 text-zinc-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">
                        Supplier Invoice No <span className="text-red-500">*</span>
                      </label>
                      <input 
                        defaultValue="SI-2026-001" 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">
                        Invoice Date <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="date"
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none transition-colors appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Due Date</label>
                      <input 
                        type="date"
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none transition-colors appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Branch</label>
                      <select className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer">
                        <option>Mumbai HQ</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* INVOICE DETAILS */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
                <h3 className="text-base font-semibold text-white mb-5">Invoice Details</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Purchase Order No</label>
                      <input 
                        defaultValue="PO-001" 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Our Reference</label>
                      <input 
                        value="PUR-2026-0042" 
                        readOnly
                        className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Warehouse</label>
                      <select className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer">
                        <option>Main Warehouse</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Payment Terms</label>
                      <select className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer">
                        <option>Immediate</option>
                        <option>Net 15</option>
                        <option>Net 30</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 font-medium ml-1">Notes</label>
                    <textarea 
                      rows={1}
                      placeholder="Any special instructions..."
                      className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors resize-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* PRODUCT ENTRY */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-zinc-800/50">
                <h3 className="text-base font-semibold text-white">Product Entry</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-zinc-400 bg-[#161618] border-b border-zinc-800/80">
                    <tr>
                      <th className="font-medium py-3 px-5 w-16">Sr</th>
                      <th className="font-medium py-3 px-2">Product / Item</th>
                      <th className="font-medium py-3 px-2 w-28">Qty</th>
                      <th className="font-medium py-3 px-2 w-32">Unit</th>
                      <th className="font-medium py-3 px-2 w-32">Rate (₹)</th>
                      <th className="font-medium py-3 px-2 w-32">GST %</th>
                      <th className="font-medium py-3 px-2 w-32">Amount</th>
                      <th className="font-medium py-3 px-5 w-16 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="py-3 px-5 text-zinc-500">{index + 1}</td>
                        <td className="py-3 px-2">
                          <input 
                            placeholder="Product name..." 
                            value={item.productName}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].productName = e.target.value;
                              setItems(newItems);
                            }}
                            className="w-full bg-transparent border-b border-transparent focus:border-zinc-500 outline-none text-zinc-200 placeholder-zinc-600 py-1"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input 
                            type="number" 
                            value={item.qty}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].qty = Number(e.target.value);
                              setItems(newItems);
                            }}
                            className="w-full bg-transparent border-b border-transparent focus:border-zinc-500 outline-none text-zinc-200 py-1" 
                          />
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={item.unit}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].unit = e.target.value;
                              setItems(newItems);
                            }}
                            className="w-full bg-transparent border-b border-transparent outline-none text-zinc-300 appearance-none cursor-pointer py-1"
                          >
                            <option className="bg-zinc-800">Pcs</option>
                            <option className="bg-zinc-800">Box</option>
                            <option className="bg-zinc-800">Kg</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <input 
                            type="number" 
                            value={item.rate === 0 ? '' : item.rate}
                            placeholder="0"
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].rate = Number(e.target.value);
                              setItems(newItems);
                            }}
                            className="w-full bg-transparent border-b border-transparent focus:border-zinc-500 outline-none text-zinc-200 py-1" 
                          />
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={item.gst}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].gst = e.target.value;
                              setItems(newItems);
                            }}
                            className="w-full bg-transparent border-b border-transparent outline-none text-zinc-300 appearance-none cursor-pointer py-1"
                          >
                            <option className="bg-zinc-800">0%</option>
                            <option className="bg-zinc-800">5%</option>
                            <option className="bg-zinc-800">12%</option>
                            <option className="bg-zinc-800">18%</option>
                            <option className="bg-zinc-800">28%</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 font-medium">
                          ₹{(item.qty * item.rate).toFixed(2)}
                        </td>
                        <td className="py-3 px-5 text-center">
                          <button 
                            onClick={() => handleRemoveRow(item.id)}
                            className="text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-zinc-800/80 bg-[#161618]">
                <button 
                  onClick={handleAddRow} 
                  className="text-green-600 hover:text-green-500 font-medium text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={16} /> Add Row
                </button>
              </div>
            </div>

            {/* TOTALS & ACTIONS */}
            <div className="flex flex-col items-end gap-6 pt-4 pb-10">
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Total GST:</span>
                  <span className="text-white font-medium">₹0.00</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <span className="text-zinc-400 font-medium">Grand Total:</span>
                  <span className="text-green-500 font-bold">₹0.00</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                  Cancel
                </button>
                <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-green-700 shadow-sm">
                  <Save size={16} /> Save Purchase Voucher
                </button>
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