"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download, Edit, Trash2, X, Save } from "lucide-react";

type HsnMasterRecord = {
  id: string;
  hsnCode: string;
  description: string;
  gstRate: string;
  type: string;
  status: "Active" | "Inactive";
};

const initialHsnMasters: HsnMasterRecord[] = [
  {
    id: "1",
    hsnCode: "9506",
    description: "Articles and equipment for general physical exercise, gymnastics, athletics",
    gstRate: "18%",
    type: "Income",
    status: "Active",
  },
  {
    id: "2",
    hsnCode: "8306",
    description: "Bells, gongs and the like, non-electric, statuettes and other ornaments",
    gstRate: "12%",
    type: "Expenses",
    status: "Active",
  },
  {
    id: "3",
    hsnCode: "3926",
    description: "Other articles of plastics and articles of other materials of headings 3901 to 3914",
    gstRate: "18%",
    type: "Assets",
    status: "Active",
  },
  {
    id: "4",
    hsnCode: "4420",
    description: "Wood marquetry and inlaid wood, caskets and cases for jewellery or cutlery",
    gstRate: "12%",
    type: "Assets",
    status: "Active",
  },
  {
    id: "5",
    hsnCode: "7114",
    description: "Articles of goldsmiths' or silversmiths' wares and parts thereof",
    gstRate: "3%",
    type: "Liabilities",
    status: "Inactive",
  },
];

export default function HsnMasterPage() {
  const [records, setRecords] = useState<HsnMasterRecord[]>(initialHsnMasters);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hsnCode, setHsnCode] = useState("9506");
  const [description, setDescription] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [type, setType] = useState("");

  const handleSaveNewHsn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hsnCode || !description) return;

    const newRecord: HsnMasterRecord = {
      id: Date.now().toString(),
      hsnCode,
      description,
      gstRate: gstRate || "18%",
      type: type || "General",
      status: "Active",
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);

    // Reset Form
    setHsnCode("9506");
    setDescription("");
    setGstRate("");
    setType("");
  };

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.hsnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                Masters / <span className="text-zinc-300">HSN Master</span>
              </p>
              <h1 className="text-xl font-bold text-white">HSN Master</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER & EXPORT ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">HSN Master</h2>
                <p className="text-zinc-400 text-sm">Harmonized System of Nomenclature codes for GST</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <Download size={16} /> Export
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>
            </div>

            {/* FILTERS & SEARCH CONTAINER */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              <div className="flex items-center gap-2 w-full md:w-auto">
                {(["All", "Active", "Inactive"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === tab
                        ? "bg-green-700 text-white"
                        : "bg-[#1a1a1c] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search HSN Master..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-3.5 px-6 font-semibold">HSN Code</th>
                      <th className="py-3.5 px-6 font-semibold">Description</th>
                      <th className="py-3.5 px-6 font-semibold">GST Rate</th>
                      <th className="py-3.5 px-6 font-semibold">Type</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-4 px-6 font-mono text-xs font-semibold text-white">{record.hsnCode}</td>
                          <td className="py-4 px-6 text-zinc-300 max-w-md truncate">{record.description}</td>
                          <td className="py-4 px-6 text-zinc-200 font-semibold">{record.gstRate}</td>
                          <td className="py-4 px-6 text-zinc-400">{record.type}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className={`w-8 h-4 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                                record.status === "Active" ? "bg-green-700" : "bg-zinc-700"
                              }`}>
                                <span className={`w-3 h-3 bg-white rounded-full transition-transform ${
                                  record.status === "Active" ? "translate-x-4" : "translate-x-0"
                                }`} />
                              </span>
                              <span className={`text-xs font-semibold ${
                                record.status === "Active" ? "text-green-400" : "text-zinc-500"
                              }`}>
                                {record.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-3 text-zinc-400">
                              <button title="Edit Record" className="hover:text-white transition-colors">
                                <Edit size={16} />
                              </button>
                              <button title="Delete Record" className="hover:text-red-400 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-zinc-500">
                          No HSN master records found matching your filters.
                        </td>
                      </tr>
                    )}
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

      {/* ADD NEW HSN MASTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/85 shrink-0">
              <h3 className="text-base font-bold text-white">Add New — HSN Master</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveNewHsn} className="p-6 flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">HSN Code *</label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors font-mono text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter HSN description..."
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg p-3.5 text-sm text-zinc-200 outline-none transition-colors resize-none placeholder:text-zinc-600"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">GST Rate *</label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled>Select...</option>
                  <option value="0%">0%</option>
                  <option value="5%">5%</option>
                  <option value="12%">12%</option>
                  <option value="18%">18%</option>
                  <option value="28%">28%</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select...</option>
                  <option value="Income">Income</option>
                  <option value="Expenses">Expenses</option>
                  <option value="Assets">Assets</option>
                  <option value="Liabilities">Liabilities</option>
                </select>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/85 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#222226] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-6 py-2.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-600 text-white text-sm px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-900/30"
                >
                  <Save size={16} /> Save
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}