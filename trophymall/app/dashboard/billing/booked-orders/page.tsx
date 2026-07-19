"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Box, Clock, AlertCircle } from "lucide-react";

type Order = {
  id: string;
  orderNo: string;
  amount: string;
  customer: string;
  salesperson: string;
  items: string;
  dueDate: string;
  daysLeft: number;
  status: string;
  step: number;
  isUrgent?: boolean;
};

const mockOrders: Order[] = [
  {
    id: "1",
    orderNo: "BO-2026-0041",
    amount: "₹34,500",
    customer: "Delhi Sports Club",
    salesperson: "Rajesh Kumar",
    items: "Cricket Trophies x20",
    dueDate: "2026-06-18",
    daysLeft: 6,
    status: "Printing Pending",
    step: 4,
  },
  {
    id: "2",
    orderNo: "BO-2026-0042",
    amount: "₹18,200",
    customer: "Maharashtra Cricket Assoc",
    salesperson: "Priya Sharma",
    items: "Gold Medals x50",
    dueDate: "2026-06-15",
    daysLeft: 3,
    status: "Design Pending",
    step: 2,
  },
  {
    id: "3",
    orderNo: "BO-2026-0043",
    amount: "₹22,800",
    customer: "St. Xavier School",
    salesperson: "Amit Patel",
    items: "Custom Shields x15",
    dueDate: "2026-06-20",
    daysLeft: 8,
    status: "Material Pending",
    step: 3,
  },
  {
    id: "4",
    orderNo: "BO-2026-0044",
    amount: "₹45,600",
    customer: "Pune FC",
    salesperson: "Neha Singh",
    items: "Football Trophies x30",
    dueDate: "2026-06-14",
    daysLeft: 2,
    status: "Ready",
    step: 5,
    isUrgent: true,
  },
];

const legendItems = [
  { label: "Booked", color: "bg-green-900" },
  { label: "Design Pending", color: "bg-green-700" },
  { label: "Material Pending", color: "bg-green-600" },
  { label: "Printing Pending", color: "bg-green-500" },
  { label: "Ready", color: "bg-green-400" },
  { label: "Dispatched", color: "bg-blue-500" },
  { label: "Delivered", color: "bg-zinc-500" },
];

export default function BookedOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getDaysLeftColor = (days: number) => {
    if (days <= 2) return "text-red-500";
    if (days <= 3) return "text-yellow-500";
    return "text-green-500";
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
                Billing Management / <span className="text-zinc-300">Booked Orders</span>
              </p>
              <h1 className="text-xl font-bold text-white">Booked Orders</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Booked Orders</h2>
                <p className="text-zinc-400 text-sm">Track production & delivery pipeline</p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input 
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-700 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-zinc-500" />
                </div>
                
                <select className="bg-[#121212] border border-zinc-700 focus:border-zinc-500 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none transition-colors appearance-none cursor-pointer pr-8 relative">
                  <option>All Orders</option>
                  <option>Urgent</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>

            {/* LEGEND BAR */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-400">
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                  {item.label}
                </div>
              ))}
            </div>

            {/* ORDERS GRID - Enforced 2 Column Layout via lg:grid-cols-2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-10">
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5 flex flex-col hover:border-zinc-700 transition-colors">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{order.orderNo}</h3>
                      {order.isUrgent && (
                        <span className="flex items-center gap-1 bg-red-950/40 text-red-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-red-900/50">
                          <AlertCircle size={12} /> Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-white">{order.amount}</span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-300 text-sm">{order.customer}</span>
                    <span className="text-zinc-400 text-sm">{order.salesperson}</span>
                  </div>

                  {/* Order Details */}
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Box size={14} className="text-zinc-500" />
                      <span>{order.items}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Clock size={14} className="text-zinc-500" />
                      <span>Due: {order.dueDate}</span>
                    </div>
                    <span className={`text-sm font-semibold ${getDaysLeftColor(order.daysLeft)}`}>
                      {order.daysLeft} days left
                    </span>
                  </div>

                  {/* Progress Status Text */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-300 text-sm font-medium">{order.status}</span>
                    <span className="text-zinc-400 text-sm">{order.step}/7</span>
                  </div>

                  {/* Progress Line Graph */}
                  <div className="relative h-6 mb-4 flex items-center">
                    {/* Background track */}
                    <div className="absolute left-0 right-0 h-1 bg-zinc-800 rounded"></div>
                    {/* Active track */}
                    <div 
                      className="absolute left-0 h-1 bg-green-800 rounded transition-all duration-500"
                      style={{ width: `${(order.step - 1) * (100 / 6)}%` }}
                    ></div>
                    
                    {/* Dots */}
                    <div className="absolute left-0 right-0 flex justify-between">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const stepNumber = index + 1;
                        let dotColor = "bg-zinc-700 border-[#121212]"; // upcoming
                        
                        if (stepNumber < order.step) {
                          dotColor = "bg-green-700 border-[#121212]"; // completed
                        } else if (stepNumber === order.step) {
                          dotColor = "bg-yellow-500 border-[#121212]"; // current
                        }

                        return (
                          <div 
                            key={index} 
                            className={`w-3 h-3 rounded-full border-[2.5px] relative z-10 ${dotColor}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center gap-3 mt-auto pt-3 border-t border-zinc-800/50">
                    <select className="flex-1 bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-zinc-500 transition-colors appearance-none cursor-pointer">
                      <option>Booked</option>
                      <option>Design Pending</option>
                      <option>Material Pending</option>
                      <option>Printing Pending</option>
                      <option>Ready</option>
                      <option>Dispatched</option>
                    </select>
                    <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                      Update
                    </button>
                  </div>

                </div>
              ))}
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