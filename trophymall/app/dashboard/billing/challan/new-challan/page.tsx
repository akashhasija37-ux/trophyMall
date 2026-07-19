"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { 
  Plus, Printer, MessageSquare, Save, FileText, 
  Search, ArrowLeft, AlertTriangle, ArrowRight 
} from "lucide-react";

type ProductItem = {
  id: string;
  productCode: string;
  tmCode: string;
  productName: string;
  qty: number;
  unit: string;
};

export default function NewDeliveryChallanPage() {
  const [deliveryType, setDeliveryType] = useState("Sample Dispatch");
  const [items, setItems] = useState<ProductItem[]>([
    {
      id: "1",
      productCode: "PC-001",
      tmCode: "TM-001",
      productName: "",
      qty: 1,
      unit: "Pcs",
    }
  ]);

  const totalQty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        productCode: "",
        tmCode: "",
        productName: "",
        qty: 1,
        unit: "Pcs",
      }
    ]);
  };

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          
          {/* HEADER SECTION */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Delivery Challan</span>
              </p>
              <h1 className="text-xl font-bold text-white">Delivery Challan</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            
            {/* SUB HEADER ACTIONS */}
            <div className="flex justify-between items-end">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <ArrowLeft size={16} className="cursor-pointer hover:text-white transition-colors" />
                  <span className="cursor-pointer hover:text-white transition-colors">Delivery Challan</span>
                  <span>/</span>
                  <span className="text-zinc-200">New Challan</span>
                </div>
                
                <div className="flex items-end gap-3">
                  <h2 className="text-2xl font-bold text-white leading-none">Delivery Challan</h2>
                  <span className="text-zinc-500 text-sm leading-none mb-0.5">DC-2026-0042</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-yellow-500 text-xs font-medium">
                  <AlertTriangle size={14} />
                  <span>No GST • Non-Tax Document</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-md border border-zinc-700 flex items-center gap-2 transition-colors">
                  <Printer size={16} /> Print
                </button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-md border border-zinc-700 flex items-center gap-2 transition-colors">
                  <MessageSquare size={16} /> WhatsApp
                </button>
                <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium">
                  <Save size={16} /> Save Challan
                </button>
              </div>
            </div>

            {/* INFO BANNER */}
            <div className="bg-orange-950/20 border border-orange-900/50 rounded-lg p-4 flex items-start gap-3">
              <FileText className="text-orange-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h3 className="text-sm font-semibold text-orange-500 mb-1">Delivery Challan — Non-GST Billing Document</h3>
                <p className="text-xs text-zinc-400">
                  This challan has no tax calculation. Use for: Sample Dispatch, Material Transfer, Approval Basis dispatch, or pre-invoice delivery. Convert to a GST Invoice after delivery confirmation.
                </p>
              </div>
            </div>

            {/* CONTENT GRID */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">
              
              {/* LEFT COLUMN - FORM AREAS */}
              <div className="flex-1 space-y-6 w-full">
                
                {/* 1. CHALLAN DETAILS */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-orange-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md">1</span>
                    <h3 className="text-base font-semibold text-white">Challan Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Challan Number</label>
                      <input 
                        value="DC-2026-0042" 
                        readOnly 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none cursor-not-allowed"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Challan Date</label>
                      <input 
                        type="date" 
                        defaultValue="2026-06-12" 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Customer Name *</label>
                      <div className="relative">
                        <input 
                          placeholder="Search customer..." 
                          className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg pl-3 pr-9 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-zinc-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Mobile Number</label>
                      <input 
                        defaultValue="9876543210" 
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Delivery Type</label>
                      <div className="flex flex-wrap gap-2">
                        {['Sample Dispatch', 'Material Transfer', 'Approval Basis', 'Pre-Invoice Delivery'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setDeliveryType(type)}
                            className={`px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${
                              deliveryType === type 
                                ? 'bg-orange-600 text-white shadow-sm' 
                                : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs text-zinc-400 font-medium ml-1">Remarks</label>
                      <textarea 
                        rows={2}
                        placeholder="Special instructions, delivery notes, approval conditions..."
                        className="w-full bg-[#1a1a1c] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors resize-none placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PRODUCT LIST */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center p-5 border-b border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <span className="bg-orange-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md">2</span>
                      <h3 className="text-base font-semibold text-white">Product List <span className="text-zinc-500 font-normal text-sm ml-1">(No GST)</span></h3>
                    </div>
                    <button 
                      onClick={handleAddRow}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Row
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-zinc-400 bg-[#161618] border-b border-zinc-800/80">
                        <tr>
                          <th className="font-medium py-3 px-5 w-16">Sr</th>
                          <th className="font-medium py-3 px-2 w-32">Product Code</th>
                          <th className="font-medium py-3 px-2 w-32">TM Code</th>
                          <th className="font-medium py-3 px-2">Product Name</th>
                          <th className="font-medium py-3 px-2 w-28">Qty</th>
                          <th className="font-medium py-3 px-5 w-28">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {items.map((item, index) => (
                          <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors">
                            <td className="py-3 px-5 text-zinc-500">{index + 1}</td>
                            <td className="py-3 px-2"><span className="text-zinc-300">{item.productCode}</span></td>
                            <td className="py-3 px-2"><span className="text-zinc-300">{item.tmCode}</span></td>
                            <td className="py-3 px-2">
                              <input 
                                placeholder="Product name..." 
                                defaultValue={item.productName}
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
                            <td className="py-3 px-5">
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between items-center p-5 bg-[#161618] border-t border-zinc-800/80">
                    <button onClick={handleAddRow} className="text-orange-500 hover:text-orange-400 font-medium text-sm flex items-center gap-1.5 transition-colors">
                      <Plus size={16} /> Add Row
                    </button>
                    
                    <div className="flex items-center gap-16 text-sm">
                      <span className="text-zinc-400">Total Items</span>
                      <span className="text-white font-bold">{totalQty} pcs</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN - SUMMARY (STICKY) */}
              <div className="w-full xl:w-[380px] shrink-0 space-y-6 sticky top-0">
                <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 flex flex-col">
                  <h3 className="text-base font-semibold text-white mb-6">Challan Summary</h3>
                  
                  <div className="space-y-4 text-sm mb-6 border-b border-zinc-800/80 pb-6">
                    <div className="flex justify-between items-center text-zinc-300">
                      <span>Total Line Items</span>
                      <span className="text-white font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-300">
                      <span>Total Quantity</span>
                      <span className="text-white font-medium">{totalQty} pcs</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-300">
                      <span>Delivery Type</span>
                      <span className="text-orange-500 font-medium">{deliveryType}</span>
                    </div>
                  </div>

                  <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4 mb-6">
                    <h4 className="text-orange-500 text-xs font-bold mb-1.5">No Tax Document</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      No GST calculated. No tax invoice generated. Convert to GST Invoice when ready.
                    </p>
                  </div>

                  <button className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors mb-6">
                    <Save size={18} /> Save Delivery Challan
                  </button>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-zinc-500 font-medium">After delivery confirmation:</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors shadow-sm">
                      <FileText size={18} /> Convert Challan To GST Invoice <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}