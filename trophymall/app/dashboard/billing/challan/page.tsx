"use client";

import React from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, FileText, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

type Challan = {
  id: string;
  no: string;
  customer: string;
  date: string;
  deliveryType: string;
  items: string;
  status: "Open" | "Converted";
};

const mockChallans: Challan[] = [
  {
    id: "1",
    no: "DC-2026-0041",
    customer: "Delhi Sports Club",
    date: "2026-06-11",
    deliveryType: "Sample Dispatch",
    items: "5 pcs",
    status: "Open",
  },
  {
    id: "2",
    no: "DC-2026-0040",
    customer: "St. Xavier School",
    date: "2026-06-10",
    deliveryType: "Approval Basis",
    items: "12 pcs",
    status: "Converted",
  },
  {
    id: "3",
    no: "DC-2026-0039",
    customer: "Pune FC",
    date: "2026-06-09",
    deliveryType: "Material Transfer",
    items: "8 pcs",
    status: "Open",
  },
  {
    id: "4",
    no: "DC-2026-0038",
    customer: "Walk-in",
    date: "2026-06-08",
    deliveryType: "Sample Dispatch",
    items: "3 pcs",
    status: "Converted",
  },
];

export default function DeliveryChallanPage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-200 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* TOP HEADER */}
          <div className="px-6 py-4 flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Billing Management / <span className="text-gray-300">Delivery Challan</span>
              </p>
              <h1 className="text-xl font-bold text-white">Delivery Challan</h1>
            </div>
           
            <button className="bg-[#005f2f] hover:bg-[#007a3d] text-white text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors">
              <Plus size={16} /> New Invoice
            </button>
           
          </div>

          <div className="px-6 pb-6 flex-1 flex flex-col space-y-6">
            {/* SUB-HEADER */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Delivery Challan</h2>
                <p className="text-sm text-gray-400">Non-GST document for samples, transfers & pre-invoice dispatch</p>
              </div>
               <Link href="/dashboard/billing/challan/new-challan">
              <button className="bg-[#ffa500] hover:bg-[#ff6600] text-white text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors"
              style={{background:'#ffa500'}}
              >
                <Plus size={16}  /> New Delivery Challan
              </button>
              </Link>
            </div>

            {/* INFO BANNER */}
            <div className="bg-[#1a1412] border border-[#3d2314] rounded-lg p-4 flex items-start gap-3">
              <FileText className="text-[#e65c00] shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-gray-300 leading-relaxed">
                Delivery Challans are <span className="text-[#e65c00] font-medium">non-GST billing documents</span> used for Sample Dispatch, Material Transfer, Approval Basis dispatch, or any delivery before the final GST Invoice is raised. Open challans can be converted to a GST Invoice at any time.
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#161618] border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Open Challans</p>
                <p className="text-2xl font-bold text-[#e65c00]">2</p>
              </div>
              <div className="bg-[#161618] border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Converted Today</p>
                <p className="text-2xl font-bold text-green-500">1</p>
              </div>
              <div className="bg-[#161618] border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Pending Conversion</p>
                <p className="text-2xl font-bold text-yellow-500">2</p>
              </div>
              <div className="bg-[#161618] border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Total This Month</p>
                <p className="text-2xl font-bold text-white">41</p>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-[#161618] border border-zinc-800 rounded-lg overflow-hidden flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-400 border-b border-zinc-800 bg-[#161618]">
                    <tr>
                      <th className="font-medium p-4 font-normal">Challan No</th>
                      <th className="font-medium p-4 font-normal">Customer</th>
                      <th className="font-medium p-4 font-normal">Date</th>
                      <th className="font-medium p-4 font-normal">Delivery Type</th>
                      <th className="font-medium p-4 font-normal">Items</th>
                      <th className="font-medium p-4 font-normal">Status</th>
                      <th className="font-medium p-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {mockChallans.map((challan) => (
                      <tr key={challan.id} className="hover:bg-[#1c1c1f] transition-colors">
                        <td className="p-4 font-medium text-white">{challan.no}</td>
                        <td className="p-4 text-gray-300">{challan.customer}</td>
                        <td className="p-4 text-gray-400">{challan.date}</td>
                        <td className="p-4">
                          <span className="bg-[#3d2314] text-[#e65c00] border border-[#5c341f] px-2.5 py-1 rounded text-xs">
                            {challan.deliveryType}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">{challan.items}</td>
                        <td className="p-4">
                          {challan.status === "Open" ? (
                            <span className="bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2.5 py-1 rounded text-xs">
                              {challan.status}
                            </span>
                          ) : (
                            <span className="bg-green-900/30 text-green-500 border border-green-900/50 px-2.5 py-1 rounded text-xs">
                              {challan.status}
                            </span>
                          )}
                        </td>
                        <td className="p-4 flex items-center gap-4">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Eye size={18} />
                          </button>
                          {challan.status === "Open" && (
                            <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors">
                              <ArrowRight size={14} /> Convert to GST Invoice
                            </button>
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

        {/* BOTTOM STATUS BAR */}
        <div className="h-8 bg-[#0a0a0a] border-t border-zinc-800 flex justify-between items-center px-4 text-[11px] text-gray-400 shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Open Invoices: 0</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Draft Invoices: 0</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Pending Printing: 5</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Pending Dispatch: 8</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Outstanding Collection: <span className="text-red-400 font-medium">₹2,10,000</span></span>
          </div>
          <div className="flex items-center gap-4 opacity-75">
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">F5</kbd> Save</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">F6</kbd> Print</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">Ctrl+W</kbd> WhatsApp</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">Esc</kbd> Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
}